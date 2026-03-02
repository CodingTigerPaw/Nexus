import type { RouteObject } from "react-router";
import type RouteConfig from "./routeInteface.ts";

const createLazyRoute = ({ path, loadComponent, config }: RouteConfig): RouteObject => ({
  path,
  lazy: async () => {
    const module = await loadComponent();

    return {
      Component: module.default,
      handle: config ? { config } : undefined,
    };
  },
});

export default createLazyRoute;
