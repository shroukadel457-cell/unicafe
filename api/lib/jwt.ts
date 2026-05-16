import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "unicafe-secret-jwt-key-2026";

export function signToken(payload: {
  userId: number;
  email: string;
  role: string;
}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(
  token: string
): { userId: number; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}
