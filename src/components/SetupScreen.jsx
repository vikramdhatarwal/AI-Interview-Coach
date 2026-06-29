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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-sm font-body mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          AI-Powered Interview Coach
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-700 text-white leading-tight mb-4">
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

      {/* Card */}
      <div className="gradient-border w-full max-w-md p-8">
        <label className="block text-sm font-medium text-slate-300 font-body mb-2">
          What role are you interviewing for?
        </label>

        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onStart()}
          placeholder="e.g. Full Stack Developer"
          className="w-full bg-[#0a0a0f] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 font-body text-sm focus:outline-none focus:border-indigo-500 transition-colors mb-4"
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`text-xs px-3 py-1.5 rounded-full border font-body transition-all ${
                role === r
                  ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                  : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
              }`}
            >
              {r}
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
          className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-display font-600 py-3 rounded-lg transition-all active:scale-[0.98]"
        >
          Start Interview →
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-8 mt-12 text-center">
        {[
          ["5", "Questions"],
          ["AI", "Feedback"],
          ["Instant", "Results"],
        ].map(([value, label]) => (
          <div key={label}>
            <div className="font-display text-2xl font-700 text-white">
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