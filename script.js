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
const settingsNavButtons = document.querySelectorAll("[data-settings-target]");
const lastSyncValue = document.getElementById("lastSyncValue");
const exportTileData = document.getElementById("exportTileData");
const importTileData = document.getElementById("importTileData");
const importTileDataInput = document.getElementById("importTileDataInput");
const undoTileChange = document.getElementById("undoTileChange");
const toastRegion = document.getElementById("toastRegion");
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
const subjectEditSource = document.getElementById("subjectEditSource");
const subjectEditContext = document.getElementById("subjectEditContext");
const subjectBulkMode = document.getElementById("subjectBulkMode");
const subjectBulkTitle = document.getElementById("subjectBulkTitle");
const subjectBulkRows = document.getElementById("subjectBulkRows");
const subjectBulkName = document.getElementById("subjectBulkName");
const subjectBulkRoom = document.getElementById("subjectBulkRoom");
const subjectBulkTeacher = document.getElementById("subjectBulkTeacher");
const subjectBulkMemo = document.getElementById("subjectBulkMemo");
const subjectBulkSummary = document.getElementById("subjectBulkSummary");
const subjectBulkToggleAll = document.getElementById("subjectBulkToggleAll");
const subjectBulkSave = document.getElementById("subjectBulkSave");
const subjectBulkBack = document.getElementById("subjectBulkBack");
const subjectBulkNeis = document.getElementById("subjectBulkNeis");
const periodEditMode = document.getElementById("periodEditMode");
const periodEditTitle = document.getElementById("periodEditTitle");
const periodEditDescription = document.getElementById("periodEditDescription");
const periodStartInput = document.getElementById("periodStartInput");
const periodEndInput = document.getElementById("periodEndInput");
const periodFormMessage = document.getElementById("periodFormMessage");
const periodEditSave = document.getElementById("periodEditSave");
const periodEditCancel = document.getElementById("periodEditCancel");
const schoolSyncPreview = document.getElementById("schoolSyncPreview");
const schoolSyncPreviewTitle = document.getElementById("schoolSyncPreviewTitle");
const schoolSyncPreviewCount = document.getElementById("schoolSyncPreviewCount");
const schoolSyncPreviewMeals = document.getElementById("schoolSyncPreviewMeals");
const schoolSyncPreviewDepartment = document.getElementById("schoolSyncPreviewDepartment");
const schoolFormMessage = document.getElementById("schoolFormMessage");
const CELL_EDIT_STORAGE_KEY = "tile-cell-edits";
const SCHEDULE_EDIT_STORAGE_KEY = "tile-schedule-edits";
const SUBJECT_MEMO_STORAGE_KEY = "tile-subject-memos";
const SUBJECT_INFO_EDIT_STORAGE_KEY = "tile-subject-info-edits";
const CELL_INFO_EDIT_STORAGE_KEY = "tile-cell-info-edits";
const PERIOD_INFO_EDIT_STORAGE_KEY = "tile-period-info-edits";
const INFO_STORAGE_MIGRATION_KEY = "tile-info-storage-migrated-v2";
const MEAL_STORAGE_KEY = "tile-meals";
const APP_SETTINGS_STORAGE_KEY = "tile-app-settings";
const UNDO_STORAGE_KEY = "tile-last-undo";
const LAST_SYNC_STORAGE_KEY = "tile-neis-last-sync";
const USER_DATA_STORAGE_KEYS = [
  CELL_EDIT_STORAGE_KEY,
  SCHEDULE_EDIT_STORAGE_KEY,
  SUBJECT_MEMO_STORAGE_KEY,
  SUBJECT_INFO_EDIT_STORAGE_KEY,
  CELL_INFO_EDIT_STORAGE_KEY,
  MEAL_STORAGE_KEY,
  APP_SETTINGS_STORAGE_KEY,
  "tile-custom-json",
  "tile-memo-content",
  "tile_user",
  "tile-neis-sync-scope",
  LAST_SYNC_STORAGE_KEY,
  "mirim-theme",
  "mirim-today-only"
];
let selectedSubjectCell = null;
let selectedSubjectRow = null;
let selectedSubjectIndex = null;
let subjectBulkTargets = [];
let modalCallback = null;
let selectedPeriodRow = null;
let selectedPeriodItem = null;
let preparedSchoolSync = null;
let preparedSchoolSignature = "";
let modalRestoreTarget = null;
let overlayDismissBlockUntil = 0;
const defaultCellSubjectMap = new Map();

let previousTimeString = null;
const rollingCharacterAnimations = new WeakMap();
const rollingTextPreviousMap = new Map();
const textSwapAnimationsMap = new Map();
let cursorGlowFrame = null;
let topbarFrame = null;
let floatingTopbarVisible = false;
let statusTickTimer = null;

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

  const previousAnimation = textSwapAnimationsMap.get(key);
  if (previousAnimation) {
    previousAnimation.element.removeEventListener("animationend", previousAnimation.finish);
    previousAnimation.element.removeEventListener("animationcancel", previousAnimation.finish);
    previousAnimation.element.classList.remove("text-roll-swap");
    textSwapAnimationsMap.delete(key);
  }

  element.classList.remove("text-roll-swap");
  void element.offsetWidth;

  const animation = { element, finish: null };
  const finish = (event) => {
    if (event && (event.target !== element || event.animationName !== "textRollSwap")) return;
    if (textSwapAnimationsMap.get(key) !== animation) return;

    element.removeEventListener("animationend", finish);
    element.removeEventListener("animationcancel", finish);
    element.classList.remove("text-roll-swap");
    textSwapAnimationsMap.delete(key);
  };
  animation.finish = finish;
  textSwapAnimationsMap.set(key, animation);
  element.addEventListener("animationend", finish);
  element.addEventListener("animationcancel", finish);
  element.classList.add("text-roll-swap");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
}

