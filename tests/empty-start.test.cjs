const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const html = readFileSync(`${__dirname}/../index.html`, 'utf8');
const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
const config = readFileSync(`${__dirname}/../config.public.js`, 'utf8');

test('a first visit has no school, class, subject, room or teacher data', () => {
  const timetable = html.match(/<table[^>]*>[\s\S]*?<\/table>/)?.[0];
  assert.ok(timetable);
  assert.doesNotMatch(timetable, /data-subject=/);
  assert.match(html, /id="schoolSubtitle">학교 정보 없음</);

  const publicConfig = { location: { hostname: 'example.test' } };
  vm.runInNewContext(config, { window: publicConfig });
  assert.equal(publicConfig.TILE_NEIS_CONFIG.schoolName, '');
  assert.equal(publicConfig.TILE_NEIS_CONFIG.grade, '');
  assert.equal(publicConfig.TILE_NEIS_CONFIG.className, '');
  assert.match(source, /const classroomMap = \{\};/);
  assert.match(source, /const teacherMap = \{\};/);
});

test('an unconfigured timetable does not show generated homeroom cells or row', () => {
  const start = source.indexOf('function renderDailyHomeroomSchedule(');
  const end = source.indexOf('\nfunction enableTileEditing(', start);
  const cell = {
    classList: { remove(name) { assert.equal(name, 'daily-homeroom-cell'); }, add(name) { assert.equal(name, 'empty-cell'); } },
    dataset: { homeroomDay: '1', homeroomStart: '15:50', homeroomEnd: '16:30' },
    replaceChildren() { this.cleared = true; }
  };
  const row = { style: {} };
  const timetable = { querySelectorAll: () => [cell] };
  const context = {
    document: { getElementById: () => timetable, querySelector: () => row },
    scheduleRanges: [{ name: '종례' }],
    getSavedTileUser: () => null,
    localStorage: { getItem: () => null }
  };
  vm.runInNewContext(`(${source.slice(start, end)})`, context)();
  assert.equal(row.style.display, 'none');
  assert.equal(cell.cleared, true);
  assert.equal(cell.dataset.homeroomDay, undefined);
});

test('saved school and class still render, while an unconfigured visit stays unassigned', () => {
  const start = source.indexOf('function updateSchoolSubtitle(');
  const end = source.indexOf('\n}\n', start) + 2;
  const subtitle = { textContent: '', parts: [], replaceChildren() { this.parts = []; }, append(node) { this.parts.push(node.textContent); } };
  const localStorage = { getItem: () => null };
  const context = {
    schoolSubtitle: subtitle, localStorage, getSavedTileUser: () => null,
    getDisplaySchoolType: () => '', normalizeDepartment: () => '', getAccessibleSchoolType: () => '',
    document: { createTextNode: text => ({ textContent: text }) }
  };
  const render = vm.runInNewContext(`(${source.slice(start, end)})`, context);
  render();
  assert.equal(subtitle.textContent, '학교 정보 없음');
  render({ school: { name: '내 학교' }, grade: '2', classNum: '3' });
  assert.equal(subtitle.parts.join(''), '내 학교 | 2학년 3반');
});

test('a connected timetable restores its own NEIS subject and room after local edits', () => {
  const cell = {
    dataset: { subject: '내 과목', source: 'neis', neisRoom: '내 교실', neisTeacher: '담당 교사' },
    hasAttribute: () => false
  };
  const row = { dataset: { period: '1교시' }, querySelectorAll: () => [cell] };
  const subjectMap = new Map();
  const infoMap = new Map();
  const context = {
    defaultCellSubjectMap: subjectMap, defaultCellInfoMap: infoMap,
    document: { querySelectorAll: () => [row] },
    renderSubjectCell: (target, subject) => { target.dataset.subject = subject; },
    applyRoomBadges() {}, updateMemoIndicators() {}
  };
  const helper = name => {
    const start = source.indexOf(`function ${name}(`);
    const end = source.indexOf('\n}\n', start) + 2;
    return vm.runInNewContext(`(${source.slice(start, end)})`, context);
  };
  context.getDefaultCellSubject = helper('getDefaultCellSubject');
  helper('captureDefaultCellSubjects')();
  cell.dataset = { subject: '수정한 과목', source: 'local' };
  helper('restoreDefaultCellSubjects')();
  assert.deepEqual(cell.dataset, {
    subject: '내 과목', source: 'neis', neisRoom: '내 교실', neisTeacher: '담당 교사'
  });
});
