const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const authSource = readFileSync(`${__dirname}/../auth.js`, 'utf8');
const scriptSource = readFileSync(`${__dirname}/../script.js`, 'utf8');
const html = readFileSync(`${__dirname}/../index.html`, 'utf8');

function helper(name, context) {
  const start = authSource.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.notEqual(start, -1);
  const end = authSource.indexOf('\n  }\n', start) + 4;
  return vm.runInNewContext(`(${authSource.slice(start, end)})`, context);
}

test('start flow offers an explicit account restore choice alongside school and manual setup', () => {
  assert.match(html, /id="setupChooseSchool"/);
  assert.match(html, /id="setupChooseManual"/);
  assert.doesNotMatch(html, /로그인해서 불러오기|id="setupAccountSignIn"/);
  assert.doesNotMatch(scriptSource, /startRestoreFlow/);
  assert.match(html, /id="setupChooseAccount"/);
  assert.match(scriptSource, /TileAuth\?\.openAccountRestore\?\.\(\)/);
  assert.match(authSource, /AUTH_RESTORE_KEY/);
});

test('account backup actions are manual and collapsed by default', () => {
  assert.match(html, /<details class="account-manual-backup">/);
  assert.match(html, /로그인만으로 클라우드에 저장되거나 다른 기기로 옮겨지지 않습니다/);
  assert.match(html, /id="backupCloudData"[^>]*>지금 백업하기/);
  assert.match(html, /id="restoreCloudData"[^>]*>백업 불러오기/);
  const sessionStart = authSource.indexOf('async function renderSession(');
  const sessionEnd = authSource.indexOf('\n  }\n', sessionStart) + 4;
  assert.doesNotMatch(authSource.slice(sessionStart, sessionEnd), /backupCurrentData\(/);
  assert.match(authSource.slice(sessionStart, sessionEnd), /sessionStorage\.getItem\(AUTH_RESTORE_KEY\)[\s\S]*prepareRestore\(\)/);
  assert.ok(authSource.slice(sessionStart, sessionEnd).indexOf('await prepareRestore()') < authSource.slice(sessionStart, sessionEnd).indexOf('await renderLoginMethods(user.id)'));
});

test('manual restore shows a preview and waits for confirmation', async () => {
  const backup = { version: 1, values: { school: 'saved' } };
  const context = {
    client: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { payload: backup, updated_at: '2026-11-12' }, error: null }) }) }) }) },
    currentSession: { user: { id: 'user-1' } }, pendingRestore: null,
    nodes: { manualBackup: { open: false }, restorePanel: { hidden: true }, restore: {}, restoreDescription: {} },
    setHidden: (node, hidden) => { node.hidden = hidden; },
    setBusy: () => {}, setMessage: () => {}, formatDate: () => '11월 12일',
  };
  await helper('prepareRestore', context)();
  assert.equal(context.nodes.manualBackup.open, true);
  assert.equal(context.nodes.restorePanel.hidden, false);
  assert.match(context.nodes.restoreDescription.textContent, /현재 데이터는 되돌리기용으로 보관합니다/);
});

test('account restore choice keeps intent until sign-in and only previews the backup', async () => {
  const storage = new Map();
  let opened = 0;
  let previews = 0;
  const context = {
    AUTH_RESTORE_KEY: 'restore-intent',
    sessionStorage: { setItem: (key, value) => storage.set(key, value), getItem: key => storage.get(key), removeItem: key => storage.delete(key) },
    currentSession: null,
    openAccountSettings: () => { opened += 1; },
    prepareRestore: async () => { previews += 1; },
  };
  helper('openAccountRestore', context)();
  assert.equal(storage.get('restore-intent'), '1');
  assert.equal(opened, 1);
  assert.equal(previews, 0);
  context.currentSession = { user: { id: 'user-1' } };
  helper('openAccountRestore', context)();
  assert.equal(storage.has('restore-intent'), false);
  assert.equal(previews, 1);
});

test('last regular period travels with backups and shares without rejecting older data', () => {
  assert.match(scriptSource, /const TIMETABLE_SHARE_STORAGE_KEYS = \[[\s\S]*?"tile-last-regular-period"/);
  assert.match(scriptSource, /const USER_DATA_STORAGE_KEYS = \[[\s\S]*?"tile-last-regular-period"/);
  assert.match(scriptSource, /!Object\.prototype\.hasOwnProperty\.call\(backup\.values, LAST_PERIOD_STORAGE_KEY\)/);
  assert.match(scriptSource, /\.filter\(row => !row\.classList\.contains\("is-beyond-last-period"\)\)/);
});
