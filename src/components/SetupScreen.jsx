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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-5xl md:text-6xl font-700 text-white leading-tight mb-4 text-center">
          AI Interview
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Coach
          </span>
        </h1>

        <p className="text-center text-slate-400 mb-8 font-body">
          Practice interviews with AI.
        </p>

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
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-display font-600 py-3 rounded-lg transition-all"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}