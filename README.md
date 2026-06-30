# AI Interview MockMate

AI Interview MockMate is a Vite + React app that generates role-specific interview questions with Gemini, evaluates each answer, and summarizes the candidate's performance at the end of the session.

## Features

- Role setup screen with quick role suggestions
- Gemini-generated 10-question interview sessions
- One-question-at-a-time interview flow
- AI feedback with score, verdict, strengths, improvements, and a stronger answer example
- Final results screen with average score and per-question breakdown
- Responsive Tailwind CSS interface

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS
- Google Gemini API
- Vercel serverless function for API key proxying

## Project Structure

```text
src/
  App.jsx                         Screen routing based on interview phase
  main.jsx                        React entry point
  index.css                       Tailwind CSS entry file
  components/
    SetupScreen.jsx               Role input and role suggestions
    LoadingScreen.jsx             Loading/progress state while questions generate
    InterviewScreen.jsx           Question, answer, and submit UI
    FeedbackPanel.jsx             Per-answer feedback UI
    ResultsScreen.jsx             Final score summary
  hooks/
    useInterview.js               Interview state machine and user actions
  utils/
    gemini.js                     Frontend calls to the serverless Gemini proxy
api/
  gemini.js                       Serverless Gemini proxy; keeps the API key server-side
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```bash
npm.cmd install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The API key is proxied through the serverless function in `api/gemini.js`. The frontend calls `/api/gemini`, and the serverless function attaches `GEMINI_API_KEY` server-side before calling Gemini.

### 3. Start the development server

For full local API support, run the app with Vercel's local dev server so `/api/gemini` is available:

```bash
vercel dev
```

If you only need to work on frontend UI without calling Gemini, you can still run Vite directly:

```bash
npm run dev
```

PowerShell alternative:

```bash
npm.cmd run dev
```

### 4. Build for production

```bash
npm run build
```

PowerShell alternative:

```bash
npm.cmd run build
```

## App Flow

1. The user enters or selects a target interview role.
2. `useInterview.startInterview()` asks Gemini for a JSON array of 10 questions.
3. The app moves into the interview screen.
4. The user answers the current question.
5. `useInterview.submitAnswer()` asks Gemini to evaluate the answer.
6. `FeedbackPanel` displays the score, verdict, strengths, improvements, and sample stronger answer.
7. The user advances to the next question.
8. After the final question, `ResultsScreen` shows the average score and breakdown.

## Gemini Response Formats

Question generation expects a JSON array of strings:

```json
[
  "Tell me about a React project you built.",
  "How would you optimize a slow frontend page?"
]
```

Answer evaluation expects a JSON object:

```json
{
  "score": 8,
  "verdict": "Good",
  "strengths": ["Clear example", "Good technical detail"],
  "improvements": ["Add measurable impact", "Mention tradeoffs"],
  "idealAnswer": "A stronger answer would describe the problem, the action taken, and the measurable result."
}
```

## Troubleshooting

### Missing API key

If you see `Missing GEMINI_API_KEY on the server`, confirm that `.env` exists in the project root, uses `GEMINI_API_KEY`, and restart the dev server after editing it.

### Invalid JSON from Gemini

The app asks Gemini to return only JSON. If Gemini returns extra text or malformed JSON, the app shows a friendly parsing error. Try submitting again or lower the prompt creativity in `src/utils/gemini.js`.

### PowerShell blocks npm

If PowerShell says `npm.ps1 cannot be loaded because running scripts is disabled`, use `npm.cmd` commands instead, such as `npm.cmd run dev`.

## Notes For Future Improvements

- Add persistence for completed interview sessions.
- Add difficulty controls and question categories.
- Add automated tests for `useInterview` and Gemini parsing helpers.
