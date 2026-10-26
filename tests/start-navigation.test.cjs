const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
function helper(name, globals) {
  let start = source.indexOf(`function ${name}(`);
  if (source.slice(start - 6, start) === 'async ') start -= 6;
  const end = source.indexOf('\n}\n', start) + 2;
  return vm.runInNewContext(`(${source.slice(start, end)})`, globals);
}

test('manual start persists empty cells without replacing prior edits or merged events', async () => {
  const values = new Map();
  const edits = { '1교시_0': '수학' };
  const cells = Array.from({ length: 5 }, () => ({ classList: { contains: () => false } }));
  const rows = [
    { dataset: { period: '1교시' }, querySelectorAll: () => cells },
    { dataset: { period: '중식' }, querySelectorAll: () => [cells[0]] },
  ];
  let closed = false;
  let edited = false;
  let homeroomRendered = false;
  const button = { disabled: false };
  const run = helper('startManualTimetable', {
    CELL_EDIT_STORAGE_KEY: 'cells',
    readJsonStorage: () => edits,
    pushUndoSnapshot: () => ({}), restoreSnapshot: () => assert.fail('unexpected rollback'),
    localStorage: { setItem: (key, value) => values.set(key, value) },
    document: {
      querySelectorAll: () => rows,
      getElementById: id => id === 'timetableEditToggle'
        ? { click() { assert.equal(closed, true); edited = true; } }
        : { focus() {}, textContent: '' },
    },
    loadCellEdits() {}, renderDailyHomeroomSchedule() { homeroomRendered = true; },
    updateSchoolSubtitle() {}, updateCurrentStatus() {},
    closeSchoolSettingsModal: async () => { closed = true; },
  });
  await run({ currentTarget: button });
  const saved = JSON.parse(values.get('cells'));
  assert.equal(saved['1교시_0'], '수학');
  assert.equal(saved['1교시_4'], '');
  assert.equal(Object.keys(saved).length, 5);
  assert.equal(values.get('tile-start-mode'), 'manual');
  assert.equal(button.disabled, false);
  assert.equal(edited, true);
  assert.equal(homeroomRendered, true);
});

test('failed manual storage rolls back and keeps setup available', async () => {
  const message = { textContent: '' };
  let rolledBack = false;
  const button = { disabled: false };
  const run = helper('startManualTimetable', {
    CELL_EDIT_STORAGE_KEY: 'cells', readJsonStorage: () => ({}),
    pushUndoSnapshot: () => ({ values: {} }), restoreSnapshot: () => { rolledBack = true; },
    document: { querySelectorAll: () => [], getElementById: () => message },
    localStorage: { setItem() { throw new Error('quota'); } },
  });
  await run({ currentTarget: button });
  assert.equal(rolledBack, true);
  assert.equal(button.disabled, false);
  assert.match(message.textContent, /다시 시도/);
});
