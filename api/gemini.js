const GEMINI_MODEL = "gemini-3.5-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function getGeminiApiKey() {
  return (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "").trim();
}

function parseResponseBody(raw) {
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "A prompt string is required." });
  }

  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return res.status(500).json({
      error: "Missing GEMINI_API_KEY on the server.",
    });
  }

  try {
    const geminiRes = await fetch(`${BASE_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    });

    const raw = await geminiRes.text();
    const data = parseResponseBody(raw);

    if (data === null) {
      const details = raw.trim().slice(0, 180);
      return res.status(502).json({
        error: details
          ? `Gemini returned a non-JSON response (${geminiRes.status}): ${details}`
          : `Gemini returned an empty non-JSON response (${geminiRes.status}).`,
      });
    }

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({
        error: data?.error?.message || "Gemini API error",
      });
    }

    return res.status(200).json({
      text: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
    });
  } catch {
    return res.status(500).json({
      error: "Unable to reach Gemini API.",
    });
  }
}
