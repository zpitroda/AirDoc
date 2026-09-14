import { NextRequest, NextResponse } from "next/server";
import { saveCoverageNeed, getCoverageNeeds, getPhysicians } from "@/lib/db";
import { sendEmail, createCoverageNeedEmail } from "@/lib/notifications";
import { ShiftType, CoverageUrgency } from "@/lib/types";
import { checkRateLimit } from "@/lib/validation";
import { isAuthorizedAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateCheck = checkRateLimit(`req:${ip}`);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requisitions submitted. Please retry after ${rateCheck.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
        }
      );
    }

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

    const cleanEmail = String(contact_email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 150) {
      return NextResponse.json(
        { success: false, error: "Valid institutional contact email is required." },
        { status: 400 }
      );
    }

    const saved = saveCoverageNeed({
      facility_name: String(facility_name).trim().slice(0, 150),
      specialty: String(specialty).trim().slice(0, 80),
      state: String(state).trim().toUpperCase().slice(0, 2),
      start_date: String(start_date).trim().slice(0, 20),
      end_date: String(end_date).trim().slice(0, 20),
      shift_type: (shift_type || "Day") as ShiftType,
      target_rate: Math.max(50, Math.min(1000, Number(target_rate) || 240)),
      urgency: (urgency || "Short-Notice (1-2w)") as CoverageUrgency,
      contact_name: String(contact_name || "").trim().slice(0, 100),
      contact_email: cleanEmail,
      notes: String(notes || "").trim().slice(0, 2000),
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

export async function GET(req: NextRequest) {
  try {
    const authorized = isAuthorizedAdmin(req);
    const needs = getCoverageNeeds();

    if (!authorized) {
      // Redact sensitive contact info for unauthenticated callers
      const sanitized = needs.map((n) => ({
        ...n,
        contact_name: "Institutional Coordinator",
        contact_email: "[Restricted - Admin Access Required]",
        notes: "",
      }));
      return NextResponse.json({ success: true, needs: sanitized });
    }

    return NextResponse.json({ success: true, needs });
  } catch (error) {
    console.error("Error retrieving coverage needs:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
