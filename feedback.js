(() => {
  const dialog = document.getElementById('feedbackDialog');
  const form = document.getElementById('feedbackForm');
  const launch = document.getElementById('feedbackLaunch');
  const subject = document.getElementById('feedbackSubject');
  const body = document.getElementById('feedbackBody');
  const drafts = { idea: { subject: '', body: '' }, bug: { subject: '', body: '' } };
  let currentType = 'idea';

  launch.addEventListener('click', () => {
    document.getElementById('toolMenu').classList.remove('is-open');
    document.getElementById('toolMenuToggle').setAttribute('aria-expanded', 'false');
    document.getElementById('toolMenuPanel').setAttribute('aria-hidden', 'true');
    dialog.showModal();
  });
  document.getElementById('feedbackClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.getElementById('toolMenuToggle').focus());
  // Do not let the application's other modal handlers consume dialog keys.
  dialog.addEventListener('keydown', event => event.stopPropagation());
  form.addEventListener('change', event => {
    if (event.target.name !== 'feedbackType') return;
    drafts[currentType] = { subject: subject.value, body: body.value };
    currentType = event.target.value;
    subject.value = drafts[currentType].subject;
    body.value = drafts[currentType].body;
    const bug = currentType === 'bug';
    document.getElementById('feedbackBugFields').hidden = !bug;
    document.getElementById('feedbackBodyLabel').textContent = bug ? '발생한 문제' : '아이디어';
    subject.placeholder = bug ? '어떤 문제가 발생했나요?' : '어떤 기능이 있으면 좋을까요?';
    body.placeholder = bug ? '실제로 나타난 현상을 자세히 알려주세요.' : '원하는 기능과 어떤 상황에서 도움이 될지 알려주세요.';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!subject.value.trim() || !body.value.trim()) {
      document.getElementById('feedbackStatus').textContent = '제목과 내용을 입력해 주세요.';
      return;
    }
    const bug = currentType === 'bug';
    const sections = [`## ${bug ? '발생한 문제' : '아이디어 제안'}`, body.value.trim()];
    if (bug) {
      const steps = document.getElementById('feedbackSteps').value.trim();
      const expected = document.getElementById('feedbackExpected').value.trim();
      if (steps) sections.push('## 재현 방법', steps);
      if (expected) sections.push('## 기대한 동작', expected);
    }
    const url = new URL('https://github.com/justcallmelightt/Tile/issues/new');
    url.searchParams.set('title', `[${bug ? '버그' : '아이디어'}] ${subject.value.trim()}`);
    url.searchParams.set('body', sections.join('\n\n'));
    const link = document.createElement('a');
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    document.getElementById('feedbackStatus').textContent = 'GitHub에서 최종 등록해 주세요. 새 창이 열리지 않았다면 팝업 설정을 확인해 주세요. 입력 내용은 그대로 남아 있습니다.';
  });
})();
