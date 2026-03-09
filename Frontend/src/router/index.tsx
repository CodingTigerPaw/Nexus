import { createBrowserRouter } from "react-router";
import { routes } from "./routes";

// Router instance is created once and reused by <RouterProvider />.
export const router = createBrowserRouter(routes);
