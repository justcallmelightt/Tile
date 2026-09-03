const ALLOWED_ORIGINS = new Set([
  "https://justcallmelightt.github.io",
  "https://tile0.vercel.app",
  "http://localhost:5506",
  "http://127.0.0.1:5506"
]);

interface ShareRequest {
  method?: string;
  headers: { origin?: string };
  query: { id?: string | string[] };
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
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://tile0.vercel.app";
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Cache-Control", "private, no-store, max-age=0");
  response.setHeader("Vary", "Origin");
}

export default async function handler(request: ShareRequest, response: ShareResponse): Promise<ShareResponse> {
  setHeaders(request, response);
  if (request.method === "OPTIONS") return response.status(204).end();
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });

  const id = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return response.status(400).json({ error: "Invalid share id" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !secretKey) return response.status(503).json({ error: "Sharing is not configured" });

  const query = new URLSearchParams({
    id: `eq.${id}`,
    is_active: "eq.true",
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
