const ALLOWED_ORIGINS = new Set([
  "https://justcallmelightt.github.io",
  "https://tile0.vercel.app",
  "http://localhost:5506",
  "http://127.0.0.1:5506"
]);
const PREVIEW_ORIGIN = /^https:\/\/tile-[a-z0-9-]+-justgivemethespotlights-projects\.vercel\.app$/;
const ANONYMOUS_SHARE_TTL_DAYS = 30;
const ANONYMOUS_SHARE_HOURLY_LIMIT = 5;

interface ShareRequest {
  method?: string;
  headers: { origin?: string; "x-forwarded-for"?: string; "x-real-ip"?: string };
  query: { id?: string | string[] };
  body?: unknown;
}

interface ShareResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ShareResponse;
  json(body: Record<string, unknown>): ShareResponse;
  end(): ShareResponse;
}

declare const process: { env: Record<string, string | undefined> };

function setHeaders(request: ShareRequest, response: ShareResponse): void {
  const origin = request.headers.origin;
  const allowedOrigin = origin && (ALLOWED_ORIGINS.has(origin) || PREVIEW_ORIGIN.test(origin)) ? origin : "https://tile0.vercel.app";
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Cache-Control", "private, no-store, max-age=0");
  response.setHeader("Vary", "Origin");
}

function isAllowedWriteOrigin(origin?: string): boolean {
  return Boolean(origin && (ALLOWED_ORIGINS.has(origin) || PREVIEW_ORIGIN.test(origin)));
}

function safeString(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function parseAnonymousShare(body: unknown): Record<string, unknown> | null {
  const input = typeof body === "string" ? (() => { try { return JSON.parse(body) as unknown; } catch { return null; } })() : body;
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  const title = safeString(record.title, 60);
  const description = safeString(record.description, 240);
  const payload = record.payload;
  const scopes = record.scopes;
  if (!title || !payload || typeof payload !== "object" || Array.isArray(payload) || !scopes || typeof scopes !== "object" || Array.isArray(scopes)) return null;
  const serialized = JSON.stringify({ title, description, payload, scopes });
  if (serialized.length > 150000) return null;
  return { title, description, payload, scopes };
}

async function anonymousKey(request: ShareRequest, secretKey: string): Promise<string> {
  const forwarded = request.headers["x-forwarded-for"]?.split(",")[0]?.trim();
  const address = forwarded || request.headers["x-real-ip"] || "unknown";
  const data = new TextEncoder().encode(`${secretKey}:${address}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function createAnonymousShare(request: ShareRequest, response: ShareResponse, supabaseUrl: string, secretKey: string): Promise<ShareResponse> {
  if (!isAllowedWriteOrigin(request.headers.origin)) return response.status(403).json({ error: "Share creation is not allowed from this origin" });
  const record = parseAnonymousShare(request.body);
  if (!record) return response.status(400).json({ error: "공유 정보가 올바르지 않거나 너무 큽니다." });
  const key = await anonymousKey(request, secretKey);
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const rateQuery = new URLSearchParams({
    owner_id: "is.null", anonymous_key: `eq.${key}`, created_at: `gte.${since}`, select: "id", limit: String(ANONYMOUS_SHARE_HOURLY_LIMIT)
  });
  const rateResponse = await fetch(`${supabaseUrl}/rest/v1/tile_timetable_shares?${rateQuery.toString()}`, {
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}`, Accept: "application/json" }
  });
  if (!rateResponse.ok) return response.status(502).json({ error: "공유 저장소를 확인하지 못했습니다." });
  const recent = await rateResponse.json() as Array<Record<string, unknown>>;
  if (recent.length >= ANONYMOUS_SHARE_HOURLY_LIMIT) return response.status(429).json({ error: "짧은 시간에 너무 많은 링크를 만들었습니다. 한 시간 뒤 다시 시도해주세요." });
  const cleanupQuery = new URLSearchParams({ owner_id: "is.null", expires_at: `lt.${new Date().toISOString()}` });
  const cleanupResponse = await fetch(`${supabaseUrl}/rest/v1/tile_timetable_shares?${cleanupQuery.toString()}`, {
    method: "DELETE",
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}`, Prefer: "return=minimal" }
  });
  if (!cleanupResponse.ok) console.error("Supabase anonymous timetable share cleanup failed", cleanupResponse.status);
  const expiresAt = new Date(Date.now() + ANONYMOUS_SHARE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const upstream = await fetch(`${supabaseUrl}/rest/v1/tile_timetable_shares`, {
    method: "POST",
    headers: {
      apikey: secretKey, Authorization: `Bearer ${secretKey}`, Accept: "application/vnd.pgrst.object+json",
      "Content-Type": "application/json", Prefer: "return=representation"
    },
    body: JSON.stringify({ ...record, owner_id: null, anonymous_key: key, expires_at: expiresAt, is_active: true })
  });
  if (!upstream.ok) {
    console.error("Supabase anonymous timetable share insert failed", upstream.status, await upstream.text());
    return response.status(502).json({ error: "짧은 공유 링크를 저장하지 못했습니다." });
  }
  const share = await upstream.json() as Record<string, unknown>;
  return response.status(201).json({ share });
}

export default async function handler(request: ShareRequest, response: ShareResponse): Promise<ShareResponse> {
  setHeaders(request, response);
  if (request.method === "OPTIONS") return response.status(204).end();
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !secretKey) return response.status(503).json({ error: "Sharing is not configured" });
  if (request.method === "POST") return createAnonymousShare(request, response, supabaseUrl, secretKey);
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });

  const id = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return response.status(400).json({ error: "Invalid share id" });
  }

  const query = new URLSearchParams({
    id: `eq.${id}`,
    is_active: "eq.true",
    or: `(expires_at.is.null,expires_at.gt.${new Date().toISOString()})`,
    select: "id,title,description,payload,scopes,created_at,updated_at",
    limit: "1"
  });
  const upstream = await fetch(`${supabaseUrl}/rest/v1/tile_timetable_shares?${query.toString()}`, {
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}`, Accept: "application/json" }
  });
  if (!upstream.ok) {
    console.error("Supabase timetable share lookup failed", upstream.status, await upstream.text());
    return response.status(502).json({ error: "Share lookup failed" });
  }
  const rows = await upstream.json() as Array<Record<string, unknown>>;
  const share = rows[0];
  if (!share) return response.status(404).json({ error: "Share not found" });
  return response.status(200).json({ share });
}
