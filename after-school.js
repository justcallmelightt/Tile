window.initAfterSchool = function (app) {
  const KEY = 'tile-after-school';
  const LIMIT = 20;
  const dialog = document.getElementById('afterSchoolDialog');
  const list = document.getElementById('afterSchoolList');
  const message = document.getElementById('afterSchoolMessage');
  const start = document.getElementById('afterSchoolStart');
  const end = document.getElementById('afterSchoolEnd');
  const add = document.getElementById('afterSchoolAdd');
  const tbody = document.querySelector('#mainContent tbody');
  const defaults = app.scheduleRanges.filter(item => /^방과후 /.test(item.name)).map(item => ({ ...item }));
  const nodes = new Map([...tbody.rows].map(row => [row.dataset.period, row]));
  const saved = app.readJsonStorage(KEY, {});
  const validTime = value => typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
  const validItem = item => item && /^방과후 (?:A|B|[1-9]\d{0,8})$/.test(item.name)
    && validTime(item.start) && validTime(item.end) && item.start < item.end;
  const validSaved = Array.isArray(saved.items) && saved.items.length <= LIMIT
    && saved.items.every(validItem) && new Set(saved.items.map(item => item.name)).size === saved.items.length;
  let items = validSaved ? saved.items : defaults;
  let nextId = Math.max(3, Number.isSafeInteger(saved.nextId) ? saved.nextId : 3,
    ...items.map(item => (Number(item.name.slice(4)) || 0) + 1));
  let knownNames = new Set(defaults.map(item => item.name));

  function renderRows() {
    app.scheduleRanges.splice(0, app.scheduleRanges.length,
      ...app.scheduleRanges.filter(item => !knownNames.has(item.name)), ...items.map(item => ({ ...item })));
    app.scheduleRanges.sort((a, b) => a.start.localeCompare(b.start));
    for (const name of knownNames) {
      if (!items.some(item => item.name === name)) nodes.get(name)?.remove();
    }
    knownNames = new Set(items.map(item => item.name));
    for (const item of items) {
      let row = nodes.get(item.name);
      if (!row) {
        row = document.createElement('tr');
        row.dataset.period = item.name;
        row.dataset.editBound = 'true';
        const header = document.createElement('th');
        header.scope = 'row';
        header.append(document.createTextNode(item.name), document.createElement('br'));
        const time = document.createElement('span');
        time.className = 'time';
        header.append(time);
        header.tabIndex = 0;
        header.setAttribute('role', 'button');
        const editTime = () => app.openPeriodEditor(row, app.scheduleRanges.find(entry => entry.name === item.name));
        header.addEventListener('click', editTime);
        header.addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); editTime(); } });
        row.append(header);
        for (let index = 0; index < 5; index++) {
          const cell = document.createElement('td');
          cell.className = 'empty-cell';
          cell.tabIndex = 0;
          cell.setAttribute('role', 'button');
          cell.setAttribute('aria-label', `${item.name} ${['월', '화', '수', '목', '금'][index]}요일 과목 편집`);
          const edit = () => app.openSubjectEditor(cell, row, index);
          cell.addEventListener('click', edit);
          cell.addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); edit(); } });
          row.append(cell);
        }
        nodes.set(item.name, row);
      }
      app.updateRowTimeText(row, item.start, item.end);
    }
    for (const item of app.scheduleRanges) {
      const row = nodes.get(item.name);
      if (row) tbody.append(row);
    }
  }

  function commit(next, label) {
    try {
      const snapshot = app.pushUndoSnapshot(label);
      localStorage.setItem(KEY, JSON.stringify({ items: next, nextId }));
      items = next;
      renderRows();
      app.loadCellEdits();
      app.applyRoomBadges();
      app.applyTodayOnlyMode();
      app.updateMemoIndicators();
      app.updateCurrentStatus();
      renderList();
      message.textContent = label + ' 완료';
      app.showToast(label + ' 완료', '', { actionLabel: '되돌리기', onAction: () => app.restoreSnapshot(snapshot) });
      return true;
    } catch (error) {
      message.textContent = '저장하지 못했습니다. 브라우저 저장 공간과 설정을 확인해 주세요.';
      return false;
    }
  }

  function renderList() {
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement('p');
      empty.textContent = '등록된 방과후가 없어요.';
      list.append(empty);
    }
    for (const item of items) {
      const line = document.createElement('div');
      line.className = 'after-school-item';
      const text = document.createElement('span');
      text.textContent = `${item.name} · ${item.start}–${item.end}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'secondary-action';
      remove.textContent = '삭제';
      remove.setAttribute('aria-label', `${item.name} 삭제`);
      remove.addEventListener('click', () => {
        if (remove.dataset.confirm !== 'yes') {
          remove.dataset.confirm = 'yes';
          remove.textContent = '삭제 확인';
          return;
        }
        if (commit(items.filter(entry => entry.name !== item.name), `${item.name} 삭제`)) add.focus();
      });
      line.append(text, remove);
      list.append(line);
    }
    add.disabled = items.length >= LIMIT;
    add.textContent = items.length >= LIMIT ? '20개까지 추가 가능' : '시간대 추가';
  }

  document.getElementById('afterSchoolOpen').addEventListener('click', () => {
    // Time edits made in the timetable remain the source of truth.
    items = items.map(item => ({ ...item, ...app.scheduleRanges.find(entry => entry.name === item.name) }));
    renderList();
    message.textContent = '';
    dialog.showModal();
  });
  document.getElementById('afterSchoolClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.getElementById('afterSchoolOpen').focus());
  dialog.addEventListener('keydown', event => event.stopPropagation());
  document.getElementById('afterSchoolForm').addEventListener('submit', event => {
    event.preventDefault();
    if (items.length >= LIMIT) return;
    if (!validTime(start.value) || !validTime(end.value) || start.value >= end.value) {
      message.textContent = '종료 시간은 시작 시간보다 늦어야 합니다.';
      end.focus();
      return;
    }
    if (app.scheduleRanges.some(item => start.value < item.end && end.value > item.start)) {
      message.textContent = '기존 일과와 시간이 겹칩니다. 다른 시간대를 선택해 주세요.';
      start.focus();
      return;
    }
    const name = `방과후 ${nextId++}`;
    if (commit([...items, { name, start: start.value, end: end.value }], `${name} 추가`)) {
      start.value = end.value;
      end.value = '';
      end.focus();
    }
  });
  renderRows();
};
