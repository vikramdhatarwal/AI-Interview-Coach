import React, { useState } from "react";

const VERDICT_COLOR = {
  Excellent: "text-[#2f655e]",
  Good: "text-[#356377]",
  Average: "text-[#9a6a27]",
  "Needs Work": "text-[#a94f38]",
};

function getOverallVerdict(avg) {
  if (avg >= 8) {
    return {
      label: "Excellent Performance",
      tone: "You are interview-ready. Keep refining examples and measurable impact.",
      color: "text-[#2f655e]",
      bar: "bg-[#2f655e]",
    };
  }

  if (avg >= 6) {
    return {
      label: "Good Performance",
      tone: "Strong foundation. A little more structure and specificity will lift your answers.",
      color: "text-[#356377]",
      bar: "bg-[#356377]",
    };
  }

  if (avg >= 4) {
    return {
      label: "Average Performance",
      tone: "You have a base to build on. Focus on clearer examples and stronger outcomes.",
      color: "text-[#9a6a27]",
      bar: "bg-[#d29d65]",
    };
  }

  return {
    label: "Keep Practicing",
    tone: "This session found the gaps. Rework your examples and try another round.",
    color: "text-[#a94f38]",
    bar: "bg-[#a94f38]",
  };
}

function getTopFeedback(feedbacks) {
  if (feedbacks.length === 0) return null;

  return feedbacks.reduce((best, item) =>
    item.feedback.score > best.feedback.score ? item : best
  );
}

function getFocusArea(feedbacks) {
  return feedbacks.find((item) => item.feedback.improvements?.length > 0)
    ?.feedback.improvements[0];
}

