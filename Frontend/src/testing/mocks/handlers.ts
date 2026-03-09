import { http, HttpResponse } from "msw";

// Test handlers emulate backend endpoints used by UI tests.
export const handlers = [
  http.get("http://localhost:5080/health", () => {
    const response = {
      status: "ok",
      service: "Nexus.Api",
      timestamp: Date.now(),
      test: "test",
    };
    return HttpResponse.json(response);
  }),
];
