const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

test('moving one subject tile preserves its memo and room, and keeps the old cell empty after reload', () => {
  const script = readFileSync(`${__dirname}/../script.js`, 'utf8');
  const method = script.slice(script.indexOf('  moveTimetableCell(fromCell, toCell) {'), script.indexOf('  savePeriodOrder(order) {'));
  assert.ok(method.startsWith('  moveTimetableCell'));
  const store = {
    'tile-cell-edits': {},
    'tile-subject-memos': { '1교시_0': '준비물' },
    'tile-cell-info-edits': { '1교시_0': { room: '101호', teacher: '김 선생님' } }
  };
  const makeCell = (row, subject) => ({
    tagName: 'TD', parentElement: row, dataset: { subject, source: 'local' },
    closest: () => row, hasAttribute: () => false
  });
  const sourceRow = { dataset: { period: '1교시' }, cells: [], querySelectorAll() { return this.cells; } };
  const targetRow = { dataset: { period: '2교시' }, cells: [], querySelectorAll() { return this.cells; } };
  const source = makeCell(sourceRow, '국어');
  const target = makeCell(targetRow, '');
  sourceRow.cells.push(source);
  targetRow.cells.push(target);
  const context = {
    document: { querySelector: () => ({ contains: cell => cell === source || cell === target }) },
    getCellStorageIndex: (row, cell) => row.cells.indexOf(cell),
    getCellInfoKey: (row, index) => `${row.dataset.period}_${index}`,
    readJsonStorage: key => structuredClone(store[key]),
    writeJsonStorage: (key, value) => { store[key] = structuredClone(value); },
    pushUndoSnapshot: () => ({ values: {} }),
    renderSubjectCell: (cell, subject) => { cell.dataset.subject = subject; },
    applyRoomBadges() {}, updateMemoIndicators() {}, renderDailyHomeroomSchedule() {}, updateCurrentStatus() {},
    getSubjectDayLabel: () => '월', showToast() {}, restoreSnapshot() {}, console,
    window: { TileCellDrag: { refresh() {} } },
    CELL_EDIT_STORAGE_KEY: 'tile-cell-edits', SUBJECT_MEMO_STORAGE_KEY: 'tile-subject-memos',
    CELL_INFO_EDIT_STORAGE_KEY: 'tile-cell-info-edits'
  };
  const app = vm.runInNewContext(`({${method}})`, context);
  assert.equal(app.moveTimetableCell(source, target), true);
  assert.deepEqual(store['tile-cell-edits'], { '1교시_0': '', '2교시_0': '국어' });
  assert.deepEqual(store['tile-subject-memos'], { '2교시_0': '준비물' });
  assert.deepEqual(store['tile-cell-info-edits'], { '2교시_0': { room: '101호', teacher: '김 선생님' } });
  assert.equal(source.dataset.subject, '');
  assert.equal(target.dataset.subject, '국어');

  source.dataset.subject = '수학';
  store['tile-subject-memos']['1교시_0'] = '계산기';
  store['tile-cell-info-edits']['1교시_0'] = { room: '202호', teacher: '이 선생님' };
  assert.equal(app.moveTimetableCell(source, target), true);
  assert.deepEqual(store['tile-cell-edits'], { '1교시_0': '국어', '2교시_0': '수학' });
  assert.deepEqual(store['tile-subject-memos'], { '1교시_0': '준비물', '2교시_0': '계산기' });
  assert.deepEqual(store['tile-cell-info-edits'], {
    '1교시_0': { room: '101호', teacher: '김 선생님' },
    '2교시_0': { room: '202호', teacher: '이 선생님' }
  });
});
