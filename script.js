const classroomMap = {
  "미디어 컨탠츠 일반": "UI Lab실",
  "프로그래밍 JAVA 기초": "제4소프트웨어랩",
  "방과후학교 A": "제4소프트웨어랩",
  "방과후학교 B": "1-2",
  "공통국어 (이대형)": "AICE랩실",
  "공통국어": "1-2",
  "공통영어": "1-2",
  "공통수학": "1-2",
  "한국사": "1-2",
  "성공적인 직업생활": "1-2",
  "기술가정": "1-2",
  "일본어": "1-2",
  "자치": "1-2",
  "동아리 · 멘토링": "꿈담카페, 사회정서탐구반",
  "체육": "체육관"
};

const teacherMap = {
  "자치": "김지훈",
  "프로그래밍 JAVA 기초": "민주리 / 김윤지 / 유병석",
  "공통영어": "김지훈",
  "성공적인 직업생활": "이정임",
  "한국사": "이철호",
  "기술가정": "김보경",
  "미디어 컨탠츠 일반": "정하나",
  "체육": "김신",
  "공통국어": "손명수",
  "공통국어 (이대형)": "이대형",
  "공통수학": "신혜영 / 이호연",
  "일본어": "김윤환",
  "방과후학교 A": "박성래 / 김영철 / 함기훈 / 유병석",
  "방과후학교 B": "박은경 / 최인녀 / 박혜영 / 김영미"
};

const defaultClassroomMap = { ...classroomMap };
const defaultTeacherMap = { ...teacherMap };

const scheduleRanges = [
  { name: "조회", start: "08:10", end: "08:20", merged: true },
  { name: "1교시", start: "08:20", end: "09:10" },
  { name: "2교시", start: "09:20", end: "10:10" },
  { name: "3교시", start: "10:20", end: "11:10" },
  { name: "4교시", start: "11:20", end: "12:10" },
  { name: "중식", start: "12:10", end: "13:00", merged: true },
  { name: "5교시", start: "13:00", end: "13:50" },
  { name: "6교시", start: "14:00", end: "14:50" },
  { name: "7교시", start: "15:00", end: "15:50" },
  { name: "종례", start: "15:50", end: "16:30", merged: true },
  { name: "방과후 A", start: "16:30", end: "17:20" },
  { name: "석식", start: "17:20", end: "18:20", merged: true },
  { name: "방과후 B", start: "18:20", end: "20:00" }
];

const breakRanges = [
  { name: "쉬는시간", start: "09:10", end: "09:20" },
  { name: "쉬는시간", start: "10:10", end: "10:20" },
  { name: "쉬는시간", start: "11:10", end: "11:20" },
  { name: "쉬는시간", start: "13:50", end: "14:00" },
  { name: "쉬는시간", start: "14:50", end: "15:00" }
];

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
const themeToggle = document.getElementById("themeToggle");
const todayOnlyToggle = document.getElementById("todayOnlyToggle");
const schoolSubtitle = document.getElementById("schoolSubtitle");
const customToggle = document.getElementById("customToggle");
const customPanel = document.getElementById("customPanel");
const customClose = document.getElementById("customClose");
const customInput = document.getElementById("customTimetableInput");
const customSave = document.getElementById("customSave");
const customLoadExample = document.getElementById("customLoadExample");
const customReset = document.getElementById("customReset");
const currentTimeEl = document.getElementById("currentTime");
const floatingTopbar = document.getElementById("floatingTopbar");
const topbarTime = document.getElementById("topbarTime");
const topbarPeriod = document.getElementById("topbarPeriod");
const topbarRemainingLabel = document.getElementById("topbarRemainingLabel");
const topbarRemaining = document.getElementById("topbarRemaining");
const topbarDayRemaining = document.getElementById("topbarDayRemaining");
const topbarRoom = document.getElementById("topbarRoom");
const topbarNeis = document.getElementById("topbarNeis");
const toolMenu = document.getElementById("toolMenu");
const toolMenuToggle = document.getElementById("toolMenuToggle");
const toolMenuPanel = document.getElementById("toolMenuPanel");
const schoolSettingsToggle = document.getElementById("schoolSettingsToggle");
const setupModal = document.getElementById("setupModal");
const closeSchoolSettings = document.getElementById("closeSchoolSettings");
const appSettingsToggle = document.getElementById("appSettingsToggle");
const appSettingsModal = document.getElementById("appSettingsModal");
const closeAppSettings = document.getElementById("closeAppSettings");
const allergyInput = document.getElementById("allergyInput");
const saveAppSettings = document.getElementById("saveAppSettings");
const resetAppSettings = document.getElementById("resetAppSettings");
const mealToggle = document.getElementById("mealToggle");
const mealPanel = document.getElementById("mealPanel");
const mealClose = document.getElementById("mealClose");
const breakfastMenu = document.getElementById("breakfastMenu");
const lunchMenu = document.getElementById("lunchMenu");
const dinnerMenu = document.getElementById("dinnerMenu");
const breakfastWarning = document.getElementById("breakfastWarning");
const lunchWarning = document.getElementById("lunchWarning");
const dinnerWarning = document.getElementById("dinnerWarning");
const memoPanel = document.getElementById("memoPanel");
const memoClose = document.getElementById("memoClose");
const memoInput = document.getElementById("memoInput");
const memoSave = document.getElementById("memoSave");
const memoReset = document.getElementById("memoReset");
const subjectOverlay = document.getElementById("subjectOverlay");
const subjectClose = document.getElementById("closeModal");
const subjectName = document.getElementById("subjectName");
const subjectLocation = document.getElementById("subjectLocation");
const subjectTeacher = document.getElementById("subjectTeacher");
const modalInfoMode = document.getElementById("modalInfoMode");
const modalInputMode = document.getElementById("modalInputMode");
const modalTitle = document.getElementById("modalTitle");
const modalInput = document.getElementById("modalInput");
const modalConfirm = document.getElementById("modalConfirm");
const subjectEditMode = document.getElementById("subjectEditMode");
const subjectEditTitle = document.getElementById("subjectEditTitle");
const subjectEditName = document.getElementById("subjectEditName");
const subjectEditRoom = document.getElementById("subjectEditRoom");
const subjectEditTeacher = document.getElementById("subjectEditTeacher");
const subjectEditMemo = document.getElementById("subjectEditMemo");
const subjectEditSave = document.getElementById("subjectEditSave");
const subjectEditReset = document.getElementById("subjectEditReset");
const subjectEditNeis = document.getElementById("subjectEditNeis");
const subjectBulkMode = document.getElementById("subjectBulkMode");
const subjectBulkTitle = document.getElementById("subjectBulkTitle");
const subjectBulkRows = document.getElementById("subjectBulkRows");
const subjectBulkSave = document.getElementById("subjectBulkSave");
const subjectBulkBack = document.getElementById("subjectBulkBack");
const subjectBulkNeis = document.getElementById("subjectBulkNeis");
const CELL_EDIT_STORAGE_KEY = "tile-cell-edits";
const SCHEDULE_EDIT_STORAGE_KEY = "tile-schedule-edits";
const SUBJECT_MEMO_STORAGE_KEY = "tile-subject-memos";
const SUBJECT_INFO_EDIT_STORAGE_KEY = "tile-subject-info-edits";
const CELL_INFO_EDIT_STORAGE_KEY = "tile-cell-info-edits";
const PERIOD_INFO_EDIT_STORAGE_KEY = "tile-period-info-edits";
const INFO_STORAGE_MIGRATION_KEY = "tile-info-storage-migrated-v2";
const MEAL_STORAGE_KEY = "tile-meals";
const APP_SETTINGS_STORAGE_KEY = "tile-app-settings";
let selectedSubjectCell = null;
let selectedSubjectRow = null;
let selectedSubjectIndex = null;
let subjectBulkTargets = [];
let modalCallback = null;
let overlayDismissBlockUntil = 0;
const defaultCellSubjectMap = new Map();

let previousTimeString = null;
const rollingTimeTimers = [];
const rollingTextPreviousMap = new Map();
const rollingTextTimersMap = new Map();
const textSwapTimersMap = new Map();
let cursorGlowFrame = null;
let topbarFrame = null;
let floatingTopbarVisible = false;
let statusTickTimer = null;

function resetRollingTimeTimers() {
  while (rollingTimeTimers.length > 0) {
    clearTimeout(rollingTimeTimers.pop());
  }
}

function resetRollingTextTimers(key) {
  const timers = rollingTextTimersMap.get(key);
  if (!timers) return;

  while (timers.length > 0) {
    clearTimeout(timers.pop());
  }
}

function getRollingTimeCharClass(char) {
  if (/[0-9]/.test(char)) return "time-char";
  if (char === ":") return "time-separator";
  if (char === " ") return "time-space";
  return "time-label-char";
}

function renderStaticRollingDigit(element, char) {
  element.innerHTML = `<span class="time-static">${char}</span>`;
  element.dataset.value = char;
}

function triggerTextSwapAnimation(element, key) {
  if (!element || !key) return;

  const previousTimer = textSwapTimersMap.get(key);
  if (previousTimer) clearTimeout(previousTimer);

  element.classList.remove("text-roll-swap");
  void element.offsetWidth;
  element.classList.add("text-roll-swap");

  const timer = setTimeout(() => {
    element.classList.remove("text-roll-swap");
    textSwapTimersMap.delete(key);
  }, 460);
  textSwapTimersMap.set(key, timer);
}

function renderStaticTimeStyleText(element, text) {
  if (!element) return;

  element.innerHTML = "";
  element.dataset.timeText = text;
  element.setAttribute("aria-label", text);

  if (!/[0-9]/.test(text)) {
    element.textContent = text;
    return;
  }

  [...text].forEach((char) => {
    const span = document.createElement("span");
    span.className = getRollingTimeCharClass(char);
    span.dataset.value = char;
    if (canRollCharacterElement(span)) {
      renderStaticRollingDigit(span, char);
    } else {
      span.textContent = char;
    }
    element.appendChild(span);
  });
}

function canRollCharacterElement(element) {
  return element?.classList?.contains("time-char");
}

function renderRollingCharacter(element, oldChar, newChar) {
  element.dataset.value = newChar;
  element.textContent = "";

  const inner = document.createElement("span");
  inner.className = "time-char-inner";

  const oldSpan = document.createElement("span");
  oldSpan.className = "time-old";
  oldSpan.textContent = oldChar;

  const newSpan = document.createElement("span");
  newSpan.className = "time-new";
  newSpan.textContent = newChar;

  inner.append(oldSpan, newSpan);
  element.appendChild(inner);
  element.classList.remove("animate", "rolling");
  void element.offsetWidth;

  requestAnimationFrame(() => {
    element.classList.add("animate", "rolling");
  });
}

