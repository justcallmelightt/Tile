const ALLOWED_ORIGINS = new Set([
  "https://justcallmelightt.github.io",
  "https://tile0.vercel.app",
  "http://localhost:5506",
  "http://127.0.0.1:5506"
]);

interface AccountRequest {
  method?: string;
  headers: { origin?: string; authorization?: string };
}

interface AccountResponse {
  setHeader(name: string, value: string): void;
  status(code: number): AccountResponse;
  json(body: Record<string, unknown>): AccountResponse;
  end(): AccountResponse;
}

declare const process: { env: Record<string, string | undefined> };

function setCorsHeaders(request: AccountRequest, response: AccountResponse): void {
  const origin = request.headers.origin;
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://tile0.vercel.app";
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  response.setHeader("Vary", "Origin");
}

export default async function handler(request: AccountRequest, response: AccountResponse): Promise<AccountResponse> {
  setCorsHeaders(request, response);
  if (request.method === "OPTIONS") return response.status(204).end();
  if (request.method !== "DELETE") {
    response.setHeader("Allow", "DELETE, OPTIONS");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const authorization = request.headers.authorization;
  if (!supabaseUrl || !secretKey) return response.status(500).json({ error: "Account deletion is not configured" });
  if (!authorization?.startsWith("Bearer ")) return response.status(401).json({ error: "Unauthorized" });

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: secretKey, Authorization: authorization }
  });
  if (!userResponse.ok) return response.status(401).json({ error: "Invalid session" });
  const user = await userResponse.json() as { id?: string };
  if (!user.id) return response.status(401).json({ error: "Invalid user" });

  const deleteResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
    method: "DELETE",
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` }
  });
  if (!deleteResponse.ok) {
    console.error("Supabase account deletion failed", deleteResponse.status, await deleteResponse.text());
    return response.status(502).json({ error: "Account deletion failed" });
  }
  return response.status(200).json({ deleted: true });
}
