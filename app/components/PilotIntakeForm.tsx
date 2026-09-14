"use client";

import { useState } from "react";
import {
  CheckCircle,
  PaperPlaneTilt,
  SpinnerGap,
  DownloadSimple,
  WarningCircle,
} from "@phosphor-icons/react";

interface SubmissionResponse {
  submissionId: string;
  role: string;
  organization: string;
  createdAt: string;
}

export function PilotIntakeForm() {
  const [role, setRole] = useState("Hospital Executive");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [region, setRegion] = useState("");
  const [comments, setComments] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const roles = [
    "Hospital Executive",
    "Medical Staff Coordinator",
    "Rural Clinic Director",
    "Locum Physician",
    "Healthcare Partner",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // Basic client checks
    if (!name.trim()) {
      setFieldErrors((prev) => ({ ...prev, name: "Please enter your full name." }));
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFieldErrors((prev) => ({ ...prev, email: "Please enter a valid institutional email address." }));
      return;
    }
    if (!organization.trim()) {
      setFieldErrors((prev) => ({ ...prev, organization: "Hospital or practice organization is required." }));
      return;
    }
    if (!region.trim()) {
      setFieldErrors((prev) => ({ ...prev, region: "State or geographic region is required." }));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          region: region.trim(),
          comments: comments.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.validationErrors) {
          setFieldErrors(data.validationErrors);
        }
        setErrorMessage(
          data.error || "Unable to record your pilot intake request. Please check inputs and retry."
        );
        setIsSubmitting(false);
        return;
      }

      setSubmissionResult({
        submissionId: data.submissionId,
        role: data.role,
        organization: data.organization,
        createdAt: data.createdAt,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage("Network error connecting to AirDoc server. Please verify your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmissionResult(null);
    setErrorMessage(null);
    setFieldErrors({});
    setName("");
    setEmail("");
    setOrganization("");
    setRegion("");
    setComments("");
  };

  const downloadReceipt = () => {
    if (!submissionResult) return;
    const content = `
AIRDOC PILOT INTAKE CONFIRMATION RECEIPT
========================================
Reference Code: ${submissionResult.submissionId}
Date Recorded:  ${new Date(submissionResult.createdAt).toLocaleString()}

APPLICANT PROFILE:
- Full Name:     ${name}
- Email:         ${email}
- Stakeholder:   ${submissionResult.role}
- Organization:  ${submissionResult.organization}
- Region:        ${region}

OPERATIONAL NOTES:
${comments || "None provided"}

NEXT STEPS:
Our co-founders (Soroosh Kermani and Zachary Pitroda, Purdue University)
will review your clinical and administrative parameters within 24-48 business hours.
Direct Contact: founders@airdochealth.com
========================================
`.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `airdoc-intake-${submissionResult.submissionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="intake" className="bg-slate-50 py-14 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-700 font-semibold mb-2 block">
            PILOT INTAKE & DISCOVERY
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-3 sm:mb-4">
            Participate in Customer Discovery & Validation
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-[60ch] mx-auto">
            We are scheduling structured interviews and pilot intake reviews with hospital leaders, credentialing coordinators, and active physicians.
          </p>
        </div>

        <div className="max-w-2xl mx-auto rounded-lg border border-slate-200 bg-white p-5 sm:p-8 md:p-10 shadow-sm">
          {isSubmitted && submissionResult ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-4 ring-8 ring-emerald-50">
                <CheckCircle size={36} weight="bold" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
                Discovery Intake Recorded
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[48ch] mx-auto mb-6">
                Thank you for contributing to AirDoc customer research. An official confirmation email has been dispatched to <span className="font-semibold text-slate-800">{email}</span>.
              </p>

              {/* Official Reference Card */}
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 max-w-md mx-auto mb-6 text-left">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2 mb-2">
                  <span className="text-xs font-mono font-medium text-blue-800 uppercase tracking-wider">
                    Official Reference Code
                  </span>
                  <span className="font-mono text-sm font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300">
                    {submissionResult.submissionId}
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><span className="font-medium text-slate-900">Role:</span> {submissionResult.role}</div>
                  <div><span className="font-medium text-slate-900">Facility:</span> {submissionResult.organization}</div>
                  <div><span className="font-medium text-slate-900">Next Step:</span> Founder follow-up within 24–48 business hours</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={downloadReceipt}
                  className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition shadow-2xs"
                >
                  <DownloadSimple size={16} />
                  <span>Download Confirmation</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center rounded-md bg-blue-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-800 active:bg-blue-900 transition shadow-2xs"
                >
                  Submit Another Response
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {errorMessage && (
                <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 animate-in fade-in duration-200">
                  <WarningCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                  <div className="leading-relaxed">{errorMessage}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5">
                  Select Your Primary Stakeholder Role
                </label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`min-h-[40px] px-3.5 py-2 rounded-md text-xs font-medium transition ${
                        role === r
                          ? "bg-blue-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {fieldErrors.role && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.role}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="intake-name" className="block text-xs font-medium text-slate-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="intake-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="Dr. Katherine Vance"
                    className={`w-full min-h-[44px] rounded-md border bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                      fieldErrors.name
                        ? "border-red-400 focus:border-red-600 focus:ring-red-600"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="intake-email" className="block text-xs font-medium text-slate-800 mb-1.5">
                    Institutional Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="intake-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="k.vance@regionalhealth.org"
                    className={`w-full min-h-[44px] rounded-md border bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                      fieldErrors.email
                        ? "border-red-400 focus:border-red-600 focus:ring-red-600"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="intake-org" className="block text-xs font-medium text-slate-800 mb-1.5">
                    Hospital or Practice Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="intake-org"
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => {
                      setOrganization(e.target.value);
                      if (fieldErrors.organization) setFieldErrors((prev) => ({ ...prev, organization: "" }));
                    }}
                    placeholder="Memorial Community Hospital"
                    className={`w-full min-h-[44px] rounded-md border bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                      fieldErrors.organization
                        ? "border-red-400 focus:border-red-600 focus:ring-red-600"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                    }`}
                  />
                  {fieldErrors.organization && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.organization}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="intake-region" className="block text-xs font-medium text-slate-800 mb-1.5">
                    State or Geographic Region <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="intake-region"
                    type="text"
                    required
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      if (fieldErrors.region) setFieldErrors((prev) => ({ ...prev, region: "" }));
                    }}
                    placeholder="Indiana, Midwest Region"
                    className={`w-full min-h-[44px] rounded-md border bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                      fieldErrors.region
                        ? "border-red-400 focus:border-red-600 focus:ring-red-600"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                    }`}
                  />
                  {fieldErrors.region && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.region}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="intake-comments" className="block text-xs font-medium text-slate-800 mb-1.5">
                  Primary Coverage Bottleneck or Operational Notes
                </label>
                <textarea
                  id="intake-comments"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Describe your current staffing pain points, credentialing cycle times, or locum agency markup challenges."
                  className="w-full rounded-md border border-slate-300 bg-white p-3 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-blue-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 active:scale-[0.98] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <SpinnerGap size={18} className="animate-spin" />
                      <span>Recording Submission & Dispatched Confirmation...</span>
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt size={18} />
                      <span>Request Pilot Access</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 leading-normal">
                Participation is intended for early customer discovery feedback. Submissions are encrypted and protected under strict confidentiality.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}