function finishRollingCharacter(element, char) {
  element.classList.remove("animate", "rolling");
  renderStaticRollingDigit(element, char);
}

function renderRollingTimeText(timeString) {
  renderStaticTimeStyleText(currentTimeEl, timeString);
  previousTimeString = timeString;
}

function renderRollingStyleText(element, text, key, options = {}) {
  if (!element) return;

  const shouldSwapText = !options.disableTextSwap;
  const finishDelay = Number.isFinite(options.finishDelay) ? options.finishDelay : 600;
  element.dataset.timeText = text;
  element.setAttribute("aria-label", text);

  const previousText = rollingTextPreviousMap.get(key);
  const chars = element.children;

  if (!/[0-9]/.test(text)) {
    resetRollingTextTimers(key);
    if (shouldSwapText && previousText && previousText !== text) triggerTextSwapAnimation(element, key);
    element.textContent = text;
    rollingTextPreviousMap.set(key, text);
    return;
  }

  if (previousText === text && chars.length === text.length) return;

  if (!previousText) {
    renderStaticTimeStyleText(element, text);
    rollingTextPreviousMap.set(key, text);
    return;
  }

  if (!/[0-9]/.test(previousText)) {
    if (shouldSwapText) triggerTextSwapAnimation(element, key);
    renderStaticTimeStyleText(element, text);
    rollingTextPreviousMap.set(key, text);
    return;
  }

  if (chars.length !== text.length) {
    resetRollingTextTimers(key);
    if (shouldSwapText) triggerTextSwapAnimation(element, key);
    element.innerHTML = "";
    const changedSpans = [];

    [...text].forEach((char, index) => {
      const oldChar = previousText[index] || char;
      const span = document.createElement("span");
      span.className = getRollingTimeCharClass(char);
      span.dataset.value = char;

      if (canRollCharacterElement(span) && char !== oldChar) {
        renderRollingCharacter(span, oldChar, char);
        changedSpans.push({ span, char });
      } else if (canRollCharacterElement(span)) {
        renderStaticRollingDigit(span, char);
      } else {
        span.textContent = char;
      }

      element.appendChild(span);
    });

    if (changedSpans.length > 0) {
      const timer = setTimeout(() => {
        changedSpans.forEach(({ span, char }) => {
          finishRollingCharacter(span, char);
        });
        rollingTextTimersMap.delete(key);
      }, finishDelay);
      rollingTextTimersMap.set(key, [timer]);
    }

    rollingTextPreviousMap.set(key, text);
    return;
  }

  const changedWrappers = [];
  let textChanged = false;

  [...text].forEach((char, index) => {
    const oldChar = previousText[index];
    if (char === oldChar) return;

    const wrapper = chars[index];
    if (!wrapper) return;

    wrapper.className = getRollingTimeCharClass(char);
    if (!canRollCharacterElement(wrapper)) {
      wrapper.textContent = char;
      wrapper.dataset.value = char;
      textChanged = true;
      return;
    }

    renderRollingCharacter(wrapper, oldChar, char);
    changedWrappers.push({ wrapper, char });
  });

  if (textChanged) {
    if (shouldSwapText) triggerTextSwapAnimation(element, key);
  }

  if (changedWrappers.length > 0) {
    const timer = setTimeout(() => {
      changedWrappers.forEach(({ wrapper, char }) => {
        finishRollingCharacter(wrapper, char);
      });
      rollingTextTimersMap.delete(key);
    }, finishDelay);
    rollingTextTimersMap.set(key, [timer]);
  }

  rollingTextPreviousMap.set(key, text);
}

function createRollingTime(timeString) {
  if (!currentTimeEl) return;
  currentTimeEl.dataset.timeText = timeString;
  currentTimeEl.setAttribute("aria-label", timeString);

  if (previousTimeString === null || currentTimeEl.children.length === 0) {
    renderRollingTimeText(timeString);
    return;
  }

  const chars = currentTimeEl.children;

  if (chars.length !== timeString.length) {
    resetRollingTimeTimers();
    renderRollingTimeText(timeString);
    return;
  }

  [...timeString].forEach((char, index) => {
    const oldChar = previousTimeString[index];
    if (char === oldChar) return;

    const wrapper = chars[index];
    if (!wrapper) return;

    wrapper.className = getRollingTimeCharClass(char);
    if (!canRollCharacterElement(wrapper)) {
      wrapper.textContent = char;
      wrapper.dataset.value = char;
      return;
    }

    renderRollingCharacter(wrapper, oldChar, char);

    const timer = setTimeout(() => {
      finishRollingCharacter(wrapper, char);
      const timerIndex = rollingTimeTimers.indexOf(timer);
      if (timerIndex !== -1) rollingTimeTimers.splice(timerIndex, 1);
    }, 600);
    rollingTimeTimers.push(timer);
  });

  previousTimeString = timeString;
}

function openSubjectModal(data = {}) {
  if (!subjectOverlay) return;
  if (modalInfoMode) modalInfoMode.classList.remove("mode-hidden");
  if (modalInputMode) modalInputMode.classList.add("mode-hidden");
  if (subjectEditMode) subjectEditMode.classList.add("mode-hidden");
  if (subjectBulkMode) subjectBulkMode.classList.add("mode-hidden");
  if (subjectName) subjectName.textContent = data.name || "과목 정보";
  if (subjectLocation) subjectLocation.textContent = data.room || "교실 정보 없음";
  if (subjectTeacher) subjectTeacher.textContent = data.teacher || "선생님 정보 없음";
  showSubjectOverlay();
}

function openInputModal(title, placeholder, callback) {
  if (!subjectOverlay || !modalInput || !modalTitle || !modalInfoMode || !modalInputMode) return;
  modalInfoMode.classList.add("mode-hidden");
  modalInputMode.classList.remove("mode-hidden");
  if (subjectEditMode) subjectEditMode.classList.add("mode-hidden");
  if (subjectBulkMode) subjectBulkMode.classList.add("mode-hidden");
  modalTitle.textContent = title;
  modalInput.placeholder = placeholder;
  modalInput.value = "";
  modalCallback = callback;
  showSubjectOverlay();
  setTimeout(() => modalInput.focus(), 100);
}

function getCellMemoKey(row, index) {
  if (!row || index == null) return "";
  return `${row.dataset.period}_${index}`;
}

function readJsonStorage(key, fallback = {}) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clearSubjectLocalEditsForNeis() {
  localStorage.removeItem(CELL_EDIT_STORAGE_KEY);
  localStorage.removeItem(SUBJECT_INFO_EDIT_STORAGE_KEY);
  localStorage.removeItem(CELL_INFO_EDIT_STORAGE_KEY);
  localStorage.removeItem(SUBJECT_MEMO_STORAGE_KEY);
  resetInfoMapsToDefault();
  restoreDefaultCellSubjects();
}

async function syncNeisFromCleanLocalState() {
  clearSubjectLocalEditsForNeis();
  const synced = typeof window.syncNeis === "function" ? await window.syncNeis() : false;
  applyRoomBadges();
  updateMemoIndicators();
  updateCurrentStatus();
  return synced;
}

function migrateLegacyInfoStorage() {
  if (localStorage.getItem(INFO_STORAGE_MIGRATION_KEY) === "done") return;

  localStorage.removeItem(PERIOD_INFO_EDIT_STORAGE_KEY);
  localStorage.removeItem(SUBJECT_INFO_EDIT_STORAGE_KEY);
  localStorage.setItem(INFO_STORAGE_MIGRATION_KEY, "done");
}

function getCellStorageIndex(row, cell) {
  const cells = Array.from(row.querySelectorAll("td"));
  return cells.indexOf(cell);
}

function getDefaultCellSubject(row, index) {
  return defaultCellSubjectMap.get(`${row.dataset.period}_${index}`) || "";
}

function captureDefaultCellSubjects() {
  defaultCellSubjectMap.clear();
  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    row.querySelectorAll("td").forEach((cell, index) => {
      if (cell.hasAttribute("colspan")) return;
      defaultCellSubjectMap.set(`${row.dataset.period}_${index}`, cell.dataset.subject || "");
    });
  });
}

function restoreDefaultCellSubjects() {
  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    row.querySelectorAll("td").forEach((cell, index) => {
      if (cell.hasAttribute("colspan")) return;
      renderSubjectCell(cell, getDefaultCellSubject(row, index));
    });
  });
  applyRoomBadges();
  updateMemoIndicators();
}

function loadSubjectInfoEdits() {
  const edits = readJsonStorage(SUBJECT_INFO_EDIT_STORAGE_KEY);
  Object.entries(edits).forEach(([subject, info]) => {
    if (info?.room) classroomMap[subject] = info.room;
    if (info?.teacher) teacherMap[subject] = info.teacher;
  });
}

function saveSubjectInfoEdit(subject, info = {}) {
  if (!subject) return;
  const edits = readJsonStorage(SUBJECT_INFO_EDIT_STORAGE_KEY);
  edits[subject] = {
    room: info.room || "",
    teacher: info.teacher || ""
  };
  writeJsonStorage(SUBJECT_INFO_EDIT_STORAGE_KEY, edits);
}

function deleteSubjectInfoEdit(subject) {
  if (!subject) return;
  const edits = readJsonStorage(SUBJECT_INFO_EDIT_STORAGE_KEY);
  delete edits[subject];
  writeJsonStorage(SUBJECT_INFO_EDIT_STORAGE_KEY, edits);
}

function getCellInfoKey(row, index) {
  if (!row || index == null) return "";
  return `${row.dataset.period}_${index}`;
}

function getCellInfo(row, index) {
  const edits = readJsonStorage(CELL_INFO_EDIT_STORAGE_KEY);
  return edits[getCellInfoKey(row, index)] || {};
}

function saveCellInfo(row, index, info = {}) {
  const key = getCellInfoKey(row, index);
  if (!key) return;

  const edits = readJsonStorage(CELL_INFO_EDIT_STORAGE_KEY);
  const normalized = {
    room: info.room || "",
    teacher: info.teacher || ""
  };

  if (normalized.room || normalized.teacher) {
    edits[key] = normalized;
  } else {
    delete edits[key];
  }

  writeJsonStorage(CELL_INFO_EDIT_STORAGE_KEY, edits);
}

