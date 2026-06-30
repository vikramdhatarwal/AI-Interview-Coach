import { useState, useCallback } from "react";
import { generateQuestions, evaluateAnswer } from "../utils/gemini";

export function useInterview() {
  const [role, setRole] = useState("");
  // Valid phases: setup -> loading -> interview -> result.
  const [phase, setPhase] = useState("setup");
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
      const generatedQuestions = await generateQuestions(role);

      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error("Gemini did not return any interview questions.");
      }

      setQuestions(generatedQuestions);
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
      // Store the latest feedback separately so the current question can show it immediately.
      const feedback = await evaluateAnswer(role, questions[currentIndex], answer);
      setCurrentFeedback(feedback);
      setFeedbacks((prev) => [
        ...prev,
        { question: questions[currentIndex], answer, feedback },
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsEvaluating(false);
    }
  }, [answer, role, questions, currentIndex]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("result");
      return;
    }

    setCurrentIndex((index) => index + 1);
    setAnswer("");
    setCurrentFeedback(null);
    setError("");
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
      ? Math.round(feedbacks.reduce((sum, item) => sum + item.feedback.score, 0) / feedbacks.length)
      : 0;

  return {
    role,
    setRole,
    phase,
    questions,
    currentIndex,
    answer,
    setAnswer,
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
