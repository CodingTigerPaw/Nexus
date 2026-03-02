// @vitest-environment node

import type { RouteObject } from "react-router";
import { describe, expect, it } from "vitest";
import { routes } from "../routes";

const invokeLazy = async (route: RouteObject) => {
  expect(route.lazy).toBeTypeOf("function");

  if (typeof route.lazy !== "function") {
    throw new TypeError("Route lazy definition is not callable");
  }

  return route.lazy();
};

describe("routes", () => {
  it("maps route definitions into lazy route objects", () => {
    expect(routes).toHaveLength(3);
    expect(routes.map((route) => route.path)).toEqual([
      "/",
      "/dice",
      "/userInfo",
    ]);

    routes.forEach((route) => {
      expect(route.lazy).toBeTypeOf("function");
    });
  });

  it("loads route components lazily", async () => {
    const loadedRoutes = await Promise.all(routes.map(invokeLazy));

    expect(loadedRoutes.map((route) => route?.Component?.name)).toEqual([
      "LandingPage",
      "DiceRoller",
      "UserInfo",
    ]);
  });
});
