// @vitest-environment node

import type { ComponentType } from "react";
import type { RouteObject } from "react-router";
import { describe, expect, it, vi } from "vitest";
import createLazyRoute from "../createLazyRoute";

const invokeLazy = async (route: RouteObject) => {
  expect(route.lazy).toBeTypeOf("function");

  if (typeof route.lazy !== "function") {
    throw new TypeError("Route lazy definition is not callable");
  }

  return route.lazy();
};

describe("createLazyRoute", () => {
  it("creates a route object with lazy-loaded component", async () => {
    const TestComponent = () => null;
    const loadComponent = vi
      .fn<() => Promise<{ default: ComponentType }>>()
      .mockResolvedValue({ default: TestComponent });

    const route = createLazyRoute({
      path: "/test",
      loadComponent,
    });

    expect(route.path).toBe("/test");
    const lazyRoute = await invokeLazy(route);

    expect(loadComponent).toHaveBeenCalledTimes(1);
    expect(lazyRoute).toEqual({
      Component: TestComponent,
      handle: undefined,
    });
  });

  it("passes route config through handle", async () => {
    const TestComponent = () => null;

    const route = createLazyRoute({
      path: "/protected",
      loadComponent: async () => ({ default: TestComponent }),
      config: {
        role: "admin",
      },
    });

    const lazyRoute = await invokeLazy(route);

    expect(lazyRoute).toEqual({
      Component: TestComponent,
      handle: {
        config: {
          role: "admin",
        },
      },
    });
  });
});
