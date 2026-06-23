const classroomMap = {
  "한국사 1": "1-3반",
  "진로활동": "1-3반",
  "공통영어 2": "1-3반",
  "공통영어 3": "1-3반",
  "미술": "미술실",
  "한문 1": "1-3반",
  "공통수학 1": "1-3반",
  "체육 2": "1-3반",
  "통합과학 3": "1-3반",
  "통합과학 4": "1-3반",
  "공통영어 1": "1-3반",
  "공통국어 1": "1-3반",
  "한문 2": "1-3반",
  "한국사 3": "1-3반",
  "통합사회 3": "1-3반",
  "체육 1": "1-3반",
  "한국사 2": "1-3반",
  "통합과학 2": "1-3반",
  "공통국어 2": "1-3반",
  "공통영어 4": "1-3반",
  "통합과학 1": "1-3반",
  "자율·자치활동": "1-3반",
  "공통국어 3": "1-3반",
  "통합사회 1": "1-3반",
  "통합사회 2": "1-3반",
  "독서": "1-3반",
  "과학탐구실험 1": "과학실"
};

const teacherMap = {
  "한국사 1": "최지원",
  "진로활동": "권채영",
  "공통영어 2": "정진실",
  "공통영어 3": "조현진",
  "미술": "박수정",
  "한문 1": "강현아",
  "공통수학 1": "권희경",
  "체육 2": "김창우",
  "통합과학 3": "최용석",
  "통합과학 4": "남아름",
  "공통영어 1": "이성기",
  "공통국어 1": "박하나",
  "한문 2": "오지선",
  "한국사 3": "정용우",
  "통합사회 3": "안세운",
  "체육 1": "정우철",
  "한국사 2": "전지영",
  "통합과학 2": "문현우",
  "공통국어 2": "오준택",
  "공통영어 4": "최정숙",
  "통합과학 1": "신진화",
  "자율·자치활동": "부담임",
  "공통국어 3": "손가영",
  "통합사회 1": "주현주",
  "통합사회 2": "이유진",
  "독서": "부담임",
  "과학탐구실험 1": "정희경"
};

const defaultClassroomMap = { ...classroomMap };
const defaultTeacherMap = { ...teacherMap };

// 율하고등학교 표준 일과 시간표 데이터 (쉬는시간 배열은 완전 삭제됨)
const scheduleRanges = [
  { name: "조회", start: "08:30", end: "08:40", merged: true },
  { name: "1교시", start: "08:40", end: "09:30" },
  { name: "2교시", start: "09:40", end: "10:30" },
  { name: "3교시", start: "10:40", end: "11:30" },
  { name: "4교시", start: "11:40", end: "12:30" },
  { name: "중식", start: "12:30", end: "13:35", merged: true },
  { name: "5교시", start: "13:35", end: "14:25" },
  { name: "6교시", start: "14:25", end: "15:15" },
  { name: "7교시", start: "15:40", end: "16:30" },
  { name: "종례", start: "16:30", end: "16:40", merged: true },
  { name: "방과후 A", start: "16:40", end: "17:40" },
  { name: "석식", start: "17:40", end: "18:40", merged: true },
  { name: "방과후 B", start: "18:40", end: "21:00" }
];

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
const themeToggle = document.getElementById("themeToggle");
const todayOnlyToggle = document.getElementById("todayOnlyToggle");
const customToggle = document.getElementById("customToggle");
const customPanel = document.getElementById("customPanel");
const customClose = document.getElementById("customClose");
const customInput = document.getElementById("customTimetableInput");
const customSave = document.getElementById("customSave");
const customLoadExample = document.getElementById("customLoadExample");
const customReset = document.getElementById("customReset");
const currentTimeEl = document.getElementById("currentTime");
const memoToggle = document.getElementById("memoToggle");
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
const CELL_EDIT_STORAGE_KEY = "tile-cell-edits";
const SCHEDULE_EDIT_STORAGE_KEY = "tile-schedule-edits";
const SUBJECT_MEMO_STORAGE_KEY = "tile-subject-memos";
let selectedSubjectCell = null;
let modalCallback = null;
let overlayDismissBlockUntil = 0;

