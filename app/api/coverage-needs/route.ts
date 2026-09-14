import { NextRequest, NextResponse } from "next/server";
import { saveCoverageNeed, getCoverageNeeds, getPhysicians } from "@/lib/db";
import { sendEmail, createCoverageNeedEmail } from "@/lib/notifications";
import { ShiftType, CoverageUrgency } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid payload format" }, { status: 400 });
    }

    const {
      facility_name,
      specialty,
      state,
      start_date,
      end_date,
      shift_type,
      target_rate,
      urgency,
      contact_name,
      contact_email,
      notes,
    } = body;

    if (!facility_name || !specialty || !state || !start_date || !end_date || !contact_email) {
      return NextResponse.json(
        { success: false, error: "Missing required shift requisition fields" },
        { status: 400 }
      );
    }

    const saved = saveCoverageNeed({
      facility_name: String(facility_name).trim(),
      specialty: String(specialty).trim(),
      state: String(state).trim().toUpperCase(),
      start_date: String(start_date).trim(),
      end_date: String(end_date).trim(),
      shift_type: (shift_type || "Day") as ShiftType,
      target_rate: Number(target_rate) || 240,
      urgency: (urgency || "Short-Notice (1-2w)") as CoverageUrgency,
      contact_name: String(contact_name || "").trim(),
      contact_email: String(contact_email).trim().toLowerCase(),
      notes: String(notes || "").trim(),
    });

    // Notify founders
    try {
      const emailContent = createCoverageNeedEmail(saved);
      const adminNotifyTarget = process.env.ADMIN_NOTIFICATION_EMAIL || "founders@airdochealth.com";
      await sendEmail({
        to: adminNotifyTarget,
        ...emailContent,
      });
    } catch (err) {
      console.error("Coverage need email notification warning:", err);
    }

    // Identify matching physicians immediately
    const matchedPhysicians = getPhysicians({
      specialty: saved.specialty,
      state: saved.state,
    });

    return NextResponse.json(
      {
        success: true,
        requisitionId: saved.id,
        requisition: saved,
        matchedPhysiciansCount: matchedPhysicians.length,
        matchedPhysicians: matchedPhysicians.map((p) => ({
          id: p.id,
          name: p.name,
          specialty: p.specialty,
          active_licenses: p.active_licenses,
          compact_licensed: p.compact_licensed,
          target_hourly_rate: p.target_hourly_rate,
          next_available: p.availability.next_available,
        })),
        message: "Shift coverage requisition registered. Matching clinicians surfaced.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating coverage need:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const needs = getCoverageNeeds();
    return NextResponse.json({ success: true, needs });
  } catch (error) {
    console.error("Error retrieving coverage needs:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
