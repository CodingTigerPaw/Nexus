import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { router } from "./router";
import { queryClient } from "./shared/query/queryClient";

// App bootstrap:
// 1) React Query provider gives global server-state cache.
// 2) Router provider handles module navigation.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
