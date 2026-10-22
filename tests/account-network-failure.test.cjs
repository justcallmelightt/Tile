const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function load(file, name, context) {
  const source = readFileSync(`${__dirname}/../${file}`, 'utf8');
  const start = source.indexOf(`async function ${name}(`);
  assert.notEqual(start, -1);
  const end = source.indexOf('\n  }', start) + 4;
  return vm.runInNewContext(`(${source.slice(start, end)})`, context);
}

for (const [name, button] of [
  ['signInWithLightframeAccount', 'lightframeSignIn'],
  ['signUpWithLightframeAccount', 'lightframeSignUp'],
  ['backupCurrentData', 'backup'],
  ['prepareRestore', 'restore'],
  ['signOut', 'signOut'],
]) {
  test(`${name}: rejected network request reports error and permits retry`, async () => {
    const reject = async () => { throw new Error('offline'); };
    const query = { upsert: reject, select() { return this; }, eq() { return this; }, maybeSingle: reject };
    const notices = [];
    const context = {
      client: { auth: { signInWithPassword: reject, signUp: reject, signOut: reject }, from: () => query },
      currentSession: { user: { id: 'user' } }, pendingRestore: { stale: true },
      nodes: { [button]: { disabled: false }, restorePanel: {} },
      getEmailCredentials: () => ({ email: 'test@example.com', password: 'password123' }),
      getAuthRedirectUrl: () => 'https://tile0.vercel.app',
      setBusy: (node, busy) => { node.disabled = busy; },
      setHidden: (node, hidden) => { node.hidden = hidden; },
      setMessage: (...args) => notices.push(args),
      setEmailMessage: (...args) => notices.push(args),
      window: { TileApp: { createAccountBackup: () => ({ version: 1 }) } },
    };
    await load('auth.js', name, context)();
    assert.equal(context.nodes[button].disabled, false);
    assert.deepEqual(notices.at(-1), ['offline', 'error']);
    if (name === 'prepareRestore') {
      assert.equal(context.pendingRestore, null);
      assert.equal(context.nodes.restorePanel.hidden, true);
    }
  });
}

test('share payload failure releases publish button without publishing', async () => {
  const notices = [];
  const context = {
    nodes: { create: { disabled: false }, title: { value: '시간표' } },
    window: {}, safeText: value => value, getScopes: () => ({}),
    buildPayload: () => { throw new Error('storage unavailable'); },
    setBusy: (node, busy) => { node.disabled = busy; },
    notify: (...args) => notices.push(args),
  };
  await load('share.js', 'createShare', context)();
  assert.equal(context.nodes.create.disabled, false);
  assert.equal(notices[0][1], 'storage unavailable');
});
