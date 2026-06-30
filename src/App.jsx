import SetupScreen from "./components/SetupScreen";
import LoadingScreen from "./components/LoadingScreen";
import InterviewScreen from "./components/InterviewScreen";
import { useInterview } from "./hooks/useInterview";
import ResultsScreen from "./components/ResultsScreen";
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
        onNext={interview.nextQuestion}
        currentFeedback={interview.currentFeedback}
        isEvaluating={interview.isEvaluating}
        error={interview.error}
      />
    );
  }

  if (interview.phase === "result") {
    return (
      <ResultsScreen
        role={interview.role}
        feedbacks={interview.feedbacks}
        avgScore={interview.avgScore}
        onRestart={interview.restart}
      />
    );
  }
}

export default App;