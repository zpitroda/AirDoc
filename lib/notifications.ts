import nodemailer from "nodemailer";
import { PilotSubmission, CoverageNeed } from "./types";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  // Option 1: Resend API if API key provided
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "AirDoc <founders@airdochealth.com>",
          to: [to],
          subject,
          html,
          text,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, id: data.id };
      } else {
        console.error("Resend API error:", data);
        return { success: false, error: data.message || "Failed to send via Resend" };
      }
    } catch (err) {
      console.error("Resend fetch error:", err);
      return { success: false, error: String(err) };
    }
  }

  // Option 2: Standard SMTP if SMTP credentials configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const port = parseInt(process.env.SMTP_PORT || "465", 10);
      const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: isSecure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const senderAddress =
        process.env.EMAIL_FROM ||
        (process.env.SMTP_USER ? `"AirDoc" <${process.env.SMTP_USER}>` : '"AirDoc" <founders@airdochealth.com>');

      const info = await transporter.sendMail({
        from: senderAddress,
        to,
        subject,
        text,
        html,
      });

      return { success: true, id: info.messageId };
    } catch (err) {
      console.error("SMTP transport error:", err);
      return { success: false, error: String(err) };
    }
  }

  // Option 3: Development / Sandbox Mock Email Dispatcher
  const simulatedId = `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  console.log("------------------------------------------------------------");
  console.log(`[AIRDOC EMAIL DISPATCHER] (SIMULATED - Ready for SMTP/Resend)`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Simulated ID: ${simulatedId}`);
  console.log(`Summary: ${text.substring(0, 180)}...`);
  console.log("------------------------------------------------------------");

  return { success: true, id: simulatedId };
}

// -------------------------
// Professional Email Templates
// -------------------------

