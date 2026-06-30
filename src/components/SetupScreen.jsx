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
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 rounded-full px-4 py-1.5 text-cyan-200 text-sm font-body mb-6 shadow-lg shadow-cyan-950/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>
          AI-Powered Interview Coach
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
          AI Interview
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            MockMate
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md mx-auto font-body">
          Practice real interview questions. Get instant AI feedback on your
          answers.
        </p>
      </div>

      <div className="gradient-border w-full max-w-md p-6 sm:p-8 fade-up">
        <label className="block text-sm font-medium text-slate-300 font-body mb-2">
          What role are you interviewing for?
        </label>

        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onStart()}
          placeholder="e.g. Full Stack Developer"
          className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg px-4 py-3 text-white placeholder-slate-600 font-body text-sm focus:outline-none focus:border-cyan-400 transition-colors mb-4"
        />

        {/* Suggested roles keep setup fast while still allowing custom input. */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ROLES.map((suggestedRole) => (
            <button
              key={suggestedRole}
              onClick={() => setRole(suggestedRole)}
              className={`text-xs px-3 py-1.5 rounded-full border font-body transition-all ${
                role === suggestedRole
                  ? "bg-cyan-500/15 border-cyan-400/60 text-cyan-200 shadow-sm shadow-cyan-950/30"
                  : "border-slate-700/80 text-slate-500 hover:border-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
              }`}
            >
              {suggestedRole}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm font-body mb-4">
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
          ["AI", "Feedback"],
          ["Instant", "Results"],
        ].map(([value, label]) => (
          <div key={label}>
            <div className="font-display text-2xl font-bold text-white">
              {value}
            </div>
            <div className="text-slate-500 text-xs font-body mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
