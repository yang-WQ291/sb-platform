import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export interface SessionData {
  userId?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || "a-very-long-secret-at-least-32-chars-change-in-production",
  cookieName: "sb-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { wallet: true },
  });
}

import jwt from "jsonwebtoken";

export function signToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "jwt-secret-change-in-production",
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt-secret-change-in-production"
    ) as { userId: string };
  } catch {
    return null;
  }
}

export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  // Priority 1: Authorization: Bearer <token> (for mobile)
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (payload) return payload.userId;
  }

  // Priority 2: iron-session cookie (web fallback)
  try {
    const session = await getSession();
    if (session.userId) return session.userId;
  } catch {
    // session parse failed, fall through
  }

  return null;
}
