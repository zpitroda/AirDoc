import { NextRequest, NextResponse } from "next/server";
import { savePilotSubmission, getPilotSubmissions, exportPilotSubmissionsCSV, getSystemMetrics } from "@/lib/db";
import { validatePilotIntake, checkRateLimit } from "@/lib/validation";
import { sendEmail, createApplicantReceiptEmail, createFounderAlertEmail } from "@/lib/notifications";
import { isAuthorizedAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. IP & Rate Limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Unknown";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions from this location. Please retry after ${rateCheck.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    // 2. Parse & Validate
    const body = await req.json().catch(() => null);
    const validation = validatePilotIntake(body);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please verify the form inputs.",
          validationErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    // 3. Persist Submission
    const saved = savePilotSubmission({
      ...validation.sanitized,
      ip_address: ip,
      user_agent: userAgent,
    });

    // 4. Send Confirmation & Alert Emails (asynchronous, non-blocking failure)
    try {
      // Confirmation to applicant
      const applicantEmail = createApplicantReceiptEmail(saved);
      await sendEmail({
        to: saved.email,
        ...applicantEmail,
      });

      // Alert to internal founders
      const founderEmail = createFounderAlertEmail(saved);
      const adminNotifyTarget = process.env.ADMIN_NOTIFICATION_EMAIL || "founders@airdochealth.com";
      await sendEmail({
        to: adminNotifyTarget,
        ...founderEmail,
      });
    } catch (emailErr) {
      console.error("Email notification dispatch warning:", emailErr);
      // Non-fatal: submission is still recorded successfully
    }

    return NextResponse.json(
      {
        success: true,
        submissionId: saved.id,
        role: saved.role,
        organization: saved.organization,
        createdAt: saved.created_at,
        message: "Pilot intake recorded successfully. An official discovery confirmation receipt has been dispatched.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing pilot intake:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An internal error occurred while processing your pilot request. Please retry shortly.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // If CSV export requested
    if (searchParams.get("format") === "csv") {
      // Require admin authentication for CSV download
      if (!isAuthorizedAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }

      const csvContent = exportPilotSubmissionsCSV();
      return new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="airdoc-pilot-intake-${new Date().toISOString().split("T")[0]}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Normal JSON query
    const role = searchParams.get("role") || "ALL";
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const { submissions, total } = getPilotSubmissions({ role, status, search, limit, offset });
    const metrics = getSystemMetrics();

    return NextResponse.json({
      success: true,
      submissions,
      total,
      metrics,
    });
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch submissions" }, { status: 500 });
  }
}
