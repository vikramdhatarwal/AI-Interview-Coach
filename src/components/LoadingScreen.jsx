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
    <div className="app-shell min-h-screen flex flex-col items-center justify-center px-4">
      <div className="gradient-border w-full max-w-sm p-8 text-center fade-up">
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border border-slate-700/80"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-indigo-400 animate-spin shadow-lg shadow-cyan-500/20"></div>
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-emerald-300 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
          <div className="absolute inset-8 rounded-full bg-cyan-300/80 shadow-lg shadow-cyan-400/40"></div>
        </div>

        <h2 className="font-display text-2xl font-semibold text-white mb-2">
          Preparing your session
        </h2>
        <p className="text-slate-400 font-body text-sm mb-8">
          {role} Interview
        </p>

        <div className="space-y-2 text-left">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3 text-sm font-body transition-all duration-300 ${
                i <= step ? "text-slate-200" : "text-slate-600"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${
                i < step ? "bg-emerald-300" : i === step ? "bg-cyan-300 animate-pulse" : "bg-slate-700"
              }`}></span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
