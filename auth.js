(() => {
  "use strict";

  const config = window.TILE_AUTH_CONFIG || {};
  const byId = (id) => document.getElementById(id);
  const nodes = {
    unavailable: byId("accountUnavailable"), signedOut: byId("accountSignedOut"), signedIn: byId("accountSignedIn"),
    googleSignIn: byId("googleSignIn"), setupGoogleSignIn: byId("setupGoogleSignIn"), lightframeEmailToggle: byId("lightframeEmailToggle"), lightframeEmailForm: byId("lightframeEmailForm"),
    lightframeEmail: byId("lightframeEmailInput"), lightframePassword: byId("lightframePasswordInput"),
    lightframeSignIn: byId("lightframePasswordSignIn"), lightframeSignUp: byId("lightframePasswordSignUp"), lightframeEmailMessage: byId("lightframeEmailMessage"),
    avatar: byId("accountAvatar"), displayName: byId("accountDisplayName"),
    email: byId("accountEmail"), message: byId("accountMessage"), backupStatus: byId("cloudBackupStatus"),
    backup: byId("backupCloudData"), restore: byId("restoreCloudData"), restorePanel: byId("restoreConfirmPanel"),
    restoreDescription: byId("restoreConfirmDescription"), cancelRestore: byId("cancelCloudRestore"),
    confirmRestore: byId("confirmCloudRestore"), signOut: byId("accountSignOut"), showDelete: byId("showDeleteAccount"),
    deletePanel: byId("deleteAccountPanel"), cancelDelete: byId("cancelDeleteAccount"), confirmDelete: byId("confirmDeleteAccount"),
    accountEntry: byId("accountSettingsToggle"), accountEntryStatus: byId("accountSettingsStatus"),
    googleStatus: byId("accountGoogleStatus"), emailStatus: byId("accountEmailStatus"),
    linkGoogle: byId("accountLinkGoogle"), linkEmail: byId("accountLinkEmail"), addPasswordForm: byId("accountAddPasswordForm"),
    newPassword: byId("accountNewPassword"), addPassword: byId("accountAddPassword"),
    methodsMessage: byId("accountMethodsMessage")
  };
  let client = null;
  let currentSession = null;
  let pendingRestore = null;
  const sessionSubscribers = new Set();
  const AUTH_RETURN_KEY = "tile-auth-return-location";
  const AUTH_LINK_KEY = "tile-auth-link-google";
  const AUTH_RESTORE_KEY = "tile-auth-restore-after-login";
  const AUTH_RESTORE_DONE_KEY = "tile-auth-restore-complete";
  const MAX_AUTH_RETURN_LENGTH = 20000;
  const CANONICAL_AUTH_ORIGIN = "https://tile0.vercel.app";

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
  function setEmailMessage(message = "", tone = "") {
    if (!nodes.lightframeEmailMessage) return;
    nodes.lightframeEmailMessage.textContent = message;
    nodes.lightframeEmailMessage.dataset.tone = tone;
  }
  function setMethodsMessage(message = "", tone = "") {
    if (!nodes.methodsMessage) return;
    nodes.methodsMessage.textContent = message;
    nodes.methodsMessage.dataset.tone = tone;
  }
  function setBusy(button, busy) {
    if (!button) return;
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
  }
  function authErrorMessage(error, fallback) {
    const message = String(error?.message || "");
    if (/identity.already.exists|identity.already.linked|already.linked.to.another.user/i.test(`${error?.code || ""} ${message}`)) {
      return "이 Google 계정은 다른 Lightframe 계정에 연결되어 있습니다. 두 계정의 백업은 자동으로 합쳐지지 않습니다.";
    }
    if (/manual.link|identity.linking/i.test(`${error?.code || ""} ${message}`)) {
      return "계정 연결이 꺼져 있습니다. Supabase 인증 설정에서 수동 계정 연결을 켜주세요.";
    }
    if (/load failed|failed to fetch|network|fetcherror|networkerror/i.test(message)) {
      return "계정 서버에 연결할 수 없습니다. 잠시 후 다시 시도하거나 인터넷 연결을 확인해주세요.";
    }
    return message || fallback;
  }
  async function checkAccountServer() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);
    try {
      // An opaque response is sufficient here: this only prevents navigation
      // when the project hostname cannot be reached at all.
      await fetch(`${config.supabaseUrl}/auth/v1/health`, {
        mode: "no-cors", cache: "no-store", signal: controller.signal
      });
    } catch (_error) {
      throw new Error("계정 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      window.clearTimeout(timeout);
    }
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

  function currentReturnLocation() {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  function getAuthRedirectUrl() {
    // OAuth callbacks need a registered HTTPS origin. A file preview has no
    // usable origin, so complete authentication on Tile's production site.
    const canReturnToCurrentOrigin = window.location.protocol === "https:"
      && window.location.origin === CANONICAL_AUTH_ORIGIN;
    return canReturnToCurrentOrigin
      ? `${window.location.origin}${window.location.pathname}`
      : `${CANONICAL_AUTH_ORIGIN}/`;
  }

  function readAuthReturnLocation() {
    const value = sessionStorage.getItem(AUTH_RETURN_KEY);
    if (!value || value.length > MAX_AUTH_RETURN_LENGTH || !value.startsWith("/") || value.startsWith("//")) return "";
    try {
      const target = new URL(value, window.location.origin);
      return target.origin === window.location.origin
        ? `${target.pathname}${target.search}${target.hash}`
        : "";
    } catch (_error) {
      return "";
    }
  }

  function restoreAuthReturnLocation() {
    const target = readAuthReturnLocation();
    sessionStorage.removeItem(AUTH_RETURN_KEY);
    if (!target || target === currentReturnLocation()) return false;
    window.location.replace(target);
    return true;
  }

  function consumeAuthError() {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.startsWith("#error=") ? url.hash.slice(1) : "");
    const errorCode = url.searchParams.get("error_code") || hashParams.get("error_code");
    if (!errorCode) return;
    const description = url.searchParams.get("error_description") || hashParams.get("error_description") || "인증 제공자 설정을 확인해주세요.";
    ["error", "error_code", "error_description", "sb"].forEach((key) => url.searchParams.delete(key));
    if (url.hash.startsWith("#error=")) url.hash = "";
    const returnLocation = readAuthReturnLocation();
    sessionStorage.removeItem(AUTH_RETURN_KEY);
    window.history.replaceState(null, "", returnLocation || `${url.pathname}${url.search}${url.hash}`);
    const wasLinking = sessionStorage.getItem(AUTH_LINK_KEY) === "1";
    sessionStorage.removeItem(AUTH_LINK_KEY);
    window.setTimeout(() => window.TileApp?.notify?.(
      wasLinking ? "Google 계정을 연결하지 못했습니다" : "Google 로그인을 완료하지 못했습니다",
      description.startsWith("Unable to exchange external code")
        ? "Google 로그인 연결 설정에 문제가 있습니다. 잠시 후 다시 시도하거나 관리자에게 알려주세요."
        : description,
      { tone: "error" }
    ), 0);
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
    const previousUserId = currentSession?.user?.id;
    currentSession = session;
    if (previousUserId !== session?.user?.id) {
      pendingRestore = null;
      setHidden(nodes.restorePanel, true);
      setMessage("");
    }
    setHidden(nodes.deletePanel, true);
    const user = session?.user;
    if (nodes.accountEntryStatus) {
      nodes.accountEntryStatus.textContent = user
        ? `${user.user_metadata?.full_name || user.user_metadata?.name || "로그인됨"} · 계정 관리`
        : "로그인 및 계정 관리";
    }
    setHidden(nodes.signedOut, Boolean(user));
    setHidden(nodes.signedIn, !user);
    setMethodsMessage("");
    sessionSubscribers.forEach((subscriber) => subscriber(session));
    if (!user) return;
    const name = user.user_metadata?.full_name || user.user_metadata?.name || "Lightframe. 사용자";
    if (nodes.avatar) nodes.avatar.textContent = getInitial(user);
    if (nodes.displayName) nodes.displayName.textContent = name;
    if (nodes.email) nodes.email.textContent = user.email || "Google 계정";
    if (await finishRestoreFlow()) return;
    await renderLoginMethods(user.id);
    await refreshBackupStatus();
  }

  async function renderLoginMethods(userId) {
    const { data, error } = await client.auth.getUserIdentities();
    if (currentSession?.user?.id !== userId) return;
    if (error) return setMethodsMessage(authErrorMessage(error, "로그인 방법을 확인하지 못했습니다."), "error");
    const identities = data?.identities || [];
    const hasGoogle = identities.some((identity) => identity.provider === "google");
    const hasEmail = identities.some((identity) => identity.provider === "email");
    if (nodes.googleStatus) nodes.googleStatus.textContent = hasGoogle ? "연결됨" : "연결하기";
    if (nodes.emailStatus) nodes.emailStatus.textContent = hasEmail ? "연결됨" : "연결하기";
    if (nodes.linkGoogle) {
      nodes.linkGoogle.disabled = hasGoogle;
      nodes.linkGoogle.dataset.linked = String(hasGoogle);
      nodes.linkGoogle.setAttribute("aria-label", hasGoogle ? "Google 연결됨" : "Google 연결하기");
      nodes.linkGoogle.title = hasGoogle ? "Google 연결됨" : "Google 연결하기";
    }
    if (nodes.linkEmail) {
      nodes.linkEmail.disabled = hasEmail;
      nodes.linkEmail.dataset.linked = String(hasEmail);
      nodes.linkEmail.setAttribute("aria-label", hasEmail ? "Lightframe 이메일 연결됨" : "Lightframe 이메일 연결하기");
      nodes.linkEmail.title = hasEmail ? "Lightframe 이메일 연결됨" : "Lightframe 이메일 연결하기";
    }
    if (hasEmail) {
      setHidden(nodes.addPasswordForm, true);
      nodes.linkEmail?.setAttribute("aria-expanded", "false");
    }
    if (sessionStorage.getItem(AUTH_LINK_KEY) === "1") {
      sessionStorage.removeItem(AUTH_LINK_KEY);
      setMethodsMessage(hasGoogle ? "Google 계정을 연결했습니다. 두 방법으로 같은 백업에 접근할 수 있습니다." : "Google 연결을 확인하지 못했습니다. 다시 시도해주세요.", hasGoogle ? "success" : "error");
    }
  }

  async function linkGoogleIdentity() {
    if (!client || !currentSession?.user) return;
    if (window.location.origin !== CANONICAL_AUTH_ORIGIN) {
      return setMethodsMessage("계정 연결은 배포된 Tile에서 진행해주세요.", "error");
    }
    setBusy(nodes.linkGoogle, true);
    setMethodsMessage("Google 계정 선택 화면으로 이동합니다.");
    sessionStorage.setItem(AUTH_LINK_KEY, "1");
    try {
      const { error } = await client.auth.linkIdentity({ provider: "google", options: { redirectTo: getAuthRedirectUrl(), queryParams: { prompt: "select_account" } } });
      if (error) throw error;
    } catch (error) {
      sessionStorage.removeItem(AUTH_LINK_KEY);
      setMethodsMessage(authErrorMessage(error, "Google 계정을 연결하지 못했습니다."), "error");
    } finally { setBusy(nodes.linkGoogle, false); }
  }

  async function addEmailPassword(event) {
    event?.preventDefault();
    if (!client || !currentSession?.user) return;
    const password = String(nodes.newPassword?.value || "");
    if (password.length < 8) return setMethodsMessage("비밀번호는 8자 이상으로 입력해주세요.", "error");
    setBusy(nodes.addPassword, true);
    setMethodsMessage("이메일 로그인 방법을 추가하고 있습니다.");
    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      if (nodes.newPassword) nodes.newPassword.value = "";
      await renderLoginMethods(currentSession.user.id);
      setMethodsMessage("이메일 로그인을 추가했습니다. 다음부터 같은 계정으로 로그인할 수 있습니다.", "success");
    } catch (error) {
      setMethodsMessage(authErrorMessage(error, "이메일 로그인을 추가하지 못했습니다."), "error");
    } finally { setBusy(nodes.addPassword, false); }
  }

  async function signInWithGoogle() {
    if (!client) {
      window.TileApp?.notify?.("계정 연결을 준비하고 있습니다", "잠시 후 다시 시도해주세요.");
      return;
    }
    if (nodes.googleSignIn?.disabled || nodes.setupGoogleSignIn?.disabled) return;
    setBusy(nodes.googleSignIn, true);
    setBusy(nodes.setupGoogleSignIn, true);
    try {
      await checkAccountServer();
      sessionStorage.setItem(AUTH_RETURN_KEY, currentReturnLocation());
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthRedirectUrl(), queryParams: { prompt: "select_account" } }
      });
      if (error) throw error;
    } catch (error) {
      sessionStorage.removeItem(AUTH_RETURN_KEY);
      window.TileApp?.notify?.("Google 로그인에 실패했습니다", authErrorMessage(error, "잠시 후 다시 시도해주세요."), { tone: "error" });
    } finally {
      setBusy(nodes.googleSignIn, false);
      setBusy(nodes.setupGoogleSignIn, false);
    }
  }

  function getEmailCredentials() {
    const email = String(nodes.lightframeEmail?.value || "").trim();
    const password = String(nodes.lightframePassword?.value || "");
    if (!email || !password) {
      setEmailMessage("이메일과 비밀번호를 입력해주세요.", "error");
      return null;
    }
    return { email, password };
  }

  async function signInWithLightframeAccount(event) {
    event?.preventDefault();
    if (!client) return;
    const credentials = getEmailCredentials();
    if (!credentials) return;
    setBusy(nodes.lightframeSignIn, true);
    setEmailMessage("Lightframe. 계정에 로그인하고 있습니다.");
    try {
      const { error } = await client.auth.signInWithPassword(credentials);
      if (error) throw error;
      setEmailMessage("");
    } catch (error) {
      setEmailMessage(authErrorMessage(error, "로그인하지 못했습니다. 다시 시도해주세요."), "error");
    } finally { setBusy(nodes.lightframeSignIn, false); }
  }

  async function signUpWithLightframeAccount() {
    if (!client) return;
    const credentials = getEmailCredentials();
    if (!credentials) return;
    if (credentials.password.length < 8) return setEmailMessage("비밀번호는 8자 이상으로 입력해주세요.", "error");
    setBusy(nodes.lightframeSignUp, true);
    setEmailMessage("Lightframe. 계정을 만들고 있습니다.");
    try {
    const { data, error } = await client.auth.signUp({
      ...credentials,
      options: { emailRedirectTo: getAuthRedirectUrl(), data: { full_name: "Lightframe. 사용자" } }
    });
    if (error) throw error;
    if (!data.session) {
      // Supabase can return an obfuscated user for an existing account.
      // A successful signUp response does not prove that an email was sent.
      setEmailMessage("계정 요청을 확인했습니다. 새 계정이면 인증 메일을 확인해주세요. 메일이 오지 않으면 기존 계정으로 로그인하거나 스팸함을 확인해주세요.", "success");
      return;
    }
    setEmailMessage("");
    } catch (error) {
      setEmailMessage(authErrorMessage(error, "계정을 만들지 못했습니다. 다시 시도해주세요."), "error");
    } finally { setBusy(nodes.lightframeSignUp, false); }
  }

  async function backupCurrentData() {
    if (!client || !currentSession?.user) return;
    try {
    const payload = window.TileApp?.createAccountBackup?.();
    if (!payload) return setMessage("백업할 Tile 데이터를 준비하지 못했습니다.", "error");
    setBusy(nodes.backup, true);
    setMessage("현재 데이터를 안전하게 백업하고 있습니다.");
    const updatedAt = new Date().toISOString();
    const { error } = await client.from("tile_backups").upsert({ user_id: currentSession.user.id, payload, updated_at: updatedAt }, { onConflict: "user_id" });
    if (error) throw error;
    if (nodes.backupStatus) nodes.backupStatus.textContent = formatDate(updatedAt);
    setMessage("현재 시간표를 Lightframe. 계정에 백업했습니다.", "success");
    window.TileApp?.notify?.("계정 백업 완료", "다른 기기에서 로그인해 불러올 수 있습니다.");
    } catch (error) {
      setMessage(error?.message || "백업하지 못했습니다. 다시 시도해주세요.", "error");
    } finally { setBusy(nodes.backup, false); }
  }

  async function prepareRestore({ applyImmediately = false } = {}) {
    if (!client || !currentSession?.user) return;
    const userId = currentSession.user.id;
    pendingRestore = null;
    setHidden(nodes.restorePanel, true);
    setBusy(nodes.restore, true);
    setMessage("클라우드 백업을 확인하고 있습니다.");
    try {
    const { data, error } = await client.from("tile_backups").select("payload, updated_at").eq("user_id", currentSession.user.id).maybeSingle();
    if (error) throw error;
    if (currentSession?.user?.id !== userId) return;
    if (!data?.payload) return setMessage("이 계정에 저장된 Tile 백업이 없습니다. 이 기기의 시간표는 그대로 유지됩니다.");
    pendingRestore = data.payload;
    if (applyImmediately) {
      if (typeof window.TileApp?.restoreAccountBackup !== "function") throw new Error("백업을 적용할 준비가 되지 않았습니다. 페이지를 새로고침해주세요.");
      sessionStorage.setItem(AUTH_RESTORE_DONE_KEY, "1");
      try { window.TileApp.restoreAccountBackup(pendingRestore); }
      catch (error) { sessionStorage.removeItem(AUTH_RESTORE_DONE_KEY); throw error; }
      return true;
    }
    const summary = data.payload.summary || {};
    const classroom = summary.grade && summary.classNum ? ` · ${summary.grade}학년 ${summary.classNum}반` : "";
    if (nodes.restoreDescription) {
      nodes.restoreDescription.textContent = `${formatDate(data.updated_at)} 백업 · ${summary.schoolName || "학교 미설정"}${classroom}. 현재 데이터는 되돌리기용으로 보관합니다.`;
    }
    setHidden(nodes.restorePanel, false);
    setMessage("적용할 백업 내용을 확인해주세요.");
    } catch (error) {
      setMessage(error?.message || "백업을 불러오지 못했습니다. 다시 시도해주세요.", "error");
    } finally { setBusy(nodes.restore, false); }
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
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setMessage(error?.message || "로그아웃하지 못했습니다. 다시 시도해주세요.", "error");
    } finally { setBusy(nodes.signOut, false); }
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
      window.TileApp?.notify?.("Lightframe. 계정을 삭제했습니다", "이 기기에 저장된 시간표는 유지됩니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "계정 삭제에 실패했습니다.", "error");
    } finally { setBusy(nodes.confirmDelete, false); }
  }

  function openAccountSettings() {
    byId("appSettingsToggle")?.click();
    window.setTimeout(() => {
      const accountTab = document.querySelector('[data-settings-target="accountSettings"]');
      accountTab?.click();
      accountTab?.focus({ preventScroll: true });
    }, 100);
  }

  async function finishRestoreFlow() {
    if (!currentSession?.user || sessionStorage.getItem(AUTH_RESTORE_KEY) !== "1") return;
    sessionStorage.removeItem(AUTH_RESTORE_KEY);
    openAccountSettings();
    const applied = await prepareRestore({ applyImmediately: true });
    window.setTimeout(() => {
      nodes.message?.scrollIntoView?.({ block: "nearest" });
    }, 180);
    return applied === true;
  }

  function startRestoreFlow() {
    sessionStorage.setItem(AUTH_RESTORE_KEY, "1");
    if (currentSession?.user) return finishRestoreFlow();
    openAccountSettings();
  }

  function bindEvents() {
    nodes.accountEntry?.addEventListener("click", openAccountSettings);
    nodes.googleSignIn?.addEventListener("click", signInWithGoogle);
    nodes.setupGoogleSignIn?.addEventListener("click", signInWithGoogle);
    nodes.lightframeEmailToggle?.addEventListener("click", () => {
      const isOpen = !nodes.lightframeEmailForm?.hidden;
      setHidden(nodes.lightframeEmailForm, isOpen);
      nodes.lightframeEmailToggle?.setAttribute("aria-expanded", String(!isOpen));
      if (!isOpen) window.setTimeout(() => nodes.lightframeEmail?.focus(), 0);
    });
    nodes.lightframeEmailForm?.addEventListener("submit", signInWithLightframeAccount);
    nodes.lightframeSignUp?.addEventListener("click", signUpWithLightframeAccount);
    nodes.backup?.addEventListener("click", backupCurrentData);
    nodes.restore?.addEventListener("click", prepareRestore);
    nodes.cancelRestore?.addEventListener("click", () => { pendingRestore = null; setHidden(nodes.restorePanel, true); setMessage(""); });
    nodes.confirmRestore?.addEventListener("click", confirmRestore);
    nodes.linkGoogle?.addEventListener("click", linkGoogleIdentity);
    nodes.linkEmail?.addEventListener("click", () => {
      if (!nodes.addPasswordForm || nodes.linkEmail?.disabled) return;
      const opening = nodes.addPasswordForm.hidden;
      setHidden(nodes.addPasswordForm, !opening);
      nodes.linkEmail.setAttribute("aria-expanded", String(opening));
      if (opening) nodes.newPassword?.focus();
    });
    nodes.addPasswordForm?.addEventListener("submit", addEmailPassword);
    nodes.signOut?.addEventListener("click", signOut);
    nodes.showDelete?.addEventListener("click", () => setHidden(nodes.deletePanel, false));
    nodes.cancelDelete?.addEventListener("click", () => setHidden(nodes.deletePanel, true));
    nodes.confirmDelete?.addEventListener("click", deleteAccount);
  }

  window.TileAuth = {
    getClient: () => client,
    getSession: () => currentSession,
    onSessionChange(subscriber) {
      if (typeof subscriber !== "function") return () => {};
      sessionSubscribers.add(subscriber);
      subscriber(currentSession);
      return () => sessionSubscribers.delete(subscriber);
    },
    openAccountSettings,
    startRestoreFlow
  };

  async function init() {
    bindEvents();
    consumeAuthError();
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
    if (data.session && restoreAuthReturnLocation()) return;
    await renderSession(data.session);
    if (sessionStorage.getItem(AUTH_RESTORE_DONE_KEY) === "1") {
      sessionStorage.removeItem(AUTH_RESTORE_DONE_KEY);
      if (data.session) window.TileApp?.notify?.("시간표를 불러왔습니다", "Lightframe. 계정의 백업을 이 기기에 적용했습니다.");
    }
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
