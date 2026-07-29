import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  id: string;
  role: "admin";
}

export function generateToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}