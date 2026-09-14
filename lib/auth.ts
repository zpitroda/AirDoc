import crypto from "node:crypto";
import { NextRequest } from "next/server";

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "airdoc2026!";
const SESSION_SECRET = process.env.SESSION_SECRET || "airdoc-secret-token-key-2026-purdue-locums";
const TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function verifyPassword(password: string): boolean {
  if (!password) return false;
  // Constant-time comparison to prevent timing attacks
  const expected = Buffer.from(DEFAULT_ADMIN_PASSWORD);
  const received = Buffer.from(password);
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

export function createAdminToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`admin:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

export function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration
  const ageSeconds = (Date.now() - timestamp) / 1000;
  if (ageSeconds > TOKEN_MAX_AGE_SECONDS || ageSeconds < -60) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`admin:${timestampStr}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

export function isAuthorizedAdmin(req: NextRequest): boolean {
  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (verifyAdminToken(token)) return true;
  }

  // Check Cookie
  const cookieToken = req.cookies.get("airdoc_admin_token")?.value;
  if (cookieToken && verifyAdminToken(cookieToken)) {
    return true;
  }

  return false;
}
