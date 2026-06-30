import { useState, useCallback } from "react";
import { generateQuestions, evaluateAnswer } from "../utils/gemini";

export function useInterview() {
  const [role, setRole] = useState("");
  const [phase, setPhase] = useState("setup"); // setup | loading | interview | result
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [error, setError] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const startInterview = useCallback(async () => {
    if (!role.trim()) {
      setError("Please enter a job role.");
      return;
    }
    setError("");
    setPhase("loading");
    try {
      const qs = await generateQuestions(role);
      setQuestions(qs);
      setCurrentIndex(0);
      setFeedbacks([]);
      setCurrentFeedback(null);
      setAnswer("");
      setPhase("interview");
    } catch (e) {
      setError(e.message);
      setPhase("setup");
    }
  }, [role]);

  const submitAnswer = useCallback(async () => {
    if (!answer.trim()) {
      setError("Write your answer before submitting.");
      return;
    }
    setError("");
    setIsEvaluating(true);
    try {
      const fb = await evaluateAnswer(role, questions[currentIndex], answer);
      setCurrentFeedback(fb);
      setFeedbacks((prev) => [...prev, { question: questions[currentIndex], answer, feedback: fb }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsEvaluating(false);
    }
  }, [answer, role, questions, currentIndex]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswer("");
      setCurrentFeedback(null);
      setError("");
    }
  }, [currentIndex, questions.length]);

  const restart = useCallback(() => {
    setPhase("setup");
    setRole("");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setFeedbacks([]);
    setCurrentFeedback(null);
    setError("");
  }, []);

  const avgScore =
    feedbacks.length > 0
      ? Math.round(feedbacks.reduce((sum, f) => sum + f.feedback.score, 0) / feedbacks.length)
      : 0;

  return {
    role, setRole,
    phase,
    questions,
    currentIndex,
    answer, setAnswer,
    feedbacks,
    currentFeedback,
    error,
    isEvaluating,
    avgScore,
    startInterview,
    submitAnswer,
    nextQuestion,
    restart,
  };
}
