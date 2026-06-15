import { spawn } from 'child_process';
import http from 'http';

// Use a dedicated test port so the suite never collides with a running dev server.
const PORT = process.env.PORT || '3001';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

let serverProcess;

// Poll the healthcheck endpoint until the server is up (or time out).
function waitForServer(url, retries = 30, interval = 200) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const req = http.get(`${url}/healthcheck`, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (remaining <= 0) {
          reject(new Error(`Server at ${url} did not start in time.`));
          return;
        }
        setTimeout(() => attempt(remaining - 1), interval);
      });
    };
    attempt(retries);
  });
}

export const mochaHooks = {
  // Start the API server before the whole suite so Supertest hits it over HTTP.
  async beforeAll() {
    this.timeout(20000);
    serverProcess = spawn('node', ['src/app.js'], {
      env: { ...process.env, PORT },
      stdio: 'ignore'
    });
    await waitForServer(BASE_URL);
  },

  // Shut the server down once all tests finish.
  afterAll() {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
};
