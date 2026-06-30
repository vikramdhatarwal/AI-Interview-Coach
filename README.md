# AI Interview MockMate

AI Interview MockMate is a React + Vite interview practice application that uses the Google Gemini API to generate role-specific interview questions, evaluate user answers, and summarize the full practice session.

Author: Vikram Dhatarwal


# Live Demo

https://ai-interview-coach-navy-eight.vercel.app/setup


## Project Overview

The application is built as a single-page React app with route-based screens for setup, interview practice, and final results. The browser never calls Gemini directly. Instead, the frontend sends prompts to a local/serverless API proxy at `/api/gemini`, and that proxy attaches the Gemini API key from the server environment before forwarding the request to Google.

This architecture keeps the API key out of browser code while still giving the frontend a simple same-origin API endpoint.

## Main Features

- Role selection screen with quick role suggestions
- AI-generated interview sessions with 10 questions by default
- One-question-at-a-time interview flow
- Answer submission and Gemini-based evaluation
- Feedback with score, verdict, strengths, improvements, and an ideal answer summary
- Final results screen with average score, top answer, focus area, and question-by-question breakdown
- Responsive Tailwind CSS interface
- Local development server that serves both the Vite app and `/api/gemini`

## Technology Stack

- React 18 for UI
- React Router for screen routing
- Vite 5 for development and production builds
- Tailwind CSS for styling
- Google Gemini API for question generation and answer evaluation
- Node HTTP server for local API + Vite middleware
- Vercel-compatible `api/gemini.js` handler for serverless deployment

## Actual Architecture

```text
Browser
  |
  | POST /api/gemini
  v
Local dev server or serverless runtime
  |
  | Reads GEMINI_API_KEY or VITE_GEMINI_API_KEY from environment
  | Calls Google Gemini generateContent endpoint
  v
Gemini API
  |
  | Returns generated text
  v
API proxy
  |
  | Returns { text: "..." } to the frontend
  v
React app parses JSON and updates interview state
```

## Directory Structure

```text
.
+-- api/
|   +-- gemini.js
|       Serverless-style Gemini proxy. Validates requests, reads the API key,
|       calls Gemini, normalizes response errors, and returns JSON to the app.
|
+-- scripts/
|   +-- dev-server.js
|       Local development server. Loads .env, mounts /api/gemini, and serves
|       the Vite React app from the same origin.
|
+-- src/
|   +-- App.jsx
|   |   Defines the application routes: /setup, /interview/:questionId,
|   |   and /results.
|   |
|   +-- main.jsx
|   |   React entry point.
|   |
|   +-- index.css
|   |   Tailwind entry file plus custom base styles, surfaces, buttons,
|   |   gradients, and animations.
|   |
|   +-- hooks/
|   |   +-- useInterview.js
|   |       Main interview state machine. Owns role, questions, current answer,
|   |       feedback, loading states, errors, navigation actions, and average score.
|   |
|   +-- utils/
|   |   +-- gemini.js
|   |       Frontend Gemini client. Calls /api/gemini, parses AI JSON output,
|   |       validates generated questions, and normalizes feedback objects.
|   |
|   +-- components/
|       +-- SetupScreen.jsx
|       |   Role input screen and suggested role buttons.
|       |
|       +-- LoadingScreen.jsx
|       |   Loading state while Gemini generates questions.
|       |
|       +-- InterviewScreen.jsx
|       |   Current question, answer textarea, submit button, and feedback area.
|       |
|       +-- FeedbackPanel.jsx
|       |   Score ring, verdict, strengths, improvements, and next action.
|       |
|       +-- ResultsScreen.jsx
|           Final summary, average score, top answer, focus area, and breakdown.
|
+-- index.html
+-- package.json
+-- tailwind.config.js
+-- postcss.config.js
+-- vite.config.js
```

## Runtime Flow

1. The user opens the app and lands on `/setup`.
2. `SetupScreen` collects a target role, such as `Frontend Developer`.
3. `useInterview.startInterview()` calls `generateQuestions()` from `src/utils/gemini.js`.
4. `generateQuestions()` sends a prompt to `/api/gemini`.
5. `api/gemini.js` forwards the prompt to Gemini and returns the generated text.
6. The frontend parses the text as a JSON array of questions.
7. The app navigates to `/interview/1`.
8. The user writes an answer and submits it.
9. `useInterview.submitAnswer()` calls `evaluateAnswer()`.
10. Gemini returns a JSON feedback object.
11. `FeedbackPanel` shows the score, verdict, strengths, improvements, and ideal answer.
12. The user moves through the questions.
13. After the final question, the app navigates to `/results`.
14. `ResultsScreen` calculates and displays the session summary.

