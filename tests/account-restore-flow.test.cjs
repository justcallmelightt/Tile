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

test('login-to-restore continues to direct restore after authentication', async () => {
  assert.match(scriptSource, /setupAccountSignIn[\s\S]*?window\.TileAuth\?\.startRestoreFlow\?\.\(\)/);
  assert.match(html, /계정에 백업이 있다면 로그인 후 바로 적용해요/);
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
    setMessage: (message) => calls.push(message),
    prepareRestore: async ({ applyImmediately }) => calls.push(applyImmediately ? 'apply' : 'preview'),
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
  assert.deepEqual(calls, ['open', 'open', '로그인되었습니다. 계정의 시간표를 불러오는 중입니다.', 'apply']);
  assert.equal(storage.has(context.AUTH_RESTORE_KEY), false);
});

test('manual account actions remain separate from the start choice', () => {
  assert.match(html, /계정 설정의 백업과 불러오기는 필요할 때 직접 실행합니다/);
  assert.match(html, /id="backupCloudData"[^>]*>지금 백업하기/);
  assert.match(html, /id="restoreCloudData"[^>]*>백업 불러오기/);
  const sessionStart = authSource.indexOf('async function renderSession(');
  const sessionEnd = authSource.indexOf('\n  }\n', sessionStart) + 4;
  assert.doesNotMatch(authSource.slice(sessionStart, sessionEnd), /backupCurrentData\(/);
});

function restoreContext(result) {
  const calls = [];
  const storage = new Map();
  const context = {
    client: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => result }) }) }) },
    currentSession: { user: { id: 'user-1' } }, pendingRestore: null,
    nodes: { restorePanel: { hidden: true }, restore: { disabled: false }, restoreDescription: {} },
    setHidden: (node, hidden) => { node.hidden = hidden; },
    setBusy: (node, busy) => { node.disabled = busy; },
    setMessage: (message) => calls.push(['message', message]),
    formatDate: () => '11월 12일',
    AUTH_RESTORE_DONE_KEY: 'tile-auth-restore-complete',
    sessionStorage: { setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    window: { TileApp: { restoreAccountBackup: (backup) => calls.push(['restore', backup]) } },
  };
  return { prepareRestore: helper('prepareRestore', context), context, calls, storage };
}

test('start-choice restore applies an existing backup without a second click', async () => {
  const backup = { version: 1, summary: { schoolName: '테스트고' }, values: { school: 'saved' } };
  const flow = restoreContext({ data: { payload: backup, updated_at: '2026-11-12T00:00:00Z' }, error: null });
  await flow.prepareRestore({ applyImmediately: true });
  assert.equal(flow.context.nodes.restorePanel.hidden, true);
  assert.deepEqual(flow.calls.find(([type]) => type === 'restore'), ['restore', backup]);
  assert.equal(flow.storage.get('tile-auth-restore-complete'), '1');
});

test('ordinary account restore still waits for explicit confirmation', async () => {
  const backup = { version: 1, summary: {}, values: { school: 'saved' } };
  const flow = restoreContext({ data: { payload: backup, updated_at: '2026-11-12T00:00:00Z' }, error: null });
  await flow.prepareRestore();
  assert.equal(flow.context.nodes.restorePanel.hidden, false);
  assert.equal(flow.calls.some(([type]) => type === 'restore'), false);
});

test('a login with no cloud backup leaves this device unchanged and explains why', async () => {
  const flow = restoreContext({ data: null, error: null });
  await flow.prepareRestore({ applyImmediately: true });
  assert.equal(flow.calls.some(([type]) => type === 'restore'), false);
  assert.match(flow.calls.at(-1)[1], /백업이 없습니다/);
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

test('a chosen restore runs before optional account metadata requests', async () => {
  const user = { id: 'user-1', email: 'tester@example.com', user_metadata: {} };
  const context = {
    currentSession: null, pendingRestore: null,
    nodes: { restorePanel: {}, deletePanel: {}, signedOut: {}, signedIn: {}, accountEntryStatus: {}, avatar: {}, displayName: {}, email: {} },
    setHidden: () => {}, setMessage: () => {}, setMethodsMessage: () => {},
    sessionSubscribers: new Set(), getInitial: () => 'T',
    finishRestoreFlow: async () => true,
    renderLoginMethods: () => assert.fail('identity lookup should not delay restoration'),
    refreshBackupStatus: () => assert.fail('status lookup should not delay restoration'),
  };
  await helper('renderSession', context)({ user });
});
