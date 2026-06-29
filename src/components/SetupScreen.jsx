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
        <h1 className="text-4xl font-bold text-center mb-2">
          AI Interview Coach
        </h1>

        <p className="text-center text-slate-400 mb-8">
          Practice interviews with AI.
        </p>

        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter your role"
          className="w-full border rounded-lg px-4 py-3 mb-4"
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                role === r
                  ? "bg-indigo-500 text-white"
                  : "border-gray-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <button
          onClick={onStart}
          className="w-full bg-indigo-500 text-white py-3 rounded-lg"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}