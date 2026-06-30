import React, { useEffect, useState } from "react";

const STEPS = [
  "Reading the role...",
  "Choosing useful questions...",
  "Balancing the session...",
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
          <div className="absolute inset-0 rounded-full border border-stone-300"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#a94f38] border-r-[#2f655e] animate-spin"></div>
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-[#d29d65] animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }}></div>
          <div className="absolute inset-8 rounded-full bg-[#a94f38]/80"></div>
        </div>

        <h2 className="font-display text-2xl font-semibold text-stone-900 mb-2">
          Preparing your session
        </h2>
        <p className="text-stone-500 font-body text-sm mb-8">
          {role} Interview
        </p>

        <div className="space-y-2 text-left">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3 text-sm font-body transition-all duration-300 ${
                i <= step ? "text-stone-800" : "text-stone-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${
                i < step ? "bg-[#2f655e]" : i === step ? "bg-[#a94f38] animate-pulse" : "bg-stone-300"
              }`}></span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
