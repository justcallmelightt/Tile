const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(`${__dirname}/../auth.js`, 'utf8');
function load(name, context) {
  const start = source.indexOf(`async function ${name}(`);
  assert.notEqual(start, -1);
  const end = source.indexOf('\n  }\n', start) + 4;
  return vm.runInNewContext(`(${source.slice(start, end)})`, context);
}

function nodes() {
  return {
    googleStatus: {}, emailStatus: {}, linkGoogle: {}, linkEmail: { setAttribute() {} }, addPasswordForm: { hidden: true },
    methodsMessage: { dataset: {} }, newPassword: { value: 'new-password-123' }, addPassword: { disabled: false },
  };
}

test('email account can start Google linking without changing its user ID', async () => {
  const ui = nodes();
  const calls = [];
  const storage = new Map();
  const context = {
    client: { auth: { linkIdentity: async (options) => { calls.push(options); return { error: null }; } } },
    currentSession: { user: { id: 'email-user' } }, nodes: ui,
    window: { location: { origin: 'https://tile0.vercel.app' } },
    CANONICAL_AUTH_ORIGIN: 'https://tile0.vercel.app',
    sessionStorage: { setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    AUTH_LINK_KEY: 'tile-auth-link-google', getAuthRedirectUrl: () => 'https://tile0.vercel.app/',
    setBusy: (node, value) => { node.disabled = value; }, setMethodsMessage: () => {},
  };
  await load('linkGoogleIdentity', context)();
  assert.equal(calls[0].provider, 'google');
  assert.equal(calls[0].options.redirectTo, 'https://tile0.vercel.app/');
  assert.equal(context.currentSession.user.id, 'email-user');
  assert.equal(storage.get('tile-auth-link-google'), '1');
  assert.equal(ui.linkGoogle.disabled, false);
});

test('Google account can add password and then sees email login available', async () => {
  const ui = nodes();
  const messages = [];
  let providers = ['google'];
  const context = {
    client: { auth: {
      updateUser: async ({ password }) => { assert.equal(password, 'new-password-123'); providers = ['google', 'email']; return { error: null }; },
      getUserIdentities: async () => ({ data: { identities: providers.map((provider) => ({ provider })) }, error: null }),
    } },
    currentSession: { user: { id: 'google-user' } }, nodes: ui,
    setBusy: (node, value) => { node.disabled = value; },
    setHidden: (node, value) => { node.hidden = value; },
    setMethodsMessage: (...args) => messages.push(args),
    sessionStorage: { getItem: () => null }, AUTH_LINK_KEY: 'tile-auth-link-google',
  };
  context.renderLoginMethods = load('renderLoginMethods', context);
  await context.renderLoginMethods('google-user');
  assert.equal(ui.addPasswordForm.hidden, true);
  assert.equal(ui.linkEmail.disabled, false);
  await load('addEmailPassword', context)({ preventDefault() {} });
  assert.equal(ui.newPassword.value, '');
  assert.equal(ui.emailStatus.textContent, '연결됨');
  assert.equal(ui.addPasswordForm.hidden, true);
  assert.match(messages.at(-1)[0], /같은 계정/);
});