function openSubjectEditor(cell, row, index) {
  if (!subjectOverlay || !subjectEditMode) return;
  selectedSubjectCell = cell;
  selectedSubjectRow = row;
  selectedSubjectIndex = index;

  const subject = cell.dataset.subject || "";
  const memos = readJsonStorage(SUBJECT_MEMO_STORAGE_KEY);
  const memoKey = getCellMemoKey(row, index);
  const cellInfo = getCellInfo(row, index);

  if (modalInfoMode) modalInfoMode.classList.add("mode-hidden");
  if (modalInputMode) modalInputMode.classList.add("mode-hidden");
  if (subjectBulkMode) subjectBulkMode.classList.add("mode-hidden");
  subjectEditMode.classList.remove("mode-hidden");
  if (subjectEditTitle) subjectEditTitle.textContent = subject ? "과목 수정" : "과목 추가";
  if (subjectEditName) subjectEditName.value = subject;
  if (subjectEditRoom) subjectEditRoom.value = cellInfo.room || classroomMap[subject] || "";
  if (subjectEditTeacher) subjectEditTeacher.value = cellInfo.teacher || teacherMap[subject] || "";
  if (subjectEditMemo) subjectEditMemo.value = memos[memoKey] || "";

  showSubjectOverlay();
  setTimeout(() => subjectEditName?.focus(), 100);
}

function showSubjectOverlay() {
  if (!subjectOverlay) return;
  // remove hidden immediately so CSS can animate in
  subjectOverlay.classList.remove("hidden");
  subjectOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  overlayDismissBlockUntil = Date.now() + 360;

  // ensure modal animation class is present (optional)
  const modal = document.getElementById("subjectModal");
  modal?.classList.remove("modal-animate-out");
  // small forced reflow for consistent animation start
  void (modal && modal.offsetWidth);
  modal?.classList.add("modal-animate-in");
}

function closeSubjectModal() {
  if (!subjectOverlay) return;
  const modal = document.getElementById("subjectModal");
  // play "out" animation by removing "in" class (we rely on overlay hide after timeout)
  modal?.classList.remove("modal-animate-in");
  modal?.classList.add("modal-animate-out");

  // wait for transition duration before hiding overlay to avoid abrupt background removal
  const hideDelay = 360; // ms, matches CSS durations
  setTimeout(() => {
    subjectOverlay.classList.add("hidden");
    subjectOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modal?.classList.remove("modal-animate-out");
    if (subjectBulkRows) subjectBulkRows.textContent = "";
    if (subjectEditMode) subjectEditMode.classList.add("mode-hidden");
    if (subjectBulkMode) subjectBulkMode.classList.add("mode-hidden");
    modalCallback = null;
    selectedSubjectCell = null;
    selectedSubjectRow = null;
    selectedSubjectIndex = null;
    subjectBulkTargets = [];
  }, hideDelay);
}

modalConfirm?.addEventListener("click", () => {
  if (!modalCallback || !modalInput) return;
  modalCallback(modalInput.value);
  closeSubjectModal();
});

subjectClose?.addEventListener("click", closeSubjectModal);

modalInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    modalConfirm?.click();
  }
});

function updateMemoIndicators() {
  const memos = readJsonStorage(SUBJECT_MEMO_STORAGE_KEY);

  document.querySelectorAll("td[data-subject]").forEach((cell) => {
    const row = cell.closest("tr");
    const cellIndex = getCellStorageIndex(row, cell);
    const memoKey = getCellMemoKey(row, cellIndex);
    const subjectWrap = cell.querySelector(".subject");
    const subjectNameEl = subjectWrap?.querySelector(".subject-name");

    if (!subjectWrap || !subjectNameEl) return;

    const existing = subjectWrap.querySelector(".memo-indicator");
    if (existing) existing.remove();

    if ((memos[memoKey] || "").trim()) {
      const dot = document.createElement("span");
      dot.className = "memo-indicator";
      dot.setAttribute("aria-hidden", "true");
      dot.textContent = "●";
      subjectNameEl.appendChild(dot);
    }
  });
}

function getSubjectDayLabel(index) {
  return document.querySelector(`thead th[data-day="${index + 1}"]`)?.textContent.trim()
    || dayNames[index + 1]
    || `${index + 1}`;
}

function getSubjectBulkTargets(subject) {
  if (!subject) return [];

  return Array.from(document.querySelectorAll("tbody tr[data-period]")).flatMap((row) => (
    Array.from(row.querySelectorAll("td"))
      .map((cell, index) => ({ row, cell, index }))
      .filter(({ cell }) => !cell.hasAttribute("colspan") && cell.dataset.subject === subject)
  ));
}

function createBulkInput(labelText, field, value, tagName = "input") {
  const label = document.createElement("label");
  label.className = "subject-bulk-field";

  const labelSpan = document.createElement("span");
  labelSpan.textContent = labelText;
  label.appendChild(labelSpan);

  const input = document.createElement(tagName);
  input.dataset.field = field;
  input.value = value || "";
  if (tagName === "textarea") {
    input.rows = 2;
    input.placeholder = "메모";
  } else {
    input.type = "text";
    input.placeholder = labelText;
  }
  label.appendChild(input);

  return label;
}

function openSubjectBulkEditor() {
  if (!selectedSubjectCell || !subjectBulkMode || !subjectBulkRows) return;

  const selectedSubject = selectedSubjectCell.dataset.subject || "";
  subjectBulkTargets = getSubjectBulkTargets(selectedSubject);
  if (!selectedSubject || !subjectBulkTargets.length) return;

  if (modalInfoMode) modalInfoMode.classList.add("mode-hidden");
  if (modalInputMode) modalInputMode.classList.add("mode-hidden");
  if (subjectEditMode) subjectEditMode.classList.add("mode-hidden");
  subjectBulkMode.classList.remove("mode-hidden");
  if (subjectBulkTitle) subjectBulkTitle.textContent = `${selectedSubject} 일괄 수정`;

  const memos = readJsonStorage(SUBJECT_MEMO_STORAGE_KEY);
  subjectBulkRows.textContent = "";

  subjectBulkTargets.forEach(({ row, cell, index }, targetIndex) => {
    const subject = cell.dataset.subject || "";
    const memoKey = getCellMemoKey(row, index);
    const cellInfo = getCellInfo(row, index);
    const rowEl = document.createElement("div");
    rowEl.className = "subject-bulk-row";
    rowEl.dataset.targetIndex = String(targetIndex);

    const dayLabel = document.createElement("div");
    dayLabel.className = "subject-bulk-day";
    dayLabel.textContent = `${getSubjectDayLabel(index)} · ${row.dataset.period || "교시"}`;
    rowEl.appendChild(dayLabel);

    const fields = document.createElement("div");
    fields.className = "subject-bulk-fields";
    fields.appendChild(createBulkInput("과목", "subject", subject));
    fields.appendChild(createBulkInput("교실", "room", cellInfo.room || classroomMap[subject] || ""));
    fields.appendChild(createBulkInput("선생님", "teacher", cellInfo.teacher || teacherMap[subject] || ""));
    fields.appendChild(createBulkInput("메모", "memo", memos[memoKey] || "", "textarea"));
    rowEl.appendChild(fields);
    subjectBulkRows.appendChild(rowEl);
  });

  subjectBulkRows.querySelector("[data-field='subject']")?.focus();
}

function saveBulkSubjectEdits() {
  if (!subjectBulkTargets.length || !subjectBulkRows) return;

  const memos = readJsonStorage(SUBJECT_MEMO_STORAGE_KEY);

  subjectBulkRows.querySelectorAll(".subject-bulk-row").forEach((rowEl) => {
    const targetIndex = Number(rowEl.dataset.targetIndex);
    const target = subjectBulkTargets[targetIndex];
    const { row, cell, index } = target || {};
    if (!cell || cell.hasAttribute("colspan")) return;

    const subject = rowEl.querySelector("[data-field='subject']")?.value.trim() || "";
    const room = rowEl.querySelector("[data-field='room']")?.value.trim() || "";
    const teacher = rowEl.querySelector("[data-field='teacher']")?.value.trim() || "";
    const memo = rowEl.querySelector("[data-field='memo']")?.value.trim() || "";
    const memoKey = getCellMemoKey(row, index);

    renderSubjectCell(cell, subject);
    saveCellEdit(row.dataset.period, index, subject);
    saveCellInfo(row, index, subject ? { room, teacher } : {});

    if (subject && memo) memos[memoKey] = memo;
    else delete memos[memoKey];
  });

  writeJsonStorage(SUBJECT_MEMO_STORAGE_KEY, memos);
  applyRoomBadges();
  updateMemoIndicators();
  updateCurrentStatus();
  closeSubjectModal();
}

subjectEditSave?.addEventListener("click", () => {
  if (!selectedSubjectCell || !selectedSubjectRow) return;
  const subject = subjectEditName?.value.trim() || "";
  if (!subject) return;

  const room = subjectEditRoom?.value.trim() || "";
  const teacher = subjectEditTeacher?.value.trim() || "";
  const memo = subjectEditMemo?.value.trim() || "";
  const memoKey = getCellMemoKey(selectedSubjectRow, selectedSubjectIndex);

  renderSubjectCell(selectedSubjectCell, subject);
  saveCellEdit(selectedSubjectRow.dataset.period, selectedSubjectIndex, subject);

  const memos = readJsonStorage(SUBJECT_MEMO_STORAGE_KEY);
  if (memo) memos[memoKey] = memo;
  else delete memos[memoKey];
  writeJsonStorage(SUBJECT_MEMO_STORAGE_KEY, memos);
  saveCellInfo(selectedSubjectRow, selectedSubjectIndex, { room, teacher });

  applyRoomBadges();
  updateMemoIndicators();
  updateCurrentStatus();
  closeSubjectModal();
});

subjectEditReset?.addEventListener("click", () => {
  openSubjectBulkEditor();
});

subjectEditNeis?.addEventListener("click", async () => {
  await syncNeisFromCleanLocalState();
  closeSubjectModal();
});

subjectBulkSave?.addEventListener("click", saveBulkSubjectEdits);

subjectBulkBack?.addEventListener("click", () => {
  if (subjectBulkMode) subjectBulkMode.classList.add("mode-hidden");
  if (subjectEditMode) subjectEditMode.classList.remove("mode-hidden");
  setTimeout(() => subjectEditName?.focus(), 40);
});

subjectBulkNeis?.addEventListener("click", async () => {
  await syncNeisFromCleanLocalState();
  closeSubjectModal();
});

function triggerButtonPop(buttonEl) {
  if (!buttonEl) return;

  // Prefer Web Animations API (avoids forced reflow / less jank on Safari)
  if (typeof buttonEl.animate === "function") {
    buttonEl.animate(
      [
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-2px) scale(1.06)", offset: 0.45 },
        { transform: "translateY(0) scale(1)" }
      ],
      { duration: 220, easing: "cubic-bezier(0.2, 0.9, 0.2, 1)" }
    );
    return;
  }

  // Fallback
  buttonEl.classList.remove("popped");
  window.requestAnimationFrame(() => {
    buttonEl.classList.add("popped");
    window.setTimeout(() => {
      buttonEl.classList.remove("popped");
    }, 260);
  });
}

