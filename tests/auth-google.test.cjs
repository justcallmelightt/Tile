const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(`${__dirname}/../auth.js`, 'utf8');
const start = source.indexOf('async function signInWithGoogle()');
const end = source.indexOf('\n  }\n', start) + 4;
assert.notEqual(start, -1);

function authHelper(name, context) {
  const helperStart = source.indexOf(`function ${name}(`);
  assert.notEqual(helperStart, -1);
  const helperEnd = source.indexOf('\n  }\n', helperStart) + 4;
  return vm.runInNewContext(`(${source.slice(helperStart, helperEnd)})`, context);
}

function createGoogleSignIn({ error = null } = {}) {
  const calls = [];
  const notices = [];
  const storage = new Map();
  const nodes = { googleSignIn: { disabled: false }, setupGoogleSignIn: { disabled: false } };
  const context = {
    client: { auth: { signInWithOAuth: async (options) => { calls.push(options); return { error }; } } },
    nodes,
    sessionStorage: { setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    AUTH_RETURN_KEY: 'tile-auth-return-location',
    currentReturnLocation: () => '/index.html',
    getAuthRedirectUrl: () => 'https://tile0.vercel.app/index.html',
    setBusy: (button, busy) => { button.disabled = busy; },
    window: { TileApp: { notify: (...args) => notices.push(args) } },
  };
  return { signIn: vm.runInNewContext(`(${source.slice(start, end)})`, context), calls, notices, storage, nodes };
}

test('start choices lead to account login where Google OAuth remains available', async () => {
  const html = readFileSync(`${__dirname}/../index.html`, 'utf8');
  assert.match(html, /id="setupAccountSignIn"/);
  assert.match(html, /id="googleSignIn"/);
  assert.match(source, /nodes\.setupGoogleSignIn\?\.addEventListener\("click", signInWithGoogle\)/);
  const auth = createGoogleSignIn();
  await auth.signIn();
  assert.equal(auth.calls.length, 1);
  assert.equal(auth.calls[0].provider, 'google');
  assert.equal(auth.calls[0].options.redirectTo, 'https://tile0.vercel.app/index.html');
  assert.equal(auth.calls[0].options.queryParams.prompt, 'select_account');
  assert.equal(auth.storage.get('tile-auth-return-location'), '/index.html');
  assert.equal(auth.nodes.googleSignIn.disabled, false);
  assert.equal(auth.nodes.setupGoogleSignIn.disabled, false);
});

test('Google OAuth failure clears both busy states and the return marker', async () => {
  const auth = createGoogleSignIn({ error: new Error('provider unavailable') });
  await auth.signIn();
  assert.equal(auth.storage.has('tile-auth-return-location'), false);
  assert.equal(auth.nodes.googleSignIn.disabled, false);
  assert.equal(auth.nodes.setupGoogleSignIn.disabled, false);
  assert.equal(auth.notices[0][0], 'Google 로그인에 실패했습니다');
});

test('file previews redirect Google OAuth to the deployed root, not a local file path', () => {
  const getRedirect = authHelper('getAuthRedirectUrl', {
    CANONICAL_AUTH_ORIGIN: 'https://tile0.vercel.app',
    window: { location: {
      protocol: 'file:', origin: 'null', pathname: '/Users/example/Tile/index.html',
    } },
  });
  assert.equal(getRedirect(), 'https://tile0.vercel.app/');
});
