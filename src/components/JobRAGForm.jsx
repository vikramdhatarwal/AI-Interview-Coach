import React, { useState } from "react";

function isErrorStatus(status) {
  return status.startsWith("Error:");
}

export default function JobRAGForm({ onInterviewReady }) {
  const [jobText, setJobText] = useState("");
  const [role, setRole] = useState("");
  const [documentId, setDocumentId] = useState(null);
  const [chunkCount, setChunkCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleIngestJob() {
    if (!jobText.trim()) {
      setStatus("Error: Paste a job description before vectorizing it.");
      return;
    }

    setLoading(true);
    setStatus("Preparing your job description...");
    setDocumentId(null);
    setChunkCount(0);

    try {
      const res = await fetch("/api/ingest-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobText }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to process the job description.");
      }

      setDocumentId(data.documentId);
      setChunkCount(data.totalChunks);
      setStatus(`Ready. ${data.totalChunks} context ${data.totalChunks === 1 ? "chunk" : "chunks"} indexed.`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartInterview() {
    if (!documentId || !role.trim()) {
      setStatus("Error: Add a target role before generating the interview.");
      return;
    }

    setLoading(true);
    setStatus("Retrieving relevant requirements and shaping your questions...");

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          topic: "key responsibilities core technologies qualifications",
          questionCount: 5,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to generate interview questions.");
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No interview questions were generated.");
      }

      onInterviewReady(role, data.questions);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      setLoading(false);
    }
  }

  const canGenerate = Boolean(documentId && role.trim() && !loading);

  return (
    <main className="app-shell min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 text-center fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white/55 px-4 py-1.5 text-sm text-stone-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2f655e]" />
            RAG-powered interview practice
          </div>
          <h1 className="mb-3 font-display text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">
            Practice against the
            <span className="block text-[#a94f38]">job description.</span>
          </h1>
          <p className="mx-auto max-w-2xl font-body text-base leading-7 text-stone-600 sm:text-lg">
            Add a role and job description. We will retrieve the most relevant
            requirements and use them to shape a focused five-question session.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="gradient-border p-6 sm:p-8 fade-up">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#a94f38]/10 font-display font-bold text-[#a94f38]">
                01
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Add your target role
                </h2>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  This helps frame the retrieved requirements as interview topics.
                </p>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="target-role">
              Target role
            </label>
            <input
              id="target-role"
              type="text"
              placeholder="e.g. Frontend Developer"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              disabled={loading}
              className="mb-7 w-full rounded-lg border border-stone-300 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 transition-colors focus:border-[#a94f38] focus:outline-none"
            />

            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#2f655e]/10 font-display font-bold text-[#2f655e]">
                02
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Ground it in the job description
                </h2>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Your text is chunked, embedded, and stored for similarity search.
                </p>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="job-description">
              Job description
            </label>
            <textarea
              id="job-description"
              rows={12}
              placeholder="Paste the responsibilities, skills, technologies, and qualifications from the role..."
              value={jobText}
              onChange={(event) => setJobText(event.target.value)}
              disabled={loading}
              className="w-full resize-y rounded-xl border border-stone-300 bg-white/80 px-4 py-4 text-sm leading-6 text-stone-900 placeholder-stone-400 shadow-inner shadow-stone-200 transition-colors focus:border-[#a94f38] focus:outline-none"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-stone-500">
                {jobText.trim().length} characters
              </span>
              <button
                type="button"
                onClick={handleIngestJob}
                disabled={loading || !jobText.trim()}
                className="quiet-button rounded-lg px-4 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading && !documentId ? "Indexing..." : "Index job description"}
              </button>
            </div>
          </section>

          <aside className="flex flex-col gap-4 fade-up">
            <div className="surface-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Your session
                </h2>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  documentId
                    ? "bg-[#2f655e]/10 text-[#2f655e]"
                    : "bg-stone-200/70 text-stone-500"
                }`}>
                  {documentId ? "Ready" : "Waiting"}
                </span>
              </div>

              <div className="space-y-3 border-y border-stone-200/80 py-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-500">Role</span>
                  <span className="text-right font-medium text-stone-800">
                    {role.trim() || "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-500">Indexed context</span>
                  <span className="font-medium text-stone-800">
                    {chunkCount ? `${chunkCount} ${chunkCount === 1 ? "chunk" : "chunks"}` : "Not indexed"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-500">Interview length</span>
                  <span className="font-medium text-stone-800">5 questions</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartInterview}
                disabled={!canGenerate}
                className="primary-button mt-5 w-full rounded-lg py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading && documentId ? "Building your interview..." : "Generate grounded interview ->"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-stone-500">
                Each answer is evaluated together after you complete all five questions.
              </p>
            </div>

            <div className="surface-card p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#2f655e]">
                How it works
              </div>
              <ol className="space-y-3 text-sm leading-6 text-stone-600">
                <li><span className="mr-2 font-display font-semibold text-stone-900">1.</span>Index the job requirements.</li>
                <li><span className="mr-2 font-display font-semibold text-stone-900">2.</span>Retrieve relevant context.</li>
                <li><span className="mr-2 font-display font-semibold text-stone-900">3.</span>Answer five tailored questions.</li>
                <li><span className="mr-2 font-display font-semibold text-stone-900">4.</span>Review your score and weak spots.</li>
              </ol>
            </div>

            {status && (
              <div className={`rounded-xl border p-4 text-sm leading-6 ${
                isErrorStatus(status)
                  ? "border-red-200 bg-red-50/80 text-red-800"
                  : "border-[#2f655e]/20 bg-[#2f655e]/5 text-[#2f655e]"
              }`} role="status">
                {status}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