function setToolMenuOpen(isOpen) {
  if (!toolMenu || !toolMenuToggle || !toolMenuPanel) return;
  toolMenu.classList.toggle("is-open", isOpen);
  toolMenuToggle.setAttribute("aria-expanded", String(isOpen));
  toolMenuPanel.setAttribute("aria-hidden", String(!isOpen));
}

function renderMeal(type, menu) {
  const targetMap = {
    "조식": breakfastMenu,
    "중식": lunchMenu,
    "석식": dinnerMenu
  };
  const target = targetMap[type];
  if (target) target.textContent = menu || "아직 불러온 급식 정보가 없습니다.";
  renderMealWarning(type);
}

function saveMeal(type, menu, rawMenu = "") {
  const meals = readJsonStorage(MEAL_STORAGE_KEY);
  meals[type] = { menu, rawMenu };
  writeJsonStorage(MEAL_STORAGE_KEY, meals);
  renderMeal(type, menu);
}

function loadMeals() {
  const meals = readJsonStorage(MEAL_STORAGE_KEY);
  ["조식", "중식", "석식"].forEach((type) => {
    const value = meals[type];
    renderMeal(type, typeof value === "string" ? value : value?.menu);
  });
}

function getAppSettings() {
  return readJsonStorage(APP_SETTINGS_STORAGE_KEY, { allergies: [] });
}

function normalizeAllergyTokens(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function saveAppSettingsFromInput() {
  const settings = {
    allergies: normalizeAllergyTokens(allergyInput?.value || "")
  };
  writeJsonStorage(APP_SETTINGS_STORAGE_KEY, settings);
  renderAllMealWarnings();
  return settings;
}

function loadAppSettings() {
  const settings = getAppSettings();
  if (allergyInput) allergyInput.value = (settings.allergies || []).join(", ");
  renderAllMealWarnings();
}

function getMealWarningTarget(type) {
  if (type === "조식") return breakfastWarning;
  if (type === "석식") return dinnerWarning;
  return lunchWarning;
}

function findMealAllergyHits(type) {
  const settings = getAppSettings();
  const tokens = settings.allergies || [];
  if (tokens.length === 0) return [];

  const meals = readJsonStorage(MEAL_STORAGE_KEY);
  const value = meals[type];
  const menu = typeof value === "string" ? value : value?.menu || "";
  const rawMenu = typeof value === "string" ? value : value?.rawMenu || menu;
  const searchable = `${menu}\n${rawMenu}`.toLowerCase();

  return tokens.filter((token) => {
    const lower = token.toLowerCase();
    if (/^\d+$/.test(token)) {
      return new RegExp(`(^|[^0-9])${token}([^0-9]|$)`).test(rawMenu);
    }
    return searchable.includes(lower);
  });
}

function renderMealWarning(type) {
  const target = getMealWarningTarget(type);
  if (!target) return;
  const hits = findMealAllergyHits(type);
  target.textContent = hits.length > 0 ? `주의: ${hits.join(", ")}` : "";
  target.classList.toggle("is-visible", hits.length > 0);
}

function renderAllMealWarnings() {
  ["조식", "중식", "석식"].forEach(renderMealWarning);
}

function updateIPhoneSafeZone() {
  const isIPhone = /iPhone/i.test(navigator.userAgent);
  document.body.classList.toggle("has-iphone-safe-zone", isIPhone);
}

function toMinutes(timeText) {
  const [hour, minute] = timeText.split(":").map(Number);
  return hour * 60 + minute;
}

function format12Hour(timeText) {
  const [hourText, minuteText] = timeText.split(":");
  const hour = Number(hourText);
  const minute = minuteText;
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${displayHour}:${minute}`;
}

function formatRelativeDuration(diffMinutes, suffix) {
  const totalSeconds = Math.max(0, Math.ceil(diffMinutes * 60));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];

  if (days > 0) parts.push(`${days}일`);
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);
  parts.push(`${String(seconds).padStart(2, "0")}초`);

  return `${parts.join(" ")} ${suffix}`;
}

function formatScheduleDuration(scheduleItem) {
  if (!scheduleItem?.start || !scheduleItem?.end) return "";

  const durationMinutes = Math.max(0, Math.round(toMinutes(scheduleItem.end) - toMinutes(scheduleItem.start)));
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}시간 ${minutes}분`;
  if (hours > 0) return `${hours}시간`;
  return `${minutes}분`;
}

function formatRemainingTime(diffMinutes) {
  if (diffMinutes <= 0) return "곧 종료";
  return formatRelativeDuration(diffMinutes, "후");
}

function formatPeriodRemainingTime(diffMinutes) {
  if (diffMinutes <= 0) return "곧 종료";
  return formatRelativeDuration(diffMinutes, "남음");
}

function formatBeforeSchoolTime(diffMinutes) {
  if (diffMinutes <= 0) return "곧 시작";
  return formatRelativeDuration(diffMinutes, "전");
}

function getNextSchoolStartDiffMinutes(now, includeToday = false) {
  const dayStartMinutes = toMinutes(scheduleRanges[0].start);
  const startOffset = includeToday ? 0 : 1;

  for (let offset = startOffset; offset <= 7; offset += 1) {
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + offset);

    const day = nextDate.getDay();
    if (!(day >= 1 && day <= 5)) continue;

    const startDate = new Date(
      nextDate.getFullYear(),
      nextDate.getMonth(),
      nextDate.getDate(),
      Math.floor(dayStartMinutes / 60),
      dayStartMinutes % 60,
      0,
      0
    );
    const diffMinutes = (startDate.getTime() - now.getTime()) / 60000;
    if (diffMinutes > 0) return diffMinutes;
  }

  return null;
}

function formatNextSchoolStartFromNow(now, currentMinutes, dayOfWeek) {
  const dayStartMinutes = toMinutes(scheduleRanges[0].start);
  if (dayOfWeek >= 1 && dayOfWeek <= 5 && currentMinutes < dayStartMinutes) {
    return formatBeforeSchoolTime(dayStartMinutes - currentMinutes);
  }

  const nextStartDiff = getNextSchoolStartDiffMinutes(now);
  return nextStartDiff !== null ? formatRelativeDuration(nextStartDiff, "전") : "일과 시간 아님";
}

function getCurrentSchedule(minutesNow) {
  for (const item of scheduleRanges) {
    const start = toMinutes(item.start);
    const end = toMinutes(item.end);
    if (minutesNow >= start && minutesNow < end) {
      return { ...item, type: "schedule" };
    }
  }

  for (const item of breakRanges) {
    const start = toMinutes(item.start);
    const end = toMinutes(item.end);
    if (minutesNow >= start && minutesNow < end) {
      return { ...item, type: "break" };
    }
  }

  return null;
}

function getScheduleProgress(scheduleItem, minutesNow) {
  const start = toMinutes(scheduleItem.start);
  const end = toMinutes(scheduleItem.end);
  const duration = end - start;

  if (duration <= 1) return 0;

  const remainingWholeMinutes = Math.max(1, Math.min(duration, Math.ceil(end - minutesNow)));
  const passedMinuteSteps = duration - remainingWholeMinutes;
  const progress = (passedMinuteSteps / (duration - 1)) * 100;

  return Math.max(0, Math.min(100, progress));
}

function getNextScheduleAfter(minutesNow) {
  for (const item of scheduleRanges) {
    const start = toMinutes(item.start);
    if (minutesNow < start) {
      return { ...item, type: "schedule" };
    }
  }
  return null;
}

function getDayScheduleEnd(dayOfWeek) {
  if (!(dayOfWeek >= 1 && dayOfWeek <= 5)) {
    return null;
  }

  const forcedDayEndMap = {
    1: "16:30",
    3: "16:30",
    5: "16:30"
  };

  if (forcedDayEndMap[dayOfWeek]) {
    return forcedDayEndMap[dayOfWeek];
  }

  const headerCells = document.querySelectorAll("thead th[data-day]");
  const tableDayIndex = Array.from(headerCells).findIndex(
    (cell) => Number(cell.dataset.day) === dayOfWeek
  );

  if (tableDayIndex === -1) {
    return null;
  }

  let latestEnd = null;

  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    const periodName = row.dataset.period;
    const scheduleItem = scheduleRanges.find((item) => item.name === periodName);
    if (!scheduleItem) return;

    const cells = row.querySelectorAll("td");
    if (cells.length === 1 && cells[0].hasAttribute("colspan")) {
      latestEnd = scheduleItem.end;
      return;
    }

    if (cells.length === 5) {
      const targetCell = cells[tableDayIndex];
      if (!targetCell) return;

      const hasSubject = Boolean(targetCell.dataset.subject);
      if (hasSubject) {
        latestEnd = scheduleItem.end;
      }
    }
  });

  return latestEnd;
}

function applyRoomBadges() {
  const cells = document.querySelectorAll("td[data-subject]");
  cells.forEach((cell) => {
    const subject = cell.dataset.subject;
    const row = cell.closest("tr");
    const cellIndex = getCellStorageIndex(row, cell);
    const cellInfo = getCellInfo(row, cellIndex);
    const subjectWrap = cell.querySelector(".subject");
    if (!subjectWrap) return;

    const existingRoom = subjectWrap.querySelector(".room-info");
    if (existingRoom) existingRoom.remove();

    const existingTeacher = subjectWrap.querySelector(".teacher-info");
    if (existingTeacher) existingTeacher.remove();

    const room = cellInfo.room || classroomMap[subject];
    if (room) {
      const roomTag = document.createElement("span");
      roomTag.className = "room-info";
      roomTag.textContent = `교실: ${room}`;
      subjectWrap.appendChild(roomTag);
    }

    const teacher = cellInfo.teacher || teacherMap[subject];
    if (teacher) {
      const teacherTag = document.createElement("span");
      teacherTag.className = "teacher-info";
      teacherTag.textContent = `선생님: ${teacher}`;
      subjectWrap.appendChild(teacherTag);
    }
  });
}

function saveCellEdit(period, index, subject) {
  if (!period || index == null) return;
  const edits = JSON.parse(localStorage.getItem(CELL_EDIT_STORAGE_KEY) || "{}");
  const key = `${period}_${index}`;
  if (subject) edits[key] = subject;
  else delete edits[key];
  localStorage.setItem(CELL_EDIT_STORAGE_KEY, JSON.stringify(edits));
}

function saveScheduleEdit(period, start, end) {
  const edits = JSON.parse(localStorage.getItem(SCHEDULE_EDIT_STORAGE_KEY) || "{}");
  edits[period] = { start, end };
  localStorage.setItem(SCHEDULE_EDIT_STORAGE_KEY, JSON.stringify(edits));
}

