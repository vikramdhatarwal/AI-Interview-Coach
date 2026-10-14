const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
];

const questionTopics = [
  "performance optimization",
  "testing strategy",
  "accessibility",
];

const answerTopics = [
  "debugging a production issue",
  "handling disagreement with a teammate",
  "designing a reliable API",
  "improving application performance",
  "prioritizing competing requirements",
  "responding to a failed deployment",
];

export const testCases = [
  ...roles.flatMap((role, index) =>
    questionTopics.map((topic, topicIndex) => ({
      id: `question-${index + 1}-${topicIndex + 1}`,
      type: "questions",
      role,
      prompt: `Generate exactly 5 interview questions for the role "${role}" focused partly on ${topic}. Mix behavioral, technical, and situational questions. Return only a JSON array of strings with no numbering or explanation.`,
    }))
  ),
  ...roles.flatMap((role, index) =>
    answerTopics.map((topic, topicIndex) => ({
      id: `feedback-${index + 1}-${topicIndex + 1}`,
      type: "feedback",
      role,
      prompt: `Evaluate this candidate answer for a ${role} interview. The question concerns ${topic}. Question: "Describe how you would approach ${topic}." Candidate answer: "I would first clarify the goal, inspect the available evidence, communicate tradeoffs, and verify the result with tests or monitoring." Return only a JSON object with score (1-10), verdict (Excellent, Good, Average, or Needs Work), strengths (array of strings), improvements (array of strings), and idealAnswer (string).`,
    }))
  ),
];

if (testCases.length !== 45) {
  throw new Error(`Expected 45 evaluation prompts, found ${testCases.length}.`);
}
