const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Add it to your .env file.");
  }

  const res = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Gemini API error");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function parseGeminiJson(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned a response that was not valid JSON.");
  }
}

export async function generateQuestions(role, count = 5) {
  const prompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions for the role: "${role}".

Rules:
- Mix of behavioral, technical, and situational questions
- Vary difficulty (easy, medium, hard)
- Keep each question concise and clear
- No numbering, no extra explanation

Return ONLY a JSON array of strings like:
["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

  return parseGeminiJson(await callGemini(prompt));
}

export async function evaluateAnswer(role, question, answer) {
  if (!answer.trim()) {
    throw new Error("Please write an answer before submitting.");
  }

  const prompt = `You are an expert interviewer evaluating a candidate's answer for the role of "${role}".

Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the answer and return ONLY a JSON object with this exact structure:
{
  "score": <number 1-10>,
  "verdict": "<one of: Excellent | Good | Average | Needs Work>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "idealAnswer": "<a brief 2-3 sentence ideal answer summary>"
}

Be honest but constructive. No extra text, just the JSON.`;

  return parseGeminiJson(await callGemini(prompt));
}
