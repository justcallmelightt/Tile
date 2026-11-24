window.initAfterSchool = function (app) {
  const KEY = 'tile-after-school';
  const LIMIT = 20;
  const dialog = document.getElementById('afterSchoolDialog');
  const list = document.getElementById('afterSchoolList');
  const message = document.getElementById('afterSchoolMessage');
  const nameInput = document.getElementById('afterSchoolName');
  const start = document.getElementById('afterSchoolStart');
  const end = document.getElementById('afterSchoolEnd');
  const add = document.getElementById('afterSchoolAdd');
  const tbody = document.querySelector('#mainContent tbody');
  const defaults = app.scheduleRanges.filter(item => /^방과후 /.test(item.name)).map(item => ({ ...item }));
  const nodes = new Map([...tbody.rows].map(row => [row.dataset.period, row]));
  const saved = app.readJsonStorage(KEY, {});
  const validTime = value => typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
  const validName = name => typeof name === 'string' && name.length <= 40
    && name === name.trim() && !!name && !name.includes('_');
  const validItem = item => item && validName(item.name)
    && validTime(item.start) && validTime(item.end) && item.start < item.end;
  const validSaved = Array.isArray(saved.items) && saved.items.length <= LIMIT
    && saved.items.every(validItem) && new Set(saved.items.map(item => item.name)).size === saved.items.length;
  // A missing or unreadable record must not recreate school-specific after-school rows.
  let items = validSaved ? saved.items : [];
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
        const editTime = () => app.openPeriodEditor(row, app.scheduleRanges.find(entry => entry.name === row.dataset.period));
        header.addEventListener('click', editTime);
        header.addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); editTime(); } });
        row.append(header);
        for (let index = 0; index < 5; index++) {
          const cell = document.createElement('td');
          cell.className = 'empty-cell';
          cell.tabIndex = 0;
          cell.setAttribute('role', 'button');
          cell.setAttribute('aria-label', `${row.dataset.period} ${['월', '화', '수', '목', '금'][index]}요일 과목 편집`);
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
    window.TilePeriodOrder?.apply();
  }

  function commit(next, label, oldName = '', newName = '') {
    const storageKeys = ['tile-cell-edits', 'tile-subject-memos', 'tile-cell-info-edits', 'tile-period-info-edits', 'tile-schedule-edits'];
    const previous = new Map();
    try {
      const snapshot = app.pushUndoSnapshot(label);
      if (oldName) {
        for (const key of storageKeys) {
          const raw = localStorage.getItem(key);
          previous.set(key, raw);
          if (!raw) continue;
          const values = JSON.parse(raw);
          if (!values || typeof values !== 'object' || Array.isArray(values)) continue;
          for (const entry of Object.keys(values)) {
            const matches = key === 'tile-schedule-edits' ? entry === oldName : entry.startsWith(`${oldName}_`);
            if (!matches) continue;
            const renamed = key === 'tile-schedule-edits' ? newName : `${newName}${entry.slice(oldName.length)}`;
            values[renamed] = values[entry];
            delete values[entry];
          }
          localStorage.setItem(key, JSON.stringify(values));
        }
      }
      localStorage.setItem(KEY, JSON.stringify({ items: next }));
      if (oldName) {
        const row = nodes.get(oldName);
        if (row) {
          nodes.delete(oldName);
          nodes.set(newName, row);
          row.dataset.period = newName;
          const header = row.querySelector('th');
          if (header?.firstChild) header.firstChild.textContent = newName;
          row.querySelectorAll('td').forEach((cell, index) => cell.setAttribute('aria-label', `${newName} ${['월', '화', '수', '목', '금'][index]}요일 과목 편집`));
        }
      }
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
      for (const [key, raw] of previous) {
        try { if (raw === null) localStorage.removeItem(key); else localStorage.setItem(key, raw); } catch { /* The original data may still be available in the undo snapshot. */ }
      }
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
      const text = document.createElement('div');
      text.className = 'after-school-item-copy';
      const name = document.createElement('strong');
      name.textContent = item.name;
      const time = document.createElement('span');
      time.textContent = `${item.start}–${item.end}`;
      text.append(name, time);
      const actions = document.createElement('div');
      actions.className = 'after-school-item-actions';
      const rename = document.createElement('button');
      rename.type = 'button';
      rename.className = 'after-school-rename';
      rename.textContent = '이름 변경';
      rename.setAttribute('aria-label', `${item.name} 이름 변경`);
      rename.addEventListener('click', () => {
        const form = document.createElement('form');
        form.className = 'after-school-rename-form';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = item.name;
        input.maxLength = 40;
        input.required = true;
        input.setAttribute('aria-label', `${item.name} 새 이름`);
        const save = document.createElement('button');
        save.type = 'submit';
        save.textContent = '저장';
        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.textContent = '취소';
        cancel.addEventListener('click', () => renderList());
        form.addEventListener('submit', event => {
          event.preventDefault();
          const newName = input.value.trim();
          if (!validName(newName)) { message.textContent = '이름은 1~40자로 입력하고 밑줄은 제외해 주세요.'; input.focus(); return; }
          if (newName === item.name) { renderList(); return; }
          if (app.scheduleRanges.some(entry => entry.name === newName)) { message.textContent = '이미 사용 중인 이름입니다.'; input.focus(); return; }
          commit(items.map(entry => entry.name === item.name ? { ...entry, name: newName } : entry), `${item.name} 이름 변경`, item.name, newName);
        });
        form.append(input, save, cancel);
        line.replaceChildren(form);
        input.focus();
        input.select();
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'secondary-action after-school-remove';
      remove.textContent = '삭제';
      remove.setAttribute('aria-label', `${item.name} 삭제`);
      remove.addEventListener('click', () => {
        if (remove.dataset.confirm !== 'yes') {
          remove.dataset.confirm = 'yes';
          remove.textContent = '삭제 확인';
          remove.classList.add('is-confirming');
          return;
        }
        if (commit(items.filter(entry => entry.name !== item.name), `${item.name} 삭제`)) add.focus();
      });
      actions.append(rename, remove);
      line.append(text, actions);
      list.append(line);
    }
    add.disabled = items.length >= LIMIT;
    add.textContent = items.length >= LIMIT ? '20개까지 추가 가능' : '시간대 추가';
  }

  document.getElementById('managementAfterSchool').addEventListener('click', () => {
    // Time edits made in the timetable remain the source of truth.
    items = items.map(item => ({ ...item, ...app.scheduleRanges.find(entry => entry.name === item.name) }));
    renderList();
    message.textContent = '';
    window.TileApp?.setNativeDialogVisible(dialog, true);
  });
  document.getElementById('afterSchoolClose').addEventListener('click', () => window.TileApp?.setNativeDialogVisible(dialog, false));
  dialog.addEventListener('close', () => document.getElementById('timetableManagementToggle')?.focus());
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
    const name = nameInput.value.trim();
    if (!name) { message.textContent = '시간표에 표시할 이름을 입력해 주세요. 예: 방과후 A, 야간자율학습'; nameInput.focus(); return; }
    if (!validName(name)) { message.textContent = '이름은 1~40자로 입력하고 밑줄은 제외해 주세요.'; nameInput.focus(); return; }
    if (app.scheduleRanges.some(item => item.name === name)) { message.textContent = '이미 사용 중인 이름입니다.'; nameInput.focus(); return; }
    if (commit([...items, { name, start: start.value, end: end.value }], `${name} 추가`)) {
      window.TileMetrics?.track('after_school_add_complete');
      nameInput.value = '';
      start.value = end.value;
      end.value = '';
      end.focus();
    }
  });
  renderRows();
};
