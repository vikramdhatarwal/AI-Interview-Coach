import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import geminiHandler from "../api/gemini.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 5173);

function loadEnvFile() {
  const envPath = path.join(root, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    req.on("error", reject);
  });
}

function createApiResponse(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };

  res.json = (body) => {
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
    }

    res.end(JSON.stringify(body));
    return res;
  };

  return res;
}

async function handleApiRequest(req, res) {
  try {
    req.body = await readJsonBody(req);
    await geminiHandler(req, createApiResponse(res));
  } catch (error) {
    createApiResponse(res).status(400).json({
      error: error.message || "Invalid API request.",
    });
  }
}

loadEnvFile();

const vite = await createViteServer({
  root,
  server: { middlewareMode: true },
  appType: "spa",
});

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/gemini") {
    handleApiRequest(req, res);
    return;
  }

  vite.middlewares(req, res);
});

server.listen(port, () => {
  console.log(`Local dev server running at http://localhost:${port}`);
  console.log("Vite UI and /api/gemini are served from the same origin.");
});
