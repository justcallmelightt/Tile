(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const nodes = {
    toggle: byId("showcaseShareToggle"), bulkToggle: byId("shareBulkEditToggle"), modal: byId("showcaseShareModal"), close: byId("closeShowcaseShare"),
    title: byId("showcaseTitleInput"), description: byId("showcaseDescriptionInput"),
    scopeSchool: byId("shareScopeSchool"), scopeDetails: byId("shareScopeDetails"),
    scopeSubjectMemos: byId("shareScopeSubjectMemos"), scopeTileMemo: byId("shareScopeTileMemo"),
    creator: byId("shareCreatorPanel"), viewer: byId("shareViewerPanel"), manager: byId("shareManagerPanel"),
    loginNotice: byId("shareLoginNotice"), editDraft: byId("editShareDraft"),
    draftEditor: byId("shareDraftEditor"), draftGrid: byId("shareDraftGrid"), resetDraft: byId("resetShareDraft"),
    create: byId("createShowcaseShare"), openManager: byId("openShareManager"), backToCreator: byId("backToShareCreator"),
    managerList: byId("shareManagerList"), sharedTitle: byId("sharedShowcaseTitle"),
    sharedMeta: byId("sharedShowcaseMeta"), sharedDescription: byId("sharedShowcaseDescription"), sharedLink: byId("sharedShowcaseLink"),
    timetable: byId("sharedTimetableView"), memo: byId("sharedMemoView"),
    copy: byId("copyCurrentShare"), save: byId("saveSharedTimetable")
  };

  const IMPORT_KEYS = [
    "tile-cell-edits", "tile-schedule-edits", "tile-subject-info-edits", "tile-cell-info-edits",
    "tile-period-info-edits", "tile-custom-json", "tile_user", "tile-neis-sync-scope", "tile-subject-memos", "tile-memo-content"
  ];
  const USER_SNAPSHOT_KEYS = [...IMPORT_KEYS, "tile-meals", "tile-app-settings", "tile-neis-last-sync", "mirim-theme", "mirim-today-only"];
  const DAYS = ["월", "화", "수", "목", "금"];
  const COMPOSER_DRAFT_KEY = "tile-share-composer-draft";
  const PORTABLE_SHARE_HASH_KEY = "showcase";
  const MAX_PORTABLE_SHARE_LENGTH = 18000;
  let draft = null;
  let currentShare = null;
  let session = null;
  let restoredComposerState = null;
  let lastTrigger = null;
  let deleteArmedId = null;
  let deleteArmTimer = 0;

  function notify(title, detail = "", tone = "") {
    window.TileApp?.notify?.(title, detail, tone ? { tone } : {});
  }

  function setBusy(button, busy, busyLabel = "처리 중…") {
    if (!button) return;
    if (!button.dataset.idleLabel) button.dataset.idleLabel = button.textContent;
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
    button.textContent = busy ? busyLabel : button.dataset.idleLabel;
  }

  function readJson(key, fallback = {}) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (error) { console.error(error); return fallback; }
  }

  function safeText(value, limit = 160) {
    return String(value || "").trim().slice(0, limit);
  }

  function getCellKey(row, index) {
    return `${row.dataset.period || ""}_${index}`;
  }

  function captureDraft() {
    const user = readJson("tile_user", null);
    const cellInfo = readJson("tile-cell-info-edits");
    const subjectInfo = readJson("tile-subject-info-edits");
    const memos = readJson("tile-subject-memos");
    const rows = [...document.querySelectorAll("#timetable tbody tr[data-period]")].map((row) => {
      const time = safeText(row.querySelector(".time")?.textContent, 80);
      const cells = [...row.querySelectorAll("td")];
      const spanning = cells.length === 1 && cells[0].hasAttribute("colspan");
      return {
        period: safeText(row.dataset.period, 40), time, spanning,
        cells: spanning ? [{ subject: safeText(cells[0].textContent, 80), room: "", teacher: "", memo: "" }] : cells.slice(0, 5).map((cell, index) => {
          const subject = safeText(cell.dataset.subject || cell.querySelector(".subject-name")?.textContent, 100);
          const info = cellInfo[getCellKey(row, index)] || subjectInfo[subject] || {};
          return {
            subject,
            room: safeText(cell.dataset.neisRoom || info.room || cell.querySelector(".room-info")?.textContent?.replace(/^교실:\s*/, ""), 80),
            teacher: safeText(cell.dataset.neisTeacher || info.teacher || cell.querySelector(".teacher-info")?.textContent?.replace(/^선생님:\s*/, ""), 80),
            memo: safeText(memos[getCellKey(row, index)], 500)
          };
        })
      };
    });
    return {
      days: DAYS,
      school: user?.school?.name || "",
      grade: user?.grade || "",
      classNum: user?.classNum || "",
      department: user?.department || "",
      rows
    };
  }

  function resetDraft() {
    draft = captureDraft();
    renderDraftEditor();
    persistComposerState();
    notify("공유용 임시본을 되돌렸습니다", "현재 Tile 시간표를 다시 복사했습니다.");
  }

  function createDraftInput(label, value, limit, onInput, wide = false) {
    const wrapper = document.createElement("label");
    wrapper.className = `share-draft-field${wide ? " is-wide" : ""}`;
    const title = document.createElement("span");
    title.textContent = label;
    const input = document.createElement("input");
    input.value = value || "";
    input.maxLength = limit;
    input.addEventListener("input", () => { onInput(input.value); persistComposerState(); });
    wrapper.append(title, input);
    return wrapper;
  }

  function renderDraftEditor() {
    if (!nodes.draftGrid || !draft) return;
    nodes.draftGrid.replaceChildren();
    draft.rows.filter((row) => !row.spanning).forEach((row) => {
      const section = document.createElement("section");
      section.className = "share-draft-period";
      const heading = document.createElement("div");
      heading.className = "share-draft-period-heading";
      const strong = document.createElement("strong");
      strong.textContent = row.period;
      const time = document.createElement("span");
      time.textContent = row.time;
      heading.append(strong, time);
      const days = document.createElement("div");
      days.className = "share-draft-days";
      row.cells.forEach((cell, cellIndex) => {
        const card = document.createElement("article");
        card.className = "share-draft-cell";
        const day = document.createElement("strong");
        day.textContent = draft.days[cellIndex] || `${cellIndex + 1}일`;
        card.append(
          day,
          createDraftInput("과목", cell.subject, 100, (value) => { cell.subject = value; }, true),
          createDraftInput("교실", cell.room, 80, (value) => { cell.room = value; }),
          createDraftInput("선생님", cell.teacher, 80, (value) => { cell.teacher = value; }),
          createDraftInput("메모", cell.memo, 500, (value) => { cell.memo = value; }, true)
        );
        days.appendChild(card);
      });
      section.append(heading, days);
      nodes.draftGrid.appendChild(section);
    });
  }

  function getScopes() {
    return {
      school: Boolean(nodes.scopeSchool?.checked), details: Boolean(nodes.scopeDetails?.checked),
      subjectMemos: Boolean(nodes.scopeSubjectMemos?.checked), tileMemo: Boolean(nodes.scopeTileMemo?.checked)
    };
  }

  function composerState(resumeAfterLogin = restoredComposerState?.resumeAfterLogin || false) {
    return {
      version: 1,
      resumeAfterLogin: Boolean(resumeAfterLogin),
      title: safeText(nodes.title?.value, 60),
      description: safeText(nodes.description?.value, 240),
      scopes: getScopes(),
      draft: draft ? JSON.parse(JSON.stringify(draft)) : null,
      draftEditorOpen: Boolean(nodes.draftEditor && !nodes.draftEditor.hidden)
    };
  }

  function persistComposerState(resumeAfterLogin) {
    try {
      restoredComposerState = composerState(resumeAfterLogin);
      sessionStorage.setItem(COMPOSER_DRAFT_KEY, JSON.stringify(restoredComposerState));
    }
    catch (error) { console.error(error); }
  }

  function clearComposerState() {
    sessionStorage.removeItem(COMPOSER_DRAFT_KEY);
    restoredComposerState = null;
  }

  function restoreComposerState() {
    if (restoredComposerState) return restoredComposerState;
    try {
      const stored = JSON.parse(sessionStorage.getItem(COMPOSER_DRAFT_KEY) || "null");
      if (!stored || stored.version !== 1 || typeof stored !== "object") return null;
      restoredComposerState = stored;
      if (nodes.title) nodes.title.value = safeText(stored.title, 60);
      if (nodes.description) nodes.description.value = safeText(stored.description, 240);
      const scopes = stored.scopes || {};
      if (nodes.scopeSchool) nodes.scopeSchool.checked = Boolean(scopes.school);
      if (nodes.scopeDetails) nodes.scopeDetails.checked = Boolean(scopes.details);
      if (nodes.scopeSubjectMemos) nodes.scopeSubjectMemos.checked = Boolean(scopes.subjectMemos);
      if (nodes.scopeTileMemo) nodes.scopeTileMemo.checked = Boolean(scopes.tileMemo);
      if (stored.draft?.rows && Array.isArray(stored.draft.rows)) draft = stored.draft;
      return restoredComposerState;
    } catch (error) { console.error(error); sessionStorage.removeItem(COMPOSER_DRAFT_KEY); return null; }
  }

  function makeImportValues(scopes) {
    const values = {};
    IMPORT_KEYS.forEach((key) => { values[key] = localStorage.getItem(key); });
    if (!scopes.school) values.tile_user = null;
    if (!scopes.subjectMemos) values["tile-subject-memos"] = null;
    if (!scopes.tileMemo) values["tile-memo-content"] = null;

    const cellEdits = readJson("tile-cell-edits");
    const cellInfo = readJson("tile-cell-info-edits");
    const subjectMemos = readJson("tile-subject-memos");
    draft.rows.filter((row) => !row.spanning).forEach((row) => {
      row.cells.forEach((cell, index) => {
        const key = `${row.period}_${index}`;
        cellEdits[key] = safeText(cell.subject, 100);
        if (scopes.details && (cell.room || cell.teacher)) cellInfo[key] = { room: safeText(cell.room, 80), teacher: safeText(cell.teacher, 80) };
        else delete cellInfo[key];
        if (scopes.subjectMemos && cell.memo) subjectMemos[key] = safeText(cell.memo, 500);
        else delete subjectMemos[key];
      });
    });
    values["tile-cell-edits"] = JSON.stringify(cellEdits);
    values["tile-cell-info-edits"] = JSON.stringify(cellInfo);
    values["tile-subject-memos"] = scopes.subjectMemos ? JSON.stringify(subjectMemos) : null;
    return values;
  }

  function buildPayload() {
    if (!draft) draft = captureDraft();
    const scopes = getScopes();
    const presentation = JSON.parse(JSON.stringify(draft));
    if (!scopes.school) Object.assign(presentation, { school: "", grade: "", classNum: "", department: "" });
    presentation.rows.forEach((row) => row.cells.forEach((cell) => {
      if (!scopes.details) { cell.room = ""; cell.teacher = ""; }
      if (!scopes.subjectMemos) cell.memo = "";
    }));
    const tileMemo = scopes.tileMemo ? safeText(localStorage.getItem("tile-memo-content"), 4000) : "";
    return { version: 1, presentation, importValues: makeImportValues(scopes), tileMemo };
  }

  function showPanel(panel) {
    [nodes.creator, nodes.viewer, nodes.manager].forEach((item) => { if (item) item.hidden = item !== panel; });
  }

  function openModal(panel = nodes.creator) {
    if (!nodes.modal) return;
    lastTrigger = document.activeElement;
    showPanel(panel);
    nodes.modal.classList.remove("hidden");
    nodes.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => (panel === nodes.creator ? nodes.title : nodes.close)?.focus(), 80);
  }

  function closeModal() {
    nodes.modal?.classList.add("hidden");
    nodes.modal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastTrigger?.focus?.();
  }

  function openBulkEditor() {
    restoreComposerState();
    if (!draft) draft = captureDraft();
    if (nodes.draftEditor) nodes.draftEditor.hidden = false;
    if (nodes.editDraft) nodes.editDraft.textContent = "편집 닫기";
    renderDraftEditor();
    persistComposerState();
    openModal(nodes.creator);
  }

  function shareUrl(id) {
    const url = new URL(window.location.href);
    url.hash = "";
    url.searchParams.set("share", id);
    return url.toString();
  }

  function encodePortableShare(share) {
    const bytes = new TextEncoder().encode(JSON.stringify(share));
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function decodePortableShare(encoded) {
    if (!encoded || encoded.length > MAX_PORTABLE_SHARE_LENGTH) throw new Error("공유 링크가 비어 있거나 너무 깁니다.");
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const share = JSON.parse(new TextDecoder().decode(bytes));
    if (share?.version !== 1 || !share.payload?.presentation || !share.payload?.importValues) {
      throw new Error("Tile 공유 링크 형식이 아닙니다.");
    }
    return share;
  }

  function portableShareUrl(share) {
    const url = new URL(window.location.href);
    ["share", "error", "error_code", "error_description"].forEach((key) => url.searchParams.delete(key));
    url.hash = `${PORTABLE_SHARE_HASH_KEY}=${encodePortableShare(share)}`;
    if (url.toString().length > MAX_PORTABLE_SHARE_LENGTH) {
      throw new Error("공유 정보가 너무 많습니다. 메모 공개 범위를 줄인 뒤 다시 시도해주세요.");
    }
    return url.toString();
  }

  function currentShareUrl() {
    return currentShare?.url || (currentShare?.id ? shareUrl(currentShare.id) : "");
  }

  async function copyText(value, message = "공유 링크를 복사했습니다") {
    try { await navigator.clipboard.writeText(value); notify(message, "원하는 곳에 붙여넣어 전달할 수 있습니다."); }
    catch (error) { console.error(error); notify("링크를 복사하지 못했습니다", "브라우저의 클립보드 권한을 확인해주세요.", "error"); }
  }

  function renderTimetable(presentation) {
    nodes.timetable.replaceChildren();
    const scroll = document.createElement("div");
    scroll.className = "shared-timetable-scroll";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["교시", ...(presentation.days || DAYS)].forEach((label) => { const th = document.createElement("th"); th.textContent = label; headerRow.appendChild(th); });
    thead.appendChild(headerRow);
    const tbody = document.createElement("tbody");
    (presentation.rows || []).forEach((row) => {
      const tr = document.createElement("tr");
      const period = document.createElement("th");
      const strong = document.createElement("strong"); strong.textContent = row.period;
      const time = document.createElement("span"); time.textContent = row.time;
      period.append(strong, time); tr.appendChild(period);
      if (row.spanning) {
        const td = document.createElement("td"); td.colSpan = 5; td.className = "shared-special-cell"; td.textContent = row.cells?.[0]?.subject || row.period; tr.appendChild(td);
      } else {
        (row.cells || []).slice(0, 5).forEach((cell) => {
          const td = document.createElement("td");
          if (!cell.subject) td.className = "shared-empty-cell";
          else {
            const subject = document.createElement("strong"); subject.textContent = cell.subject; td.appendChild(subject);
            const detail = [cell.room, cell.teacher].filter(Boolean).join(" · ");
            if (detail) { const meta = document.createElement("span"); meta.textContent = detail; td.appendChild(meta); }
            if (cell.memo) { const memo = document.createElement("small"); memo.textContent = cell.memo; td.appendChild(memo); }
          }
          tr.appendChild(td);
        });
      }
      tbody.appendChild(tr);
    });
    table.append(thead, tbody); scroll.appendChild(table); nodes.timetable.appendChild(scroll);
  }

  function renderShare(share) {
    currentShare = share;
    const payload = share?.payload || {};
    const presentation = payload.presentation || {};
    nodes.sharedTitle.textContent = safeText(share.title, 60) || "공유 시간표";
    const classText = presentation.grade && presentation.classNum ? `${presentation.grade}학년 ${presentation.classNum}반` : "";
    nodes.sharedMeta.textContent = [presentation.school, classText, presentation.department].filter(Boolean).join(" · ") || "Tile 공유 프리셋";
    const description = safeText(share.description, 240);
    nodes.sharedDescription.textContent = description;
    nodes.sharedDescription.hidden = !description;
    if (nodes.sharedLink) nodes.sharedLink.value = share?.url || (share?.id ? shareUrl(share.id) : window.location.href);
    renderTimetable(presentation);
    nodes.memo.hidden = !payload.tileMemo;
    nodes.memo.textContent = payload.tileMemo ? `공유 메모 · ${payload.tileMemo}` : "";
    showPanel(nodes.viewer);
  }

  async function createShare() {
    const client = window.TileAuth?.getClient?.();
    const activeSession = window.TileAuth?.getSession?.();
    const title = safeText(nodes.title?.value, 60);
    if (!title) { nodes.title?.focus(); return notify("공유 페이지 이름을 입력해주세요", "학교와 학급을 알아보기 쉬운 이름이 좋습니다."); }
    setBusy(nodes.create, true, "게시 준비 중…");
    const scopes = getScopes();
    const record = { title, description: safeText(nodes.description?.value, 240), payload: buildPayload(), scopes };
    if (!client || !activeSession?.user) {
      try {
        const portableShare = { version: 1, ...record, created_at: new Date().toISOString() };
        portableShare.url = portableShareUrl(portableShare);
        clearComposerState();
        renderShare(portableShare);
        window.history.replaceState(null, "", portableShare.url);
        notify("공유 링크를 만들었습니다", "로그인 없이 사용할 수 있습니다. 로그인 후 만든 링크만 관리 목록에 저장됩니다.");
      } catch (error) {
        notify("공유 링크를 만들지 못했습니다", error instanceof Error ? error.message : "공유 정보를 확인해주세요.", "error");
      } finally { setBusy(nodes.create, false); }
      return;
    }
    record.owner_id = activeSession.user.id;
    const { data, error } = await client.from("tile_timetable_shares").insert(record).select("id,title,description,payload,scopes,is_active,created_at,updated_at").single();
    setBusy(nodes.create, false);
    if (error) return notify("공유 링크를 만들지 못했습니다", error.message, "error");
    clearComposerState();
    renderShare(data);
    window.history.replaceState(null, "", shareUrl(data.id));
    notify("공유 프리셋을 게시했습니다", "원본 Tile은 변경되지 않았습니다.");
  }

  function managerButton(label, action, className = "") {
    const button = document.createElement("button"); button.type = "button"; button.textContent = label;
    button.className = `secondary-action ${className}`.trim(); button.addEventListener("click", action); return button;
  }

  async function loadManager() {
    const client = window.TileAuth?.getClient?.();
    const activeSession = window.TileAuth?.getSession?.();
    if (!client || !activeSession?.user) {
      persistComposerState(true);
      closeModal();
      window.TileAuth?.openAccountSettings?.();
      notify("로그인 후 이어서 관리할 수 있습니다", "작성 중인 공유 정보는 그대로 보관했습니다.");
      return;
    }
    showPanel(nodes.manager); nodes.managerList.textContent = "공유 링크를 불러오는 중입니다…";
    const { data, error } = await client.from("tile_timetable_shares").select("id,title,description,is_active,created_at,updated_at").order("created_at", { ascending: false });
    if (error) { nodes.managerList.textContent = "공유 링크를 불러오지 못했습니다."; return notify("관리 목록을 열지 못했습니다", error.message, "error"); }
    nodes.managerList.replaceChildren();
    if (!data?.length) { const empty = document.createElement("div"); empty.className = "share-manager-empty"; empty.textContent = "아직 만든 공유 링크가 없습니다."; nodes.managerList.appendChild(empty); return; }
    data.forEach((item) => {
      const card = document.createElement("article"); card.className = `share-manager-item${item.is_active ? "" : " is-disabled"}`;
      const info = document.createElement("div"); const title = document.createElement("strong"); title.textContent = item.title;
      const meta = document.createElement("span"); meta.textContent = `${item.is_active ? "공개 중" : "공개 중지"} · ${new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(new Date(item.created_at))}`;
      info.append(title, meta);
      const actions = document.createElement("div"); actions.className = "share-manager-actions";
      actions.append(
        managerButton("복사", () => copyText(shareUrl(item.id))),
        managerButton(item.is_active ? "공개 중지" : "다시 공개", async (event) => {
          setBusy(event.currentTarget, true); const { error: updateError } = await client.from("tile_timetable_shares").update({ is_active: !item.is_active, updated_at: new Date().toISOString() }).eq("id", item.id);
          if (updateError) { setBusy(event.currentTarget, false); return notify("공개 상태를 바꾸지 못했습니다", updateError.message, "error"); }
          loadManager();
        }),
        managerButton("삭제", async (event) => {
          if (deleteArmedId !== item.id) {
            deleteArmedId = item.id; event.currentTarget.textContent = "한 번 더 눌러 삭제";
            window.clearTimeout(deleteArmTimer); deleteArmTimer = window.setTimeout(() => { deleteArmedId = null; loadManager(); }, 4000); return;
          }
          setBusy(event.currentTarget, true, "삭제 중…");
          const { error: deleteError } = await client.from("tile_timetable_shares").delete().eq("id", item.id);
          deleteArmedId = null;
          if (deleteError) return notify("공유 링크를 삭제하지 못했습니다", deleteError.message, "error");
          notify("공유 링크를 삭제했습니다", "이 링크는 더 이상 열리지 않습니다."); loadManager();
        }, "danger-action")
      );
      card.append(info, actions); nodes.managerList.appendChild(card);
    });
  }

  function validatedImportValues(values) {
    if (!values || typeof values !== "object" || Array.isArray(values)) throw new Error("가져올 설정이 없습니다.");
    const result = {}; let length = 0;
    IMPORT_KEYS.forEach((key) => {
      const value = Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null;
      if (value !== null && typeof value !== "string") throw new Error("공유 설정 형식이 올바르지 않습니다.");
      if (typeof value === "string") { length += value.length; if (key !== "tile-neis-sync-scope" && key !== "tile-memo-content") JSON.parse(value); }
      result[key] = value;
    });
    if (length > 150000) throw new Error("공유 설정이 너무 큽니다.");
    return result;
  }

  function saveSharedTimetable() {
    try {
      const values = validatedImportValues(currentShare?.payload?.importValues);
      const snapshot = { label: "공유 시간표 적용 전", createdAt: new Date().toISOString(), values: {} };
      USER_SNAPSHOT_KEYS.forEach((key) => { snapshot.values[key] = localStorage.getItem(key); });
      localStorage.setItem("tile-last-undo", JSON.stringify(snapshot));
      IMPORT_KEYS.forEach((key) => { const value = values[key]; if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); });
      sessionStorage.setItem("tile-session-toast", JSON.stringify({ title: "공유 시간표를 저장했습니다", detail: "내 Tile에 적용했어요. 설정에서 되돌릴 수 있습니다." }));
      const url = new URL(window.location.href);
      url.searchParams.delete("share");
      const hashParams = new URLSearchParams(url.hash.slice(1));
      if (hashParams.has(PORTABLE_SHARE_HASH_KEY)) url.hash = "";
      window.location.replace(url.toString());
    } catch (error) { notify("시간표를 저장하지 못했습니다", error instanceof Error ? error.message : "공유 데이터를 확인해주세요.", "error"); }
  }

  async function loadIncomingShare() {
    const encoded = new URLSearchParams(window.location.hash.slice(1)).get(PORTABLE_SHARE_HASH_KEY);
    if (encoded) {
      try {
        const share = decodePortableShare(encoded);
        share.url = window.location.href;
        renderShare(share);
        openModal(nodes.viewer);
      } catch (error) {
        notify("공유 링크를 열지 못했습니다", error instanceof Error ? error.message : "링크가 손상되었습니다.", "error");
      }
      return;
    }
    const id = new URLSearchParams(window.location.search).get("share");
    if (!id) return;
    openModal(nodes.viewer);
    nodes.sharedMeta.textContent = "공유 프리셋을 불러오는 중입니다.";
    try {
      const response = await fetch(`/api/share?id=${encodeURIComponent(id)}`, { headers: { Accept: "application/json" } });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(response.status === 404 ? "공개가 중지되었거나 삭제된 링크입니다." : body.error || "공유 링크를 불러오지 못했습니다.");
      renderShare(body.share);
    } catch (error) {
      nodes.sharedTitle.textContent = "공유 링크를 열 수 없습니다";
      nodes.sharedMeta.textContent = error instanceof Error ? error.message : "잠시 후 다시 시도해주세요.";
      nodes.timetable.replaceChildren(); nodes.save.disabled = true;
    }
  }

  function bindEvents() {
    nodes.toggle?.addEventListener("click", () => { restoreComposerState(); if (!draft) draft = captureDraft(); renderDraftEditor(); openModal(nodes.creator); });
    nodes.bulkToggle?.addEventListener("click", () => {
      document.getElementById("toolMenu")?.classList.remove("is-open");
      document.getElementById("toolMenuToggle")?.setAttribute("aria-expanded", "false");
      document.getElementById("toolMenuPanel")?.setAttribute("aria-hidden", "true");
      openBulkEditor();
    });
    nodes.close?.addEventListener("click", () => { persistComposerState(); closeModal(); });
    nodes.modal?.addEventListener("pointerdown", (event) => { if (event.target === nodes.modal) nodes.modal.dataset.dismissCandidate = "true"; });
    nodes.modal?.addEventListener("pointerup", (event) => { const shouldClose = event.target === nodes.modal && nodes.modal.dataset.dismissCandidate === "true"; delete nodes.modal.dataset.dismissCandidate; if (shouldClose) { persistComposerState(); closeModal(); } });
    nodes.modal?.addEventListener("pointercancel", () => { delete nodes.modal.dataset.dismissCandidate; });
    nodes.editDraft?.addEventListener("click", () => { if (!draft) draft = captureDraft(); const opening = nodes.draftEditor.hidden; nodes.draftEditor.hidden = !opening; nodes.editDraft.textContent = opening ? "편집 닫기" : "시간표 일괄 편집"; if (opening) renderDraftEditor(); persistComposerState(); });
    nodes.resetDraft?.addEventListener("click", resetDraft);
    nodes.create?.addEventListener("click", createShare);
    nodes.openManager?.addEventListener("click", loadManager);
    nodes.backToCreator?.addEventListener("click", () => showPanel(nodes.creator));
    nodes.copy?.addEventListener("click", () => { const url = currentShareUrl(); if (url) copyText(url); });
    nodes.save?.addEventListener("click", saveSharedTimetable);
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !nodes.modal?.classList.contains("hidden")) { persistComposerState(); closeModal(); } });
    [nodes.title, nodes.description].forEach((input) => input?.addEventListener("input", persistComposerState));
    [nodes.scopeSchool, nodes.scopeDetails, nodes.scopeSubjectMemos, nodes.scopeTileMemo].forEach((input) => input?.addEventListener("change", persistComposerState));
    window.TileAuth?.onSessionChange?.((nextSession) => {
      session = nextSession;
      if (nodes.loginNotice) nodes.loginNotice.hidden = Boolean(session?.user);
      const state = restoreComposerState();
      if (session?.user && state?.resumeAfterLogin) {
        if (state.draftEditorOpen && nodes.draftEditor) {
          nodes.draftEditor.hidden = false;
          nodes.editDraft.textContent = "편집 닫기";
          renderDraftEditor();
        }
        state.resumeAfterLogin = false;
        sessionStorage.setItem(COMPOSER_DRAFT_KEY, JSON.stringify(state));
        openModal(nodes.creator);
        notify("작성 중이던 공유를 복원했습니다", "로그인 전 입력한 제목, 소개, 공개 범위와 임시 시간표를 그대로 이어서 작성할 수 있습니다.");
      }
    });
    const initialSession = window.TileAuth?.getSession?.();
    if (initialSession) {
      session = initialSession;
      if (nodes.loginNotice) nodes.loginNotice.hidden = true;
      const state = restoreComposerState();
      if (state?.resumeAfterLogin) {
        if (state.draftEditorOpen && nodes.draftEditor) {
          nodes.draftEditor.hidden = false;
          nodes.editDraft.textContent = "편집 닫기";
          renderDraftEditor();
        }
        state.resumeAfterLogin = false;
        sessionStorage.setItem(COMPOSER_DRAFT_KEY, JSON.stringify(state));
        openModal(nodes.creator);
        notify("작성 중이던 공유를 복원했습니다", "로그인 전 입력한 제목, 소개, 공개 범위와 임시 시간표를 그대로 이어서 작성할 수 있습니다.");
      }
    }
  }

  bindEvents();
  loadIncomingShare();
})();