function parseTimeRange(input) {
  if (!input) return null;
  const match = input.trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const [_, h1, m1, h2, m2] = match.map(Number);
  if (h1 > 23 || m1 > 59 || h2 > 23 || m2 > 59) return null;
  const start = `${String(h1).padStart(2, "0")}:${String(m1).padStart(2, "0")}`;
  const end = `${String(h2).padStart(2, "0")}:${String(m2).padStart(2, "0")}`;
  return { start, end };
}

function updateRowTimeText(row, start, end) {
  const timeSpan = row.querySelector(".time");
  if (timeSpan) {
    timeSpan.textContent = `${format12Hour(start)} ~ ${format12Hour(end)}`;
  }
}

function renderSubjectCell(cell, subject) {
  if (!cell) return;
  if (!subject) {
    cell.removeAttribute("data-subject");
    cell.classList.add("empty-cell");
    cell.classList.remove("neis-empty-cell");
    cell.textContent = "";
    return;
  }
  cell.dataset.subject = subject;
  cell.classList.remove("empty-cell", "neis-empty-cell");

  let subjectWrap = cell.querySelector(".subject");

  if (!subjectWrap || subjectWrap.tagName === "BUTTON") {
    cell.textContent = "";
    subjectWrap = document.createElement("div");
    subjectWrap.className = "subject";

    const subjectNameEl = document.createElement("span");
    subjectNameEl.className = "subject-name";
    subjectWrap.appendChild(subjectNameEl);
    cell.appendChild(subjectWrap);
  }

  const subjectNameEl = subjectWrap.querySelector(".subject-name");
  if (subjectNameEl) subjectNameEl.textContent = subject;

  const existingRoom = subjectWrap.querySelector(".room-info");
  if (existingRoom) existingRoom.remove();

  const existingTeacher = subjectWrap.querySelector(".teacher-info");
  if (existingTeacher) existingTeacher.remove();

  const room = classroomMap[subject];
  if (room) {
    const roomTag = document.createElement("span");
    roomTag.className = "room-info";
    roomTag.textContent = `교실: ${room}`;
    subjectWrap.appendChild(roomTag);
  }

  const teacher = teacherMap[subject];
  if (teacher) {
    const teacherTag = document.createElement("span");
    teacherTag.className = "teacher-info";
    teacherTag.textContent = `선생님: ${teacher}`;
    subjectWrap.appendChild(teacherTag);
  }
}

function resetInfoMapsToDefault() {
  Object.keys(classroomMap).forEach((key) => delete classroomMap[key]);
  Object.assign(classroomMap, defaultClassroomMap);

  Object.keys(teacherMap).forEach((key) => delete teacherMap[key]);
  Object.assign(teacherMap, defaultTeacherMap);
}

function setSubjectInfo(subject, info = {}) {
  if (!subject) return;
  if (info.room) classroomMap[subject] = info.room;
  if (info.teacher) teacherMap[subject] = info.teacher;
  saveSubjectInfoEdit(subject, {
    room: classroomMap[subject] || "",
    teacher: teacherMap[subject] || ""
  });
  applyRoomBadges();
}

function setCellInfoByCell(cell, info = {}) {
  const row = cell?.closest("tr[data-period]");
  if (!row || !cell) return;
  const index = Array.from(row.querySelectorAll("td")).indexOf(cell);
  if (index < 0) return;
  saveCellInfo(row, index, info);
}

function loadScheduleEdits() {
  const saved = localStorage.getItem(SCHEDULE_EDIT_STORAGE_KEY);
  if (!saved) return;
  try {
    const edits = JSON.parse(saved);
    Object.entries(edits).forEach(([period, range]) => {
      const item = scheduleRanges.find((entry) => entry.name === period);
      if (!item || !range?.start || !range?.end) return;
      item.start = range.start;
      item.end = range.end;
      const row = document.querySelector(`tbody tr[data-period="${period}"]`);
      if (row) updateRowTimeText(row, range.start, range.end);
    });
  } catch (error) {
    console.error(error);
  }
}

function loadCellEdits() {
  const saved = localStorage.getItem(CELL_EDIT_STORAGE_KEY);
  if (!saved) return;
  try {
    const edits = JSON.parse(saved);
    Object.entries(edits).forEach(([key, subject]) => {
      if (!subject) return;
      const [period, day] = key.split("_");
      const row = document.querySelector(`tbody tr[data-period="${period}"]`);
      if (!row) return;
      const cells = row.querySelectorAll("td");
      const targetCell = cells[Number(day)];
      if (!targetCell) return;
      renderSubjectCell(targetCell, subject);
    });
  } catch (error) {
    console.error(error);
  }
}

function enableTileEditing() {
  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    const cells = row.querySelectorAll("td");
    const header = row.querySelector("th");

    if (header) {
      header.style.cursor = "pointer";
      header.addEventListener("click", () => {
        const period = row.dataset.period;
        const scheduleItem = scheduleRanges.find((item) => item.name === period);
        const current = scheduleItem ? `${scheduleItem.start}-${scheduleItem.end}` : "";
        openInputModal("교시 수정", "08:20-09:10", (value) => {
          const parsed = parseTimeRange(value);
          if (!parsed) return;
          if (scheduleItem) {
            scheduleItem.start = parsed.start;
            scheduleItem.end = parsed.end;
          } else {
            scheduleRanges.push({ name: period, start: parsed.start, end: parsed.end });
          }
          updateRowTimeText(row, parsed.start, parsed.end);
          saveScheduleEdit(period, parsed.start, parsed.end);
          updateCurrentStatus();
        });
        if (modalInput) modalInput.value = current;
      });
    }

    cells.forEach((cell, index) => {
      if (cell.hasAttribute("colspan")) return;

      cell.style.cursor = cell.classList.contains("empty-cell") ? "pointer" : "default";

      cell.addEventListener("click", () => {
        if (cell.classList.contains("empty-cell")) {
          openSubjectEditor(cell, row, index);
          return;
        }

        const subject = cell.dataset.subject || "";
        if (!subject) return;

        openSubjectEditor(cell, row, index);
      });
    });
  });

  subjectOverlay?.addEventListener("click", (event) => {
    if (Date.now() < overlayDismissBlockUntil) return;
    if (event.target === subjectOverlay) closeSubjectModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && subjectOverlay && !subjectOverlay.classList.contains("hidden")) {
      closeSubjectModal();
    }
  });
}

function updateThemeButton() {
  const isDark = !document.body.classList.contains("light-mode");
  themeToggle.textContent = isDark ? "라이트 모드" : "다크 모드";
  themeToggle.classList.toggle("theme-target-light", isDark);
  themeToggle.classList.toggle("theme-target-dark", !isDark);
}

function initTheme() {
  const savedTheme = localStorage.getItem("mirim-theme");
  document.body.classList.toggle("light-mode", savedTheme === "light");
  document.body.classList.toggle("dark-mode", savedTheme !== "light");
  updateThemeButton();
}

function initCursorGlow() {
  document.addEventListener("pointermove", (event) => {
    if (cursorGlowFrame) cancelAnimationFrame(cursorGlowFrame);

    cursorGlowFrame = requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      cursorGlowFrame = null;
    });
  }, { passive: true });
}

function syncFloatingTopbar() {
  if (!floatingTopbar) return;
  const currentPeriodEl = document.getElementById("currentPeriod");
  const remainingTimeLabelEl = document.getElementById("remainingTimeLabel");
  const remainingTimeEl = document.getElementById("remainingTime");
  const dayRemainingTimeEl = document.getElementById("dayRemainingTime");
  const currentRoomEl = document.getElementById("currentRoom");
  const neisStatusEl = document.getElementById("neisStatus");
  const readDisplayText = (element, fallback) => (
    element?.dataset?.timeText
    || element?.dataset?.displayText
    || element?.textContent?.trim()
    || fallback
  );
  const writeDisplayText = (element, value) => {
    if (!element) return;
    element.textContent = value;
    element.dataset.displayText = value;
  };
  const writeRollingText = (element, value, key) => {
    if (!element) return;
    element.dataset.displayText = value;
    renderRollingStyleText(element, value, key);
  };

  writeRollingText(topbarTime, readDisplayText(currentTimeEl, "불러오는 중..."), "topbar-current-time");
  writeRollingText(topbarPeriod, readDisplayText(currentPeriodEl, "확인 중..."), "topbar-current-period");
  if (topbarRemainingLabel) topbarRemainingLabel.textContent = remainingTimeLabelEl?.textContent?.trim() || "교시 남은 시간";
  writeRollingText(topbarRemaining, readDisplayText(remainingTimeEl, "계산 중..."), "topbar-period-remaining-time");
  writeRollingText(topbarDayRemaining, readDisplayText(dayRemainingTimeEl, "계산 중..."), "topbar-day-remaining-time");
  writeRollingText(topbarRoom, readDisplayText(currentRoomEl, "확인 중..."), "topbar-current-room");
  writeRollingText(topbarNeis, readDisplayText(neisStatusEl, "대기 중"), "topbar-neis-status");
}

function updateFloatingTopbar() {
  if (!floatingTopbar) return;
  if (topbarFrame) cancelAnimationFrame(topbarFrame);

  topbarFrame = requestAnimationFrame(() => {
    const statusCard = document.querySelector(".status-card");
    const threshold = statusCard
      ? statusCard.getBoundingClientRect().bottom
      : 0;
    const shouldShow = floatingTopbarVisible
      ? window.scrollY > 210 && threshold < 152
      : window.scrollY > 280 && threshold < 96;

    floatingTopbar.classList.toggle("is-visible", shouldShow);
    document.body.classList.toggle("floating-topbar-visible", shouldShow);
    floatingTopbar.setAttribute("aria-hidden", String(!shouldShow));
    floatingTopbarVisible = shouldShow;
    topbarFrame = null;
  });
}

function scheduleStatusTick() {
  if (statusTickTimer) clearTimeout(statusTickTimer);

  const delay = Math.max(16, 1000 - (Date.now() % 1000) + 18);
  statusTickTimer = setTimeout(() => {
    if (!document.hidden) updateCurrentStatus();
    scheduleStatusTick();
  }, delay);
}


function getTodayScheduleDay() {
  const day = new Date().getDay();
  return day >= 1 && day <= 5 ? day : null;
}

function getActiveScheduleDay() {
  return getTodayScheduleDay() || 1;
}

function isMobileTimetableView() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function hideColumnByDay(day) {
  const targetHeader = document.querySelector(`thead th[data-day="${day}"]`);
  if (targetHeader) {
    targetHeader.classList.add("today-only-hidden");
  }

  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length === 5) {
      const targetCell = cells[day - 1];
      if (targetCell) {
        targetCell.classList.add("today-only-hidden");
        targetCell.style.display = "";
        targetCell.style.visibility = "visible";
      }
    }
  });
}

