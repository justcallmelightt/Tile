const classroomMap = {
  "MC": "UI Lab실",
  "JAVA": "제4소프트웨어랩",
  "방과후학교 A": "제4소프트웨어랩",
  "방과후학교 B": "1-2",
  "공통국어 (이대형)": "AICE랩실",
  "공통국어": "1-2",
  "공통영어": "1-2",
  "공통수학": "1-2",
  "한국사": "1-2",
  "성직": "1-2",
  "기술가정": "1-2",
  "일본어": "1-2",
  "자치": "1-2",
  "동아리": "꿈담카페, 사회정서탐구반",
  "체육": "체육관"
};

const teacherMap = {
  "자치": "김지훈",
  "JAVA": "민주리 / 김윤지 / 유병석",
  "공통영어": "김지훈",
  "성직": "이정임",
  "한국사": "이철호",
  "기술가정": "김보경",
  "MC": "정하나",
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
const customToggle = document.getElementById("customToggle");
const customPanel = document.getElementById("customPanel");
const customClose = document.getElementById("customClose");
const customInput = document.getElementById("customTimetableInput");
const customSave = document.getElementById("customSave");
const customLoadExample = document.getElementById("customLoadExample");
const customReset = document.getElementById("customReset");
const currentTimeEl = document.getElementById("currentTime");
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
  if (subjectLocation) subjectLocation.textContent = data.room || "교실 정보 없음";
  if (subjectTeacher) subjectTeacher.textContent = data.teacher || "선생님 정보 없음";
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
  const memos = JSON.parse(
    localStorage.getItem(SUBJECT_MEMO_STORAGE_KEY) || "{}"
  );

  document.querySelectorAll("td[data-subject]").forEach((cell) => {
    const row = cell.closest("tr"); const cellIndex = Array.from(row.querySelectorAll("td[data-subject]")).indexOf(cell); const memoKey = `${row.dataset.period}_${cellIndex}`;
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

function formatRemainingTime(diffMinutes) {
  if (diffMinutes <= 0) return "곧 종료";

  const totalMinutes = Math.ceil(diffMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}시간 ${minutes}분 남음`;
  if (hours > 0) return `${hours}시간 남음`;
  return `${minutes}분 남음`;
}

function formatBeforeSchoolTime(diffMinutes) {
  if (diffMinutes <= 0) return "곧 시작";

  const totalMinutes = Math.ceil(diffMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `일과 ${hours}시간 ${minutes}분 전`;
  if (hours > 0) return `일과 ${hours}시간 전`;
  return `일과 ${minutes}분 전`;
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
  cell.classList.remove("empty-cell");
  cell.textContent = "";

  const subjectButton = document.createElement("button");
  subjectButton.className = "subject";
  subjectButton.type = "button";
  subjectButton.dataset.editable = "true";

  const subjectNameEl = document.createElement("span");
  subjectNameEl.className = "subject-name";
  subjectNameEl.textContent = subject;
  subjectButton.appendChild(subjectNameEl);
  cell.appendChild(subjectButton);

  // 이 셀에만 배지 적용 (전체가 아님)
  const subjectWrap = subjectButton;
  if (!subjectWrap) return;

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
  const subjectMemo = document.getElementById("subjectMemo");
  const subjectSave = document.getElementById("subjectSave");
  const subjectReset = document.getElementById("subjectReset");

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
          openInputModal("과목 추가", "과목명을 입력하세요", (value) => {
            if (!value || !value.trim()) return;
            renderSubjectCell(cell, value.trim());
            saveCellEdit(row.dataset.period, index, value.trim());
            updateMemoIndicators();
            updateCurrentStatus();
          });
          return;
        }

        const subject = cell.dataset.subject || "";
        if (!subject) return;

        // 단순 클릭: 편집 모달 열기
        openInputModal("과목 수정", "과목명을 입력하세요", (value) => {
          if (!value || !value.trim()) return;
          renderSubjectCell(cell, value.trim());
          saveCellEdit(row.dataset.period, index, value.trim());
          updateMemoIndicators();
          updateCurrentStatus();
        });
        if (modalInput) {
          modalInput.value = subject;
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
  themeToggle.classList.toggle("theme-target-light", isDark);
  themeToggle.classList.toggle("theme-target-dark", !isDark);
}

function initTheme() {
  const savedTheme = localStorage.getItem("mirim-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
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
  label.textContent = currentTimeEl.textContent;
  label.style.visibility = "hidden";
  table.appendChild(label);

  const safeLeft = rowHeader.offsetLeft + 4;
  const syncedTop = isBreakTarget ? targetRow.offsetTop : rawLineTop;

  label.style.left = `${safeLeft}px`;
  label.style.top = `${syncedTop}px`;
  label.style.visibility = "visible";

  const line = document.createElement("div");
  line.className = "floating-time-line";
  const lineLeft = safeLeft + label.offsetWidth - 6;
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
    return { subject: "일과 시간 아님", room: "미지정" };
  }

  if (currentSchedule.type === "break") {
    return { subject: "쉬는시간", room: "이동 시간" };
  }

  if (currentSchedule.merged) {
    return { subject: currentSchedule.name, room: "공통 일정" };
  }

  if (!(dayOfWeek >= 1 && dayOfWeek <= 5)) {
    return { subject: currentSchedule.name, room: "주말" };
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
    currentTimeEl.textContent = `${format12Hour(`${hours}:${minutes}`)}:${seconds}`;
  }

  if (todayLabelEl) {
    todayLabelEl.textContent = `${dayNames[dayOfWeek]}요일`;
  }

  if (remainingTimeLabelEl) {
    remainingTimeLabelEl.textContent = currentSchedule && currentSchedule.type === "break" ? "남은 쉬는 시간" : "교시 남은 시간";
  }

  const isSchoolWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const dayScheduleEnd = getDayScheduleEnd(dayOfWeek);
  const dayScheduleEndMinutes = dayScheduleEnd ? toMinutes(dayScheduleEnd) : null;

  if (dayRemainingTimeEl) {
    const dayStartMinutes = toMinutes(scheduleRanges[0].start);
    const schoolPreviewStartMinutes = 6 * 60;

    if (isSchoolWeekday && dayScheduleEndMinutes !== null) {
      if (currentMinutes >= schoolPreviewStartMinutes && currentMinutes < dayStartMinutes) {
        dayRemainingTimeEl.textContent = formatBeforeSchoolTime(dayStartMinutes - currentMinutes);
      } else if (currentMinutes >= dayStartMinutes && currentMinutes < dayScheduleEndMinutes) {
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
      if (currentSchedule.type === "break") {
        currentPeriodEl.textContent = `${currentSchedule.name} (${format12Hour(currentSchedule.start)} ~ ${format12Hour(currentSchedule.end)})`;
      } else if (!subject) {
        currentPeriodEl.textContent = "일과 시간 아님";
      } else if (currentSchedule.merged) {
        currentPeriodEl.textContent = `${currentSchedule.name} (${format12Hour(currentSchedule.start)} ~ ${format12Hour(currentSchedule.end)})`;
      } else {
        currentPeriodEl.textContent = `${currentSchedule.name} · ${subject}`;
      }
    }

    if (remainingTimeEl) {
      remainingTimeEl.textContent = !subject && currentSchedule.type === "schedule"
        ? "일과 시간 아님"
        : formatRemainingTime(remaining);
    }

    if (currentRoomEl) {
      currentRoomEl.textContent = !subject && currentSchedule.type === "schedule"
        ? "일과 시간 아님"
        : room;
    }
  } else {
    if (currentPeriodEl) currentPeriodEl.textContent = "일과 시간 아님";
    if (remainingTimeEl) remainingTimeEl.textContent = "일과 시간 아님";
    if (currentRoomEl) currentRoomEl.textContent = "일과 시간 아님";
  }

  updateHighlights(currentSchedule, dayOfWeek, highlightSchedule);
  document.documentElement.style.setProperty("--period-progress", `${currentProgress}`);
  renderFloatingTimeline(currentSchedule, highlightSchedule, dayOfWeek, currentProgress);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    triggerButtonPop(themeToggle);
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
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

loadCustomConfig();
updateIPhoneSafeZone();
initTheme();
applyTodayOnlyMode();
loadCellEdits();
loadScheduleEdits();
enableTileEditing();
updateMemoIndicators();
updateCurrentStatus();
setInterval(updateCurrentStatus, 1000);

if (customToggle && customPanel) {
  customToggle.addEventListener("click", () => {
    triggerButtonPop(customToggle);
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

    customInput.value = `{
  "message": "Tile 수정 기능 준비 완료 ✨"
}`;

    // Reset to default
    loadCustomConfig();
    applyRoomBadges();
    updateCurrentStatus();

    alert("시간표 및 설정 초기화 완료. 새로고침 해주세요.");
  });
}

if (customLoadExample && customInput) {
  customLoadExample.addEventListener("click", () => {
    customInput.value = `{
  "teachers": {
    "MC": "정하나",
    "JAVA": "민주리"
  },
  "classrooms": {
    "MC": "UI Lab실",
    "JAVA": "제4소프트웨어랩"
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
