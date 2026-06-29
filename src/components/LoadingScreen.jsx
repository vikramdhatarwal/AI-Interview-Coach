import React, { useEffect, useState } from "react";

const STEPS = [
  "Analyzing role requirements...",
  "Crafting interview questions...",
  "Calibrating difficulty...",
  "Ready to begin!",
];

export default function LoadingScreen({ role }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-cyan-500 animate-spin"></div>
        <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-indigo-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
      </div>

      <h2 className="font-display text-2xl font-600 text-white mb-2">
        Preparing your session
      </h2>
      <p className="text-slate-400 font-body text-sm mb-8">
        {role} Interview
      </p>

      <div className="space-y-2 w-64">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`flex items-center gap-3 text-sm font-body transition-all duration-300 ${
              i <= step ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${
              i < step ? "bg-cyan-400" : i === step ? "bg-indigo-400 animate-pulse" : "bg-slate-700"
            }`}></span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}