function updateTodayOnlyButton(todayDay, isActive) {
  if (!todayOnlyToggle) return;

  const isEnabled = Boolean(todayDay);
  todayOnlyToggle.disabled = !isEnabled;
  todayOnlyToggle.classList.toggle("active", isActive && isEnabled);
  todayOnlyToggle.textContent = isActive && isEnabled ? "전체 시간표 보기" : "오늘 일과만 보기";
}

function applyTodayOnlyMode() {
  const isMobile = isMobileTimetableView();
  const isTodayOnly = localStorage.getItem("mirim-today-only") === "on";
  const activeDay = getActiveScheduleDay();
  const shouldApply = isMobile || isTodayOnly;
  document.body.classList.toggle("today-only-mode", shouldApply);
  document.body.classList.toggle("mobile-today-mode", isMobile);

  document.querySelectorAll(".today-only-hidden").forEach((node) => {
    node.classList.remove("today-only-hidden");
    node.style.display = "";
    node.style.visibility = "";
  });

  if (shouldApply) {
    [1, 2, 3, 4, 5].forEach((day) => {
      if (day !== activeDay) {
        hideColumnByDay(day);
      }
    });
  }

  updateTodayOnlyButton(activeDay, shouldApply);
}

function clearHighlights() {
  document.querySelectorAll("tbody tr").forEach((row) => row.classList.remove("today-row", "current-row", "break-target-row"));
  document.querySelectorAll("tbody td").forEach((cell) => cell.classList.remove("today-cell", "current-cell", "current-glow-cell"));
  document.querySelectorAll("thead th").forEach((cell) => cell.classList.remove("today-column-header", "current-day-column-header"));
  document.querySelectorAll(".time-marker, .floating-time-line, .floating-time-label").forEach((node) => node.remove());
}

function updateHighlights(currentSchedule, dayOfWeek, highlightSchedule) {
  clearHighlights();

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const headerCell = document.querySelector(`thead th[data-day="${dayOfWeek}"]`);
    if (headerCell) {
      headerCell.classList.add("today-column-header", "current-day-column-header");
    }

    document.querySelectorAll("tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 5) {
        const targetCell = cells[dayOfWeek - 1];
        if (targetCell) targetCell.classList.add("today-cell");
      }
    });
  }

  if (highlightSchedule) {
    const currentRow = document.querySelector(`tbody tr[data-period="${highlightSchedule.name}"]`);
    if (currentRow) {
      const isBreakTarget = currentSchedule && currentSchedule.type === "break";
      currentRow.classList.add(isBreakTarget ? "break-target-row" : "current-row");

      const cells = currentRow.querySelectorAll("td");
      if (cells.length === 5 && dayOfWeek >= 1 && dayOfWeek <= 5) {
        const currentCell = cells[dayOfWeek - 1];
        if (currentCell) {
          currentCell.classList.add("current-cell", "today-cell", "current-glow-cell");
        }
      }
    }
  }
}

function renderFloatingTimeline(currentSchedule, highlightSchedule, dayOfWeek, progress) {
  const table = document.querySelector("table");
  if (!table || !highlightSchedule) return;
  if (!(dayOfWeek >= 1 && dayOfWeek <= 5)) return;
  if (!currentTimeEl) return;

  const targetRow = document.querySelector(`tbody tr[data-period="${highlightSchedule.name}"]`);
  if (!targetRow) return;

  const rowHeader = targetRow.querySelector("th");
  const cells = targetRow.querySelectorAll("td");
  if (!rowHeader || cells.length === 0) return;

  const lastCell = cells[cells.length - 1];
  const isBreakTarget = currentSchedule && currentSchedule.type === "break";
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const rawLineTop = isBreakTarget
    ? targetRow.offsetTop
    : targetRow.offsetTop + ((targetRow.offsetHeight - 3) * clampedProgress / 100);

  const label = document.createElement("span");
  label.className = "floating-time-label";
  renderRollingStyleText(label, currentTimeEl.dataset.timeText || currentTimeEl.textContent, "floating-time-label", {
    disableTextSwap: true
  });
  label.style.visibility = "hidden";
  table.appendChild(label);

  const safeLeft = rowHeader.offsetLeft + 4;
  const syncedTop = isBreakTarget ? targetRow.offsetTop : rawLineTop;

  label.style.left = `${safeLeft}px`;
  label.style.top = `${syncedTop}px`;
  label.style.visibility = "visible";

  const line = document.createElement("div");
  line.className = "floating-time-line";
  const labelWidth = Number.parseFloat(getComputedStyle(label).width) || label.offsetWidth;
  const lineLeft = safeLeft + labelWidth - 6;
  const tableRight = table.clientWidth - 12;
  const lastCellRight = lastCell.offsetLeft + lastCell.offsetWidth - 12;
  const lineRight = Math.max(tableRight, lastCellRight);
  line.style.left = `${lineLeft}px`;
  line.style.width = `${Math.max(0, lineRight - lineLeft)}px`;
  line.style.top = `${syncedTop}px`;
  table.appendChild(line);
}

function getCurrentSubjectAndRoom(currentSchedule, dayOfWeek) {
  if (!currentSchedule) {
    return { subject: "일과 시간 아님", room: "일과 시간 아님" };
  }

  if (currentSchedule.type === "break") {
    return { subject: "쉬는시간", room: "이동 시간" };
  }

  if (currentSchedule.merged) {
    return { subject: currentSchedule.name, room: "공통 일정" };
  }

  if (!(dayOfWeek >= 1 && dayOfWeek <= 5)) {
    return { subject: "", room: "일과 시간 아님" };
  }

  const currentRow = document.querySelector(`tbody tr[data-period="${currentSchedule.name}"]`);
  if (!currentRow) {
    return { subject: currentSchedule.name, room: "미지정" };
  }

  const cells = currentRow.querySelectorAll("td");
  if (cells.length !== 5) {
    return { subject: currentSchedule.name, room: "미지정" };
  }

  const currentCell = cells[dayOfWeek - 1];
  const subject = currentCell && currentCell.dataset ? currentCell.dataset.subject || "" : "";
  if (!subject) {
    return { subject: "", room: "일과 시간 아님" };
  }

  const currentCellIndex = getCellStorageIndex(currentRow, currentCell);
  const cellInfo = getCellInfo(currentRow, currentCellIndex);
  const room = cellInfo.room || classroomMap[subject];
  return {
    subject,
    room: room ? `교실: ${room}` : "미지정"
  };
}

function updateCurrentStatus() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const dayOfWeek = now.getDay();
  const isSchoolWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  const currentSchedule = isSchoolWeekday ? getCurrentSchedule(currentMinutes) : null;
  const highlightSchedule = currentSchedule && currentSchedule.type === "break"
    ? getNextScheduleAfter(currentMinutes)
    : currentSchedule;
  const currentProgress = currentSchedule
    ? (currentSchedule.type === "break" ? 0 : getScheduleProgress(currentSchedule, currentMinutes))
    : 0;
  const currentPeriodEl = document.getElementById("currentPeriod");
  const remainingTimeLabelEl = document.getElementById("remainingTimeLabel");
  const remainingTimeEl = document.getElementById("remainingTime");
  const dayRemainingTimeEl = document.getElementById("dayRemainingTime");
  const currentRoomEl = document.getElementById("currentRoom");
  const todayLabelEl = document.getElementById("todayLabel");

if (currentTimeEl) {
  const timeText = `${format12Hour(`${hours}:${minutes}`)}:${seconds}`;
  createRollingTime(timeText);
}

  if (todayLabelEl) {
    todayLabelEl.textContent = `${dayNames[dayOfWeek]}요일`;
  }

  if (remainingTimeLabelEl) {
    remainingTimeLabelEl.textContent = currentSchedule
      ? (currentSchedule.type === "break" ? "남은 쉬는 시간" : "교시 남은 시간")
      : "교시 남은 시간";
  }

  const dayScheduleEnd = getDayScheduleEnd(dayOfWeek);
  const dayScheduleEndMinutes = dayScheduleEnd ? toMinutes(dayScheduleEnd) : null;

  if (dayRemainingTimeEl) {
    const dayStartMinutes = toMinutes(scheduleRanges[0].start);

    if (isSchoolWeekday && dayScheduleEndMinutes !== null) {
      if (currentMinutes < dayStartMinutes) {
        renderRollingStyleText(dayRemainingTimeEl, formatBeforeSchoolTime(dayStartMinutes - currentMinutes), "day-remaining-time");
      } else if (currentMinutes >= dayStartMinutes && currentMinutes < dayScheduleEndMinutes) {
        renderRollingStyleText(dayRemainingTimeEl, formatRemainingTime(dayScheduleEndMinutes - currentMinutes), "day-remaining-time");
      } else {
        renderRollingStyleText(dayRemainingTimeEl, formatNextSchoolStartFromNow(now, currentMinutes, dayOfWeek), "day-remaining-time");
      }
    } else {
      renderRollingStyleText(dayRemainingTimeEl, formatNextSchoolStartFromNow(now, currentMinutes, dayOfWeek), "day-remaining-time");
    }
  }

  if (currentSchedule) {
    const remaining = toMinutes(currentSchedule.end) - currentMinutes;
    const { subject, room } = getCurrentSubjectAndRoom(currentSchedule, dayOfWeek);

    if (currentPeriodEl) {
      if (currentSchedule.type === "break") {
        renderRollingStyleText(currentPeriodEl, `${currentSchedule.name} (${formatScheduleDuration(currentSchedule)})`, "current-period");
      } else if (!subject) {
        renderRollingStyleText(currentPeriodEl, "일과 시간 아님", "current-period");
      } else if (currentSchedule.merged) {
        renderRollingStyleText(currentPeriodEl, `${currentSchedule.name} (${formatScheduleDuration(currentSchedule)})`, "current-period");
      } else {
        renderRollingStyleText(currentPeriodEl, `${currentSchedule.name} · ${subject}`, "current-period");
      }
    }

    if (remainingTimeEl) {
      renderRollingStyleText(remainingTimeEl, !subject && currentSchedule.type === "schedule"
        ? "일과 시간 아님"
        : formatPeriodRemainingTime(remaining), "period-remaining-time");
    }

    if (currentRoomEl) {
      currentRoomEl.textContent = !subject && currentSchedule.type === "schedule"
        ? "일과 시간 아님"
        : room;
    }
  } else {
    if (currentPeriodEl) renderRollingStyleText(currentPeriodEl, "일과 시간 아님", "current-period");
    if (remainingTimeEl) renderRollingStyleText(remainingTimeEl, "일과 시간 아님", "period-remaining-time");
    if (currentRoomEl) currentRoomEl.textContent = "일과 시간 아님";
  }

  updateHighlights(currentSchedule, dayOfWeek, highlightSchedule);
  document.documentElement.style.setProperty("--period-progress", `${currentProgress}`);
  renderFloatingTimeline(currentSchedule, highlightSchedule, dayOfWeek, currentProgress);
  syncFloatingTopbar();
  updateFloatingTopbar();
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    triggerButtonPop(themeToggle);
    const nextIsLight = !document.body.classList.contains("light-mode");
    document.body.classList.toggle("light-mode", nextIsLight);
    document.body.classList.toggle("dark-mode", !nextIsLight);
    const isDark = !nextIsLight;
    localStorage.setItem("mirim-theme", isDark ? "dark" : "light");
    updateThemeButton();
  });
}

