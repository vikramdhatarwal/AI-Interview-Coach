import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function chunkText(text, chunkSize = 600, overlap = 100) {
  const chunks = [];
  let startIndex = 0;
  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex).trim();
    if (chunk.length > 0) chunks.push(chunk);
    startIndex += chunkSize - overlap;
  }
  return chunks;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { jobDescription, userId = "anonymous" } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: "Job description is too short" });
    }

    const documentId = crypto.randomUUID();
    const textChunks = chunkText(jobDescription);
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    const rowsToInsert = [];

    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const embedResult = await embeddingModel.embedContent(chunk);
      const embeddingVector = embedResult.embedding.values;

      rowsToInsert.push({
        document_id: documentId,
        user_id: userId,
        chunk_index: i,
        content: chunk,
        embedding: embeddingVector,
        metadata: { charCount: chunk.length }
      });
    }

    const { error } = await supabase.from("job_chunks").insert(rowsToInsert);

    if (error) throw new Error(error.message);

    return res.status(200).json({
      success: true,
      documentId,
      totalChunks: textChunks.length
    });
  } catch (err) {
    console.error("Ingest error:", err);
    return res.status(500).json({ error: err.message || "Failed to ingest job" });
  }
}