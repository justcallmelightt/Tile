(() => {
  const key = "tile-period-order";
  const tbody = document.querySelector("#timetable tbody");
  if (!tbody) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const lessons = () => [...tbody.rows].filter(row => /^\d+교시$/.test(row.dataset.period || ""));
  const rows = () => [...tbody.rows].filter(row => row.dataset.period);
  let active = null;
  let settleFrame = 0;

  function normalizePeriodOrder(saved, current) {
    const names = new Set(current.map(row => row.dataset.period));
    const seen = new Set();
    const ordered = [];
    if (Array.isArray(saved)) {
      for (const name of saved) {
        if (typeof name !== "string" || !names.has(name) || seen.has(name)) continue;
        seen.add(name);
        ordered.push(name);
      }
    }
    for (const row of current) {
      if (!seen.has(row.dataset.period)) ordered.push(row.dataset.period);
    }
    return ordered;
  }

  function readOrder() {
    try { return JSON.parse(localStorage.getItem(key) || "null"); }
    catch { return null; }
  }

  function apply() {
    if (active) return;
    const current = rows();
    const byName = new Map(current.map(row => [row.dataset.period, row]));
    for (const name of normalizePeriodOrder(readOrder(), current)) tbody.append(byName.get(name));
    installHandles();
  }

  function finishMotion(row, initialVelocity = 0) {
    cancelAnimationFrame(settleFrame);
    const start = Number(row.dataset.dragOffset || 0);
    if (reduceMotion.matches) {
      row.style.transform = "";
      row.style.opacity = "";
      row.classList.remove("is-period-dragging");
      delete row.dataset.dragOffset;
      return;
    }
    let offset = start;
    let velocity = Math.max(-3500, Math.min(3500, initialVelocity));
    let last = performance.now();
    const omega = 2 * Math.PI / 0.34;
    const tick = now => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      velocity += (-omega * omega * offset - 2 * omega * velocity) * dt;
      offset += velocity * dt;
      if (Math.abs(offset) < 0.5 && Math.abs(velocity) < 3) {
        row.style.transform = "";
        row.style.opacity = "";
        row.classList.remove("is-period-dragging");
        delete row.dataset.dragOffset;
        return;
      }
      row.style.transform = `translate3d(0, ${offset}px, 0)`;
      settleFrame = requestAnimationFrame(tick);
    };
    settleFrame = requestAnimationFrame(tick);
  }

  function moveRow(row, target, before) {
    const oldIndex = rows().indexOf(row);
    if (before) tbody.insertBefore(row, target);
    else tbody.insertBefore(row, target.nextSibling);
    return rows().indexOf(row) !== oldIndex;
  }

  function persist(beforeOrder) {
    const current = rows().map(row => row.dataset.period);
    if (current.join("\u0000") === beforeOrder.join("\u0000")) return;
    if (window.TileApp?.savePeriodOrder(current)) {
      window.TileApp.updateCurrentStatus();
    } else {
      const byName = new Map(rows().map(row => [row.dataset.period, row]));
      beforeOrder.forEach(name => { if (byName.has(name)) tbody.append(byName.get(name)); });
    }
  }

  function onPointerDown(event) {
    if (event.button !== 0 || active) return;
    cancelAnimationFrame(settleFrame);
    const handle = event.currentTarget;
    const row = handle.closest("tr");
    const startTop = row.getBoundingClientRect().top;
    active = {
      handle, row, pointerId: event.pointerId, startY: event.clientY,
      startTop, offset: 0, lastY: event.clientY, lastTime: performance.now(),
      velocity: 0, beforeOrder: rows().map(item => item.dataset.period), moved: false
    };
    tbody.setPointerCapture(event.pointerId);
    row.classList.add("is-period-dragging");
    event.preventDefault();
    event.stopPropagation();
  }

  function onPointerMove(event) {
    if (!active || event.pointerId !== active.pointerId) return;
    const state = active;
    const now = performance.now();
    const dt = Math.max(1, now - state.lastTime);
    state.velocity = ((event.clientY - state.lastY) / dt) * 1000;
    state.lastY = event.clientY;
    state.lastTime = now;
    state.moved ||= Math.abs(event.clientY - state.startY) > 4;
    if (!state.moved) return;
    const candidates = rows().filter(row => row !== state.row);
    const target = candidates.find(row => event.clientY < row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2);

    if (target) moveRow(state.row, target, true);
    else if (candidates.length) moveRow(state.row, candidates.at(-1), false);
    const baseTop = state.row.getBoundingClientRect().top - state.offset;
    state.offset = state.startTop + event.clientY - state.startY - baseTop;
    state.row.dataset.dragOffset = String(state.offset);
    state.row.style.transform = `translate3d(0, ${state.offset}px, 0)`;
    event.preventDefault();
  }

  function onPointerEnd(event) {
    if (!active || event.pointerId !== active.pointerId) return;
    const state = active;
    active = null;
    if (tbody.hasPointerCapture(event.pointerId)) tbody.releasePointerCapture(event.pointerId);
    const visualTop = state.row.getBoundingClientRect().top;
    if (event.type === "pointercancel") {
      const byName = new Map(rows().map(row => [row.dataset.period, row]));
      state.beforeOrder.forEach(name => { if (byName.has(name)) tbody.append(byName.get(name)); });
    } else if (state.moved) {
      persist(state.beforeOrder);
    }
    const baseTop = state.row.getBoundingClientRect().top - state.offset;
    state.row.dataset.dragOffset = String(visualTop - baseTop);
    state.row.style.transform = `translate3d(0, ${visualTop - baseTop}px, 0)`;
    finishMotion(state.row, state.velocity);
    event.preventDefault();
    event.stopPropagation();
  }

  function onKeyDown(event) {
    const direction = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    if (!direction) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    const row = event.currentTarget.closest("tr");
    const all = rows();
    const target = all[all.indexOf(row) + direction];
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    const beforeOrder = all.map(item => item.dataset.period);
    moveRow(row, target, direction < 0);
    persist(beforeOrder);
    event.currentTarget.focus();
  }

  function installHandles() {
    for (const row of lessons()) {
      const header = row.querySelector("th");
      if (!header || header.querySelector(".period-order-handle")) continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "period-order-handle";
      button.setAttribute("aria-label", `${row.dataset.period} 행 이동. 드래그하거나 위아래 화살표로 순서를 변경`);
      button.setAttribute("title", "끌어서 교시 행 이동");
      button.innerHTML = '<svg viewBox="0 0 16 20" aria-hidden="true"><circle cx="5" cy="4" r="1.2"/><circle cx="11" cy="4" r="1.2"/><circle cx="5" cy="10" r="1.2"/><circle cx="11" cy="10" r="1.2"/><circle cx="5" cy="16" r="1.2"/><circle cx="11" cy="16" r="1.2"/></svg>';
      button.addEventListener("pointerdown", onPointerDown);
      button.addEventListener("keydown", onKeyDown);
      button.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); });
      header.append(button);
    }
  }

  tbody.addEventListener("pointermove", onPointerMove);
  tbody.addEventListener("pointerup", onPointerEnd);
  tbody.addEventListener("pointercancel", onPointerEnd);
  window.TilePeriodOrder = { apply, normalizePeriodOrder };
  apply();
})();