export function createApplicantReceiptEmail(submission: PilotSubmission): { subject: string; html: string; text: string } {
  const subject = `AirDoc Discovery Confirmation: ${submission.id}`;

  const text = `
AirDoc - Coverage When It Matters. Clarity at Every Step.

Dear ${submission.name},

Thank you for requesting pilot access and participating in the AirDoc customer discovery evaluation.

Your discovery submission has been registered under reference code: ${submission.id}

Summary of Submitted Parameters:
- Reference ID: ${submission.id}
- Stakeholder Role: ${submission.role}
- Organization: ${submission.organization}
- Region: ${submission.region}
- Date: ${new Date(submission.created_at).toLocaleDateString()}

Next Steps:
Our co-founders (Soroosh Kermani and Zachary Pitroda, Purdue University) review incoming institutional parameters to align pilot trial readiness with regional physician coverage needs. You will receive a direct follow-up within 24 to 48 business hours to schedule a brief discovery consultation.

If you need to provide additional coverage specifications in the interim, please reply directly to this email or contact us at founders@airdochealth.com.

Sincerely,
The AirDoc Team
Purdue University Research & Commercialization Initiative
https://airdochealth.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .header { background-color: #1d4ed8; color: #ffffff; padding: 24px 32px; text-align: left; }
    .logo-badge { display: inline-block; background: #ffffff; color: #1d4ed8; font-weight: 700; font-family: monospace; padding: 4px 8px; border-radius: 4px; font-size: 14px; margin-bottom: 8px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
    .header p { margin: 4px 0 0 0; font-size: 13px; color: #bfdbfe; }
    .content { padding: 32px; }
    .reference-box { background: #f1f5f9; border-left: 4px solid #1d4ed8; padding: 14px 18px; margin: 20px 0; border-radius: 0 6px 6px 0; }
    .reference-box strong { font-size: 16px; font-family: monospace; color: #1e3a8a; }
    .detail-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    .detail-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
    .detail-table td.label { font-weight: 600; color: #475569; width: 35%; }
    .detail-table td.value { color: #0f172a; }
    .next-steps { background: #eff6ff; border: 1px solid #dbeafe; border-radius: 6px; padding: 16px 20px; margin: 24px 0; font-size: 13px; color: #1e40af; }
    .next-steps h4 { margin: 0 0 6px 0; font-size: 14px; color: #1e3a8a; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; font-size: 11px; color: #64748b; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">AirDoc</div>
      <h1>Pilot Intake & Customer Discovery</h1>
      <p>Coverage when it matters. Clarity at every step.</p>
    </div>

    <div class="content">
      <p>Dear <strong>${submission.name}</strong>,</p>
      <p>Thank you for requesting pilot access and contributing your operational perspective to the AirDoc temporary physician coverage platform.</p>

      <div class="reference-box">
        <div>Official Discovery Reference ID:</div>
        <strong>${submission.id}</strong>
      </div>

      <table class="detail-table">
        <tr>
          <td class="label">Stakeholder Role</td>
          <td class="value">${submission.role}</td>
        </tr>
        <tr>
          <td class="label">Organization</td>
          <td class="value">${submission.organization}</td>
        </tr>
        <tr>
          <td class="label">Geographic Region</td>
          <td class="value">${submission.region}</td>
        </tr>
        <tr>
          <td class="label">Recorded At</td>
          <td class="value">${new Date(submission.created_at).toUTCString()}</td>
        </tr>
      </table>

      <div class="next-steps">
        <h4>What Happens Next?</h4>
        <p style="margin: 0;">Our co-founders (Soroosh Kermani and Zachary Pitroda, Purdue University) will review your facility's operational parameters to assess match readiness with regional physician availability. We will follow up directly within 24 to 48 business hours to schedule an introductory pilot interview.</p>
      </div>

      <p style="font-size: 13px; color: #475569;">
        If you have urgent shift vacancies or immediate clinical documentation questions, please feel free to reply directly to this email.
      </p>
    </div>

    <div class="footer">
      <p><strong>AirDoc Institutional Discovery</strong> &bull; Developed by Soroosh Kermani & Zachary Pitroda (Purdue University)</p>
      <p>AirDoc is an early-stage healthcare technology initiative and does not replace institutional medical staff credentialing or privileging governance.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

export function createFounderAlertEmail(submission: PilotSubmission): { subject: string; html: string; text: string } {
  const subject = `[AirDoc Alert] New Pilot Request: ${submission.organization} (${submission.role})`;

  const text = `
New Pilot Request Received:

Reference ID: ${submission.id}
Role: ${submission.role}
Name: ${submission.name}
Email: ${submission.email}
Organization: ${submission.organization}
Region: ${submission.region}
Submitted At: ${submission.created_at}

Operational Notes:
${submission.comments || "None provided"}

IP Address: ${submission.ip_address}
User Agent: ${submission.user_agent}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; font-size: 14px; line-height: 1.5; color: #1e293b;">
  <h2 style="color: #1d4ed8; margin-bottom: 4px;">New Pilot Intake Submission</h2>
  <p style="color: #64748b; margin-top: 0;">Reference ID: <strong>${submission.id}</strong></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
  <p><strong>Role:</strong> ${submission.role}</p>
  <p><strong>Name:</strong> ${submission.name}</p>
  <p><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
  <p><strong>Organization:</strong> ${submission.organization}</p>
  <p><strong>Region:</strong> ${submission.region}</p>
  <p><strong>Comments / Operational Pain Points:</strong></p>
  <blockquote style="background: #f8fafc; border-left: 3px solid #3b82f6; padding: 10px 14px; margin: 8px 0; font-style: italic;">
    ${submission.comments || "None provided"}
  </blockquote>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
  <p style="font-size: 12px; color: #94a3b8;">IP: ${submission.ip_address} | Submitted: ${submission.created_at}</p>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

export function createCoverageNeedEmail(need: CoverageNeed): { subject: string; html: string; text: string } {
  const subject = `[AirDoc Requisition] Coverage Request Registered: ${need.id} (${need.specialty} in ${need.state})`;

  const text = `
Coverage Requisition Received:
ID: ${need.id}
Facility: ${need.facility_name}
Specialty: ${need.specialty}
State: ${need.state}
Date Range: ${need.start_date} to ${need.end_date}
Shift Type: ${need.shift_type}
Target Rate: $${need.target_rate}/hr
Urgency: ${need.urgency}
Contact: ${need.contact_name} (${need.contact_email})
Notes: ${need.notes || "None"}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; font-size: 14px; line-height: 1.5; color: #1e293b;">
  <h2 style="color: #1d4ed8;">Shift Coverage Requisition: ${need.id}</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    <tr><td style="padding: 6px; font-weight: bold;">Facility</td><td>${need.facility_name}</td></tr>
    <tr><td style="padding: 6px; font-weight: bold;">Specialty</td><td>${need.specialty}</td></tr>
    <tr><td style="padding: 6px; font-weight: bold;">State</td><td>${need.state}</td></tr>
    <tr><td style="padding: 6px; font-weight: bold;">Dates</td><td>${need.start_date} &rarr; ${need.end_date}</td></tr>
    <tr><td style="padding: 6px; font-weight: bold;">Shift Format</td><td>${need.shift_type}</td></tr>
    <tr><td style="padding: 6px; font-weight: bold;">Target Rate</td><td>$${need.target_rate}/hr</td></tr>
    <tr><td style="padding: 6px; font-weight: bold;">Urgency</td><td>${need.urgency}</td></tr>
    <tr><td style="padding: 6px; font-weight: bold;">Contact</td><td>${need.contact_name} (${need.contact_email})</td></tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html, text };
}
