import { NextRequest, NextResponse } from "next/server";
import { getPilotSubmissionById, updatePilotSubmissionStatus, deletePilotSubmission } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";
import { SubmissionStatus } from "@/lib/types";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Administrative session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const submission = getPilotSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const status = body.status as SubmissionStatus | undefined;
    const internalNotes = body.internal_notes as string | undefined;

    const updated = updatePilotSubmissionStatus(id, status, internalNotes);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    deletePilotSubmission(id);
    return NextResponse.json({ success: true, message: "Submission removed" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
