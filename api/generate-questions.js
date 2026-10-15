import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { documentId, topic = "key responsibilities skills requirements", questionCount = 5 } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: "documentId is required" });
    }

    // 1. Embed the search query topic
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const queryEmbeddingResult = await embeddingModel.embedContent(topic);
    const queryVector = queryEmbeddingResult.embedding.values;

    // 2. Perform vector similarity search via Supabase RPC
    const { data: retrievedChunks, error: searchError } = await supabase.rpc(
      "match_job_chunks",
      {
        query_embedding: queryVector,
        match_document_id: documentId,
        match_count: 5
      }
    );

    if (searchError) throw new Error(`Vector search failed: ${searchError.message}`);

    // 3. Format retrieved passages into prompt context
    const contextText = retrievedChunks && retrievedChunks.length > 0
      ? retrievedChunks.map((c, idx) => `[Chunk ${idx + 1}]: ${c.content}`).join("\n\n")
      : "No specific chunks found.";

    // 4. Construct grounded Gemini prompt
    const prompt = `
You are an expert technical interviewer. Generate ${questionCount} realistic interview questions grounded ONLY in the job description context below.

CONTEXT FROM JOB DESCRIPTION:
---
${contextText}
---

INSTRUCTIONS:
1. Every question must directly relate to skills, tools, responsibilities, or expectations explicitly mentioned in the context.
2. Return your response in clean JSON format matching this array structure:
[
{
"id": 1,
"category": "Technical Skill / Behavioral / System Design",
"question": "Question text...",
"rationale": "Briefly why this question matters based on context"
}
]
`;

    // 5. Call Gemini LLM (gemini-2.5-flash)
    const llmModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const response = await llmModel.generateContent(prompt);
    const rawText = response.response.text();
    const questions = JSON.parse(rawText);

    return res.status(200).json({
      success: true,
      documentId,
      retrievedChunksCount: retrievedChunks?.length || 0,
      questions
    });
  } catch (err) {
    console.error("Generation error:", err);
    return res.status(500).json({ error: err.message || "Failed to generate questions" });
  }
}