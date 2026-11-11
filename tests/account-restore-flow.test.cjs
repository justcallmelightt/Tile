const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const authSource = readFileSync(`${__dirname}/../auth.js`, 'utf8');
const scriptSource = readFileSync(`${__dirname}/../script.js`, 'utf8');
const html = readFileSync(`${__dirname}/../index.html`, 'utf8');

function helper(name, context) {
  const start = authSource.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.notEqual(start, -1, `${name} exists`);
  const end = authSource.indexOf('\n  }\n', start) + 4;
  return vm.runInNewContext(`(${authSource.slice(start, end)})`, context);
}

test('login-to-restore opens the backup preview and still requires explicit apply', async () => {
  assert.match(scriptSource, /setupAccountSignIn[\s\S]*?window\.TileAuth\?\.startRestoreFlow\?\.\(\)/);
  assert.match(html, /로그인 후 백업을 확인하고 직접 적용해요/);
  const storage = new Map();
  const calls = [];
  const context = {
    AUTH_RESTORE_KEY: 'tile-auth-restore-after-login',
    sessionStorage: {
      getItem: (key) => storage.get(key),
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
    currentSession: null,
    openAccountSettings: () => calls.push('open'),
    prepareRestore: async () => calls.push('preview'),
    pendingRestore: { version: 1 },
    nodes: { restorePanel: { scrollIntoView: () => calls.push('scroll') } },
    window: { setTimeout: (callback) => callback() },
  };
  context.finishRestoreFlow = helper('finishRestoreFlow', context);
  const startRestoreFlow = helper('startRestoreFlow', context);
  startRestoreFlow();
  assert.deepEqual(calls, ['open']);
  assert.equal(storage.get(context.AUTH_RESTORE_KEY), '1');
  context.currentSession = { user: { id: 'user-1' } };
  await context.finishRestoreFlow();
  assert.deepEqual(calls, ['open', 'open', 'preview', 'scroll']);
  assert.equal(storage.has(context.AUTH_RESTORE_KEY), false);
  assert.match(html, /id="confirmCloudRestore"[^>]*>백업 적용/);
});

test('manual backup and restore remain separate actions with no automatic backup call', () => {
  assert.match(html, /클라우드 백업은 자동으로 저장되거나 적용되지 않습니다/);
  assert.match(html, /id="backupCloudData"[^>]*>지금 백업하기/);
  assert.match(html, /id="restoreCloudData"[^>]*>백업 불러오기/);
  const sessionStart = authSource.indexOf('async function renderSession(');
  const sessionEnd = authSource.indexOf('\n  }\n', sessionStart) + 4;
  assert.doesNotMatch(authSource.slice(sessionStart, sessionEnd), /backupCurrentData\(/);
});

test('a repeated auth event does not dismiss a pending restore preview', async () => {
  const panel = { hidden: false };
  const user = { id: 'user-1', email: 'tester@example.com', user_metadata: {} };
  const context = {
    currentSession: { user }, pendingRestore: { version: 1 },
    nodes: { restorePanel: panel, deletePanel: {}, signedOut: {}, signedIn: {}, accountEntryStatus: {}, avatar: {}, displayName: {}, email: {} },
    setHidden: (node, hidden) => { node.hidden = hidden; },
    setMessage: () => assert.fail('same-user event must preserve restore message'),
    setMethodsMessage: () => {}, sessionSubscribers: new Set(),
    getInitial: () => 'T', renderLoginMethods: async () => {}, refreshBackupStatus: async () => {}, finishRestoreFlow: async () => {},
  };
  await helper('renderSession', context)({ user });
  assert.equal(panel.hidden, false);
  assert.deepEqual(context.pendingRestore, { version: 1 });
});
