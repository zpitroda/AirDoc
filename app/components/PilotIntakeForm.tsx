"use client";

import { useState } from "react";
import { CheckCircle, PaperPlaneTilt, SpinnerGap } from "@phosphor-icons/react";

export function PilotIntakeForm() {
  const [role, setRole] = useState("Hospital Executive");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [region, setRegion] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const roles = [
    "Hospital Executive",
    "Medical Staff Coordinator",
    "Rural Clinic Director",
    "Locum Physician",
    "Healthcare Partner",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName("");
    setEmail("");
    setOrganization("");
    setRegion("");
    setComments("");
  };

  return (
    <section id="intake" className="bg-slate-50 py-14 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-3 sm:mb-4">
            Participate in Customer Discovery & Validation
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-[60ch] mx-auto">
            We are scheduling structured interviews and pilot intake reviews with hospital leaders, credentialing coordinators, and active physicians.
          </p>
        </div>

        <div className="max-w-2xl mx-auto rounded-lg border border-slate-200 bg-white p-5 sm:p-8 md:p-10 shadow-sm">
          {isSubmitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 mb-4">
                <CheckCircle size={32} weight="bold" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Discovery Intake Recorded
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[45ch] mx-auto mb-6">
                Thank you for contributing to AirDoc research. We will review your facility parameters and reach out directly to schedule a validation discussion.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="intake-name" className="block text-xs font-medium text-slate-800 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="intake-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Katherine Vance"
                    className="w-full min-h-[44px] rounded-md border border-slate-300 bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="intake-email" className="block text-xs font-medium text-slate-800 mb-1.5">
                    Institutional Email Address
                  </label>
                  <input
                    id="intake-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="k.vance@regionalhealth.org"
                    className="w-full min-h-[44px] rounded-md border border-slate-300 bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="intake-org" className="block text-xs font-medium text-slate-800 mb-1.5">
                    Hospital or Practice Organization
                  </label>
                  <input
                    id="intake-org"
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Memorial Community Hospital"
                    className="w-full min-h-[44px] rounded-md border border-slate-300 bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="intake-region" className="block text-xs font-medium text-slate-800 mb-1.5">
                    State or Geographic Region
                  </label>
                  <input
                    id="intake-region"
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Indiana, Midwest Region"
                    className="w-full min-h-[44px] rounded-md border border-slate-300 bg-white px-3.5 py-2 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
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
                  className="w-full inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-blue-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <SpinnerGap size={18} className="animate-spin" />
                      <span>Recording Response...</span>
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
                Participation is intended for early customer discovery feedback. Information is protected under strict confidentiality.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}