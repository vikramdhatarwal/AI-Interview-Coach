import React from "react";
import FeedbackPanel from "./FeedbackPanel";

export default function InterviewScreen({
  role,
  questions,
  currentIndex,
  answer,
  setAnswer,
  onSubmit,
  onNext,
  isEvaluating,
  currentFeedback,
  error,
}) {
  const total = questions.length;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const isLast = currentIndex === total - 1;

  return (
    <div className="app-shell min-h-screen flex flex-col items-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-2xl">
        <div className="surface-card flex items-center justify-between mb-4 px-4 py-3">
          <span className="text-slate-300 text-sm font-body">{role}</span>
          <span className="text-slate-400 text-sm font-body tabular-nums">
            {currentIndex + 1} / {total}
          </span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mb-8 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="gradient-border p-6 sm:p-7 mb-6 fade-up">
          <div className="text-xs text-cyan-300 font-display font-semibold uppercase tracking-wider mb-3">
            Question {currentIndex + 1}
          </div>

          <p className="text-white text-lg font-display font-medium leading-relaxed">
            {questions[currentIndex]}
          </p>
        </div>

        {/* Hide the answer form after evaluation so the feedback becomes the next action. */}
        {!currentFeedback && (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be specific and use examples from your experience."
              rows={6}
              className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-4 text-white placeholder-slate-600 font-body text-sm resize-none focus:outline-none transition-colors mb-4 shadow-inner shadow-black/20"
            />

            {error && (
              <p className="text-red-400 text-sm font-body mb-3">
                {error}
              </p>
            )}

            <button
              onClick={onSubmit}
              disabled={isEvaluating || !answer.trim()}
              className="primary-button w-full disabled:opacity-40 disabled:cursor-not-allowed text-white font-display font-semibold py-3 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Evaluating...
                </>
              ) : (
                "Submit Answer ->"
              )}
            </button>
          </>
        )}

        {currentFeedback && (
          <FeedbackPanel
            feedback={currentFeedback}
            onNext={onNext}
            isLast={isLast}
          />
        )}
      </div>
    </div>
  );
}
