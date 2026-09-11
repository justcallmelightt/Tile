const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');

class Element {
  constructor() { this.children = []; this.dataset = {}; this.events = {}; this.value = ''; }
  get rows() { return this.children; }
  append(...children) { for (const child of children) { child.remove?.(); child.parent = this; this.children.push(child); } }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); }
  replaceChildren() { this.children = []; }
  setAttribute() {}
  addEventListener(name, callback) { this.events[name] = callback; }
  focus() {}
  showModal() {}
  close() {}
  fire(name) { this.events[name]?.({ preventDefault() {}, stopPropagation() {} }); }
}
function setup(saved = {}, blocked = false) {
  const ids = new Map();
  const node = id => { if (!ids.has(id)) ids.set(id, new Element()); return ids.get(id); };
  const tbody = new Element();
  const scheduleRanges = [
    { name: '종례', start: '15:50', end: '16:30' },
    { name: '방과후 A', start: '16:30', end: '17:20' },
    { name: '방과후 B', start: '18:20', end: '20:00' },
  ];
  for (const item of scheduleRanges) { const row = new Element(); row.dataset.period = item.name; tbody.append(row); }
  let stored;
  const context = {
    window: {}, document: { getElementById: node, querySelector: () => tbody,
      createElement: () => new Element(), createTextNode: text => ({ text }) },
    localStorage: { setItem(key, value) { if (blocked) throw new Error('quota'); stored = JSON.parse(value); } },
  };
  vm.runInNewContext(readFileSync(`${__dirname}/../after-school.js`, 'utf8'), context);
  const noop = () => {};
  context.window.initAfterSchool({ scheduleRanges, readJsonStorage: () => saved,
    pushUndoSnapshot: () => ({}), restoreSnapshot: noop, showToast: noop,
    openSubjectEditor: noop, openPeriodEditor: noop, updateRowTimeText: noop,
    applyTodayOnlyMode: noop, updateCurrentStatus: noop, loadCellEdits: noop,
    applyRoomBadges: noop, updateMemoIndicators: noop });
  return { node, scheduleRanges, tbody, stored: () => stored, add(start, end) {
    node('afterSchoolStart').value = start; node('afterSchoolEnd').value = end;
    node('afterSchoolForm').fire('submit');
  } };
}
test('add persists and restores a new five-day time slot', () => {
  const app = setup();
  app.add('20:00', '20:50');
  assert.equal(app.stored().items.length, 3);
  assert.equal(app.tbody.rows.at(-1).children.length, 6);
  assert.equal(setup(app.stored()).scheduleRanges.at(-1).name, '방과후 3');
});
test('overlap and reversed times do not save', () => {
  const app = setup();
  app.add('16:00', '17:00');
  assert.equal(app.stored(), undefined);
  app.add('22:00', '21:00');
  assert.equal(app.stored(), undefined);
});
test('removal requires confirmation and remains removed after reload', () => {
  const app = setup();
  app.node('afterSchoolOpen').fire('click');
  const remove = app.node('afterSchoolList').children[0].children[1];
  remove.fire('click');
  assert.equal(app.stored(), undefined);
  remove.fire('click');
  assert.equal(setup(app.stored()).scheduleRanges.some(item => item.name === '방과후 A'), false);
});
test('storage failure leaves rows and schedule unchanged', () => {
  const app = setup({}, true);
  app.add('20:00', '20:50');
  assert.equal(app.scheduleRanges.length, 3);
  assert.equal(app.tbody.rows.length, 3);
});
test('twenty-slot cap and empty saved list are respected', () => {
  const items = Array.from({ length: 20 }, (_, i) => ({ name: `방과후 ${i + 3}`, start: '20:00', end: '20:01' }));
  const app = setup({ items });
  app.add('21:00', '21:01');
  assert.equal(app.stored(), undefined);
  assert.equal(setup({ items: [] }).scheduleRanges.length, 1);
});
