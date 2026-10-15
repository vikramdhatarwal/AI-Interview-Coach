import { useState, useCallback } from "react";
import { generateQuestions, evaluateAnswer } from "../utils/gemini";

export function useInterview() {
  const [role, setRole] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [error, setError] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [deferEvaluation, setDeferEvaluation] = useState(false);
  const [answers, setAnswers] = useState([]);

  const startInterview = useCallback(async () => {
    if (!role.trim()) {
      setError("Please enter a job role.");
      return false;
    }

    setError("");
    setIsStarting(true);

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
      setDeferEvaluation(false);
      setAnswers([]);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setIsStarting(false);
    }
  }, [role]);

  const startInterviewWithQuestions = useCallback((interviewRole, generatedQuestions) => {
    if (!interviewRole.trim()) {
      setError("Please enter a job role.");
      return false;
    }

    const normalizedQuestions = generatedQuestions
      .map((question) =>
        typeof question === "string" ? question : question?.question
      )
      .filter((question) => typeof question === "string" && question.trim())
      .map((question) => question.trim());

    if (normalizedQuestions.length === 0) {
      setError("No valid interview questions were generated.");
      return false;
    }

    setRole(interviewRole.trim());
    setQuestions(normalizedQuestions);
    setCurrentIndex(0);
    setFeedbacks([]);
    setCurrentFeedback(null);
    setAnswer("");
    setError("");
    setDeferEvaluation(true);
    setAnswers([]);
    return true;
  }, []);

  const submitAnswer = useCallback(async () => {
    if (!answer.trim()) {
      setError("Write your answer before submitting.");
      return;
    }

    setError("");
    setIsEvaluating(true);

    try {
      if (deferEvaluation) {
        const updatedAnswers = [...answers];
        updatedAnswers[currentIndex] = answer.trim();
        setAnswers(updatedAnswers);

        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((index) => index + 1);
          setAnswer("");
          return false;
        }

        const evaluatedFeedbacks = await Promise.all(
          questions.map((question, index) =>
            evaluateAnswer(role, question, updatedAnswers[index] || "")
          )
        );
        setFeedbacks(
          questions.map((question, index) => ({
            question,
            answer: updatedAnswers[index],
            feedback: evaluatedFeedbacks[index],
          }))
        );
        return true;
      }

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
  }, [answer, role, questions, currentIndex, deferEvaluation, answers]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      return null;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setAnswer("");
    setCurrentFeedback(null);
    setError("");
    setDeferEvaluation(false);
    setAnswers([]);
    return nextIndex;
  }, [currentIndex, questions.length]);

  const restart = useCallback(() => {
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
    isStarting,
    questions,
    currentIndex,
    answer,
    setAnswer,
    feedbacks,
    currentFeedback,
    error,
    isEvaluating,
    deferEvaluation,
    avgScore,
    startInterview,
    startInterviewWithQuestions,
    submitAnswer,
    nextQuestion,
    restart,
  };
}
