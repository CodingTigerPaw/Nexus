import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../../testing/mocks/server";
import LandingPage from "../index";

describe("LandingPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    server.resetHandlers();
  });

  it("logs health response from the API request", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({ test: "test" }),
      );
    });
  });
});
