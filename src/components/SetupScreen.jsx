import React from "react";

const ROLES = [
  "Frontend Developer",
  "Full Stack Developer",
  "Backend Engineer",
  "React Developer",
  "Node.js Developer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
];

export default function SetupScreen({ role, setRole, onStart, error }) {
  return (
    <div className="app-shell min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="text-center mb-10 fade-up">
        <div className="inline-flex items-center gap-2 bg-white/55 border border-stone-300/80 rounded-full px-4 py-1.5 text-stone-600 text-sm font-body mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2f655e]"></span>
          Guided interview practice
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-stone-900 leading-tight mb-4">
          Interview
          <span className="block text-[#a94f38]">
            MockMate
          </span>
        </h1>

        <p className="text-stone-600 text-lg max-w-md mx-auto font-body">
          Practice real questions, shape clearer stories, and leave with notes
          you can actually use.
        </p>
      </div>

      <div className="gradient-border w-full max-w-md p-6 sm:p-8 fade-up">
        <label className="block text-sm font-medium text-stone-700 font-body mb-2">
          What role are you interviewing for?
        </label>

        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onStart()}
          placeholder="e.g. Full Stack Developer"
          className="w-full bg-white/80 border border-stone-300 rounded-lg px-4 py-3 text-stone-900 placeholder-stone-400 font-body text-sm focus:outline-none focus:border-[#a94f38] transition-colors mb-4"
        />

        {/* Suggested roles keep setup fast while still allowing custom input. */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ROLES.map((suggestedRole) => (
            <button
              key={suggestedRole}
              onClick={() => setRole(suggestedRole)}
              className={`text-xs px-3 py-1.5 rounded-full border font-body transition-all ${
                role === suggestedRole
                  ? "bg-[#a94f38]/10 border-[#a94f38]/50 text-[#743625]"
                  : "border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-800 hover:bg-white/70"
              }`}
            >
              {suggestedRole}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-700 text-sm font-body mb-4">
            {error}
          </p>
        )}

        <button
          onClick={onStart}
          className="primary-button w-full text-white font-display font-semibold py-3 rounded-lg transition-all duration-300 ease-out active:scale-[0.98]"
        >
          Start Interview -&gt;
        </button>
      </div>

      <div className="surface-card flex gap-8 mt-8 px-6 py-4 text-center fade-up">
        {[
          ["10", "Questions"],
          ["Guided", "Feedback"],
          ["Clear", "Results"],
        ].map(([value, label]) => (
          <div key={label}>
            <div className="font-display text-2xl font-bold text-stone-900">
              {value}
            </div>
            <div className="text-stone-500 text-xs font-body mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
