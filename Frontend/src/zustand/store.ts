import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Session data returned after successful Cognito authentication.
type AuthSession = {
  accessToken: string;
  idToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
};

type AuthChallenge = {
  challengeName: string | null;
  requiredAction: string;
  session: string | null;
};

// Local auth store: UI/session/challenge state that is not ideal for server cache.
type AuthState = {
  username: string | null;
  rememberMe: boolean;
  session: AuthSession | null;
  challenge: AuthChallenge | null;
  setSession: (
    session: AuthSession,
    username: string,
    rememberMe: boolean,
  ) => void;
  setChallenge: (
    challenge: AuthChallenge,
    username: string,
    rememberMe: boolean,
  ) => void;
  clearChallenge: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        username: null,
        rememberMe: false,
        session: null,
        challenge: null,
        setSession: (session, username, rememberMe) =>
          // Success path: authenticated session replaces challenge state.
          set(() => ({
            session,
            username,
            rememberMe,
            challenge: null,
          })),
        setChallenge: (challenge, username, rememberMe) =>
          // Challenge path: backend asks for additional action (e.g. new password).
          set(() => ({
            challenge,
            username,
            rememberMe,
            session: null,
          })),
        clearChallenge: () => set(() => ({ challenge: null })),
        logout: () =>
          set(() => ({
            username: null,
            rememberMe: false,
            session: null,
            challenge: null,
          })),
      }),
      {
        // Persist allows page refresh without losing auth context.
        name: "nexus-auth-store",
      },
    ),
    {
      name: "auth-store",
    },
  ),
);
