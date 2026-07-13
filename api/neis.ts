const NEIS_BASE_URL = "https://open.neis.go.kr/hub";
const ALLOWED_ENDPOINTS = new Set<NeisEndpoint>([
  "schoolInfo",
  "mealServiceDietInfo",
  "hisTimetable"
]);

const ALLOWED_ORIGINS = new Set([
  "https://justcallmelightt.github.io",
  "https://tile0.vercel.app",
  "http://localhost:5506",
  "http://127.0.0.1:5506"
]);

type RequestQueryValue = string | string[] | undefined;

interface ApiRequest {
  method?: string;
  headers: { origin?: string };
  query: Record<string, RequestQueryValue>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: { error: string }): ApiResponse;
  send(body: string): ApiResponse;
  end(): ApiResponse;
}

declare const process: {
  env: Record<string, string | undefined>;
};

function setCorsHeaders(request: ApiRequest, response: ApiResponse): void {
  const origin = request.headers.origin;
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://tile0.vercel.app";

  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Vary", "Origin");
}

function firstQueryValue(value: RequestQueryValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
): Promise<ApiResponse> {
  setCorsHeaders(request, response);

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET, OPTIONS");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.NEIS_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: "NEIS_KEY is not configured" });
  }

  const { endpoint: endpointValue, ...query } = request.query;
  const endpoint = firstQueryValue(endpointValue);
  if (!endpoint || !ALLOWED_ENDPOINTS.has(endpoint as NeisEndpoint)) {
    return response.status(400).json({ error: "Unsupported NEIS endpoint" });
  }

  const url = new URL(`${NEIS_BASE_URL}/${endpoint}`);
  url.searchParams.set("KEY", apiKey);
  url.searchParams.set("Type", "json");
  url.searchParams.set("pIndex", firstQueryValue(query.pIndex) || "1");
  url.searchParams.set("pSize", firstQueryValue(query.pSize) || "100");

  Object.entries(query).forEach(([key, value]) => {
    if (key === "rowKey" || value == null) return;
    const normalizedValue = firstQueryValue(value);
    if (normalizedValue) url.searchParams.set(key, normalizedValue);
  });

  try {
    const neisResponse = await fetch(url);
    const contentType = neisResponse.headers.get("content-type") || "application/json";
    const body = await neisResponse.text();

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.setHeader("Content-Type", contentType);
    return response.status(neisResponse.status).send(body);
  } catch (error: unknown) {
    console.error("NEIS proxy request failed", error);
    return response.status(502).json({ error: "NEIS request failed" });
  }
}
