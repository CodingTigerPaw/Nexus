import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

    fireEvent.change(screen.getByPlaceholderText("my placeholder"), {
      target: { value: "Abcdefg1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "data",
        expect.objectContaining({ test: "Abcdefg1" }),
      );
    });
  });
});