function renderStaticTimeStyleText(element, text) {
  if (!element) return;

  cancelRollingCharacters(element);
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

function clearRollingCharacterAnimation(element) {
  const animation = rollingCharacterAnimations.get(element);
  if (!animation) return;

  animation.inner.removeEventListener("animationend", animation.finish);
  animation.inner.removeEventListener("animationcancel", animation.finish);
  rollingCharacterAnimations.delete(element);
}

function cancelRollingCharacters(element) {
  if (!element) return;

  [...element.children].forEach((child) => {
    if (!canRollCharacterElement(child)) return;
    clearRollingCharacterAnimation(child);
    child.classList.remove("animate", "rolling");
  });
}

function renderRollingCharacter(element, oldChar, newChar) {
  clearRollingCharacterAnimation(element);
  element.classList.remove("animate", "rolling");
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

  const animation = { inner, finish: null };
  const finish = (event) => {
    if (event && (event.target !== inner || event.animationName !== "rollUp")) return;
    finishRollingCharacter(element, newChar, animation);
  };
  animation.finish = finish;
  rollingCharacterAnimations.set(element, animation);
  inner.addEventListener("animationend", finish);
  inner.addEventListener("animationcancel", finish);
  element.classList.add("animate", "rolling");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
}

function finishRollingCharacter(element, char, expectedAnimation = null) {
  if (expectedAnimation && rollingCharacterAnimations.get(element) !== expectedAnimation) return;

  clearRollingCharacterAnimation(element);
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
  const textChars = [...text];
  element.dataset.timeText = text;
  element.setAttribute("aria-label", text);

  const previousText = rollingTextPreviousMap.get(key);
  const chars = element.children;

  if (!/[0-9]/.test(text)) {
    if (shouldSwapText && previousText && previousText !== text) triggerTextSwapAnimation(element, key);
    cancelRollingCharacters(element);
    element.textContent = text;
    rollingTextPreviousMap.set(key, text);
    return;
  }

  if (previousText === text && chars.length === textChars.length) return;

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

  if (chars.length !== textChars.length) {
    if (shouldSwapText) triggerTextSwapAnimation(element, key);
    cancelRollingCharacters(element);
    element.innerHTML = "";
    const previousChars = [...previousText];
    const previousOffset = previousChars.length - textChars.length;

    textChars.forEach((char, index) => {
      const oldChar = previousChars[index + previousOffset];
      const span = document.createElement("span");
      span.className = getRollingTimeCharClass(char);
      span.dataset.value = char;
      element.appendChild(span);

      if (canRollCharacterElement(span) && /[0-9]/.test(oldChar) && char !== oldChar) {
        renderRollingCharacter(span, oldChar, char);
      } else if (canRollCharacterElement(span)) {
        renderStaticRollingDigit(span, char);
      } else {
        span.textContent = char;
      }
    });

    rollingTextPreviousMap.set(key, text);
    return;
  }

  let textChanged = false;

  const previousChars = [...previousText];
  textChars.forEach((char, index) => {
    const oldChar = previousChars[index];
    if (char === oldChar) return;

    const wrapper = chars[index];
    if (!wrapper) return;

    clearRollingCharacterAnimation(wrapper);
    wrapper.classList.remove("animate", "rolling");
    wrapper.className = getRollingTimeCharClass(char);
    if (!canRollCharacterElement(wrapper)) {
      wrapper.textContent = char;
      wrapper.dataset.value = char;
      textChanged = true;
      return;
    }

    renderRollingCharacter(wrapper, oldChar, char);
  });

  if (textChanged) {
    if (shouldSwapText) triggerTextSwapAnimation(element, key);
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
  });

  previousTimeString = timeString;
}

function openSubjectModal(data = {}) {
  if (!subjectOverlay) return;
  hideSubjectModes();
  modalInfoMode?.classList.remove("mode-hidden");
  if (subjectName) subjectName.textContent = data.name || "과목 정보";
  if (subjectLocation) subjectLocation.textContent = data.room || "교실 정보 없음";
  if (subjectTeacher) subjectTeacher.textContent = data.teacher || "선생님 정보 없음";
  showSubjectOverlay();
}

function openInputModal(title, placeholder, callback) {
  if (!subjectOverlay || !modalInput || !modalTitle || !modalInfoMode || !modalInputMode) return;
  hideSubjectModes();
  modalInputMode.classList.remove("mode-hidden");
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

function showToast(title, detail = "", options = {}) {
  if (!toastRegion) return;

  const toast = document.createElement("div");
  toast.className = "tile-toast";
  toast.setAttribute("role", options.tone === "error" ? "alert" : "status");

  const copy = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = title;
  copy.appendChild(heading);

  if (detail) {
    const description = document.createElement("span");
    description.textContent = detail;
    copy.appendChild(description);
  }
  toast.appendChild(copy);

  if (options.actionLabel && typeof options.onAction === "function") {
    toast.classList.add("has-action");
    const action = document.createElement("button");
    action.type = "button";
    action.textContent = options.actionLabel;
    action.addEventListener("click", () => {
      options.onAction();
      toast.remove();
    });
    toast.appendChild(action);
  }

  toastRegion.appendChild(toast);
  let timeout = null;
  const dismiss = () => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 240);
  };
  const scheduleDismiss = () => {
    window.clearTimeout(timeout);
    const duration = options.actionLabel
      ? Math.max(options.duration || 0, 9000)
      : options.duration || 4200;
    timeout = window.setTimeout(dismiss, duration);
  };
  scheduleDismiss();
  toast.addEventListener("pointerenter", () => window.clearTimeout(timeout));
  toast.addEventListener("pointerleave", scheduleDismiss);
  toast.addEventListener("focusin", () => window.clearTimeout(timeout));
  toast.addEventListener("focusout", scheduleDismiss);
}

function captureUserDataSnapshot(label) {
  const values = {};
  USER_DATA_STORAGE_KEYS.forEach((key) => {
    values[key] = localStorage.getItem(key);
  });
  return {
    label,
    createdAt: new Date().toISOString(),
    values
  };
}

function pushUndoSnapshot(label) {
  toastRegion?.querySelectorAll(".tile-toast.has-action").forEach((toast) => toast.remove());
  const snapshot = captureUserDataSnapshot(label);
  localStorage.setItem(UNDO_STORAGE_KEY, JSON.stringify(snapshot));
  updateUndoAvailability();
  return snapshot;
}

function applySnapshotValues(values) {
  if (!values || typeof values !== "object" || Array.isArray(values)) return false;
  const entries = Object.entries(values)
    .filter(([key]) => USER_DATA_STORAGE_KEYS.includes(key));
  if (entries.some(([, value]) => value !== null && value !== undefined && typeof value !== "string")) {
    return false;
  }

  entries.forEach(([key, value]) => {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  });
  return true;
}

function restoreSnapshot(snapshot, { reload = true } = {}) {
  if (!applySnapshotValues(snapshot?.values)) return false;

  localStorage.removeItem(UNDO_STORAGE_KEY);
  if (reload) window.location.reload();
  return true;
}

function getUndoSnapshot() {
  return readJsonStorage(UNDO_STORAGE_KEY, null);
}

function restoreLastChange() {
  const snapshot = getUndoSnapshot();
  if (!snapshot) {
    showToast("되돌릴 변경이 없습니다", "새로운 수정이나 동기화 후 다시 시도해주세요.");
    return false;
  }
  return restoreSnapshot(snapshot);
}

function updateUndoAvailability() {
  if (!undoTileChange) return;
  const snapshot = getUndoSnapshot();
  undoTileChange.disabled = !snapshot;
  undoTileChange.textContent = snapshot
    ? `${snapshot.label || "마지막 변경"} 되돌리기`
    : "마지막 변경 되돌리기";
}

function formatSavedDate(value) {
  if (!value) return "기록 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "기록 없음";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function updateLastSyncValue() {
  if (lastSyncValue) {
    lastSyncValue.textContent = formatSavedDate(localStorage.getItem(LAST_SYNC_STORAGE_KEY));
  }
}

