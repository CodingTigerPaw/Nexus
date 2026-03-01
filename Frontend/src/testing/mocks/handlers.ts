import { http, HttpResponse } from "msw";

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
