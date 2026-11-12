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

test('start flow offers school and manual timetable without implying login restores data', () => {
  assert.match(html, /id="setupChooseSchool"/);
  assert.match(html, /id="setupChooseManual"/);
  assert.doesNotMatch(html, /로그인해서 불러오기|id="setupAccountSignIn"/);
  assert.doesNotMatch(scriptSource, /startRestoreFlow/);
  assert.doesNotMatch(authSource, /AUTH_RESTORE_KEY|finishRestoreFlow|startRestoreFlow/);
});

test('account backup actions are manual and collapsed by default', () => {
  assert.match(html, /<details class="account-manual-backup">/);
  assert.match(html, /로그인만으로 클라우드에 저장되거나 다른 기기로 옮겨지지 않습니다/);
  assert.match(html, /id="backupCloudData"[^>]*>지금 백업하기/);
  assert.match(html, /id="restoreCloudData"[^>]*>백업 불러오기/);
  const sessionStart = authSource.indexOf('async function renderSession(');
  const sessionEnd = authSource.indexOf('\n  }\n', sessionStart) + 4;
  assert.doesNotMatch(authSource.slice(sessionStart, sessionEnd), /backupCurrentData\(|prepareRestore\(/);
});

test('manual restore shows a preview and waits for confirmation', async () => {
  const backup = { version: 1, values: { school: 'saved' } };
  const context = {
    client: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { payload: backup, updated_at: '2026-11-12' }, error: null }) }) }) }) },
    currentSession: { user: { id: 'user-1' } }, pendingRestore: null,
    nodes: { restorePanel: { hidden: true }, restore: {}, restoreDescription: {} },
    setHidden: (node, hidden) => { node.hidden = hidden; },
    setBusy: () => {}, setMessage: () => {}, formatDate: () => '11월 12일',
  };
  await helper('prepareRestore', context)();
  assert.equal(context.nodes.restorePanel.hidden, false);
  assert.match(context.nodes.restoreDescription.textContent, /현재 데이터는 되돌리기용으로 보관합니다/);
});
