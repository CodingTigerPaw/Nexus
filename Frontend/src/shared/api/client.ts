export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

// API base can be changed with VITE_API_URL (defaults to local backend).
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5080";

type ApiRequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  // Generic transport wrapper for every backend call.
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const canParseBody = contentType.includes("application/json");
  const payload = canParseBody ? await response.json() : null;

  if (!response.ok) {
    // Normalize backend errors into one predictable client error type.
    const fallbackMessage = `Request failed with status ${response.status}`;
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : fallbackMessage;

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
