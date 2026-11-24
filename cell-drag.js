(() => {
  const tbody = document.querySelector("#timetable tbody");
  if (!tbody) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = null;
  let suppressClick = false;

  const cellIndex = cell => [...cell.parentElement.querySelectorAll("td")].indexOf(cell);
  const movable = cell => cell?.matches?.("td") && !cell.hasAttribute("colspan") && tbody.contains(cell);
  const dropCellAt = (x, y, source) => {
    const cell = document.elementFromPoint(x, y)?.closest?.("td");
    return movable(cell) && cell !== source ? cell : null;
  };

  function refresh() {
    tbody.querySelectorAll("td[data-subject]").forEach(cell => {
      if (!cell.dataset.subject || cell.hasAttribute("colspan")) return;
      let handle = cell.querySelector(".cell-drag-handle");
      if (!handle) {
        handle = document.createElement("button");
        handle.type = "button";
        handle.className = "cell-drag-handle";
        handle.innerHTML = '<svg viewBox="0 0 12 16" aria-hidden="true"><circle cx="3" cy="3" r="1"/><circle cx="9" cy="3" r="1"/><circle cx="3" cy="8" r="1"/><circle cx="9" cy="8" r="1"/><circle cx="3" cy="13" r="1"/><circle cx="9" cy="13" r="1"/></svg>';
        handle.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); });
        handle.addEventListener("keydown", onHandleKeyDown);
        cell.append(handle);
      }
      const day = document.querySelector(`#timetable thead th[data-day="${cellIndex(cell) + 1}"]`)?.textContent?.trim() || "";
      handle.setAttribute("aria-label", `${day}요일 ${cell.parentElement.dataset.period} ${cell.dataset.subject} 이동. 화살표 키로 옆 칸과 바꾸기`);
      handle.title = "끌어서 과목 이동";
    });
  }

  function onHandleKeyDown(event) {
    const cell = event.currentTarget.closest("td");
    const row = cell?.parentElement;
    const index = cellIndex(cell);
    const direction = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -5, ArrowDown: 5 }[event.key];
    if (!direction || !movable(cell)) return;
    event.preventDefault();
    event.stopPropagation();
    let target;
    if (Math.abs(direction) === 1) target = row.querySelectorAll("td")[index + direction];
    else {
      const lessonRows = [...tbody.rows].filter(item => item.querySelectorAll("td").length === 5);
      const targetRow = lessonRows[lessonRows.indexOf(row) + Math.sign(direction)];
      target = targetRow?.querySelectorAll("td")[index];
    }
    if (movable(target) && window.TileApp?.moveTimetableCell(cell, target)) {
      target.querySelector(".cell-drag-handle")?.focus();
    }
  }

  function makeGhost(state) {
    const rect = state.source.getBoundingClientRect();
    const ghost = document.createElement("div");
    ghost.className = "cell-drag-ghost";
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    const subject = state.source.querySelector(".subject");
    if (subject) ghost.append(subject.cloneNode(true));
    document.body.append(ghost);
    state.originX = rect.left;
    state.originY = rect.top;
    state.x = rect.left;
    state.y = rect.top;
    state.ghost = ghost;
    state.source.classList.add("is-cell-drag-source");
    ghost.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
  }

  function onPointerDown(event) {
    if (event.button !== 0 || active) return;
    const source = event.target.closest?.("td");
    if (!movable(source) || !source.dataset.subject) return;
    const handle = event.target.closest?.(".cell-drag-handle");
    if (event.pointerType !== "mouse" && !handle) return;
    active = {
      source, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      lastX: event.clientX, lastY: event.clientY, lastTime: performance.now(),
      vx: 0, vy: 0, moved: false, target: null, ghost: null
    };
    if (handle) event.stopPropagation();
  }

  function onPointerMove(event) {
    const state = active;
    if (!state || event.pointerId !== state.pointerId) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (!state.moved && Math.hypot(dx, dy) < 6) return;
    if (!state.moved) {
      state.moved = true;
      makeGhost(state);
      state.source.setPointerCapture?.(event.pointerId);
    }
    const now = performance.now();
    const dt = Math.max(1, now - state.lastTime);
    state.vx = (event.clientX - state.lastX) / dt * 1000;
    state.vy = (event.clientY - state.lastY) / dt * 1000;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastTime = now;
    state.x = state.originX + dx;
    state.y = state.originY + dy;
    state.ghost.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
    const target = dropCellAt(event.clientX, event.clientY, state.source);
    state.target?.classList.remove("is-cell-drop-target");
    state.target = target;
    target?.classList.add("is-cell-drop-target");
    event.preventDefault();
  }

  function settleGhost(state, destination) {
    const ghost = state.ghost;
    if (!ghost) return;
    if (reduceMotion.matches) {
      ghost.style.opacity = "0";
      window.setTimeout(() => ghost.remove(), 150);
      return;
    }
    const target = destination.getBoundingClientRect();
    let x = state.x, y = state.y;
    let vx = Math.max(-3000, Math.min(3000, state.vx));
    let vy = Math.max(-3000, Math.min(3000, state.vy));
    let last = performance.now();
    const omega = 2 * Math.PI / .34;
    const frame = now => {
      const dt = Math.min((now - last) / 1000, .032);
      last = now;
      vx += (-omega * omega * (x - target.left) - 2 * omega * vx) * dt;
      vy += (-omega * omega * (y - target.top) - 2 * omega * vy) * dt;
      x += vx * dt;
      y += vy * dt;
      ghost.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(x - target.left) < .5 && Math.abs(y - target.top) < .5 && Math.hypot(vx, vy) < 4) {
        ghost.remove();
      } else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  function onPointerEnd(event) {
    const state = active;
    if (!state || event.pointerId !== state.pointerId) return;
    active = null;
    if (!state.moved) return;
    if (state.source.hasPointerCapture?.(event.pointerId)) state.source.releasePointerCapture(event.pointerId);
    state.source.classList.remove("is-cell-drag-source");
    state.target?.classList.remove("is-cell-drop-target");
    const target = event.type === "pointercancel" ? null : dropCellAt(event.clientX, event.clientY, state.source);
    const moved = Boolean(target && window.TileApp?.moveTimetableCell(state.source, target));
    settleGhost(state, moved ? target : state.source);
    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 0);
    event.preventDefault();
  }

  tbody.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerEnd);
  window.addEventListener("pointercancel", onPointerEnd);
  tbody.addEventListener("click", event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }, true);
  new MutationObserver(refresh).observe(tbody, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-subject"] });
  window.TileCellDrag = { refresh };
  refresh();
})();