if (todayOnlyToggle) {
  todayOnlyToggle.addEventListener("click", () => {
    triggerButtonPop(todayOnlyToggle);
    if (!isMobileTimetableView()) {
      const isTodayOnly = localStorage.getItem("mirim-today-only") === "on";
      localStorage.setItem("mirim-today-only", isTodayOnly ? "off" : "on");
    }
    applyTodayOnlyMode();
  });
}

toolMenuToggle?.addEventListener("click", () => {
  const isOpen = toolMenu?.classList.contains("is-open");
  triggerButtonPop(toolMenuToggle);
  setToolMenuOpen(!isOpen);
});

document.addEventListener("click", (event) => {
  if (!toolMenu || toolMenu.contains(event.target)) return;
  setToolMenuOpen(false);
});

mealToggle?.addEventListener("click", () => {
  setToolMenuOpen(false);
  triggerButtonPop(mealToggle);
  mealPanel?.classList.toggle("is-open");
  mealPanel?.setAttribute("aria-hidden", mealPanel.classList.contains("is-open") ? "false" : "true");
});

mealClose?.addEventListener("click", () => {
  mealPanel?.classList.remove("is-open");
  mealPanel?.setAttribute("aria-hidden", "true");
});

function loadCustomConfig() {
  resetInfoMapsToDefault();

  const saved = localStorage.getItem("tile-custom-json");
  if (!saved) {
    applyRoomBadges();
    return;
  }

  try {
    const config = JSON.parse(saved);

    // Update teacher map
    if (config.teachers && typeof config.teachers === "object") {
      Object.assign(teacherMap, config.teachers);
    }

    // Update classroom map
    if (config.classrooms && typeof config.classrooms === "object") {
      Object.assign(classroomMap, config.classrooms);
    }

    // Update schedule ranges (periods)
    if (config.scheduleRanges && Array.isArray(config.scheduleRanges)) {
      config.scheduleRanges.forEach(newPeriod => {
        if (!newPeriod.name || !newPeriod.start || !newPeriod.end) return;
        const existingIndex = scheduleRanges.findIndex(p => p.name === newPeriod.name);
        if (existingIndex >= 0) {
          scheduleRanges[existingIndex] = { ...scheduleRanges[existingIndex], ...newPeriod };
        }
      });
    }
  } catch (e) {
    console.error("Failed to load custom config:", e);
  }

  applyRoomBadges();
}

migrateLegacyInfoStorage();
loadCustomConfig();
loadSubjectInfoEdits();
applyRoomBadges();
captureDefaultCellSubjects();
loadMeals();
loadAppSettings();
updateIPhoneSafeZone();
initTheme();
initCursorGlow();
updateSchoolSubtitle();
syncFloatingTopbar();
updateFloatingTopbar();
applyTodayOnlyMode();
loadCellEdits();
loadScheduleEdits();
enableTileEditing();
updateMemoIndicators();
updateCurrentStatus();
scheduleStatusTick();

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateCurrentStatus();
  scheduleStatusTick();
});

const startupSpotlight = document.querySelector(".startup-spotlight");
const tileTitle = document.getElementById("tileTitle");
const startupSpotlightReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function replayWelcomeTitle() {
  if (!tileTitle || startupSpotlightReduceMotion.matches) return;

  tileTitle.classList.remove("is-welcome-rolling");
  void tileTitle.offsetWidth;
  requestAnimationFrame(() => {
    tileTitle.classList.add("is-welcome-rolling");
  });
}

function replayStartupSpotlight() {
  document.body.classList.add("welcome-active");
  replayWelcomeTitle();
  if (!startupSpotlight) {
    document.body.classList.remove("welcome-active");
    return;
  }

  startupSpotlight.classList.add("is-settled");
  if (startupSpotlightReduceMotion.matches) {
    document.body.classList.remove("welcome-active");
    return;
  }

  void startupSpotlight.offsetWidth;
  requestAnimationFrame(() => {
    startupSpotlight.classList.remove("is-settled");
  });
}

startupSpotlight?.addEventListener("animationend", (event) => {
  if (event.animationName !== "startupSpotlightIlluminate") return;
  startupSpotlight.classList.add("is-settled");
  document.body.classList.remove("welcome-active");
});

if (startupSpotlightReduceMotion.matches) {
  document.body.classList.remove("welcome-active");
}

window.addEventListener("scroll", updateFloatingTopbar, { passive: true });
window.addEventListener("resize", updateFloatingTopbar, { passive: true });

window.TileApp = {
  renderRollingText(element, text, key) {
    renderRollingStyleText(element, text, key);
  },
  replayRollingText(element, fromText, toText, key, options = {}) {
    if (!element || !fromText || !toText || fromText === toText) return;

    resetRollingTextTimers(key);
    renderStaticTimeStyleText(element, fromText);
    rollingTextPreviousMap.set(key, fromText);
    requestAnimationFrame(() => {
      renderRollingStyleText(element, toText, key, options);
    });
  },
  renderSubjectCell,
  setSubjectInfo,
  setCellInfoByCell,
  setSchoolDetails(school = {}) {
    const currentUser = getSavedTileUser();
    updateSavedTileUser({
      school: {
        ...(currentUser?.school || {}),
        ...school
      }
    });
  },
  setSchoolDepartment(department = "") {
    updateSavedTileUser({ department });
  },
  setMeal(period, text, rawText = "") {
    if (period === "조식" || period === "중식" || period === "석식") saveMeal(period, text, rawText);
  },
  refresh() {
    applyRoomBadges();
    updateMemoIndicators();
    updateCurrentStatus();
    applyTodayOnlyMode();
  }
};

if (customToggle && customPanel) {
  customToggle.addEventListener("click", () => {
    triggerButtonPop(customToggle);
    setToolMenuOpen(false);
    customPanel.classList.toggle("is-open");
  });
}

if (customClose && customPanel) {
  customClose.addEventListener("click", () => {
    customPanel.classList.remove("is-open");
  });
}

if (customInput) {
  customInput.value = localStorage.getItem("tile-custom-json") || `{
  "message": "Tile 수정 기능 준비 완료 ✨"
}`;
}

if (customSave && customInput) {
  customSave.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(customInput.value);

      // Validate basic structure
      if (typeof parsed !== "object" || parsed === null) {
        alert("유효한 JSON 객체여야 합니다.");
        return;
      }

      localStorage.setItem("tile-custom-json", JSON.stringify(parsed));

      // Reload config without page refresh
      loadCustomConfig();
      applyRoomBadges();
      updateCurrentStatus();

      alert("설정 저장 완료 ✨");
    } catch (err) {
      alert(`JSON 형식 오류: ${err.message}`);
    }
  });
}

if (customReset && customInput) {
  customReset.addEventListener("click", () => {
    localStorage.removeItem("tile-custom-json");
    localStorage.removeItem(CELL_EDIT_STORAGE_KEY);
    localStorage.removeItem(SCHEDULE_EDIT_STORAGE_KEY);
    localStorage.removeItem(SUBJECT_INFO_EDIT_STORAGE_KEY);
    localStorage.removeItem(CELL_INFO_EDIT_STORAGE_KEY);
    localStorage.removeItem(PERIOD_INFO_EDIT_STORAGE_KEY);
    localStorage.removeItem(SUBJECT_MEMO_STORAGE_KEY);

    customInput.value = `{
  "message": "Tile 수정 기능 준비 완료 ✨"
}`;

    // Reset to default
    loadCustomConfig();
    loadSubjectInfoEdits();
    applyRoomBadges();
    updateMemoIndicators();
    updateCurrentStatus();

    alert("시간표 및 설정 초기화 완료. 새로고침 해주세요.");
  });
}

if (customLoadExample && customInput) {
  customLoadExample.addEventListener("click", () => {
    customInput.value = `{
  "teachers": {
    "미디어 컨탠츠 일반": "정하나",
    "프로그래밍 JAVA 기초": "민주리"
  },
  "classrooms": {
    "미디어 컨탠츠 일반": "UI Lab실",
    "프로그래밍 JAVA 기초": "제4소프트웨어랩"
  },
  "scheduleRanges": [
    {
      "name": "1교시",
      "start": "08:20",
      "end": "09:10"
    }
  ]
}`;
  });
}

// 메모 저장 및 초기화 기능 추가
if (memoSave && memoInput) {
  memoSave.addEventListener("click", () => {
    try {
      const memoText = memoInput.value;
      localStorage.setItem("tile-memo-content", memoText);
      alert("메모 저장 완료 ✨");
    } catch (err) {
      alert(`저장 오류: ${err.message}`);
    }
  });
}

if (memoReset && memoInput) {
  memoReset.addEventListener("click", () => {
    localStorage.removeItem("tile-memo-content");
    memoInput.value = "";
    alert("메모 초기화 완료 ✨");
  });
}

// 메모 패널 토글
const memoToggle = document.getElementById("memoToggle");
if (memoToggle && memoPanel) {
  memoToggle.addEventListener("click", () => {
    triggerButtonPop(memoToggle);
    memoPanel.classList.toggle("is-open");
  });
}

if (memoClose && memoPanel) {
  memoClose.addEventListener("click", () => {
    memoPanel.classList.remove("is-open");
  });
}

// 페이지 로드 시 저장된 메모 불러오기
if (memoInput) {
  const savedMemo = localStorage.getItem("tile-memo-content");
  if (savedMemo) {
    memoInput.value = savedMemo;
  }
}

const saveSchoolButton = document.getElementById("saveSchool");
const schoolInput =
    document.getElementById("schoolInput");

const schoolResults =
    document.getElementById("schoolResults");
const selectedSchoolInfo = document.getElementById("selectedSchoolInfo");

const gradeInput = document.getElementById("gradeInput");
const classInput = document.getElementById("classInput");
let selectedSchool = null;

function openSchoolSettings() {
    if (!setupModal) return;
    setupModal.classList.remove("hidden");
    setupModal.setAttribute("aria-hidden", "false");
    setTimeout(() => schoolInput?.focus(), 80);
}

