import { apiRequest } from "../../../shared/api/client";
import type {
  CompleteNewPasswordRequest,
  LoginRequest,
  LoginResponse,
} from "../types/auth";

// Thin API layer: no UI logic, only transport and typing.
export function login(payload: LoginRequest) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function completeNewPassword(payload: CompleteNewPasswordRequest) {
  return apiRequest<LoginResponse>("/api/auth/complete-new-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
