// Contract mirrors backend DTOs from /api/auth endpoints.
export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  idToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresIn: number;
};

export type AuthChallengeResponse = {
  message: string;
  challengeName: string | null;
  session: string | null;
  requiredAction: string;
};

export type CompleteNewPasswordRequest = {
  username: string;
  newPassword: string;
  session: string;
};