export default function ResultsScreen({ feedbacks, avgScore, role, onRestart }) {
  const [selectedReview, setSelectedReview] = useState(null);
  const overall = getOverallVerdict(avgScore);
  const topFeedback = getTopFeedback(feedbacks);
  const focusArea = getFocusArea(feedbacks);
  const highestScore = topFeedback?.feedback.score ?? 0;
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (avgScore / 10) * circumference;

  return (
    <div className="app-shell min-h-screen flex flex-col items-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex items-center rounded-full border border-stone-300 bg-white/55 px-4 py-1.5 text-stone-600 text-sm font-body mb-5">
            Session complete
          </div>
          <h2 className={`font-display text-4xl md:text-5xl font-bold mb-3 ${overall.color}`}>
            {overall.label}
          </h2>
          <p className="text-stone-600 font-body max-w-2xl mx-auto">
            {overall.tone}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr] mb-6">
          <div className="gradient-border p-6 sm:p-8 fade-up">
            <div className="flex flex-col sm:flex-row items-center gap-7">
              <svg width="156" height="156" viewBox="0 0 156 156" aria-label={`Average score ${avgScore} out of 10`}>
                <circle cx="78" cy="78" r="58" fill="none" stroke="#e6dac8" strokeWidth="12" />
                <circle
                  cx="78"
                  cy="78"
                  r="58"
                  fill="none"
                  stroke="url(#avgGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform="rotate(-90 78 78)"
                  style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
                <defs>
                  <linearGradient id="avgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a94f38" />
                    <stop offset="100%" stopColor="#2f655e" />
                  </linearGradient>
                </defs>
                <text x="78" y="72" textAnchor="middle" fill="#2f2a25" fontSize="38" fontWeight="700" fontFamily="Space Grotesk">
                  {avgScore}
                </text>
                <text x="78" y="94" textAnchor="middle" fill="#78716c" fontSize="13" fontFamily="Inter">
                  avg / 10
                </text>
              </svg>

              <div className="w-full text-center sm:text-left">
                <div className="text-sm text-stone-500 mb-2">{role} Interview</div>
                <div className="h-2 rounded-full bg-stone-200 overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full ${overall.bar}`}
                    style={{ width: `${avgScore * 10}%` }}
                  />
                </div>
                <p className="text-stone-700 text-sm leading-6">
                  You completed {feedbacks.length} questions. Use the focus area below as your next practice target.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="surface-card p-5 fade-up">
              <div className="text-xs text-stone-500 font-display font-semibold uppercase tracking-wider mb-2">
                Best Answer
              </div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-stone-900 font-display font-semibold">Top score</span>
                <span className="text-[#2f655e] font-display text-2xl font-bold">{highestScore}/10</span>
              </div>
              <p className="text-stone-600 text-sm leading-6 line-clamp-2">
                {topFeedback?.question || "Complete an interview to see your strongest answer."}
              </p>
            </div>

            <div className="surface-card p-5 fade-up">
              <div className="text-xs text-stone-500 font-display font-semibold uppercase tracking-wider mb-2">
                Next Focus
              </div>
              <p className="text-stone-700 text-sm leading-6">
                {focusArea || "Keep adding concrete examples, tradeoffs, and measurable outcomes to your answers."}
              </p>
            </div>
          </div>
        </div>

        <div className="gradient-border p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <div className="text-xs text-stone-500 font-display font-semibold uppercase tracking-wider mb-1">
                Question Breakdown
              </div>
              <h3 className="text-stone-900 font-display text-xl font-semibold">
                Review your performance
              </h3>
            </div>
            <div className="text-stone-500 text-sm tabular-nums">
              {feedbacks.length}/10 done
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {feedbacks.map((item, index) => (
              <button
                key={`${item.question}-${index}`}
                type="button"
                onClick={() => setSelectedReview(item)}
                className="surface-card w-full p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#a94f38]/35 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#a94f38]/40"
                aria-label={`Review question ${index + 1}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#a94f38]/10 border border-[#a94f38]/20 flex items-center justify-center text-[#a94f38] font-display text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-stone-700 text-sm font-body leading-snug line-clamp-2">
                      {item.question}
                    </p>
                  </div>
                  <span className={`text-xs font-display font-semibold flex-shrink-0 ${VERDICT_COLOR[item.feedback.verdict] || VERDICT_COLOR.Average}`}>
                    {item.feedback.score}/10
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-[#a94f38]"
                      style={{ width: `${item.feedback.score * 10}%`, transition: "width 1s ease-out" }}
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 min-w-16 text-right">
                    {item.feedback.verdict}
                  </span>
                </div>
                <div className="mt-3 text-xs font-semibold text-[#a94f38]">
                  Click to review full answer
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedReview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/35 px-4 py-6 backdrop-blur-sm"
            role="presentation"
            onClick={() => setSelectedReview(null)}
          >
            <section
              className="gradient-border max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8 fade-up"
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-dialog-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#2f655e]">
                    Full answer review
                  </div>
                  <h3 id="review-dialog-title" className="font-display text-2xl font-bold text-stone-900">
                    {selectedReview.feedback.verdict}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="quiet-button rounded-lg px-3 py-2 text-sm font-semibold"
                  aria-label="Close answer review"
                >
                  Close
                </button>
              </div>

              <div className="space-y-5">
                <div className="surface-card p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Question
                  </div>
                  <p className="leading-7 text-stone-800">{selectedReview.question}</p>
                </div>

                <div className="surface-card p-4">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Your answer
                    </div>
                    <div className="font-display text-2xl font-bold text-[#a94f38]">
                      {selectedReview.feedback.score}/10
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap leading-7 text-stone-700">
                    {selectedReview.answer || "No answer recorded."}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="surface-card border-[#2f655e]/20 bg-[#2f655e]/5 p-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#2f655e]">
                      Strengths
                    </div>
                    <ul className="space-y-2 text-sm leading-6 text-stone-700">
                      {selectedReview.feedback.strengths?.map((strength) => (
                        <li key={strength}>- {strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="surface-card border-[#d29d65]/30 bg-[#d29d65]/10 p-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#9a6a27]">
                      Weak spots & improvements
                    </div>
                    <ul className="space-y-2 text-sm leading-6 text-stone-700">
                      {selectedReview.feedback.improvements?.map((improvement) => (
                        <li key={improvement}>- {improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="surface-card p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Stronger answer direction
                  </div>
                  <p className="leading-7 text-stone-700">
                    {selectedReview.feedback.idealAnswer}
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="primary-button flex-1 text-white font-display font-semibold py-3 rounded-lg transition-all active:scale-[0.98]"
          >
            Practice Again
          </button>
          <button
            onClick={onRestart}
            className="quiet-button px-5 py-3 rounded-lg font-display font-semibold transition-colors"
          >
            Try New Role
          </button>
        </div>
      </div>
    </div>
  );
}
