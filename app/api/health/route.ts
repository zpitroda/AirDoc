import { NextResponse } from "next/server";
import { getSystemMetrics } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const metrics = getSystemMetrics();
    return NextResponse.json({
      status: "healthy",
      service: "AirDoc Marketplace & Discovery API",
      timestamp: new Date().toISOString(),
      storage: "persistent-sqlite",
      metrics,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
