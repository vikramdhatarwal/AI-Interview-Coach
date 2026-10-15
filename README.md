# AI Interview MockMate

AI Interview MockMate is a React + Vite interview practice application that uses the Google Gemini API to generate role-specific interview questions, evaluate user answers, and summarize the full practice session.

Author: Vikram Dhatarwal


# Live Demo

https://ai-interview-coach-navy-eight.vercel.app/setup


## Project Overview

The application is built as a single-page React app with setup, interview practice, and final results screens. Users can choose either a role-based interview or a job-description-grounded interview. The browser never calls Gemini or Supabase directly with server credentials; requests go through server-side API handlers.

This architecture keeps Gemini and Supabase service credentials out of browser code while giving the frontend same-origin API endpoints.

## Gemini Evaluation

The Gemini response format was evaluated using a fixed 45-prompt test set
through GitHub Actions.

- Model: `gemini-3.5-flash`
- Prompts: 45
- Iterations: 1
- Request success rate: 100%
- JSON validity rate: 100%
- Schema compliance rate: 100%

The detailed output is uploaded as an artifact by the manually triggered
`Gemini Evaluation` workflow.



## Main Features

- Role selection screen with quick role suggestions
- Role-based interviews with 10 generated questions
- Job-description RAG interviews with 5 retrieved-context questions
- Job-description chunking, Gemini embeddings, and Supabase pgvector storage
- Similarity retrieval to ground generated questions in job requirements
- One-question-at-a-time interview flow
- Gemini-based answer evaluation with scores and weak-spot feedback
- End-of-session evaluation for RAG interviews after all five answers are submitted
- Feedback with score, verdict, strengths, improvements, and an ideal answer summary
- Final results screen with average score, top answer, focus area, and clickable full question reviews
- Responsive Tailwind CSS interface
- Local development server that serves the Vite app and all Gemini/RAG API routes

## Technology Stack

- React 18 for UI
- React Router for screen routing
- Vite 5 for development and production builds
- Tailwind CSS for styling
- Google Gemini API for question generation and answer evaluation
- Gemini Embeddings API for job-description vectors
- Supabase PostgreSQL with pgvector for vector storage and similarity search
- Node HTTP server for local API + Vite middleware
- Vercel-compatible serverless API handlers

## Actual Architecture

```text
Browser
  |
  | Role interview: POST /api/gemini
  | RAG ingestion: POST /api/ingest-job
  | RAG generation: POST /api/generate-questions
  v
Local dev server or Vercel serverless runtime
  |
  +--> Gemini API
  |      +--> Question generation and answer evaluation
  |      +--> Gemini embeddings
  |
  +--> Supabase pgvector
         +--> Stores job-description chunks and embeddings
         +--> Retrieves top matching passages
  |
  +--> Grounded Gemini prompt
```

## Directory Structure

