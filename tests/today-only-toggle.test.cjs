const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
const start = source.indexOf('function applyTodayOnlyMode() {');
const end = source.indexOf('\n}\n', start) + 2;
function viewAt(width, savedView, day = 4) {
  const classes = new Set();
  const button = { disabled: false, classList: { toggle(name, active) { this[name] = active; } }, setAttribute(name, value) { this[name] = value; } };
  const hiddenDays = [];
  const run = vm.runInNewContext(`(${source.slice(start, end)})`, {
    isMobileTimetableView: () => width <= 768,
    localStorage: { getItem: () => savedView },
    getTodayScheduleDay: () => day,
    document: {
      body: { classList: { toggle(name, active) { active ? classes.add(name) : classes.delete(name); } } },
      querySelectorAll: () => [],
    },
    hideColumnByDay: dayNumber => hiddenDays.push(dayNumber),
    updateTodayOnlyButton: (todayDay, active) => {
      button.disabled = !todayDay;
      button.textContent = active ? '전체 시간표 보기' : '오늘 일과만 보기';
      button.setAttribute('aria-pressed', String(active));
    },
  });
  run();
  return { classes, button, hiddenDays };
}

test('mobile defaults to today but saved full view reveals all weekdays', () => {
  const initial = viewAt(600, null);
  assert.equal(initial.button.textContent, '전체 시간표 보기');
  assert.equal(initial.hiddenDays.length, 4);
  assert.equal(initial.classes.has('mobile-today-mode'), true);

  const full = viewAt(600, 'off');
  assert.equal(full.button.textContent, '오늘 일과만 보기');
  assert.equal(full.hiddenDays.length, 0);
  assert.equal(full.classes.has('mobile-today-mode'), false);
});

test('desktop and weekends keep their existing full-view defaults', () => {
  assert.equal(viewAt(1000, null).hiddenDays.length, 0);
  assert.equal(viewAt(600, 'on', null).button.disabled, true);
});

test('toggle persists the next view on both narrow and wide screens', () => {
  const click = source.match(/todayOnlyToggle\.addEventListener\("click", \(\) => \{([\s\S]*?)\n  \}\);/);
  assert.ok(click);
  assert.match(click[1], /localStorage\.setItem\("mirim-today-only", todayOnlyToggle\.getAttribute\("aria-pressed"\) === "true" \? "off" : "on"\)/);
  assert.doesNotMatch(click[1], /!isMobileTimetableView\(\)/);
});
