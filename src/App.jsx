import SetupScreen from "./components/SetupScreen";
import LoadingScreen from "./components/LoadingScreen";
import InterviewScreen from "./components/InterviewScreen";
import { useInterview } from "./hooks/useInterview";

function App() {
  const interview = useInterview();

  if (interview.phase === "setup") {
    return (
      <SetupScreen
        role={interview.role}
        setRole={interview.setRole}
        onStart={interview.startInterview}
        error={interview.error}
      />
    );
  }

  if (interview.phase === "loading") {
    return <LoadingScreen role={interview.role} />;
  }

  if (interview.phase === "interview") {
    return (
      <InterviewScreen
        role={interview.role}
        questions={interview.questions}
        currentIndex={interview.currentIndex}
        answer={interview.answer}
        setAnswer={interview.setAnswer}
        onSubmit={interview.submitAnswer}
        isEvaluating={interview.isEvaluating}
        error={interview.error}
      />
    );
  }

  return <div>Results Coming Soon...</div>;
}

export default App;