```text
.
+-- api/
|   +-- gemini.js
|       Serverless-style Gemini proxy. Validates requests, reads the API key,
|       calls Gemini, normalizes response errors, and returns JSON to the app.
|   +-- ingest-job.js
|       Chunks a job description, creates embeddings, and stores vectors.
|   +-- generate-questions.js
|       Retrieves similar job-description chunks and generates grounded questions.
|
+-- scripts/
|   +-- dev-server.js
|       Local development server. Loads .env, mounts Gemini/RAG API handlers,
|       and serves the Vite React app from the same origin.
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
|       |   Unified setup screen for role-based or job-description interviews.
|       |
|       +-- JobRAGForm.jsx
|       |   Job-description input, indexing status, and RAG interview setup.
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

### Role-based interview

1. The user selects **Role-based interview** and enters a target role.
2. `useInterview.startInterview()` requests 10 questions through `/api/gemini`.
3. The app parses and validates the JSON question list.
4. The user answers one question at a time.
5. Each answer is evaluated immediately and shown in `FeedbackPanel`.
6. The final results screen summarizes the session.

### Job-description RAG interview

1. The user selects **Job description (RAG)** and enters a target role.
2. The user pastes a job description and submits it to `/api/ingest-job`.
3. The server chunks the text, creates Gemini embeddings, and stores each chunk in Supabase pgvector under a new document ID.
4. `/api/generate-questions` embeds a retrieval query and calls the `match_job_chunks` Supabase RPC.
5. The retrieved passages are added to a grounded Gemini prompt.
6. Five generated questions are passed into the same interview route as the role-based flow.
7. The user submits all five answers without seeing intermediate scores.
8. Gemini evaluates all five answers after the final submission.
9. The results screen shows the overall review and clickable full reviews for every question.

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
- Interview mode and deferred answer collection for RAG sessions
- Start, submit, next, and restart actions

Because interview state is in memory, refreshing the page resets the current interview session. Indexed job-description chunks remain in Supabase after a refresh.

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
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

`GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` are server-side
variables. Do not prefix them with `VITE_`, expose them through
`import.meta.env`, or commit `.env`. After changing `.env`, restart the dev
server.

## RAG Database Setup

The RAG flow requires a Supabase project with the `vector` extension, a
`job_chunks` table, and a `match_job_chunks` RPC function. The embedding model
currently returns 3072-dimensional vectors, so the table and function must use
`vector(3072)`.

The table needs these fields:

```text
document_id uuid
user_id text
chunk_index integer
content text
embedding vector(3072)
metadata jsonb
created_at timestamptz
```

The `match_job_chunks` function should filter by `document_id`, order by cosine
distance using `<=>`, and return the most relevant chunks. The server expects
the RPC parameters `query_embedding`, `match_document_id`, and `match_count`.

Each ingestion creates a new document ID. Re-entering the same job description
currently creates another set of chunks and embeddings; content-hash
deduplication and automatic cleanup are not implemented yet.

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
- `/api/ingest-job` RAG ingestion
- `/api/generate-questions` retrieval and grounded generation

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
  "preview": "vite preview",
  "evaluate": "node evaluation/run-evaluation.js",
  "validate:evaluation": "node evaluation/validate.js"
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

### Supabase URL or service key errors

Make sure `.env` contains:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

The custom local server loads `.env` before importing the Supabase API
handlers. Restart `npm run dev` after changing either value.

### Embedding dimension mismatch

If Supabase reports an error such as `expected 768 dimensions, not 3072`,
update the `job_chunks.embedding` column and `match_job_chunks` function to
use `vector(3072)`, matching the current `gemini-embedding-001` response.

### Missing `job_chunks` table or `match_job_chunks` RPC

Run the RAG database setup SQL in the Supabase SQL editor. The ingestion route
cannot store vectors and the generation route cannot retrieve context until
both the table and RPC function exist.

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
For the RAG flow, also set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

For another hosting provider, make sure:

- Static frontend files from `dist/` are served correctly
- `POST /api/gemini` is routed to the API handler
- `POST /api/ingest-job` and `POST /api/generate-questions` are routed to their handlers
- `GEMINI_API_KEY` is available in the server environment
- Supabase server variables are available in the server environment

## Current Limitations

- Interview sessions are not persisted after refresh.
- There is no authentication or user history.
- Question count is controlled in code, not by a UI setting.
- Gemini availability, quota, and model behavior can affect app responses.
- Re-indexing the same job description creates duplicate chunks because content-hash deduplication is not implemented.

## Future Improvements

- Add session persistence with local storage or a database
- Add difficulty and question category controls
- Add automated tests for `useInterview` and Gemini parsing
- Add export/share options for final feedback
- Add authentication and user interview history
- Add model selection through configuration

## Evaluation

The repository includes a reproducible 45-prompt evaluation harness:

```bash
npm run evaluate -- --iterations=3
```

Set `GEMINI_API_KEY` in the environment before running it. The harness records
two metrics in `evaluation/results.json`:

For testing an already-deployed proxy without exposing a local key, set
`EVALUATION_PROXY_URL` to the deployed `POST /api/gemini` URL instead.

- **JSON validity rate:** the percentage of responses from which the defensive
  parser extracts valid JSON, excluding failed API requests.
- **Schema compliance rate:** the percentage of parsed responses that satisfy
  the application's question or feedback contract after normalization,
  excluding failed API requests.
- **Request success rate:** the percentage of prompts for which Gemini returned
  a response instead of an HTTP or network error.

The prompt set contains 15 question-generation cases and 30 answer-feedback
cases. Results include each response's iteration, case ID, metric outcomes, and
any parsing or validation error. Do not commit API keys or sensitive candidate
answers.
