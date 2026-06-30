import React from "react";

const VERDICT_COLORS = {
  Excellent: { text: "text-[#2f655e]", bg: "bg-[#2f655e]/10 border-[#2f655e]/25" },
  Good: { text: "text-[#356377]", bg: "bg-[#356377]/10 border-[#356377]/25" },
  Average: { text: "text-[#9a6a27]", bg: "bg-[#d29d65]/15 border-[#d29d65]/40" },
  "Needs Work": { text: "text-[#a94f38]", bg: "bg-[#a94f38]/10 border-[#a94f38]/25" },
};

function ScoreRing({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100" aria-label={`Score ${score} out of 10`}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e6dac8" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a94f38" />
            <stop offset="100%" stopColor="#2f655e" />
          </linearGradient>
        </defs>
        <text x="50" y="45" textAnchor="middle" fill="#2f2a25" fontSize="22" fontWeight="700" fontFamily="Space Grotesk">
          {score}
        </text>
        <text x="50" y="61" textAnchor="middle" fill="#78716c" fontSize="10" fontFamily="Inter">
          / 10
        </text>
      </svg>
    </div>
  );
}

export default function FeedbackPanel({ feedback, onNext, isLast }) {
  const colors = VERDICT_COLORS[feedback.verdict] || VERDICT_COLORS.Average;

  return (
    <div className="fade-up mt-6 space-y-4">
      {/* Show the score first so users immediately understand the evaluation. */}
      <div className="gradient-border p-5 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        <ScoreRing score={feedback.score} />
        <div className="text-center sm:text-left">
          <div className={`inline-block text-xs font-display font-semibold px-3 py-1 rounded-full border mb-2 ${colors.bg} ${colors.text}`}>
            {feedback.verdict}
          </div>
          <p className="text-stone-600 text-sm font-body leading-relaxed">
            {feedback.idealAnswer}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="surface-card bg-[#2f655e]/5 border-[#2f655e]/20 p-4">
          <div className="text-[#2f655e] text-xs font-display font-semibold uppercase tracking-wider mb-3">
            Strengths
          </div>
          <ul className="space-y-2">
            {feedback.strengths?.map((strength) => (
              <li key={strength} className="text-stone-700 text-sm font-body flex gap-2">
                <span className="text-[#2f655e] mt-0.5 flex-shrink-0">-</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-card bg-[#d29d65]/10 border-[#d29d65]/30 p-4">
          <div className="text-[#9a6a27] text-xs font-display font-semibold uppercase tracking-wider mb-3">
            Improve
          </div>
          <ul className="space-y-2">
            {feedback.improvements?.map((improvement) => (
              <li key={improvement} className="text-stone-700 text-sm font-body flex gap-2">
                <span className="text-[#9a6a27] mt-0.5 flex-shrink-0">-</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onNext}
        className="primary-button w-full text-white font-display font-semibold py-3 rounded-lg transition-all active:scale-[0.98]"
      >
        {isLast ? "See Final Results ->" : "Next Question ->"}
      </button>
    </div>
  );
}
