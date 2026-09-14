import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createAdminToken, isAuthorizedAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Invalid administrative password" },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Administrative access authorized",
      token,
    });

    // Set HTTP-only session cookie
    response.cookies.set("airdoc_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
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
