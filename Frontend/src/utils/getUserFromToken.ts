import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub: string;
  Email: string;
  Name: string;
  Role: string;
  exp: number;
  iat: number;
}

export const getUserFromToken = (token: string) => {
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    return null;
  }
};
