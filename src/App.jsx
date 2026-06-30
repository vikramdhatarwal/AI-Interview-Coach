import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import SetupScreen from "./components/SetupScreen";
import LoadingScreen from "./components/LoadingScreen";
import InterviewScreen from "./components/InterviewScreen";
import ResultsScreen from "./components/ResultsScreen";
import { useInterview } from "./hooks/useInterview";

function SetupRoute({ interview }) {
  const navigate = useNavigate();

  async function handleStart() {
    const started = await interview.startInterview();

    if (started) {
      navigate("/interview/1");
    }
  }

  if (interview.isStarting) {
    return <LoadingScreen role={interview.role} />;
  }

  return (
    <SetupScreen
      role={interview.role}
      setRole={interview.setRole}
      onStart={handleStart}
      error={interview.error}
    />
  );
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

  return (
    <InterviewScreen
      role={interview.role}
      questions={interview.questions}
      currentIndex={interview.currentIndex}
      answer={interview.answer}
      setAnswer={interview.setAnswer}
      onSubmit={interview.submitAnswer}
      onNext={handleNext}
      currentFeedback={interview.currentFeedback}
      isEvaluating={interview.isEvaluating}
      error={interview.error}
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
