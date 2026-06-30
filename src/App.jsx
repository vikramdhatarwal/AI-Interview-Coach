import { useState } from "react";
import InterviewScreen from "./components/InterviewScreen";

function App() {
  const [answer, setAnswer] = useState("");

  return (
    <InterviewScreen
      role="Frontend Developer"
      questions={[
        "Tell me about yourself.",
        "What is React?",
        "Explain the Virtual DOM.",
      ]}
      currentIndex={0}
      answer={answer}
      setAnswer={setAnswer}
      onSubmit={() => alert("Answer submitted")}
      isEvaluating={false}
      error=""
    />
  );
}

export default App;