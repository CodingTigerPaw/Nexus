import type { ComponentType } from "react";

export default interface RouteConfig {
  path: string;
  loadComponent: () => Promise<{ default: ComponentType }>;
  config?: {
    role: string;
  };
}
