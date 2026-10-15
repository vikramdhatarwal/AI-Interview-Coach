import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import SetupScreen from "./components/SetupScreen";
import LoadingScreen from "./components/LoadingScreen";
import InterviewScreen from "./components/InterviewScreen";
import ResultsScreen from "./components/ResultsScreen";
import { useInterview } from "./hooks/useInterview";
import JobRAGForm from "./components/JobRAGForm";

function SetupRoute({ interview }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("role");
  const [shouldNavigateToInterview, setShouldNavigateToInterview] = useState(false);

  useEffect(() => {
    if (shouldNavigateToInterview && interview.questions.length > 0) {
      navigate("/interview/1", { replace: true });
      setShouldNavigateToInterview(false);
    }
  }, [interview.questions.length, navigate, shouldNavigateToInterview]);

  async function handleStart() {
    const started = await interview.startInterview();

    if (started) {
      setShouldNavigateToInterview(true);
    }
  }

  function handleRagInterviewReady(interviewRole, questions) {
    const started = interview.startInterviewWithQuestions(interviewRole, questions);

    if (started) {
      setShouldNavigateToInterview(true);
    }
  }

  if (interview.isStarting) {
    return <LoadingScreen role={interview.role} />;
  }

  return (
    <>
      <div className="app-shell px-4 pt-8 sm:pt-10">
        <div className="mx-auto flex w-full max-w-md rounded-xl border border-stone-300/80 bg-white/55 p-1 shadow-sm">
          {[
            ["role", "Role-based interview"],
            ["job", "Job description (RAG)"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                mode === value
                  ? "bg-[#a94f38] text-white shadow-sm"
                  : "text-stone-500 hover:bg-white/70 hover:text-stone-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {mode === "role" ? (
        <SetupScreen
          role={interview.role}
          setRole={interview.setRole}
          onStart={handleStart}
          error={interview.error}
        />
      ) : (
        <RagRoute interview={interview} onInterviewReady={handleRagInterviewReady} />
      )}
    </>
  );
}

function RagRoute({ onInterviewReady }) {
  return <JobRAGForm onInterviewReady={onInterviewReady} />;
}

function InterviewRoute({ interview }) {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const routeQuestionNumber = Number(questionId);
  const currentQuestionNumber = interview.currentIndex + 1;
  const isKnownQuestion =
    Number.isInteger(routeQuestionNumber) &&
    routeQuestionNumber >= 1 &&
    routeQuestionNumber <= interview.questions.length;

  if (interview.questions.length === 0) {
    return <Navigate to="/setup" replace />;
  }

  if (!isKnownQuestion || routeQuestionNumber !== currentQuestionNumber) {
    return <Navigate to={`/interview/${currentQuestionNumber}`} replace />;
  }

  function handleNext() {
    const nextIndex = interview.nextQuestion();

    if (nextIndex === null) {
      navigate("/results");
      return;
    }

    navigate(`/interview/${nextIndex + 1}`);
  }

  async function handleSubmit() {
    const completed = await interview.submitAnswer();

    if (interview.deferEvaluation && completed) {
      navigate("/results");
    }
  }

  return (
    <InterviewScreen
      role={interview.role}
      questions={interview.questions}
      currentIndex={interview.currentIndex}
      answer={interview.answer}
      setAnswer={interview.setAnswer}
      onSubmit={handleSubmit}
      onNext={handleNext}
      currentFeedback={interview.currentFeedback}
      isEvaluating={interview.isEvaluating}
      error={interview.error}
      deferEvaluation={interview.deferEvaluation}
    />
  );
}

function ResultsRoute({ interview }) {
  const navigate = useNavigate();

  if (interview.feedbacks.length === 0) {
    return <Navigate to="/setup" replace />;
  }

  function handleRestart() {
    interview.restart();
    navigate("/setup");
  }

  return (
    <ResultsScreen
      role={interview.role}
      feedbacks={interview.feedbacks}
      avgScore={interview.avgScore}
      onRestart={handleRestart}
    />
  );
}

function AppRoutes() {
  const interview = useInterview();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/setup" replace />} />
      <Route path="/setup" element={<SetupRoute interview={interview} />} />
      <Route
        path="/rag"
        element={<Navigate to="/setup" replace />}
      />
      <Route
        path="/interview/:questionId"
        element={<InterviewRoute interview={interview} />}
      />
      <Route path="/results" element={<ResultsRoute interview={interview} />} />
      <Route path="*" element={<Navigate to="/setup" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
