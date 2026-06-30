import React from "react";

const VERDICT_COLORS = {
  Excellent: { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  Good: { text: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
  Average: { text: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  "Needs Work": { text: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
};

function ScoreRing({ score }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 10) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e1e2e" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <text x="50" y="45" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Space Grotesk">
          {score}
        </text>
        <text x="50" y="61" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="Inter">
          / 10
        </text>
      </svg>
    </div>
  );
}

export default function FeedbackPanel({ feedback, onNext, isLast }) {
  const colors = VERDICT_COLORS[feedback.verdict] || VERDICT_COLORS["Average"];

  return (
    <div className="fade-up mt-6 space-y-4">
      {/* Score + verdict */}
      <div className="gradient-border p-5 flex items-center gap-6">
        <ScoreRing score={feedback.score} />
        <div>
          <div className={`inline-block text-xs font-display font-600 px-3 py-1 rounded-full border mb-2 ${colors.bg} ${colors.text}`}>
            {feedback.verdict}
          </div>
          <p className="text-slate-400 text-sm font-body leading-relaxed">
            {feedback.idealAnswer}
          </p>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
          <div className="text-emerald-400 text-xs font-display font-600 uppercase tracking-wider mb-3">
            ✓ Strengths
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-slate-300 text-sm font-body flex gap-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <div className="text-amber-400 text-xs font-display font-600 uppercase tracking-wider mb-3">
            ↑ Improve
          </div>
          <ul className="space-y-2">
            {feedback.improvements.map((imp, i) => (
              <li key={i} className="text-slate-300 text-sm font-body flex gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-display font-600 py-3 rounded-lg transition-all active:scale-[0.98]"
      >
        {isLast ? "See Final Results →" : "Next Question →"}
      </button>
    </div>
  );
}
