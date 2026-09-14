import { NextRequest, NextResponse } from "next/server";
import { getPhysicians } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get("specialty") || undefined;
  const state = searchParams.get("state") || undefined;
  const imlcOnly = searchParams.get("imlc") === "true";

  const physicians = getPhysicians({ specialty, state, imlcOnly });

  return NextResponse.json({
    success: true,
    count: physicians.length,
    physicians,
  });
}
