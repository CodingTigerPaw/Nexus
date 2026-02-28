import { spawn } from "node:child_process";

const stripAnsi = (value) => value.replace(/\u001B\[[0-9;]*m/g, "");

const child = spawn(
  process.platform === "win32" ? "pnpm.cmd" : "pnpm",
  ["exec", "turbo", "run", "dev", "--parallel"],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  },
);

const urls = {
  frontend: "http://localhost:5173/",
  backend: "http://localhost:5080",
};

let frontendReady = false;
let backendReady = false;
let backendStarted = false;
let summaryPrinted = false;
let summaryTimer;

const printSummary = () => {
  if (summaryPrinted) return;
  summaryPrinted = true;

  process.stdout.write(
    `\nDev endpoints:\n` +
      `Frontend: ${urls.frontend}\n` +
      `Backend: ${urls.backend}\n` +
      `Backend health: ${urls.backend}/health\n\n`,
  );
};

const scheduleSummary = () => {
  if (summaryPrinted) return;
  if (summaryTimer) clearTimeout(summaryTimer);
  summaryTimer = setTimeout(printSummary, 1500);
};

const handleChunk = (chunk, target) => {
  target.write(chunk);

  const text = stripAnsi(String(chunk));
  const frontendMatch = text.match(/Local:\s+(https?:\/\/[^\s]+)/);
  const backendMatch = text.match(/Now listening on:\s+(https?:\/\/[^\s]+)/);
  const backendStartedMatch = text.includes("Application started. Press Ctrl+C to shut down.");

  if (frontendMatch) {
    urls.frontend = frontendMatch[1];
    frontendReady = true;
  }

  if (backendMatch && backendMatch[1].startsWith("http://")) {
    urls.backend = backendMatch[1];
    backendReady = true;
  }

  if (backendStartedMatch) {
    backendStarted = true;
  }

  if (frontendReady && backendReady && backendStarted) {
    printSummary();
    return;
  }

  if (frontendReady && backendReady) {
    scheduleSummary();
    return;
  }

  if (frontendReady || backendReady || backendStarted) {
    scheduleSummary();
  }
};

child.stdout.on("data", (chunk) => handleChunk(chunk, process.stdout));
child.stderr.on("data", (chunk) => handleChunk(chunk, process.stderr));

child.on("exit", (code, signal) => {
  if (summaryTimer) clearTimeout(summaryTimer);

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
