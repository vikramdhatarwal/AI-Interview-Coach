import { testCases } from "./prompts.js";
import {
  normalizeFeedback,
  normalizeQuestionList,
  parseGeminiJson,
} from "../src/utils/gemini.js";

if (testCases.length !== 45) {
  throw new Error(`Expected 45 evaluation prompts, found ${testCases.length}.`);
}

normalizeQuestionList(parseGeminiJson('["Question 1"]'));
normalizeFeedback(
  parseGeminiJson(
    '{"score":8,"verdict":"Good","strengths":["Specific"],"improvements":["More detail"],"idealAnswer":"A stronger answer"}'
  )
);

console.log("Evaluation prompt count and parser fixtures passed.");
