import React from "react";

const VERDICT_COLOR = {
  Excellent: "text-emerald-400",
  Good: "text-cyan-400",
  Average: "text-yellow-400",
  "Needs Work": "text-red-400",
};

function getOverallVerdict(avg) {
  if (avg >= 8) return { label: "Excellent Performance", emoji: "🏆", color: "text-emerald-400" };
  if (avg >= 6) return { label: "Good Performance", emoji: "👍", color: "text-cyan-400" };
  if (avg >= 4) return { label: "Average Performance", emoji: "📈", color: "text-yellow-400" };
  return { label: "Keep Practicing", emoji: "💪", color: "text-red-400" };
}

export default function ResultsScreen({ feedbacks, avgScore, role, onRestart }) {
  const overall = getOverallVerdict(avgScore);
  const circ = 2 * Math.PI * 54;
  const offset = circ - (avgScore / 10) * circ;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Hero result */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">{overall.emoji}</div>
          <h2 className={`font-display text-3xl font-700 mb-2 ${overall.color}`}>
            {overall.label}
          </h2>
          <p className="text-slate-400 font-body">
            {role} Interview — {feedbacks.length} questions completed
          </p>
        </div>

        {/* Score ring */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1e1e2e" strokeWidth="10" />
              <circle
                cx="70" cy="70" r="54"
                fill="none"
                stroke="url(#avgGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform="rotate(-90 70 70)"
                style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
              />
              <defs>
                <linearGradient id="avgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <text x="70" y="62" textAnchor="middle" fill="white" fontSize="32" fontWeight="700" fontFamily="Space Grotesk">
                {avgScore}
              </text>
              <text x="70" y="82" textAnchor="middle" fill="#64748b" fontSize="13" fontFamily="Inter">
                avg score
              </text>
            </svg>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="gradient-border p-6 mb-6">
          <div className="text-xs text-slate-500 font-display font-600 uppercase tracking-wider mb-4">
            Question Breakdown
          </div>
          <div className="space-y-3">
            {feedbacks.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-display text-sm font-600 flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm font-body leading-snug mb-1 truncate">
                    {f.question}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                        style={{ width: `${f.feedback.score * 10}%`, transition: "width 1s ease-out" }}
                      ></div>
                    </div>
                    <span className={`text-xs font-display font-600 w-12 text-right ${VERDICT_COLOR[f.feedback.verdict]}`}>
                      {f.feedback.score}/10
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-display font-600 py-3 rounded-lg transition-all active:scale-[0.98]"
          >
            Practice Again
          </button>
          <button
            onClick={onRestart}
            className="px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-display py-3 rounded-lg transition-all"
          >
            New Role
          </button>
        </div>
      </div>
    </div>
  );
}