## State Management

The project does not use Redux, Zustand, or a backend database. Interview state is kept in the custom React hook:

```text
src/hooks/useInterview.js
```

This hook manages:

- Selected role
- Loading state for question generation
- Generated questions
- Current question index
- Current answer text
- Per-question feedback
- Current feedback panel state
- Error messages
- Evaluation loading state
- Average score
- Start, submit, next, and restart actions

Because state is in memory, refreshing the page resets the current interview session.

## API Proxy

The API endpoint is:

```text
POST /api/gemini
```

Request body:

```json
{
  "prompt": "Generate interview questions..."
}
```

Successful response:

```json
{
  "text": "[\"Question 1\", \"Question 2\"]"
}
```

The proxy accepts the API key from either:

```env
GEMINI_API_KEY=your_key_here
```

or, for local compatibility:

```env
VITE_GEMINI_API_KEY=your_key_here
```

`GEMINI_API_KEY` is preferred because the key is server-side and should not be treated as a browser-facing Vite variable.

## Gemini Model

The proxy currently uses:

```js
gemini-3.5-flash
```

The model is configured in:

```text
api/gemini.js
```

## Gemini Response Contracts

Question generation expects Gemini to return a JSON array of strings:

```json
[
  "Tell me about a React project you built.",
  "How would you optimize a slow frontend page?"
]
```

Answer evaluation expects Gemini to return a JSON object:

```json
{
  "score": 8,
  "verdict": "Good",
  "strengths": ["Clear example", "Good technical detail"],
  "improvements": ["Add measurable impact", "Mention tradeoffs"],
  "idealAnswer": "A stronger answer would describe the problem, action, and measurable result."
}
```

The frontend includes defensive parsing for common AI response issues, including fenced JSON blocks, extra surrounding text, missing fields, invalid scores, and non-string list values.

## Installation

Install dependencies:

```bash
npm install
```

On Windows PowerShell, if script execution blocks `npm`, use:

```powershell
npm.cmd install
```

## Environment Setup

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

If you already have this variable, the app will also read it locally:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

After changing `.env`, restart the dev server.

## Development

Run the full local development server:

```bash
npm run dev
```

PowerShell:

```powershell
npm.cmd run dev
```

This command starts `scripts/dev-server.js`, which serves both:

- React/Vite frontend
- `/api/gemini` API proxy

For frontend-only work, you can run Vite without the API proxy:

```bash
npm run dev:vite
```

PowerShell:

```powershell
npm.cmd run dev:vite
```

Do not use `dev:vite` when testing Gemini features, because `/api/gemini` will not be available.

## Production Build

Build the app:

```bash
npm run build
```

PowerShell:

```powershell
npm.cmd run build
```

Preview the production build:

```bash
npm run preview
```

PowerShell:

```powershell
npm.cmd run preview
```

## Package Scripts

```json
{
  "dev": "node scripts/dev-server.js",
  "dev:vite": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## Troubleshooting

### PowerShell blocks npm

Use `npm.cmd` instead:

```powershell
npm.cmd run dev
```

### Missing GEMINI_API_KEY

Make sure `.env` exists in the project root and contains:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Then restart the dev server.

### `/api/gemini` returns frontend HTML

This happens when the app is running with the frontend-only Vite server. Stop the server and start the full dev server:

```powershell
npm.cmd run dev
```

### Gemini returns invalid JSON

The prompts request JSON-only output, and the frontend tries to recover from fenced JSON or extra text. If parsing still fails, submit again or adjust the prompt in:

```text
src/utils/gemini.js
```

### Gemini returns a non-JSON API response

The API proxy reads upstream responses as text first, then parses JSON. If Google returns HTML, an empty response, or another unexpected body, the app displays a more specific error with the HTTP status and a short response preview.

## Deployment Notes

The `api/gemini.js` file follows a Vercel-style serverless function shape:

```js
export default async function handler(req, res) {}
```

For Vercel deployment, set `GEMINI_API_KEY` in the project environment variables.

For another hosting provider, make sure:

- Static frontend files from `dist/` are served correctly
- `POST /api/gemini` is routed to the API handler
- `GEMINI_API_KEY` is available in the server environment

## Current Limitations

- Interview sessions are not persisted after refresh.
- There is no authentication or user history.
- There are no automated tests yet.
- Question count is controlled in code, not by a UI setting.
- Gemini availability, quota, and model behavior can affect app responses.

## Future Improvements

- Add session persistence with local storage or a database
- Add difficulty and question category controls
- Add automated tests for `useInterview` and Gemini parsing
- Add export/share options for final feedback
- Add authentication and user interview history
- Add model selection through configuration
