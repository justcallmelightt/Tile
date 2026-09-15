(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const dialog = byId("timetableManagementDialog");
  const openButton = byId("timetableManagementToggle");
  const closeButton = byId("timetableManagementClose");

  function closeToolMenu() {
    byId("toolMenu")?.classList.remove("is-open");
    byId("toolMenuToggle")?.setAttribute("aria-expanded", "false");
    byId("toolMenuPanel")?.setAttribute("aria-hidden", "true");
  }

  function closeStudio() {
    if (dialog?.open) dialog.close();
  }

  openButton?.addEventListener("click", () => {
    closeToolMenu();
    dialog?.showModal();
  });

  closeButton?.addEventListener("click", closeStudio);
  dialog?.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeStudio();
  });
  dialog?.addEventListener("close", () => openButton?.focus());
  dialog?.addEventListener("keydown", (event) => event.stopPropagation());

  function startTimetableEditing() {
    closeStudio();
    const timetable = byId("timetable");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timetable?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    timetable?.classList.add("is-management-target");
    window.setTimeout(() => timetable?.classList.remove("is-management-target"), 1400);
    window.TileApp?.notify?.("수정할 수업을 선택하세요", "한 칸을 수정하거나 같은 과목을 한 번에 바꿀 수 있습니다.");
  }

  byId("timetableEditToggle")?.addEventListener("click", startTimetableEditing);

  byId("personalPresetsOpen")?.addEventListener("click", closeStudio, { capture: true });

  byId("managementAfterSchool")?.addEventListener("click", () => {
    closeStudio();
    byId("afterSchoolOpen")?.click();
  });
})();
