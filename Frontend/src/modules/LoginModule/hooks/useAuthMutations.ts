import { useMutation } from "@tanstack/react-query";
import { ApiError } from "../../../shared/api/client";
import { completeNewPassword, login } from "../api/authApi";
import type {
  AuthChallengeResponse,
  CompleteNewPasswordRequest,
  LoginRequest,
  LoginResponse,
} from "../types/auth";
import { useAuthStore } from "../../../zustand/store";

// Convert backend token payload into client session format (adds absolute expiry).
function mapSession(data: LoginResponse) {
  return {
    accessToken: data.accessToken,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType,
    expiresIn: data.expiresIn,
    expiresAt: Date.now() + data.expiresIn * 1000,
  };
}

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);
  const setChallenge = useAuthStore((state) => state.setChallenge);
  const clearChallenge = useAuthStore((state) => state.clearChallenge);

  return useMutation({
    mutationFn: async ({
      username,
      password,
      rememberMe,
    }: LoginRequest & { rememberMe: boolean }) => {
      try {
        const response = await login({ username, password });
        return { type: "success" as const, response, rememberMe, username };
      } catch (error) {
        // Backend returns 409 when Cognito requires a challenge step.
        if (
          error instanceof ApiError &&
          error.status === 409 &&
          error.payload &&
          typeof error.payload === "object"
        ) {
          const challenge = error.payload as AuthChallengeResponse;
          console.log("Backend challenge response:", challenge);
          return { type: "challenge" as const, challenge, rememberMe, username };
        }

        throw error;
      }
    },
    onSuccess: (result) => {
      if (result.type === "success") {
        clearChallenge();
        setSession(mapSession(result.response), result.username, result.rememberMe);
        return;
      }

      // Save challenge context so dedicated UI can continue authentication flow.
      setChallenge(
        {
          challengeName: result.challenge.challengeName,
          requiredAction: result.challenge.requiredAction,
          session: result.challenge.session,
        },
        result.username,
        result.rememberMe,
      );
    },
  });
}

export function useCompleteNewPasswordMutation() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearChallenge = useAuthStore((state) => state.clearChallenge);

  return useMutation({
    mutationFn: async (
      payload: CompleteNewPasswordRequest & { rememberMe: boolean },
    ) => {
      const { rememberMe, ...request } = payload;
      const response = await completeNewPassword(request);
      return { response, rememberMe, username: request.username };
    },
    onSuccess: ({ response, rememberMe, username }) => {
      // Completing challenge returns normal token payload.
      clearChallenge();
      setSession(mapSession(response), username, rememberMe);
    },
  });
}