function closeSchoolSettingsModal() {
    if (!setupModal) return;
    setupModal.classList.add("hidden");
    setupModal.setAttribute("aria-hidden", "true");
    if (schoolResults) schoolResults.innerHTML = "";
}

function getSavedTileUser() {
    try {
        return JSON.parse(localStorage.getItem("tile_user") || "null");
    } catch (error) {
        console.error(error);
        return null;
    }
}

function updateSchoolSubtitle(user = getSavedTileUser()) {
    if (!schoolSubtitle) return;

    const schoolName = user?.school?.name || "미림마이스터고등학교";
    const grade = user?.grade || "1";
    const classNum = user?.classNum || "2";
    const schoolType = getDisplaySchoolType(user?.school);
    const department = normalizeDepartment(user?.department);
    schoolSubtitle.textContent = [schoolName, schoolType, `${grade}학년 ${classNum}반`, department]
        .filter(Boolean)
        .join(" | ");
}

function normalizeDepartment(department = "") {
    const text = String(department || "").trim();
    if (!text || text === "일반학과" || text === "일반과" || text === "공통과정") return "";
    return text;
}

function normalizeHighSchoolType(type = "") {
    const text = String(type || "").trim();
    const compact = text.replace(/\s+/g, "");
    if (!text) return "";
    if (compact.includes("특수목적") || compact.includes("특목")) return "특목고";
    if (compact.includes("자율형사립") || compact.includes("자율사립")) return "자율고 · 자사고";
    if (compact.includes("자율형공립") || compact.includes("자율공립")) return "자율형공립고";
    if (compact.includes("자율")) return "자율고";
    if (compact.includes("일반")) return "일반고";
    if (compact.includes("특성화")) return "특성화고";
    return text.replace(/등학교$/g, "고등학교");
}

function getDisplaySchoolType(school = {}) {
    const name = String(school?.name || "");
    const compactName = name.replace(/\s+/g, "");
    const foundation = String(school?.foundation || "").trim();
    const rawHighSchoolType = String(school?.highSchoolType || "").replace(/\s+/g, "");
    const purpose = String(school?.specialPurpose || "").replace(/\s+/g, "");
    const generalType = String(school?.generalType || "").replace(/\s+/g, "");

    if (/영재학교/.test(compactName)) return "영재학교";

    if (rawHighSchoolType.includes("특목") || rawHighSchoolType.includes("특수목적")) {
        let detail = "";
        if (purpose.includes("산업수요") || /마이스터/.test(compactName)) detail = "마이스터고";
        else if (purpose.includes("과학") || /과학고/.test(compactName)) detail = "과학고";
        else if (purpose.includes("외국어") || /외국어고|외고/.test(compactName)) detail = "외국어고";
        else if (purpose.includes("국제") || /국제고/.test(compactName)) detail = "국제고";
        else if (purpose.includes("예술") || /예술고/.test(compactName)) detail = "예술고";
        else if (purpose.includes("체육") || /체육고/.test(compactName)) detail = "체육고";
        return ["특목고", detail].filter(Boolean).join(" · ");
    }

    if (rawHighSchoolType.includes("자율")) {
        let detail = "";
        if (foundation === "사립") detail = "자사고";
        else if (foundation === "공립") detail = "자율형공립고";
        return ["자율고", detail].filter(Boolean).join(" · ");
    }

    if (rawHighSchoolType.includes("특성화")) {
        if (generalType.includes("대안") || /대안|한겨레/.test(compactName)) return "대안교육 특성화고";
        return "특성화고";
    }

    const highSchoolType = normalizeHighSchoolType(school?.highSchoolType);
    if (highSchoolType) return highSchoolType;

    const kind = String(school?.kind || "").trim();
    if (kind === "고등학교") return "";

    if (kind.includes("중")) {
        if (/국제중학교|국제중/.test(compactName)) return "특성화중 · 국제중";
        if (/예술중학교|예술중|예원학교|선화예술중/.test(compactName)) return "특성화중 · 예술중";
        if (/체육중학교|체육중/.test(compactName)) return "특성화중 · 체육중";
        if (/특성화중학교|특성화중|대안중|헌산중|두레자연중|지평선중|성지송학중/.test(compactName)) return "특성화중";
    }

    return kind;
}

function renderSelectedSchoolInfo(school = selectedSchool) {
    if (!selectedSchoolInfo) return;

    if (!school) {
        selectedSchoolInfo.classList.remove("is-visible");
        selectedSchoolInfo.innerHTML = "";
        return;
    }

    const typeText = [school.kind, getDisplaySchoolType(school)]
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index)
        .join(" · ") || "학교 정보";
    selectedSchoolInfo.classList.add("is-visible");
    selectedSchoolInfo.innerHTML = `
      <div>
        <span>설립 구분</span>
        <strong>${school.foundation || "확인 중"}</strong>
      </div>
      <div>
        <span>학교 종류</span>
        <strong>${typeText}</strong>
      </div>
      <div>
        <span>교육청</span>
        <strong>${school.officeName || school.office || "확인 중"}</strong>
      </div>
    `;
}

function updateSavedTileUser(updates = {}) {
    const user = getSavedTileUser();
    if (!user) return null;

    const nextUser = { ...user, ...updates };
    localStorage.setItem("tile_user", JSON.stringify(nextUser));
    updateSchoolSubtitle(nextUser);
    return nextUser;
}

function fillSchoolSettingsFromSavedUser() {
    const user = getSavedTileUser();
    if (!user) return;
    selectedSchool = user.school || null;
    if (schoolInput && user.school?.name) schoolInput.value = user.school.name;
    if (gradeInput && user.grade) gradeInput.value = user.grade;
    if (classInput && user.classNum) classInput.value = user.classNum;
    renderSelectedSchoolInfo(selectedSchool);
}

function saveSchoolSettings({ showAlert = true } = {}) {
    const schoolName = schoolInput?.value.trim();
    const grade = gradeInput?.value.trim();
    const classNum = classInput?.value.trim();

    if (!schoolName || !grade || !classNum) {
        if (showAlert) alert("학교, 학년, 반을 모두 선택해주세요.");
        return null;
    }

    const school = selectedSchool?.name === schoolName
        ? selectedSchool
        : { name: schoolName };

    const user = {
        school,
        grade,
        classNum
    };

    localStorage.setItem("tile_user", JSON.stringify(user));
    updateSchoolSubtitle(user);
    return user;
}

schoolSettingsToggle?.addEventListener("click", () => {
    triggerButtonPop(schoolSettingsToggle);
    setToolMenuOpen(false);
    fillSchoolSettingsFromSavedUser();
    openSchoolSettings();
});

function openAppSettings() {
  if (!appSettingsModal) return;
  loadAppSettings();
  appSettingsModal.classList.remove("hidden");
  appSettingsModal.setAttribute("aria-hidden", "false");
  setTimeout(() => allergyInput?.focus(), 80);
}

function closeAppSettingsModal() {
  if (!appSettingsModal) return;
  appSettingsModal.classList.add("hidden");
  appSettingsModal.setAttribute("aria-hidden", "true");
}

appSettingsToggle?.addEventListener("click", () => {
  triggerButtonPop(appSettingsToggle);
  setToolMenuOpen(false);
  openAppSettings();
});

closeAppSettings?.addEventListener("click", closeAppSettingsModal);

appSettingsModal?.addEventListener("click", (event) => {
  if (event.target === appSettingsModal) closeAppSettingsModal();
});

saveAppSettings?.addEventListener("click", () => {
  triggerButtonPop(saveAppSettings);
  saveAppSettingsFromInput();
  closeAppSettingsModal();
});

resetAppSettings?.addEventListener("click", () => {
  localStorage.removeItem(APP_SETTINGS_STORAGE_KEY);
  loadAppSettings();
});

closeSchoolSettings?.addEventListener("click", closeSchoolSettingsModal);

setupModal?.addEventListener("click", (event) => {
    if (event.target === setupModal) closeSchoolSettingsModal();
});

saveSchoolButton?.addEventListener("click", async () => {
    const user = saveSchoolSettings();
    if (!user) return;
    const neisStatusEl = document.getElementById("neisStatus");
    const previousNeisStatus = neisStatusEl?.dataset?.timeText || neisStatusEl?.textContent?.trim() || "";
    const didSync = await syncNeis({ user });
    if (didSync) {
        const nextNeisStatus = neisStatusEl?.dataset?.timeText || neisStatusEl?.textContent?.trim() || "";
        closeSchoolSettingsModal();

        requestAnimationFrame(() => {
            replayStartupSpotlight();
            const neisRollOptions = { disableTextSwap: true, finishDelay: 980 };
            window.TileApp?.replayRollingText?.(neisStatusEl, previousNeisStatus, nextNeisStatus, "neis-status", neisRollOptions);
            window.TileApp?.replayRollingText?.(topbarNeis, previousNeisStatus, nextNeisStatus, "topbar-neis-status", neisRollOptions);
            syncFloatingTopbar();
        });
    }
});

schoolInput?.addEventListener(
    "input",
    async () => {

        const query = schoolInput.value.trim();
        if (!schoolResults) return;
        selectedSchool = null;
        renderSelectedSchoolInfo(null);
        if (query.length < 2) {
            schoolResults.innerHTML = "";
            return;
        }

        let schools = [];
        try {
            schools = await searchSchool(query);
        } catch (error) {
            console.error(error);
            const message = error.message || "학교 검색 실패";
            schoolResults.innerHTML = `<div class="school-result-empty">${message}</div>`;
            return;
        }

        schoolResults.innerHTML = "";

        if (schools.length === 0) {
            schoolResults.innerHTML = `<div class="school-result-empty">검색 결과 없음</div>`;
            return;
        }

        schools.forEach(school => {

            const div =
                document.createElement("div");

            div.innerText = school.name;

            div.onclick = () => {

                selectedSchool = school;

                schoolInput.value =
                    school.name;

                schoolResults.innerHTML = "";
                renderSelectedSchoolInfo(school);
            };

            schoolResults.appendChild(div);
        });
    }
);

async function init() {

    const user = getSavedTileUser();

    fillSchoolSettingsFromSavedUser();

    if (!user) return;

    await syncNeis({ user, silent: true });
}

init();

const setupScreen = document.getElementById("setup-screen");
const appScreen = document.getElementById("app-screen");
const startButton = document.getElementById("start-btn");

startButton?.addEventListener("click", () => {
  setupScreen.style.opacity = "0";
  setupScreen.style.pointerEvents = "none";

  setTimeout(() => {
    setupScreen.style.display = "none";
    appScreen.style.display = "block";

    requestAnimationFrame(() => {
      appScreen.classList.add("show");
    });
  }, 400);
});
