const NEIS_BASE_URL = "https://open.neis.go.kr/hub";
const ALLOWED_ENDPOINTS = new Set([
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

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://tile0.vercel.app";
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Vary", "Origin");
}

export default async function handler(request, response) {
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

  const { endpoint, ...query } = request.query;
  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return response.status(400).json({ error: "Unsupported NEIS endpoint" });
  }

  const url = new URL(`${NEIS_BASE_URL}/${endpoint}`);
  url.searchParams.set("KEY", apiKey);
  url.searchParams.set("Type", "json");
  url.searchParams.set("pIndex", query.pIndex || "1");
  url.searchParams.set("pSize", query.pSize || "100");

  Object.entries(query).forEach(([key, value]) => {
    if (key === "rowKey" || key === "endpoint" || value == null || value === "") return;
    const normalizedValue = Array.isArray(value) ? value[0] : value;
    url.searchParams.set(key, normalizedValue);
  });

  try {
    const neisResponse = await fetch(url);
    const contentType = neisResponse.headers.get("content-type") || "application/json";
    const body = await neisResponse.text();

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.setHeader("Content-Type", contentType);
    return response.status(neisResponse.status).send(body);
  } catch (error) {
    return response.status(502).json({ error: "NEIS request failed" });
  }
}
