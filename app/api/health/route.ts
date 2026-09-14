import { NextRequest, NextResponse } from "next/server";
import { getSystemMetrics } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const isAuth = isAuthorizedAdmin(req);
    const responseData: Record<string, unknown> = {
      status: "healthy",
      service: "AirDoc Marketplace & Discovery API",
      timestamp: new Date().toISOString(),
    };

    if (isAuth) {
      responseData.metrics = getSystemMetrics();
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check probe failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
