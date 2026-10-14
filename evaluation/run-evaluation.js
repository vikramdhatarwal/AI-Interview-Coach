import { mkdir, writeFile } from "node:fs/promises";
import { testCases } from "./prompts.js";
import {
  normalizeFeedback,
  normalizeQuestionList,
  parseGeminiJson,
} from "../src/utils/gemini.js";

const model = "gemini-3.5-flash";
const apiKey = (process.env.GEMINI_API_KEY || "").trim();
const proxyUrl = (process.env.EVALUATION_PROXY_URL || "").trim();
const iterations = Number.parseInt(
  process.argv.find((argument) => argument.startsWith("--iterations="))?.split("=")[1] || "1",
  10
);
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

if (!apiKey && !proxyUrl) {
  throw new Error("Set GEMINI_API_KEY in the environment before running the evaluation.");
}

if (!Number.isInteger(iterations) || iterations < 1 || iterations > 5) {
  throw new Error("--iterations must be an integer from 1 through 5.");
}

async function requestModel(prompt) {
  const url = proxyUrl
    ? proxyUrl
    : `${endpoint}?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      proxyUrl
        ? { prompt }
        : {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
          }
    ),
  });
  const body = await response.text();

  if (!response.ok) {
    const error = new Error(
      `Gemini request failed with HTTP ${response.status}: ${body.slice(0, 180)}`
    );
    error.requestFailed = true;
    throw error;
  }

  const data = JSON.parse(body);
  return proxyUrl
    ? data.text || ""
    : data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function validateOutput(testCase, raw) {
  let parsed;
  try {
    parsed = parseGeminiJson(raw);
  } catch (error) {
    return { jsonValid: false, schemaCompliant: false, error: error.message };
  }

  try {
    if (testCase.type === "questions") {
      normalizeQuestionList(parsed);
    } else {
      normalizeFeedback(parsed);
    }
    return { jsonValid: true, schemaCompliant: true };
  } catch (error) {
    return { jsonValid: true, schemaCompliant: false, error: error.message };
  }
}

const results = [];

for (let iteration = 1; iteration <= iterations; iteration += 1) {
  for (const testCase of testCases) {
    const startedAt = new Date().toISOString();
    try {
      const raw = await requestModel(testCase.prompt);
      results.push({
        iteration,
        id: testCase.id,
        type: testCase.type,
        startedAt,
        requestSucceeded: true,
        ...validateOutput(testCase, raw),
      });
    } catch (error) {
      results.push({
        iteration,
        id: testCase.id,
        type: testCase.type,
        startedAt,
        requestSucceeded: false,
        jsonValid: false,
        schemaCompliant: false,
        error: error.message,
      });
    }
    process.stdout.write(".");
  }
  process.stdout.write(` iteration ${iteration}/${iterations}\n`);
}

const total = results.length;
const successfulResponses = results.filter((result) => result.requestSucceeded);
const jsonValid = successfulResponses.filter((result) => result.jsonValid).length;
const schemaCompliant = successfulResponses.filter((result) => result.schemaCompliant).length;
const summary = {
  model,
  totalPromptsPerIteration: testCases.length,
  iterations,
  totalResponses: total,
  successfulResponses: successfulResponses.length,
  requestSuccessRate: Number(((successfulResponses.length / total) * 100).toFixed(2)),
  jsonValidityRate: successfulResponses.length
    ? Number(((jsonValid / successfulResponses.length) * 100).toFixed(2))
    : null,
  schemaComplianceRate: successfulResponses.length
    ? Number(((schemaCompliant / successfulResponses.length) * 100).toFixed(2))
    : null,
  metrics: {
    jsonValidity:
      "Among successful model responses, the parser extracts valid JSON.",
    schemaCompliance:
      "The normalized result satisfies the application's question or feedback contract.",
  },
  results,
  generatedAt: new Date().toISOString(),
};

await mkdir(new URL(".", import.meta.url), { recursive: true });
await writeFile(
  new URL("./results.json", import.meta.url),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8"
);
console.log(
  JSON.stringify(
    {
      totalResponses: summary.totalResponses,
      successfulResponses: summary.successfulResponses,
      requestSuccessRate: summary.requestSuccessRate,
      jsonValidityRate: summary.jsonValidityRate,
      schemaComplianceRate: summary.schemaComplianceRate,
      resultsFile: "evaluation/results.json",
    },
    null,
    2
  )
);
