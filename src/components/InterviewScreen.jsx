import React from "react";

export default function InterviewScreen({
  role,
  questions,
  currentIndex,
  answer,
  setAnswer,
}) {
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">
            {role}
          </span>

          <span className="text-slate-400 text-sm">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Progress */}
        <div className="w-full bg-slate-800 rounded-full h-1 mb-8">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="gradient-border p-6 mb-6">
          <div className="text-xs text-indigo-400 uppercase mb-3">
            Question {currentIndex + 1}
          </div>

          <p className="text-white text-lg">
            {questions[currentIndex]}
          </p>
        </div>

        {/* Answer */}
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={6}
          placeholder="Type your answer..."
          className="w-full bg-[#13131f] border border-slate-700 rounded-xl px-4 py-4 text-white resize-none"
        />

      </div>
    </div>
  );
}