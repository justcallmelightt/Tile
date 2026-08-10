(() => {
  "use strict";

  const config = window.TILE_AUTH_CONFIG || {};
  const byId = (id) => document.getElementById(id);
  const nodes = {
    unavailable: byId("accountUnavailable"), signedOut: byId("accountSignedOut"), signedIn: byId("accountSignedIn"),
    googleSignIn: byId("googleSignIn"), avatar: byId("accountAvatar"), displayName: byId("accountDisplayName"),
    email: byId("accountEmail"), message: byId("accountMessage"), backupStatus: byId("cloudBackupStatus"),
    backup: byId("backupCloudData"), restore: byId("restoreCloudData"), restorePanel: byId("restoreConfirmPanel"),
    restoreDescription: byId("restoreConfirmDescription"), cancelRestore: byId("cancelCloudRestore"),
    confirmRestore: byId("confirmCloudRestore"), signOut: byId("accountSignOut"), showDelete: byId("showDeleteAccount"),
    deletePanel: byId("deleteAccountPanel"), cancelDelete: byId("cancelDeleteAccount"), confirmDelete: byId("confirmDeleteAccount")
  };
  let client = null;
  let currentSession = null;
  let pendingRestore = null;

  function isConfigured() {
    return /^https:\/\/.+\.supabase\.co$/i.test(config.supabaseUrl || "")
      && typeof config.supabasePublishableKey === "string"
      && config.supabasePublishableKey.length > 20;
  }

  function loadSupabaseClient() {
    if (window.supabase?.createClient) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.8/dist/umd/supabase.min.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", () => reject(new Error("계정 연결 모듈을 불러오지 못했습니다.")), { once: true });
      document.head.appendChild(script);
    });
  }

  function setHidden(element, hidden) { if (element) element.hidden = hidden; }
  function setMessage(message = "", tone = "") {
    if (!nodes.message) return;
    nodes.message.textContent = message;
    nodes.message.dataset.tone = tone;
  }
  function setBusy(button, busy) {
    if (!button) return;
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
  }
  function formatDate(value) {
    if (!value) return "백업 없음";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "확인할 수 없음";
    return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
  }
  function getInitial(user) {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "T";
    return String(name).trim().slice(0, 1).toUpperCase() || "T";
  }

  async function refreshBackupStatus() {
    if (!client || !currentSession?.user) return;
    const { data, error } = await client.from("tile_backups").select("updated_at").eq("user_id", currentSession.user.id).maybeSingle();
    if (error) {
      if (nodes.backupStatus) nodes.backupStatus.textContent = "확인 실패";
      return;
    }
    if (nodes.backupStatus) nodes.backupStatus.textContent = formatDate(data?.updated_at);
  }

  async function renderSession(session) {
    currentSession = session;
    pendingRestore = null;
    setHidden(nodes.restorePanel, true);
    setHidden(nodes.deletePanel, true);
    const user = session?.user;
    setHidden(nodes.signedOut, Boolean(user));
    setHidden(nodes.signedIn, !user);
    if (!user) return;
    const name = user.user_metadata?.full_name || user.user_metadata?.name || "Tile 사용자";
    if (nodes.avatar) nodes.avatar.textContent = getInitial(user);
    if (nodes.displayName) nodes.displayName.textContent = name;
    if (nodes.email) nodes.email.textContent = user.email || "Google 계정";
    setMessage("");
    await refreshBackupStatus();
  }

  async function signInWithGoogle() {
    if (!client) return;
    setBusy(nodes.googleSignIn, true);
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${window.location.pathname}`, queryParams: { prompt: "select_account" } }
    });
    if (error) {
      setBusy(nodes.googleSignIn, false);
      window.TileApp?.notify?.("Google 로그인에 실패했습니다", error.message, { tone: "error" });
    }
  }

  async function backupCurrentData() {
    if (!client || !currentSession?.user) return;
    const payload = window.TileApp?.createAccountBackup?.();
    if (!payload) return setMessage("백업할 Tile 데이터를 준비하지 못했습니다.", "error");
    setBusy(nodes.backup, true);
    setMessage("현재 데이터를 안전하게 백업하고 있습니다.");
    const updatedAt = new Date().toISOString();
    const { error } = await client.from("tile_backups").upsert({ user_id: currentSession.user.id, payload, updated_at: updatedAt }, { onConflict: "user_id" });
    setBusy(nodes.backup, false);
    if (error) return setMessage(error.message, "error");
    if (nodes.backupStatus) nodes.backupStatus.textContent = formatDate(updatedAt);
    setMessage("현재 시간표를 Tile 계정에 백업했습니다.", "success");
    window.TileApp?.notify?.("계정 백업 완료", "다른 기기에서 로그인해 불러올 수 있습니다.");
  }

  async function prepareRestore() {
    if (!client || !currentSession?.user) return;
    setBusy(nodes.restore, true);
    setMessage("클라우드 백업을 확인하고 있습니다.");
    const { data, error } = await client.from("tile_backups").select("payload, updated_at").eq("user_id", currentSession.user.id).maybeSingle();
    setBusy(nodes.restore, false);
    if (error) return setMessage(error.message, "error");
    if (!data?.payload) return setMessage("이 계정에 저장된 Tile 백업이 없습니다.");
    pendingRestore = data.payload;
    const summary = data.payload.summary || {};
    const classroom = summary.grade && summary.classNum ? ` · ${summary.grade}학년 ${summary.classNum}반` : "";
    if (nodes.restoreDescription) {
      nodes.restoreDescription.textContent = `${formatDate(data.updated_at)} 백업 · ${summary.schoolName || "학교 미설정"}${classroom}. 현재 데이터는 되돌리기용으로 보관합니다.`;
    }
    setHidden(nodes.restorePanel, false);
    setMessage("적용할 백업 내용을 확인해주세요.");
  }

  function confirmRestore() {
    if (!pendingRestore) return;
    setBusy(nodes.confirmRestore, true);
    try { window.TileApp?.restoreAccountBackup?.(pendingRestore); }
    catch (error) {
      setBusy(nodes.confirmRestore, false);
      setMessage(error instanceof Error ? error.message : "백업 복원에 실패했습니다.", "error");
    }
  }

  async function signOut() {
    if (!client) return;
    setBusy(nodes.signOut, true);
    const { error } = await client.auth.signOut();
    setBusy(nodes.signOut, false);
    if (error) setMessage(error.message, "error");
  }

  async function deleteAccount() {
    if (!currentSession?.access_token) return;
    setBusy(nodes.confirmDelete, true);
    setMessage("계정과 클라우드 백업을 삭제하고 있습니다.");
    try {
      const response = await fetch("/api/account", { method: "DELETE", headers: { Authorization: `Bearer ${currentSession.access_token}` } });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "계정을 삭제하지 못했습니다.");
      await client.auth.signOut({ scope: "local" });
      setHidden(nodes.deletePanel, true);
      window.TileApp?.notify?.("Tile 계정을 삭제했습니다", "이 기기에 저장된 시간표는 유지됩니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "계정 삭제에 실패했습니다.", "error");
    } finally { setBusy(nodes.confirmDelete, false); }
  }

  function bindEvents() {
    nodes.googleSignIn?.addEventListener("click", signInWithGoogle);
    nodes.backup?.addEventListener("click", backupCurrentData);
    nodes.restore?.addEventListener("click", prepareRestore);
    nodes.cancelRestore?.addEventListener("click", () => { pendingRestore = null; setHidden(nodes.restorePanel, true); setMessage(""); });
    nodes.confirmRestore?.addEventListener("click", confirmRestore);
    nodes.signOut?.addEventListener("click", signOut);
    nodes.showDelete?.addEventListener("click", () => setHidden(nodes.deletePanel, false));
    nodes.cancelDelete?.addEventListener("click", () => setHidden(nodes.deletePanel, true));
    nodes.confirmDelete?.addEventListener("click", deleteAccount);
  }

  async function init() {
    bindEvents();
    if (!isConfigured()) {
      setHidden(nodes.unavailable, false);
      setHidden(nodes.signedOut, true);
      setHidden(nodes.signedIn, true);
      return;
    }
    setHidden(nodes.unavailable, true);
    await loadSupabaseClient();
    if (!window.supabase?.createClient) throw new Error("계정 연결 모듈을 초기화하지 못했습니다.");
    client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    await renderSession(data.session);
    client.auth.onAuthStateChange((_event, session) => window.setTimeout(() => renderSession(session), 0));
  }

  init().catch((error) => {
    console.error("Tile account initialization failed", error);
    setHidden(nodes.unavailable, false);
    if (nodes.unavailable) {
      nodes.unavailable.querySelector("strong").textContent = "계정 연결 실패";
      nodes.unavailable.querySelector("span").textContent = error.message || "잠시 후 다시 시도해주세요.";
    }
  });
})();
