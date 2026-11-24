const ALLOWED_ORIGINS = new Set(["https://tile0.vercel.app", "https://justcallmelightt.github.io"]);
const EVENTS = new Set([
  "visit", "intro_view", "intro_skipped", "intro_start_clicked",
  "start_choices_view", "school_setup_view", "school_search_empty",
  "school_search_error", "school_selected", "class_entered", "school_times_view",
  "school_preview_ready", "school_setup_complete", "school_setup_error",
  "school_setup_closed", "manual_setup_complete", "manual_setup_error",
  "school_times_complete", "timetable_edit_complete", "after_school_add_complete", "auth_google_start", "auth_email_start",
  "auth_signup_requested", "auth_complete", "auth_session_seen", "auth_error", "backup_error"
]);
const REASONS = new Set(["validation", "network", "provider", "storage", "unknown"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface MetricsRequest {
  method?: string;
  headers: { origin?: string; "content-length"?: string };
  body?: unknown;
}
interface MetricsResponse {
  setHeader(name: string, value: string): void;
  status(code: number): MetricsResponse;
  json(body: Record<string, unknown>): MetricsResponse;
  end(): MetricsResponse;
}
declare const process: { env: Record<string, string | undefined> };

export default async function handler(request: MetricsRequest, response: MetricsResponse): Promise<MetricsResponse> {
  const origin = request.headers.origin;
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Vary", "Origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return response.status(403).json({ error: "Origin not allowed" });
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (request.method === "OPTIONS") return response.status(204).end();
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });

  const raw = typeof request.body === "string" ? request.body : JSON.stringify(request.body ?? null);
  if (raw.length > 512 || Number(request.headers["content-length"] || 0) > 512) {
    return response.status(413).json({ error: "Payload too large" });
  }
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    body = parsed as Record<string, unknown>;
  } catch { return response.status(400).json({ error: "Invalid body" }); }
  const visitorId = body.visitor_id;
  const sessionId = body.session_id;
  const event = body.event;
  const reason = body.reason;
  if (typeof visitorId !== "string" || !UUID.test(visitorId)
    || typeof sessionId !== "string" || !UUID.test(sessionId)
    || typeof event !== "string" || !EVENTS.has(event)
    || (reason !== undefined && (typeof reason !== "string" || !REASONS.has(reason)))) {
    return response.status(400).json({ error: "Invalid event" });
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !secretKey) return response.status(503).json({ error: "Metrics unavailable" });
  const upstream = await fetch(`${supabaseUrl}/rest/v1/tile_usage_events`, {
    method: "POST",
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ visitor_id: visitorId, session_id: sessionId,
      event_name: event, failure_reason: reason || null })
  }).catch(() => null);
  if (!upstream?.ok) {
    console.error("Tile metrics insert failed", upstream?.status || "network");
    return response.status(503).json({ error: "Metrics unavailable" });
  }
  return response.status(204).end();
}
