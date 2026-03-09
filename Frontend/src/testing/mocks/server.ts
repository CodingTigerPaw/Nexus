// Node-side mock server that intercepts fetch/XHR in tests.
import { setupServer } from "msw/node";
import { handlers } from "./handlers.ts";

export const server = setupServer(...handlers);
