async function callGemini(prompt) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const raw = await res.text();
  let data = {};

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    const details = raw.trim().slice(0, 140);
    const isHtml = /^\s*<!doctype html|^\s*<html/i.test(raw);

    if (isHtml) {
      throw new Error(
        "The /api/gemini route is returning the frontend HTML. Stop the Vite-only server and restart with npm.cmd run dev."
      );
    }

    throw new Error(
      details
        ? `The /api/gemini route returned a non-JSON response (${res.status}): ${details}`
        : `The /api/gemini route returned an empty non-JSON response (${res.status}).`
    );
  }

  if (!res.ok) {
    throw new Error(data?.error || "Gemini API error");
  }

  return data.text || "";
}

function parseGeminiJson(raw) {
  const cleaned = raw
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstArray = cleaned.indexOf("[");
    const lastArray = cleaned.lastIndexOf("]");
    const firstObject = cleaned.indexOf("{");
    const lastObject = cleaned.lastIndexOf("}");
    const candidates = [];

    if (firstArray !== -1 && lastArray > firstArray) {
      candidates.push(cleaned.slice(firstArray, lastArray + 1));
    }

    if (firstObject !== -1 && lastObject > firstObject) {
      candidates.push(cleaned.slice(firstObject, lastObject + 1));
    }

    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate);
      } catch {
        // Try the next plausible JSON segment.
      }
    }

    throw new Error("Gemini returned a response that was not valid JSON.");
  }
}

function normalizeQuestionList(value) {
  if (!Array.isArray(value)) {
    throw new Error("Gemini did not return a list of interview questions.");
  }

  const questions = value
    .filter((question) => typeof question === "string")
    .map((question) => question.trim())
    .filter(Boolean);

  if (questions.length === 0) {
    throw new Error("Gemini did not return any interview questions.");
  }

  return questions;
}

function normalizeFeedback(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Gemini did not return a valid feedback object.");
  }

  const score = Math.min(10, Math.max(1, Number(value.score) || 1));
  const allowedVerdicts = ["Excellent", "Good", "Average", "Needs Work"];
  const verdict = allowedVerdicts.includes(value.verdict)
    ? value.verdict
    : "Average";
  const toTextList = (list) =>
    Array.isArray(list)
      ? list
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  return {
    score,
    verdict,
    strengths: toTextList(value.strengths),
    improvements: toTextList(value.improvements),
    idealAnswer:
      typeof value.idealAnswer === "string" && value.idealAnswer.trim()
        ? value.idealAnswer.trim()
        : "A stronger answer would be specific, structured, and tied to measurable outcomes.",
  };
}

export async function generateQuestions(role, count = 10) {
  const prompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions for the role: "${role}".

Rules:
- Mix of behavioral, technical, and situational questions
- Vary difficulty (easy, medium, hard)
- Keep each question concise and clear
- No numbering, no extra explanation

Return ONLY a JSON array of strings like:
["Question 1", "Question 2", "Question 3"]`;

  return normalizeQuestionList(parseGeminiJson(await callGemini(prompt)));
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

  return normalizeFeedback(parseGeminiJson(await callGemini(prompt)));
}
