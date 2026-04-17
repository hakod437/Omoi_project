export interface AuthenticatedUser {
  userId: string;
  email: string | null;
}

export interface JwtPayload {
  sub: string;
  email: string | null;
}