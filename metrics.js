(() => {
  "use strict";
  const productionHosts = new Set(["tile0.vercel.app", "justcallmelightt.github.io"]);
  if (!productionHosts.has(location.hostname) || !crypto?.randomUUID) {
    window.TileMetrics = { track() {} };
    return;
  }

  const events = new Set([
    "visit", "intro_view", "intro_skipped", "intro_start_clicked",
    "start_choices_view", "school_setup_view", "school_search_empty",
    "school_search_error", "school_selected", "class_entered", "school_times_view",
    "school_preview_ready", "school_setup_complete", "school_setup_error",
    "school_setup_closed", "manual_setup_complete", "manual_setup_error",
    "school_times_complete", "timetable_edit_complete", "after_school_add_complete", "auth_google_start", "auth_email_start",
    "auth_signup_requested", "auth_complete", "auth_session_seen", "auth_error", "backup_error"
  ]);
  const reasons = new Set(["validation", "network", "provider", "storage", "unknown"]);
  const endpoint = location.hostname === "tile0.vercel.app"
    ? "/api/metrics" : "https://tile0.vercel.app/api/metrics";
  const visitorKey = "tile-metrics-visitor-v1";
  const sessionKey = "tile-metrics-session-v1";

  function identifier(storage, key) {
    try {
      const existing = storage.getItem(key);
      if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
      const created = crypto.randomUUID();
      storage.setItem(key, created);
      return created;
    } catch { return crypto.randomUUID(); }
  }

  const visitorId = identifier(localStorage, visitorKey);
  const sessionId = identifier(sessionStorage, sessionKey);
  const sentOnce = new Set();
  function track(event, options = {}) {
    if (!events.has(event)) return;
    const onceKey = options.once ? `${event}:${sessionId}` : "";
    let alreadySent = false;
    if (onceKey) {
      try { alreadySent = Boolean(sessionStorage.getItem(`tile-metrics-once:${onceKey}`)); } catch { /* Storage may be unavailable. */ }
    }
    if (onceKey && (sentOnce.has(onceKey) || alreadySent)) return;
    if (onceKey) sentOnce.add(onceKey);
    if (onceKey) {
      try { sessionStorage.setItem(`tile-metrics-once:${onceKey}`, "1"); } catch { /* Private browsing may block storage. */ }
    }
    const reason = reasons.has(options.reason) ? options.reason : undefined;
    const body = JSON.stringify({ visitor_id: visitorId, session_id: sessionId, event, reason });
    fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body, keepalive: true, credentials: "omit"
    }).catch(() => {});
  }

  window.TileMetrics = { track };
  track("visit", { once: true });
})();