function setButtonLoading(button, isLoading) {
  if (!button) return;
  button.classList.toggle("is-loading", isLoading);
  button.toggleAttribute("disabled", isLoading);
  button.setAttribute("aria-busy", String(isLoading));
}

function rememberDialogTrigger() {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body) {
    modalRestoreTarget = active.closest("#toolMenuPanel")
      ? toolMenuToggle
      : active;
  }
}

function restoreDialogTrigger() {
  const target = modalRestoreTarget;
  modalRestoreTarget = null;
  if (target instanceof HTMLElement && target.isConnected) {
    window.setTimeout(() => {
      const focusTarget = target.getClientRects().length > 0
        ? target
        : toolMenuToggle;
      focusTarget?.focus();
    }, 40);
  }
}

function getVisibleDialog() {
  return Array.from(document.querySelectorAll('[role="dialog"]')).find((dialog) => {
    const parent = dialog.closest(".setup-modal, .overlay");
    return parent && !parent.classList.contains("hidden") && parent.getAttribute("aria-hidden") !== "true";
  });
}

function trapDialogFocus(event) {
  if (event.key !== "Tab") return;
  const dialog = getVisibleDialog();
  if (!dialog) return;

  const focusable = Array.from(dialog.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
  )).filter((element) => !element.hidden && element.getClientRects().length > 0);

  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function hideSubjectModes() {
  [modalInfoMode, modalInputMode, subjectEditMode, subjectBulkMode, periodEditMode]
    .forEach((mode) => mode?.classList.add("mode-hidden"));
}

function getCellSourceLabel(cell) {
  if (cell?.dataset.source === "local") return { label: "직접 수정", className: "source-local" };
  if (cell?.dataset.source === "neis") return { label: "NEIS", className: "source-neis" };
  return { label: "기본값", className: "" };
}

function clearSubjectLocalEditsForNeis() {
  localStorage.removeItem(CELL_EDIT_STORAGE_KEY);
  localStorage.removeItem(SUBJECT_INFO_EDIT_STORAGE_KEY);
  localStorage.removeItem(CELL_INFO_EDIT_STORAGE_KEY);
  localStorage.removeItem(SUBJECT_MEMO_STORAGE_KEY);
  resetInfoMapsToDefault();
  restoreDefaultCellSubjects();
}

function clearLocalOverridesForTargets(targets = []) {
  const cellEdits = readJsonStorage(CELL_EDIT_STORAGE_KEY);
  const cellInfoEdits = readJsonStorage(CELL_INFO_EDIT_STORAGE_KEY);
  const memos = readJsonStorage(SUBJECT_MEMO_STORAGE_KEY);

  targets.forEach(({ row, index }) => {
    const key = getCellInfoKey(row, index);
    if (!key) return;
    delete cellEdits[key];
    delete cellInfoEdits[key];
    delete memos[key];
  });

  writeJsonStorage(CELL_EDIT_STORAGE_KEY, cellEdits);
  writeJsonStorage(CELL_INFO_EDIT_STORAGE_KEY, cellInfoEdits);
  writeJsonStorage(SUBJECT_MEMO_STORAGE_KEY, memos);
}

function rehydrateTimetableFromStorage() {
  resetInfoMapsToDefault();
  loadSubjectInfoEdits();
  restoreDefaultCellSubjects();
  loadCellEdits();
  loadMeals();
  applyRoomBadges();
  updateMemoIndicators();
  updateSchoolSubtitle();
  updateCurrentStatus();
  syncFloatingTopbar();
}

async function restoreSubjectTargetsFromNeis(targets, button) {
  const validTargets = targets.filter(({ row, cell, index }) => (
    row && cell && index != null && !cell.hasAttribute("colspan")
  ));
  const neisBridge = window.TileNeis;

  if (!validTargets.length) {
    showToast("복원할 수업을 선택해주세요", "목록에서 하나 이상의 수업을 선택하세요.", {
      tone: "error"
    });
    return false;
  }
  if (!neisBridge?.prepare || !neisBridge?.applyTargets) {
    showToast("NEIS 연결 모듈을 불러오지 못했습니다", "페이지를 새로고침한 뒤 다시 시도해주세요.", {
      tone: "error"
    });
    return false;
  }

  setButtonLoading(button, true);
  let snapshot = null;
  try {
    const prepared = await neisBridge.prepare(getSavedTileUser());
    snapshot = pushUndoSnapshot("NEIS 과목 복원");
    clearLocalOverridesForTargets(validTargets);
    const appliedCount = neisBridge.applyTargets(
      prepared,
      validTargets.map(({ row, index }) => ({
        period: row.dataset.period || "",
        dayIndex: index
      }))
    );
    applyRoomBadges();
    updateMemoIndicators();
    updateCurrentStatus();
    closeSubjectModal();
    showToast(
      "선택한 수업을 NEIS 정보로 복원했습니다",
      `${appliedCount}개 수업을 다시 불러왔습니다.`,
      {
        actionLabel: "되돌리기",
        onAction: () => restoreSnapshot(snapshot),
        duration: 7000
      }
    );
    return true;
  } catch (error) {
    console.error(error);
    if (snapshot) {
      restoreSnapshot(snapshot, { reload: false });
      rehydrateTimetableFromStorage();
    }
    showToast("선택한 수업을 복원하지 못했습니다", error.message || "잠시 후 다시 시도해주세요.", {
      tone: "error"
    });
    return false;
  } finally {
    setButtonLoading(button, false);
  }
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
      if (!cell.dataset.source) cell.dataset.source = "default";
    });
  });
}

