import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createAdminToken, isAuthorizedAdmin } from "@/lib/auth";
import { checkAdminAuthRateLimit, recordAdminAuthFailure, resetAdminAuthLimit } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = checkAdminAuthRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Account temporarily locked. Please retry after ${rateCheck.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || !verifyPassword(password)) {
      recordAdminAuthFailure(ip);
      return NextResponse.json(
        { success: false, error: "Invalid administrative password" },
        { status: 401 }
      );
    }

    resetAdminAuthLimit(ip);
    const token = createAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Administrative access authorized",
      token,
    });

    // Set HTTP-only session cookie with Strict sameSite
    response.cookies.set("airdoc_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authorized = isAuthorizedAdmin(req);
  return NextResponse.json({ authenticated: authorized });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("airdoc_admin_token");
  return response;
}
