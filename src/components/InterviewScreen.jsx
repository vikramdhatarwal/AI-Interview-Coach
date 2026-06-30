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
          <span className="text-stone-700 text-sm font-body">{role}</span>
          <span className="text-stone-500 text-sm font-body tabular-nums">
            {currentIndex + 1} / {total}
          </span>
        </div>

        <div className="w-full bg-stone-200 rounded-full h-1.5 mb-8 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-[#a94f38] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="gradient-border p-6 sm:p-7 mb-6 fade-up">
          <div className="text-xs text-[#2f655e] font-display font-semibold uppercase tracking-wider mb-3">
            Question {currentIndex + 1}
          </div>

          <p className="text-stone-900 text-lg font-display font-medium leading-relaxed">
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
              className="w-full bg-white/80 border border-stone-300 focus:border-[#a94f38] rounded-xl px-4 py-4 text-stone-900 placeholder-stone-400 font-body text-sm resize-none focus:outline-none transition-colors mb-4 shadow-inner shadow-stone-200"
            />

            {error && (
              <p className="text-red-700 text-sm font-body mb-3">
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
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
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