function restoreDefaultCellSubjects() {
  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    row.querySelectorAll("td").forEach((cell, index) => {
      if (cell.hasAttribute("colspan")) return;
      renderSubjectCell(cell, getDefaultCellSubject(row, index));
      cell.dataset.source = "default";
      delete cell.dataset.neisRoom;
      delete cell.dataset.neisTeacher;
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

  hideSubjectModes();
  subjectEditMode.classList.remove("mode-hidden");
  if (subjectEditTitle) subjectEditTitle.textContent = subject ? "과목 수정" : "과목 추가";
  if (subjectEditName) subjectEditName.value = subject;
  if (subjectEditRoom) {
    subjectEditRoom.value = cellInfo.room || cell.dataset.neisRoom || classroomMap[subject] || "";
  }
  if (subjectEditTeacher) {
    subjectEditTeacher.value = cellInfo.teacher || cell.dataset.neisTeacher || teacherMap[subject] || "";
  }
  if (subjectEditMemo) subjectEditMemo.value = memos[memoKey] || "";
  if (subjectEditContext) {
    subjectEditContext.textContent = `${getSubjectDayLabel(index)}요일 · ${row.dataset.period || "교시"}`;
  }
  if (subjectEditSource) {
    const source = getCellSourceLabel(cell);
    subjectEditSource.textContent = source.label;
    subjectEditSource.className = `source-badge ${source.className}`.trim();
  }

  showSubjectOverlay();
  setTimeout(() => subjectEditName?.focus(), 100);
}

function showSubjectOverlay() {
  if (!subjectOverlay) return;
  if (subjectOverlay.classList.contains("hidden")) rememberDialogTrigger();
  subjectOverlay.classList.remove("hidden");
  subjectOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  overlayDismissBlockUntil = Date.now() + 360;

  const modal = document.getElementById("subjectModal");
  modal?.classList.remove("modal-animate-out");
  void (modal && modal.offsetWidth);
  modal?.classList.add("modal-animate-in");
}

function closeSubjectModal() {
  if (!subjectOverlay) return;
  const modal = document.getElementById("subjectModal");
  modal?.classList.remove("modal-animate-in");
  modal?.classList.add("modal-animate-out");

  const hideDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 150 : 320;
  setTimeout(() => {
    subjectOverlay.classList.add("hidden");
    subjectOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modal?.classList.remove("modal-animate-out");
    if (subjectBulkRows) subjectBulkRows.textContent = "";
    hideSubjectModes();
    modalCallback = null;
    selectedSubjectCell = null;
    selectedSubjectRow = null;
    selectedSubjectIndex = null;
    selectedPeriodRow = null;
    selectedPeriodItem = null;
    subjectBulkTargets = [];
    restoreDialogTrigger();
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

function updateBulkSelectionSummary() {
  if (!subjectBulkRows) return;
  const checkboxes = Array.from(
    subjectBulkRows.querySelectorAll('input[type="checkbox"]')
  );
  const selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;

  if (subjectBulkSummary) {
    subjectBulkSummary.textContent = `${selectedCount}개 수업 선택됨`;
  }
  if (subjectBulkToggleAll) {
    const allSelected = checkboxes.length > 0 && selectedCount === checkboxes.length;
    subjectBulkToggleAll.textContent = allSelected ? "전체 해제" : "전체 선택";
    subjectBulkToggleAll.setAttribute("aria-pressed", String(allSelected));
  }
}

function openSubjectBulkEditor() {
  if (!selectedSubjectCell || !subjectBulkMode || !subjectBulkRows) return;

  const selectedSubject = selectedSubjectCell.dataset.subject || "";
  subjectBulkTargets = getSubjectBulkTargets(selectedSubject);
  if (!selectedSubject || !subjectBulkTargets.length) return;

  hideSubjectModes();
  subjectBulkMode.classList.remove("mode-hidden");
  if (subjectBulkTitle) subjectBulkTitle.textContent = `${selectedSubject} 일괄 수정`;

  const memos = readJsonStorage(SUBJECT_MEMO_STORAGE_KEY);
  const selectedCellInfo = getCellInfo(selectedSubjectRow, selectedSubjectIndex);
  const selectedMemoKey = getCellMemoKey(selectedSubjectRow, selectedSubjectIndex);
  if (subjectBulkName) subjectBulkName.value = selectedSubject;
  if (subjectBulkRoom) {
    subjectBulkRoom.value = selectedCellInfo.room
      || selectedSubjectCell.dataset.neisRoom
      || classroomMap[selectedSubject]
      || "";
  }
  if (subjectBulkTeacher) {
    subjectBulkTeacher.value = selectedCellInfo.teacher
      || selectedSubjectCell.dataset.neisTeacher
      || teacherMap[selectedSubject]
      || "";
  }
  if (subjectBulkMemo) subjectBulkMemo.value = memos[selectedMemoKey] || "";
  subjectBulkRows.textContent = "";

  subjectBulkTargets.forEach(({ row, cell, index }, targetIndex) => {
    const subject = cell.dataset.subject || "";
    const memoKey = getCellMemoKey(row, index);
    const cellInfo = getCellInfo(row, index);
    const rowEl = document.createElement("label");
    rowEl.className = "subject-bulk-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.dataset.targetIndex = String(targetIndex);
    checkbox.setAttribute(
      "aria-label",
      `${getSubjectDayLabel(index)}요일 ${row.dataset.period || "교시"} 선택`
    );
    rowEl.appendChild(checkbox);

    const dayLabel = document.createElement("div");
    dayLabel.className = "subject-bulk-day";
    const dayTitle = document.createElement("strong");
    dayTitle.textContent = `${getSubjectDayLabel(index)}요일 · ${row.dataset.period || "교시"}`;
    const daySubject = document.createElement("span");
    daySubject.textContent = subject;
    dayLabel.append(dayTitle, daySubject);
    rowEl.appendChild(dayLabel);

    const meta = document.createElement("span");
    meta.className = "subject-bulk-meta";
    const room = cellInfo.room
      || (cell.dataset.source === "neis" ? cell.dataset.neisRoom : "")
      || classroomMap[subject]
      || "교실 미지정";
    const hasMemo = Boolean((memos[memoKey] || "").trim());
    meta.textContent = hasMemo ? `${room} · 메모 있음` : room;
    rowEl.appendChild(meta);
    subjectBulkRows.appendChild(rowEl);
  });

  updateBulkSelectionSummary();
  subjectBulkName?.focus();
}

function saveBulkSubjectEdits() {
  if (!subjectBulkTargets.length || !subjectBulkRows) return;

  const checkedTargets = Array.from(
    subjectBulkRows.querySelectorAll('input[type="checkbox"]:checked')
  );
  if (checkedTargets.length === 0) {
    showToast("적용할 수업을 선택해주세요", "목록에서 하나 이상의 수업을 선택하세요.", {
      tone: "error"
    });
    return;
  }

  const subject = subjectBulkName?.value.trim() || "";
  if (!subject) {
    showToast("과목명을 입력해주세요", "빈 과목명은 저장할 수 없습니다.", {
      tone: "error"
    });
    subjectBulkName?.focus();
    return;
  }

  const room = subjectBulkRoom?.value.trim() || "";
  const teacher = subjectBulkTeacher?.value.trim() || "";
  const memo = subjectBulkMemo?.value.trim() || "";
  const memos = readJsonStorage(SUBJECT_MEMO_STORAGE_KEY);
  const undoSnapshot = pushUndoSnapshot("과목 일괄 수정");

  checkedTargets.forEach((checkbox) => {
    const targetIndex = Number(checkbox.dataset.targetIndex);
    const target = subjectBulkTargets[targetIndex];
    const { row, cell, index } = target || {};
    if (!cell || cell.hasAttribute("colspan")) return;

    const memoKey = getCellMemoKey(row, index);

    renderSubjectCell(cell, subject);
    cell.dataset.source = "local";
    saveCellEdit(row.dataset.period, index, subject);
    saveCellInfo(row, index, { room, teacher });

    if (memo) memos[memoKey] = memo;
    else delete memos[memoKey];
  });

  writeJsonStorage(SUBJECT_MEMO_STORAGE_KEY, memos);
  applyRoomBadges();
  updateMemoIndicators();
  updateCurrentStatus();
  closeSubjectModal();
  showToast(
    `${checkedTargets.length}개 수업을 수정했습니다`,
    "선택하지 않은 수업은 그대로 유지했습니다.",
    {
      actionLabel: "되돌리기",
      onAction: () => restoreSnapshot(undoSnapshot),
      duration: 6200
    }
  );
}

subjectEditSave?.addEventListener("click", () => {
  if (!selectedSubjectCell || !selectedSubjectRow) return;
  const subject = subjectEditName?.value.trim() || "";
  if (!subject) return;

  const room = subjectEditRoom?.value.trim() || "";
  const teacher = subjectEditTeacher?.value.trim() || "";
  const memo = subjectEditMemo?.value.trim() || "";
  const memoKey = getCellMemoKey(selectedSubjectRow, selectedSubjectIndex);

  const undoSnapshot = pushUndoSnapshot("과목 수정");
  renderSubjectCell(selectedSubjectCell, subject);
  selectedSubjectCell.dataset.source = "local";
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
  showToast("수업을 저장했습니다", `${getSubjectDayLabel(selectedSubjectIndex)}요일 ${selectedSubjectRow.dataset.period}`, {
    actionLabel: "되돌리기",
    onAction: () => restoreSnapshot(undoSnapshot),
    duration: 6200
  });
});

subjectEditReset?.addEventListener("click", () => {
  openSubjectBulkEditor();
});

subjectEditNeis?.addEventListener("click", async () => {
  await restoreSubjectTargetsFromNeis([
    {
      row: selectedSubjectRow,
      cell: selectedSubjectCell,
      index: selectedSubjectIndex
    }
  ], subjectEditNeis);
});

subjectBulkSave?.addEventListener("click", saveBulkSubjectEdits);

subjectBulkBack?.addEventListener("click", () => {
  hideSubjectModes();
  subjectEditMode?.classList.remove("mode-hidden");
  setTimeout(() => subjectEditName?.focus(), 40);
});

subjectBulkNeis?.addEventListener("click", async () => {
  const checkedTargets = Array.from(
    subjectBulkRows?.querySelectorAll('input[type="checkbox"]:checked') || []
  ).map((checkbox) => subjectBulkTargets[Number(checkbox.dataset.targetIndex)])
    .filter(Boolean);
  await restoreSubjectTargetsFromNeis(checkedTargets, subjectBulkNeis);
});

subjectBulkRows?.addEventListener("change", updateBulkSelectionSummary);

subjectBulkToggleAll?.addEventListener("click", () => {
  if (!subjectBulkRows) return;
  const checkboxes = Array.from(
    subjectBulkRows.querySelectorAll('input[type="checkbox"]')
  );
  const shouldSelect = checkboxes.some((checkbox) => !checkbox.checked);
  checkboxes.forEach((checkbox) => {
    checkbox.checked = shouldSelect;
  });
  updateBulkSelectionSummary();
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
  const rawSeconds = diffMinutes * 60;
  const nearestSecond = Math.round(rawSeconds);
  // Snap floating-point noise at whole-second boundaries without discarding real milliseconds.
  const totalSeconds = Math.max(0, Math.abs(rawSeconds - nearestSecond) < 1e-7
    ? nearestSecond
    : Math.ceil(rawSeconds));
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
  return formatRelativeDuration(diffMinutes, "남음");
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
  
  for (let i = 0; i < scheduleRanges.length - 1; i++) {
    const prevEnd = toMinutes(scheduleRanges[i].end);
    const nextStart = toMinutes(scheduleRanges[i + 1].start);
    if (minutesNow >= prevEnd && minutesNow < nextStart) {
      return {
        name: "쉬는시간",
        start: scheduleRanges[i].end,
        end: scheduleRanges[i + 1].start,
        type: "break"
      };
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

    const room = cellInfo.room
      || (cell.dataset.source === "neis" ? cell.dataset.neisRoom : "")
      || classroomMap[subject];
    if (room) {
      const roomTag = document.createElement("span");
      roomTag.className = "room-info";
      roomTag.textContent = `교실: ${room}`;
      subjectWrap.appendChild(roomTag);
    }

    const teacher = cellInfo.teacher
      || (cell.dataset.source === "neis" ? cell.dataset.neisTeacher : "")
      || teacherMap[subject];
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
  if (!cell) return;
  cell.dataset.neisRoom = info.room || "";
  cell.dataset.neisTeacher = info.teacher || "";
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
      targetCell.dataset.source = "local";
    });
  } catch (error) {
    console.error(error);
  }
}

function openPeriodEditor(row, scheduleItem) {
  if (!row || !periodEditMode || !subjectOverlay) return;

  selectedPeriodRow = row;
  selectedPeriodItem = scheduleItem || null;
  const period = row.dataset.period || "교시";
  hideSubjectModes();
  periodEditMode.classList.remove("mode-hidden");
  if (periodEditTitle) periodEditTitle.textContent = `${period} 시간`;
  if (periodEditDescription) {
    periodEditDescription.textContent = "시작과 종료 시간을 바꾸면 남은 시간과 현재 진행 계산에도 바로 반영됩니다.";
  }
  if (periodStartInput) periodStartInput.value = scheduleItem?.start || "";
  if (periodEndInput) periodEndInput.value = scheduleItem?.end || "";
  if (periodFormMessage) periodFormMessage.textContent = "";
  showSubjectOverlay();
  window.setTimeout(() => periodStartInput?.focus(), 80);
}

periodEditCancel?.addEventListener("click", closeSubjectModal);

periodEditSave?.addEventListener("click", () => {
  if (!selectedPeriodRow) return;
  const start = periodStartInput?.value || "";
  const end = periodEndInput?.value || "";

  if (!start || !end || toMinutes(end) <= toMinutes(start)) {
    if (periodFormMessage) {
      periodFormMessage.textContent = "종료 시간은 시작 시간보다 늦어야 합니다.";
    }
    periodEndInput?.focus();
    return;
  }

  const period = selectedPeriodRow.dataset.period || "교시";
  const undoSnapshot = pushUndoSnapshot("교시 시간 수정");
  if (selectedPeriodItem) {
    selectedPeriodItem.start = start;
    selectedPeriodItem.end = end;
  } else {
    selectedPeriodItem = { name: period, start, end };
    scheduleRanges.push(selectedPeriodItem);
  }

  updateRowTimeText(selectedPeriodRow, start, end);
  saveScheduleEdit(period, start, end);
  updateCurrentStatus();
  closeSubjectModal();
  showToast(`${period} 시간을 저장했습니다`, `${format12Hour(start)}부터 ${format12Hour(end)}까지`, {
    actionLabel: "되돌리기",
    onAction: () => restoreSnapshot(undoSnapshot),
    duration: 6200
  });
});

function enableTileEditing() {
  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    const cells = row.querySelectorAll("td");
    const header = row.querySelector("th");

    if (header) {
      header.style.cursor = "pointer";
      header.addEventListener("click", () => {
        const period = row.dataset.period;
        const scheduleItem = scheduleRanges.find((item) => item.name === period);
        openPeriodEditor(row, scheduleItem);
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
    if (event.key !== "Escape") return;
    if (subjectOverlay && !subjectOverlay.classList.contains("hidden")) {
      closeSubjectModal();
    } else if (setupModal && !setupModal.classList.contains("hidden")) {
      closeSchoolSettingsModal();
    } else if (appSettingsModal && !appSettingsModal.classList.contains("hidden")) {
      closeAppSettingsModal();
    }
  });
  document.addEventListener("keydown", trapDialogFocus);
}

function updateThemeButton() {
  if (!themeToggle) return;
  const isDark = !document.body.classList.contains("light-mode");
  themeToggle.textContent = isDark ? "라이트 모드" : "다크 모드";
  themeToggle.classList.toggle("theme-target-light", isDark);
  themeToggle.classList.toggle("theme-target-dark", !isDark);
  themeToggle.setAttribute("aria-pressed", String(!isDark));
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
  todayOnlyToggle.setAttribute("aria-pressed", String(isActive && isEnabled));
}

function applyTodayOnlyMode() {
  const isMobile = isMobileTimetableView();
  const isTodayOnly = localStorage.getItem("mirim-today-only") === "on";
  const activeDay = getTodayScheduleDay();
  const hasSchoolDay = Boolean(activeDay);
  const shouldApply = hasSchoolDay && (isMobile || isTodayOnly);
  document.body.classList.toggle("today-only-mode", shouldApply);
  document.body.classList.toggle("mobile-today-mode", isMobile && hasSchoolDay);

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
  const room = cellInfo.room
    || (currentCell.dataset.source === "neis" ? currentCell.dataset.neisRoom : "")
    || classroomMap[subject];
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
updateLastSyncValue();
updateUndoAvailability();
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
  notify(title, detail = "", options = {}) {
    showToast(title, detail, options);
  },
  renderRollingText(element, text, key) {
    renderRollingStyleText(element, text, key);
  },
  replayRollingText(element, fromText, toText, key, options = {}) {
    if (!element || !fromText || !toText || fromText === toText) return;

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
    customPanel.setAttribute("aria-hidden", String(!customPanel.classList.contains("is-open")));
  });
}

if (customClose && customPanel) {
  customClose.addEventListener("click", () => {
    customPanel.classList.remove("is-open");
    customPanel.setAttribute("aria-hidden", "true");
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
        showToast("JSON 객체가 필요합니다", "중괄호로 시작하는 올바른 설정을 입력해주세요.", {
          tone: "error"
        });
        return;
      }

      const undoSnapshot = pushUndoSnapshot("JSON 설정 수정");
      localStorage.setItem("tile-custom-json", JSON.stringify(parsed));

      // Reload config without page refresh
      loadCustomConfig();
      applyRoomBadges();
      updateCurrentStatus();

      showToast("JSON 설정을 저장했습니다", "시간표에 새 설정을 반영했습니다.", {
        actionLabel: "되돌리기",
        onAction: () => restoreSnapshot(undoSnapshot),
        duration: 6200
      });
    } catch (err) {
      showToast("JSON 형식을 확인해주세요", err.message, { tone: "error" });
    }
  });
}

if (customReset && customInput) {
  customReset.addEventListener("click", () => {
    const undoSnapshot = pushUndoSnapshot("시간표 초기화");
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

    showToast("시간표 수정값을 초기화했습니다", "기본 시간표를 다시 표시했습니다.", {
      actionLabel: "되돌리기",
      onAction: () => restoreSnapshot(undoSnapshot),
      duration: 6200
    });
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
      const undoSnapshot = pushUndoSnapshot("메모 수정");
      localStorage.setItem("tile-memo-content", memoText);
      showToast("메모를 저장했습니다", "이 브라우저에 안전하게 보관됩니다.", {
        actionLabel: "되돌리기",
        onAction: () => restoreSnapshot(undoSnapshot)
      });
    } catch (err) {
      showToast("메모를 저장하지 못했습니다", err.message, { tone: "error" });
    }
  });
}

if (memoReset && memoInput) {
  memoReset.addEventListener("click", () => {
    const undoSnapshot = pushUndoSnapshot("메모 초기화");
    localStorage.removeItem("tile-memo-content");
    memoInput.value = "";
    showToast("메모를 비웠습니다", "", {
      actionLabel: "되돌리기",
      onAction: () => restoreSnapshot(undoSnapshot)
    });
  });
}

// 메모 패널 토글
const memoToggle = document.getElementById("memoToggle");
if (memoToggle && memoPanel) {
  memoToggle.addEventListener("click", () => {
    triggerButtonPop(memoToggle);
    setToolMenuOpen(false);
    memoPanel.classList.toggle("is-open");
    memoPanel.setAttribute("aria-hidden", String(!memoPanel.classList.contains("is-open")));
  });
}

if (memoClose && memoPanel) {
  memoClose.addEventListener("click", () => {
    memoPanel.classList.remove("is-open");
    memoPanel.setAttribute("aria-hidden", "true");
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
let schoolSearchRequestId = 0;

function openSchoolSettings() {
    if (!setupModal) return;
    rememberDialogTrigger();
    resetSchoolSyncPreview();
    setupModal.classList.remove("hidden");
    setupModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(() => schoolInput?.focus(), 80);
}

function closeSchoolSettingsModal() {
    if (!setupModal) return;
    setupModal.classList.add("hidden");
    setupModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (schoolResults) schoolResults.innerHTML = "";
    resetSchoolSyncPreview();
    restoreDialogTrigger();
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
        selectedSchoolInfo.replaceChildren();
        return;
    }

    const typeText = [school.kind, getDisplaySchoolType(school)]
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index)
        .join(" · ") || "학교 정보";
    selectedSchoolInfo.classList.add("is-visible");
    selectedSchoolInfo.replaceChildren();
    [
      ["설립 구분", school.foundation || "확인 중"],
      ["학교 종류", typeText],
      ["교육청", school.officeName || school.office || "확인 중"]
    ].forEach(([labelText, valueText]) => {
      const item = document.createElement("div");
      const label = document.createElement("span");
      const value = document.createElement("strong");
      label.textContent = labelText;
      value.textContent = valueText;
      item.append(label, value);
      selectedSchoolInfo.appendChild(item);
    });
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

function saveSchoolSettings({ persist = true } = {}) {
    const schoolName = schoolInput?.value.trim();
    const grade = gradeInput?.value.trim();
    const classNum = classInput?.value.trim();

    if (!schoolName || !grade || !classNum) {
        if (schoolFormMessage) schoolFormMessage.textContent = "학교, 학년, 반을 모두 입력해주세요.";
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

    if (persist) {
      localStorage.setItem("tile_user", JSON.stringify(user));
      updateSchoolSubtitle(user);
    }
    return user;
}

function getSchoolFormSignature(user = saveSchoolSettings({ persist: false })) {
  if (!user) return "";
  return [
    user.school?.office || "",
    user.school?.code || user.school?.name || "",
    user.grade,
    user.classNum
  ].join("|");
}

function setSchoolProgressStep(step = 1) {
  document.querySelectorAll(".setup-progress > span").forEach((item, index) => {
    const itemStep = index + 1;
    item.classList.toggle("is-active", itemStep === step);
    item.classList.toggle("is-complete", itemStep < step);
  });
}

function resetSchoolSyncPreview() {
  preparedSchoolSync = null;
  preparedSchoolSignature = "";
  if (schoolSyncPreview) schoolSyncPreview.hidden = true;
  if (schoolFormMessage) schoolFormMessage.textContent = "";
  if (saveSchoolButton) {
    const label = saveSchoolButton.querySelector(".button-label");
    if (label) label.textContent = "변경사항 확인";
  }
  setSchoolProgressStep(selectedSchool ? 2 : 1);
}

function renderSchoolSyncPreview(prepared) {
  if (!prepared || !schoolSyncPreview) return;
  const subjectRows = prepared.timetableRows.filter((row) => (
    row?.ITRT_CNTNT && Number(row?.PERIO) > 0
  ));
  const dateCount = new Set(
    subjectRows.map((row) => row.ALL_TI_YMD || row.TI_YMD).filter(Boolean)
  ).size;
  if (schoolSyncPreviewTitle) {
    schoolSyncPreviewTitle.textContent = `${prepared.school.name} · ${prepared.user.grade}학년 ${prepared.user.classNum}반`;
  }
  if (schoolSyncPreviewCount) {
    schoolSyncPreviewCount.textContent = `${subjectRows.length}개 · ${dateCount || 0}일`;
  }
  if (schoolSyncPreviewMeals) {
    schoolSyncPreviewMeals.textContent = `${prepared.meals.length}개`;
  }
  if (schoolSyncPreviewDepartment) {
    schoolSyncPreviewDepartment.textContent = normalizeDepartment(prepared.department) || "해당 없음";
  }
  schoolSyncPreview.hidden = false;
  setSchoolProgressStep(3);
  const label = saveSchoolButton?.querySelector(".button-label");
  if (label) label.textContent = "이 설정 적용";
}

schoolSettingsToggle?.addEventListener("click", () => {
    triggerButtonPop(schoolSettingsToggle);
    setToolMenuOpen(false);
    fillSchoolSettingsFromSavedUser();
    openSchoolSettings();
});

function setSettingsSection(sectionId = "mealSettings") {
  settingsNavButtons.forEach((button) => {
    const isActive = button.dataset.settingsTarget === sectionId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll(".settings-section").forEach((section) => {
    const isActive = section.id === sectionId;
    section.classList.toggle("is-active", isActive);
    section.hidden = !isActive;
  });

  const settingsActions = saveAppSettings?.closest(".setup-actions");
  if (settingsActions) settingsActions.hidden = sectionId === "dataSettings";
}

function openAppSettings() {
  if (!appSettingsModal) return;
  rememberDialogTrigger();
  loadAppSettings();
  setSettingsSection("mealSettings");
  updateLastSyncValue();
  updateUndoAvailability();
  appSettingsModal.classList.remove("hidden");
  appSettingsModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => allergyInput?.focus(), 80);
}

function closeAppSettingsModal() {
  if (!appSettingsModal) return;
  appSettingsModal.classList.add("hidden");
  appSettingsModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  restoreDialogTrigger();
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
  const undoSnapshot = pushUndoSnapshot("Tile 설정 수정");
  saveAppSettingsFromInput();
  closeAppSettingsModal();
  showToast("Tile 설정을 저장했습니다", "급식 알림 설정을 바로 반영했습니다.", {
    actionLabel: "되돌리기",
    onAction: () => restoreSnapshot(undoSnapshot)
  });
});

resetAppSettings?.addEventListener("click", () => {
  const undoSnapshot = pushUndoSnapshot("Tile 설정 초기화");
  localStorage.removeItem(APP_SETTINGS_STORAGE_KEY);
  loadAppSettings();
  showToast("현재 설정을 초기화했습니다", "", {
    actionLabel: "되돌리기",
    onAction: () => restoreSnapshot(undoSnapshot)
  });
});

settingsNavButtons.forEach((button) => {
  button.addEventListener("click", () => setSettingsSection(button.dataset.settingsTarget));
});

exportTileData?.addEventListener("click", () => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: 1,
    values: captureUserDataSnapshot("Tile 데이터 내보내기").values
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `tile-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Tile 데이터를 내보냈습니다", "다운로드한 파일은 개인 백업으로 보관할 수 있습니다.");
});

importTileData?.addEventListener("click", () => {
  importTileDataInput?.click();
});

importTileDataInput?.addEventListener("change", async () => {
  const [file] = Array.from(importTileDataInput.files || []);
  importTileDataInput.value = "";
  if (!file) return;

  let undoSnapshot = null;
  let previousUndo = null;
  try {
    const imported = JSON.parse(await file.text());
    if (
      imported?.version !== 1
      || !imported.values
      || typeof imported.values !== "object"
      || Array.isArray(imported.values)
    ) {
      throw new Error("Tile에서 내보낸 올바른 백업 파일이 아닙니다.");
    }

    previousUndo = localStorage.getItem(UNDO_STORAGE_KEY);
    undoSnapshot = pushUndoSnapshot("데이터 가져오기");
    if (!applySnapshotValues(imported.values)) {
      throw new Error("백업 데이터 형식을 읽지 못했습니다.");
    }
    localStorage.setItem(UNDO_STORAGE_KEY, JSON.stringify(undoSnapshot));
    window.location.reload();
  } catch (error) {
    console.error(error);
    if (undoSnapshot) {
      restoreSnapshot(undoSnapshot, { reload: false });
      if (previousUndo === null) localStorage.removeItem(UNDO_STORAGE_KEY);
      else localStorage.setItem(UNDO_STORAGE_KEY, previousUndo);
      rehydrateTimetableFromStorage();
      updateUndoAvailability();
    }
    showToast("Tile 데이터를 가져오지 못했습니다", error.message || "백업 파일을 확인해주세요.", {
      tone: "error"
    });
  }
});

undoTileChange?.addEventListener("click", restoreLastChange);

closeSchoolSettings?.addEventListener("click", closeSchoolSettingsModal);

setupModal?.addEventListener("click", (event) => {
    if (event.target === setupModal) closeSchoolSettingsModal();
});

saveSchoolButton?.addEventListener("click", async () => {
    const formUser = saveSchoolSettings({ persist: false });
    if (!formUser) return;
    const formSignature = getSchoolFormSignature(formUser);
    const neisBridge = window.TileNeis;

    if (!neisBridge?.prepare || !neisBridge?.sync) {
      if (schoolFormMessage) schoolFormMessage.textContent = "NEIS 연결 모듈을 불러오지 못했습니다. 페이지를 새로고침해주세요.";
      return;
    }

    if (!preparedSchoolSync || preparedSchoolSignature !== formSignature) {
      setButtonLoading(saveSchoolButton, true);
      if (schoolFormMessage) schoolFormMessage.textContent = "학교와 학급의 시간표를 확인하고 있습니다.";
      try {
        const prepared = await neisBridge.prepare(formUser);
        preparedSchoolSync = prepared;
        selectedSchool = prepared.school;
        if (schoolInput) schoolInput.value = prepared.school.name;
        renderSelectedSchoolInfo(prepared.school);
        preparedSchoolSignature = [
          prepared.school.office || "",
          prepared.school.code || prepared.school.name || "",
          prepared.user.grade,
          prepared.user.classNum
        ].join("|");
        renderSchoolSyncPreview(prepared);
        if (schoolFormMessage) schoolFormMessage.textContent = "내용을 확인한 뒤 적용해주세요.";
      } catch (error) {
        console.error(error);
        if (schoolFormMessage) {
          schoolFormMessage.textContent = error.message || "학교 정보를 확인하지 못했습니다.";
        }
        showToast("학교 정보를 불러오지 못했습니다", error.message || "잠시 후 다시 시도해주세요.", {
          tone: "error"
        });
      } finally {
        setButtonLoading(saveSchoolButton, false);
      }
      return;
    }

    const neisStatusEl = document.getElementById("neisStatus");
    const previousNeisStatus = neisStatusEl?.dataset?.timeText
      || neisStatusEl?.dataset?.displayText
      || neisStatusEl?.textContent?.trim()
      || "";
    const previousUndo = localStorage.getItem(UNDO_STORAGE_KEY);
    const rollbackSnapshot = pushUndoSnapshot("학교 변경");
    const user = {
      school: preparedSchoolSync.school,
      grade: preparedSchoolSync.user.grade,
      classNum: preparedSchoolSync.user.classNum
    };
    localStorage.setItem("tile_user", JSON.stringify(user));
    updateSchoolSubtitle(user);
    setButtonLoading(saveSchoolButton, true);
    if (schoolFormMessage) schoolFormMessage.textContent = "확인한 시간표를 적용하고 있습니다.";

    const didSync = await neisBridge.sync({
      user,
      prepared: preparedSchoolSync,
      beforeApply: clearSubjectLocalEditsForNeis
    });
    setButtonLoading(saveSchoolButton, false);

    if (!didSync) {
      restoreSnapshot(rollbackSnapshot, { reload: false });
      if (previousUndo === null) localStorage.removeItem(UNDO_STORAGE_KEY);
      else localStorage.setItem(UNDO_STORAGE_KEY, previousUndo);
      fillSchoolSettingsFromSavedUser();
      rehydrateTimetableFromStorage();
      updateUndoAvailability();
      if (schoolFormMessage) schoolFormMessage.textContent = "적용하지 못했습니다. 기존 시간표는 그대로 유지됩니다.";
      return;
    }

    localStorage.setItem(LAST_SYNC_STORAGE_KEY, new Date().toISOString());
    updateLastSyncValue();
    const nextNeisStatus = neisStatusEl?.dataset?.timeText
      || neisStatusEl?.dataset?.displayText
      || neisStatusEl?.textContent?.trim()
      || "";
    closeSchoolSettingsModal();

    requestAnimationFrame(() => {
      replayStartupSpotlight();
      const neisRollOptions = { disableTextSwap: true };
      window.TileApp?.replayRollingText?.(
        neisStatusEl,
        previousNeisStatus,
        nextNeisStatus,
        "neis-status",
        neisRollOptions
      );
      window.TileApp?.replayRollingText?.(
        topbarNeis,
        previousNeisStatus,
        nextNeisStatus,
        "topbar-neis-status",
        neisRollOptions
      );
      syncFloatingTopbar();
    });
    showToast("학교와 시간표를 적용했습니다", `${user.school.name} · ${user.grade}학년 ${user.classNum}반`, {
      actionLabel: "되돌리기",
      onAction: () => restoreSnapshot(rollbackSnapshot),
      duration: 7000
    });
});

let schoolSearchTimer = null;
schoolInput?.addEventListener("input", () => {
  window.clearTimeout(schoolSearchTimer);
  selectedSchool = null;
  renderSelectedSchoolInfo(null);
  resetSchoolSyncPreview();
  const query = schoolInput.value.trim();
  if (!schoolResults) return;
  schoolResults.replaceChildren();

  if (query.length < 2) return;

  const loading = document.createElement("div");
  loading.className = "school-result-empty";
  loading.textContent = "학교를 검색하고 있습니다.";
  schoolResults.appendChild(loading);
  const requestId = ++schoolSearchRequestId;

  schoolSearchTimer = window.setTimeout(async () => {
    try {
      const schools = await searchSchool(query);
      if (requestId !== schoolSearchRequestId || schoolInput.value.trim() !== query) return;
      schoolResults.replaceChildren();

      if (schools.length === 0) {
        const empty = document.createElement("div");
        empty.className = "school-result-empty";
        empty.textContent = "검색 결과가 없습니다.";
        schoolResults.appendChild(empty);
        return;
      }

      schools.forEach((school) => {
        const button = document.createElement("button");
        button.type = "button";
        const name = document.createElement("strong");
        const office = document.createElement("span");
        name.textContent = school.name;
        office.textContent = school.officeName || school.location || "";
        button.append(name, office);
        button.addEventListener("click", () => {
          selectedSchool = school;
          schoolInput.value = school.name;
          schoolResults.replaceChildren();
          renderSelectedSchoolInfo(school);
          resetSchoolSyncPreview();
          setSchoolProgressStep(2);
          gradeInput?.focus();
        });
        schoolResults.appendChild(button);
      });
    } catch (error) {
      if (requestId !== schoolSearchRequestId) return;
      console.error(error);
      schoolResults.replaceChildren();
      const message = document.createElement("div");
      message.className = "school-result-empty";
      message.textContent = error.message || "학교 검색에 실패했습니다.";
      schoolResults.appendChild(message);
    }
  }, 280);
});

[gradeInput, classInput].forEach((input) => {
  input?.addEventListener("input", () => {
    resetSchoolSyncPreview();
    if (selectedSchool) setSchoolProgressStep(2);
  });
});

async function init() {

    const user = getSavedTileUser();

    fillSchoolSettingsFromSavedUser();

    if (!user) {
      const status = document.getElementById("neisStatus");
      if (status) status.textContent = "학교 설정 필요";
      window.setTimeout(openSchoolSettings, 1450);
      return;
    }

    const didSync = await syncNeis({ user, silent: true });
    if (!didSync) return;

    loadCellEdits();
    loadSubjectInfoEdits();
    applyRoomBadges();
    updateMemoIndicators();
    updateCurrentStatus();
    localStorage.setItem(LAST_SYNC_STORAGE_KEY, new Date().toISOString());
    updateLastSyncValue();
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
