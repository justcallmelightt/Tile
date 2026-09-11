(() => {
  const KEY = 'tile-personal-presets-v1';
  const byId = id => document.getElementById(id);
  const dialog = byId('personalPresetsDialog');
  const list = byId('personalPresetsList');
  const status = byId('personalPresetsStatus');
  const nameInput = byId('personalPresetName');
  let presets = [];
  let readable = true;

  function persist(next) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      presets = next;
      render();
      return true;
    } catch (error) {
      status.textContent = '저장 공간이 부족하거나 저장이 차단되어 있습니다. 기존 프리셋은 유지됩니다.';
      return false;
    }
  }
  function render() {
    list.replaceChildren();
    if (!presets.length) {
      const empty = document.createElement('p');
      empty.className = 'after-school-description';
      empty.textContent = '아직 저장한 프리셋이 없어요.';
      list.append(empty);
    }
    for (const preset of presets) {
      const row = document.createElement('div');
      row.className = 'preset-item';
      const title = document.createElement('strong');
      title.textContent = preset.name;
      const actions = document.createElement('div');
      actions.className = 'preset-actions';
      for (const action of ['불러오기', '삭제']) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'secondary-action';
        button.textContent = action;
        button.setAttribute('aria-label', `${preset.name} ${action}`);
        button.addEventListener('click', () => {
          if (button.dataset.armed !== 'true') {
            list.querySelectorAll('button').forEach(other => {
              if (other.dataset.original) other.textContent = other.dataset.original;
              other.dataset.armed = 'false';
            });
            button.dataset.armed = 'true';
            button.dataset.original = action;
            button.textContent = action === '삭제' ? '삭제 확인' : '적용 확인';
            status.textContent = action === '삭제'
              ? '저장한 프리셋만 삭제합니다. 현재 시간표는 유지됩니다.'
              : '현재 시간표와 설정을 교체합니다. 적용 전 구성은 마지막 변경 되돌리기로 복원할 수 있어요.';
            return;
          }
          if (action === '삭제') {
            const previous = presets.slice();
            if (persist(presets.filter(item => item.id !== preset.id))) {
              status.textContent = '프리셋을 삭제했습니다.';
              nameInput.focus();
              window.TileApp.notify('프리셋을 삭제했습니다', '', { actionLabel: '되돌리기', onAction: () => {
                // Preserve any presets saved after deletion.
                if (!presets.some(item => item.id === preset.id)) persist([...presets, previous.find(item => item.id === preset.id)]);
              } });
            }
          } else {
            try { window.TileApp.applyPersonalPreset(preset.backup); }
            catch (error) { status.textContent = '프리셋을 적용하지 못했습니다. 저장 공간과 프리셋 데이터를 확인해 주세요.'; }
          }
        });
        actions.append(button);
      }
      row.append(title, actions);
      list.append(row);
    }
  }
  byId('personalPresetsOpen').addEventListener('click', () => {
    document.getElementById('toolMenu').classList.remove('is-open');
    byId('toolMenuToggle').setAttribute('aria-expanded', 'false');
    byId('toolMenuPanel').setAttribute('aria-hidden', 'true');
    readable = true;
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(data) || !data.every(item => item && typeof item.id === 'string' && typeof item.name === 'string' && item.backup?.version === 1)) throw new Error('Invalid presets');
      presets = data;
      status.textContent = '';
    } catch (error) {
      readable = false;
      presets = [];
      status.textContent = '기존 프리셋을 읽지 못했습니다. 데이터를 보호하기 위해 새 저장을 중단했습니다.';
    }
    render();
    dialog.showModal();
  });
  byId('personalPresetsClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => byId('toolMenuToggle').focus());
  dialog.addEventListener('keydown', event => event.stopPropagation());
  byId('personalPresetsForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!readable) return;
    const name = nameInput.value.trim();
    if (!name) { status.textContent = '프리셋 이름을 입력해 주세요.'; nameInput.focus(); return; }
    if (presets.some(item => item.name === name)) { status.textContent = '같은 이름의 프리셋이 있어요. 다른 이름을 입력해 주세요.'; return; }
    try {
      const preset = { id: crypto.randomUUID(), name, backup: window.TileApp.createPersonalPreset() };
      if (persist([...presets, preset])) { nameInput.value = ''; status.textContent = `“${name}” 프리셋을 저장했습니다.`; }
    } catch (error) { status.textContent = '현재 구성을 저장하지 못했습니다. 브라우저 저장 설정을 확인해 주세요.'; }
  });
})();
