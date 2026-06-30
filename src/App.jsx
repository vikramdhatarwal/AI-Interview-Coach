import InterviewScreen from "./components/InterviewScreen";
import { useState } from "react";

function App() {
  const [answer, setAnswer] = useState("");

  return (
    <InterviewScreen
      role="Frontend Developer"
      questions={[
        "Tell me about yourself.",
        "What is React?",
        "Explain the Virtual DOM.",
        "What are React Hooks?",
        "Describe a project you built."
      ]}
      currentIndex={0}
      answer={answer}
      setAnswer={setAnswer}
    />
  );
}

export default App;