function openSubjectModal(data = {}) {
  if (!subjectOverlay) return;
  if (modalInfoMode) modalInfoMode.classList.remove("mode-hidden");
  if (modalInputMode) modalInputMode.classList.add("mode-hidden");
  if (subjectName) subjectName.textContent = data.name || "과목 정보";
  if (subjectLocation) subjectLocation.textContent = data.room ? `교실: ${data.room}` : "교실 정보 없음";
  if (subjectTeacher) subjectTeacher.textContent = data.teacher ? `선생님: ${data.teacher}` : "선생님 정보 없음";
  showSubjectOverlay();
}

function openInputModal(title, placeholder, callback) {
  if (!subjectOverlay || !modalInput || !modalTitle || !modalInfoMode || !modalInputMode) return;
  modalInfoMode.classList.add("mode-hidden");
  modalInputMode.classList.remove("mode-hidden");
  modalTitle.textContent = title;
  modalInput.placeholder = placeholder;
  modalInput.value = "";
  modalCallback = callback;
  showSubjectOverlay();
  setTimeout(() => modalInput.focus(), 100);
}

function showSubjectOverlay() {
  if (!subjectOverlay) return;
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

  const hideDelay = 360;
  setTimeout(() => {
    subjectOverlay.classList.add("hidden");
    subjectOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modal?.classList.remove("modal-animate-out");
    modalCallback = null;
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
  const memos = JSON.parse(localStorage.getItem(SUBJECT_MEMO_STORAGE_KEY) || "{}");

  document.querySelectorAll("td[data-subject]").forEach((cell) => {
    const row = cell.closest("tr");
    const cellIndex = Array.from(row.querySelectorAll("td[data-subject]")).indexOf(cell);
    const memoKey = `${row.dataset.period}_${cellIndex}`;
    const subjectWrap = cell.querySelector(".subject");

    if (!subjectWrap) return;

    const existing = subjectWrap.querySelector(".memo-indicator");
    if (existing) existing.remove();

    if (memos[memoKey] && memos[memoKey].trim()) {
      const dot = document.createElement("span");
      dot.className = "memo-indicator";
      subjectWrap.appendChild(dot);
    }
  });
}

function triggerButtonPop(buttonEl) {
  if (!buttonEl) return;
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
  buttonEl.classList.remove("popped");
  window.requestAnimationFrame(() => {
    buttonEl.classList.add("popped");
    window.setTimeout(() => {
      buttonEl.classList.remove("popped");
    }, 260);
  });
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
  const paddedHour = String(displayHour).padStart(2, "0");
  return `${period} ${paddedHour}:${minute}`;
}

// 롤링 클럭 애니메이션 구동 함수
function updateRollingClock(newTimeStr) {
  if (!currentTimeEl) return;
  const oldTimeStr = currentTimeEl.dataset.time || "";
  if (oldTimeStr === newTimeStr) return;

  currentTimeEl.dataset.time = newTimeStr;

  if (oldTimeStr.length !== newTimeStr.length) {
    currentTimeEl.innerHTML = "";
    for (let i = 0; i < newTimeStr.length; i++) {
      const char = newTimeStr[i];
      const span = document.createElement("span");
      span.className = "time-char";
      if (char === " ") span.classList.add("time-space");
      else if (char === ":") span.classList.add("time-separator");
      span.textContent = char;
      currentTimeEl.appendChild(span);
    }
    return;
  }

  const children = currentTimeEl.children;
  for (let i = 0; i < newTimeStr.length; i++) {
    const newChar = newTimeStr[i];
    const oldChar = oldTimeStr[i];
    const targetSpan = children[i];

    if (!targetSpan) continue;

    if (newChar !== oldChar) {
      targetSpan.className = "time-char animate";
      if (newChar === " ") targetSpan.classList.add("time-space");
      else if (newChar === ":") targetSpan.classList.add("time-separator");

      targetSpan.innerHTML = `
        <span class="time-char-inner">
          <span class="time-old">${oldChar}</span>
          <span class="time-new">${newChar}</span>
        </span>
      `;
    } else {
      targetSpan.className = "time-char";
      if (newChar === " ") targetSpan.classList.add("time-space");
      else if (newChar === ":") targetSpan.classList.add("time-separator");
      targetSpan.textContent = newChar;
    }
  }
}

function formatRemainingTime(diffMinutes) {
  if (diffMinutes <= 0) return "곧 종료";
  const totalMinutes = Math.ceil(diffMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}시간 ${minutes}분 남음`;
  if (hours > 0) return `${hours}시간 남음`;
  return `${minutes}분 남음`;
}

// 빈틈을 계산하여 쉬는시간을 유동적으로 인식하는 새로운 구동 로직
function getCurrentSchedule(minutesNow) {
  // 1. 먼저 정규 교시/일정 중에 해당하는지 확인
  for (const item of scheduleRanges) {
    const start = toMinutes(item.start);
    const end = toMinutes(item.end);
    if (minutesNow >= start && minutesNow < end) {
      return { ...item, type: "schedule" };
    }
  }
  
  // 2. 일치하는 교시가 없다면, 교시와 교시 사이의 '빈틈'을 자동으로 쉬는시간으로 인식
  for (let i = 0; i < scheduleRanges.length - 1; i++) {
    const prevEnd = toMinutes(scheduleRanges[i].end);
    const nextStart = toMinutes(scheduleRanges[i+1].start);
    
    if (minutesNow >= prevEnd && minutesNow < nextStart) {
      return {
        name: "쉬는시간",
        start: scheduleRanges[i].end,
        end: scheduleRanges[i+1].start,
        type: "break",
        nextSchedule: scheduleRanges[i+1] // 빨간 줄을 대기시킬 다음 교시 정보 수록
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

function getDayScheduleEnd(dayOfWeek) {
  if (!(dayOfWeek >= 1 && dayOfWeek <= 5)) return null;
  let latestEnd = null;
  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    const periodName = row.dataset.period;
    const scheduleItem = scheduleRanges.find((item) => item.name === periodName);
    if (!scheduleItem) return;
    latestEnd = scheduleItem.end;
  });
  return latestEnd;
}

function applyRoomBadges() {
  const cells = document.querySelectorAll("td[data-subject]");
  cells.forEach((cell) => {
    const subject = cell.dataset.subject;
    if (!subject || subject === ".") return;
    const subjectWrap = cell.querySelector(".subject");
    if (!subjectWrap) return;

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
  });
}

function saveCellEdit(period, index, subject) {
  if (!period || index == null) return;
  const edits = JSON.parse(localStorage.getItem(CELL_EDIT_STORAGE_KEY) || "{}");
  edits[`${period}_${index}`] = subject;
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
  cell.dataset.subject = subject;
  
  if (subject === ".") {
    cell.classList.add("empty-cell");
    cell.textContent = ".";
    return;
  }
  
  cell.classList.remove("empty-cell");

  let subjectWrap = cell.querySelector(".subject");
  if (!subjectWrap) {
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

  applyRoomBadges();
}

function resetInfoMapsToDefault() {
  Object.keys(classroomMap).forEach((key) => delete classroomMap[key]);
  Object.assign(classroomMap, defaultClassroomMap);
  Object.keys(teacherMap).forEach((key) => delete teacherMap[key]);
  Object.assign(teacherMap, defaultTeacherMap);
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

function isTileEditModeActive() {
  return document.body.classList.contains("edit-mode");
}

function setTileEditMode(isActive) {
  document.body.classList.toggle("edit-mode", isActive);
  customToggle?.classList.toggle("active", isActive);
  if (customToggle) customToggle.textContent = isActive ? "수정 종료" : "수정";
  customPanel?.classList.toggle("is-open", isActive);
  customPanel?.setAttribute("aria-hidden", isActive ? "false" : "true");
}

function enableTileEditing() {
  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    const cells = row.querySelectorAll("td");
    const header = row.querySelector("th");

    if (header) {
      header.style.cursor = "pointer";
      header.addEventListener("click", () => {
        if (isTileEditModeActive()) {
          const period = row.dataset.period;
          const scheduleItem = scheduleRanges.find((item) => item.name === period);
          const current = scheduleItem ? `${scheduleItem.start}-${scheduleItem.end}` : "";
          openInputModal("교시 수정", "08:20-09:10", (value) => {
            const parsed = parseTimeRange(value);
            if (!parsed) return;
            if (scheduleItem) {
              scheduleItem.start = parsed.start;
              scheduleItem.end = parsed.end;
            }
            updateRowTimeText(row, parsed.start, parsed.end);
            saveScheduleEdit(period, parsed.start, parsed.end);
            updateCurrentStatus();
          });
          if (modalInput) modalInput.value = current;
        }
      });
    }

    cells.forEach((cell, index) => {
      if (cell.hasAttribute("colspan")) return;
      cell.style.cursor = "pointer";

      cell.addEventListener("click", () => {
        if (isTileEditModeActive()) {
          if (cell.classList.contains("empty-cell") || cell.dataset.subject === ".") {
            openInputModal("과목 추가", "과목명을 입력하세요", (value) => {
              if (!value || !value.trim()) return;
              renderSubjectCell(cell, value.trim());
              saveCellEdit(row.dataset.period, index, value.trim());
              updateMemoIndicators();
              updateCurrentStatus();
            });
          } else {
            const subject = cell.dataset.subject || "";
            openInputModal("과목 수정", "과목명을 입력하세요", (value) => {
              if (!value || !value.trim()) return;
              renderSubjectCell(cell, value.trim());
              saveCellEdit(row.dataset.period, index, value.trim());
              updateMemoIndicators();
              updateCurrentStatus();
            });
            if (modalInput) modalInput.value = subject;
          }
        } else {
          if (cell.classList.contains("empty-cell") || cell.dataset.subject === ".") return;
          const subject = cell.dataset.subject;
          if (!subject) return;

          openSubjectModal({
            name: subject,
            room: classroomMap[subject] || "정보 없음",
            teacher: teacherMap[subject] || "정보 없음"
          });
        }
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
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "라이트 모드" : "다크 모드";
}

function initTheme() {
  const savedTheme = localStorage.getItem("mirim-theme");
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  updateThemeButton();
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
  if (targetHeader) targetHeader.classList.add("today-only-hidden");

  document.querySelectorAll("tbody tr[data-period]").forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length === 5) {
      const targetCell = cells[day - 1];
      if (targetCell) targetCell.classList.add("today-only-hidden");
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

  document.querySelectorAll(".today-only-hidden").forEach((node) => {
    node.classList.remove("today-only-hidden");
  });

  if (shouldApply) {
    [1, 2, 3, 4, 5].forEach((day) => {
      if (day !== activeDay) hideColumnByDay(day);
    });
  }
  updateTodayOnlyButton(activeDay, shouldApply);
}

function clearHighlights() {
  document.querySelectorAll("tbody tr").forEach((row) => row.classList.remove("today-row", "current-row", "break-target-row"));
  document.querySelectorAll("tbody td").forEach((cell) => cell.classList.remove("today-cell", "current-cell", "current-glow-cell"));
  document.querySelectorAll("thead th").forEach((cell) => cell.classList.remove("today-column-header", "current-day-column-header"));
  document.querySelectorAll(".floating-time-line, .floating-time-label").forEach((node) => node.remove());
}

function updateHighlights(currentSchedule, dayOfWeek, highlightSchedule) {
  clearHighlights();
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const headerCell = document.querySelector(`thead th[data-day="${dayOfWeek}"]`);
    if (headerCell) headerCell.classList.add("today-column-header", "current-day-column-header");

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
        if (currentCell) currentCell.classList.add("current-cell", "today-cell", "current-glow-cell");
      }
    }
  }
}

function renderFloatingTimeline(currentSchedule, highlightSchedule, dayOfWeek, progress) {
  const table = document.querySelector("table");
  if (!table || !highlightSchedule || !(dayOfWeek >= 1 && dayOfWeek <= 5) || !currentTimeEl) return;

  const targetRow = document.querySelector(`tbody tr[data-period="${highlightSchedule.name}"]`);
  if (!targetRow) return;

  const rowHeader = targetRow.querySelector("th");
  const cells = targetRow.querySelectorAll("td");
  if (!rowHeader || cells.length === 0) return;

  const lastCell = cells[cells.length - 1];
  const isBreakTarget = currentSchedule && currentSchedule.type === "break";
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const rawLineTop = isBreakTarget ? targetRow.offsetTop : targetRow.offsetTop + ((targetRow.offsetHeight - 3) * clampedProgress / 100);

  const label = document.createElement("span");
  label.className = "floating-time-label";
  label.textContent = currentTimeEl.textContent;
  table.appendChild(label);

  const safeLeft = rowHeader.offsetLeft + 4;
  const syncedTop = isBreakTarget ? targetRow.offsetTop : rawLineTop;
  label.style.left = `${safeLeft}px`;
  label.style.top = `${syncedTop}px`;

  const line = document.createElement("div");
  line.className = "floating-time-line";
  const lineLeft = safeLeft + label.offsetWidth - 6;
  const lineRight = Math.max(table.clientWidth - 12, lastCell.offsetLeft + lastCell.offsetWidth - 12);
  line.style.left = `${lineLeft}px`;
  line.style.width = `${Math.max(0, lineRight - lineLeft)}px`;
  line.style.top = `${syncedTop}px`;
  table.appendChild(line);
}

function getCurrentSubjectAndRoom(currentSchedule, dayOfWeek) {
  if (!currentSchedule) return { subject: "일과 시간 아님", room: "미지정" };
  if (currentSchedule.type === "break") return { subject: "쉬는시간", room: "이동 시간" };
  if (currentSchedule.merged) return { subject: currentSchedule.name, room: "공통 일정" };
  if (!(dayOfWeek >= 1 && dayOfWeek <= 5)) return { subject: currentSchedule.name, room: "주말" };

  const currentRow = document.querySelector(`tbody tr[data-period="${currentSchedule.name}"]`);
  if (!currentRow) return { subject: currentSchedule.name, room: "미지정" };

  const cells = currentRow.querySelectorAll("td");
  if (cells.length !== 5) return { subject: currentSchedule.name, room: "미지정" };

  const currentCell = cells[dayOfWeek - 1];
  const subject = currentCell ? currentCell.dataset.subject || "" : "";
  if (!subject || subject === ".") return { subject: "", room: "일과 시간 아님" };

  return {
    subject,
    room: classroomMap[subject] ? `교실: ${classroomMap[subject]}` : "미지정"
  };
}

function updateCurrentStatus() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const dayOfWeek = now.getDay();

  const currentSchedule = getCurrentSchedule(currentMinutes);
  const highlightSchedule = currentSchedule && currentSchedule.type === "break" ? currentSchedule.nextSchedule : currentSchedule;
  const currentProgress = currentSchedule ? (currentSchedule.type === "break" ? 0 : getScheduleProgress(currentSchedule, currentMinutes)) : 0;
  
  const currentPeriodEl = document.getElementById("currentPeriod");
  const remainingTimeLabelEl = document.getElementById("remainingTimeLabel");
  const remainingTimeEl = document.getElementById("remainingTime");
  const dayRemainingTimeEl = document.getElementById("dayRemainingTime");
  const currentRoomEl = document.getElementById("currentRoom");

  const newTimeText = `${format12Hour(`${hours}:${minutes}`)}:${seconds}`;
  updateRollingClock(newTimeText);

  if (remainingTimeLabelEl) remainingTimeLabelEl.textContent = currentSchedule && currentSchedule.type === "break" ? "남은 쉬는 시간" : "교시 남은 시간";

  const isSchoolWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const dayScheduleEnd = getDayScheduleEnd(dayOfWeek);
  const dayScheduleEndMinutes = dayScheduleEnd ? toMinutes(dayScheduleEnd) : null;

  if (dayRemainingTimeEl) {
    const dayStartMinutes = toMinutes(scheduleRanges[0].start);
    if (isSchoolWeekday && dayScheduleEndMinutes !== null) {
      if (currentMinutes >= dayStartMinutes && currentMinutes < dayScheduleEndMinutes) {
        dayRemainingTimeEl.textContent = formatRemainingTime(dayScheduleEndMinutes - currentMinutes);
      } else {
        dayRemainingTimeEl.textContent = "일과 시간 아님";
      }
    } else {
      dayRemainingTimeEl.textContent = "일과 시간 아님";
    }
  }

  if (currentSchedule) {
    const remaining = toMinutes(currentSchedule.end) - currentMinutes;
    const { subject, room } = getCurrentSubjectAndRoom(currentSchedule, dayOfWeek);

    if (currentPeriodEl) {
      if (currentSchedule.type === "break" || currentSchedule.merged) {
        currentPeriodEl.textContent = `${currentSchedule.name} (${format12Hour(currentSchedule.start)} ~ ${format12Hour(currentSchedule.end)})`;
      } else if (!subject) {
        currentPeriodEl.textContent = "일과 시간 아님";
      } else {
        currentPeriodEl.textContent = `${currentSchedule.name} · ${subject}`;
      }
    }
    if (remainingTimeEl) remainingTimeEl.textContent = !subject && currentSchedule.type === "schedule" ? "일과 시간 아님" : formatRemainingTime(remaining);
    if (currentRoomEl) currentRoomEl.textContent = !subject && currentSchedule.type === "schedule" ? "일과 시간 아님" : room;
  } else {
    if (currentPeriodEl) currentPeriodEl.textContent = "일과 시간 아님";
    if (remainingTimeEl) remainingTimeEl.textContent = "일과 시간 아님";
    if (currentRoomEl) currentRoomEl.textContent = "일과 시간 아님";
  }

  updateHighlights(currentSchedule, dayOfWeek, highlightSchedule);
  document.documentElement.style.setProperty("--period-progress", `${currentProgress}`);
  renderFloatingTimeline(currentSchedule, highlightSchedule, dayOfWeek, currentProgress);
}

function loadCustomConfig() {
  resetInfoMapsToDefault();
  const saved = localStorage.getItem("tile-custom-json");
  if (!saved) {
    applyRoomBadges();
    return;
  }
  try {
    const config = JSON.parse(saved);
    if (config.teachers && typeof config.teachers === "object") Object.assign(teacherMap, config.teachers);
    if (config.classrooms && typeof config.classrooms === "object") Object.assign(classroomMap, config.classrooms);
    if (config.subjects && typeof config.subjects === "object") {
      Object.entries(config.subjects).forEach(([subName, subData]) => {
        if (subData.room) classroomMap[subName] = subData.room;
        if (subData.teacher) teacherMap[subName] = subData.teacher;
      });
    }
    if (config.scheduleRanges && Array.isArray(config.scheduleRanges)) {
      config.scheduleRanges.forEach(newPeriod => {
        if (!newPeriod.name || !newPeriod.start || !newPeriod.end) return;
        const existingIndex = scheduleRanges.findIndex(p => p.name === newPeriod.name);
        if (existingIndex >= 0) scheduleRanges[existingIndex] = { ...scheduleRanges[existingIndex], ...newPeriod };
      });
    }
  } catch (error) {
    console.error("JSON 파싱 에러:", error);
  }
  applyRoomBadges();
}

// 초기화 순서 강제 세팅
initTheme();
loadCustomConfig();
loadScheduleEdits();
loadCellEdits();
enableTileEditing();
updateMemoIndicators();
setInterval(updateCurrentStatus, 1000);
updateCurrentStatus();
applyTodayOnlyMode();

// ===== 버튼 이벤트 리스너 통합 정의 =====

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("mirim-theme", isDark ? "dark" : "light");
  updateThemeButton();
  triggerButtonPop(themeToggle);
});

todayOnlyToggle?.addEventListener("click", () => {
  const todayDay = getTodayScheduleDay();
  if (!todayDay) return;
  const isTodayOnly = localStorage.getItem("mirim-today-only") === "on";
  localStorage.setItem("mirim-today-only", isTodayOnly ? "off" : "on");
  applyTodayOnlyMode();
  updateCurrentStatus();
  triggerButtonPop(todayOnlyToggle);
});

customToggle?.addEventListener("click", () => {
  const nextEditMode = !isTileEditModeActive();
  setTileEditMode(nextEditMode);
  if (nextEditMode && customInput) {
    setTimeout(() => customInput.focus(), 100);
  }
  triggerButtonPop(customToggle);
});

customClose?.addEventListener("click", () => {
  setTileEditMode(false);
});

customLoadExample?.addEventListener("click", () => {
  const example = {
    teachers: { ...defaultTeacherMap },
    classrooms: { ...defaultClassroomMap },
    scheduleRanges: scheduleRanges.map(item => ({ name: item.name, start: item.start, end: item.end }))
  };
  if (customInput) customInput.value = JSON.stringify(example, null, 2);
  triggerButtonPop(customLoadExample);
});

customSave?.addEventListener("click", () => {
  if (!customInput) return;
  try {
    const config = JSON.parse(customInput.value);
    localStorage.setItem("tile-custom-json", JSON.stringify(config));
    loadCustomConfig();
    loadCellEdits();
    updateCurrentStatus();
    triggerButtonPop(customSave);
    alert("저장되었습니다!");
    setTileEditMode(false);
  } catch (error) {
    alert("JSON 형식이 올바르지 않습니다: " + error.message);
  }
});

customReset?.addEventListener("click", () => {
  if (!confirm("정말 초기화하시겠습니까?")) return;
  localStorage.removeItem("tile-custom-json");
  localStorage.removeItem(CELL_EDIT_STORAGE_KEY);
  localStorage.removeItem(SCHEDULE_EDIT_STORAGE_KEY);
  loadCustomConfig();
  loadCellEdits();
  updateCurrentStatus();
  applyTodayOnlyMode();
  triggerButtonPop(customReset);
  setTileEditMode(false);
});

memoToggle?.addEventListener("click", () => {
  if (!memoPanel) return;
  const isOpen = memoPanel.classList.contains("is-open");
  memoPanel.classList.toggle("is-open");
  memoPanel.setAttribute("aria-hidden", isOpen);
  if (!isOpen && memoInput) {
    const saved = localStorage.getItem("tile-memo");
    if (saved) memoInput.value = saved;
    setTimeout(() => memoInput.focus(), 100);
  }
  triggerButtonPop(memoToggle);
});

memoClose?.addEventListener("click", () => {
  memoPanel?.classList.remove("is-open");
  memoPanel?.setAttribute("aria-hidden", "true");
});

memoSave?.addEventListener("click", () => {
  if (!memoInput) return;
  localStorage.setItem("tile-memo", memoInput.value);
  triggerButtonPop(memoSave);
  alert("메모가 저장되었습니다!");
  memoPanel?.classList.remove("is-open");
  memoPanel?.setAttribute("aria-hidden", "true");
});

memoReset?.addEventListener("click", () => {
  if (!confirm("메모를 초기화하시겠습니까?")) return;
  if (memoInput) memoInput.value = "";
  localStorage.removeItem("tile-memo");
  triggerButtonPop(memoReset);
  memoPanel?.classList.remove("is-open");
  memoPanel?.setAttribute("aria-hidden", "true");
});
