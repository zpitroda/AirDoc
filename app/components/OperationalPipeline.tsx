"use client";

import { useState } from "react";
import {
  FilePlus,
  UsersThree,
  Scales,
  PaperPlaneRight,
  ShieldCheck,
  ChartLineUp,
  CaretLeft,
  CaretRight,
  X,
  SpinnerGap,
  CheckCircle,
} from "@phosphor-icons/react";

export function OperationalPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Shift Requisition Modal State
  const [facilityName, setFacilityName] = useState("");
  const [specialty, setSpecialty] = useState("Hospitalist");
  const [state, setState] = useState("IN");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-07");
  const [shiftType, setShiftType] = useState("Day");
  const [targetRate, setTargetRate] = useState(240);
  const [urgency, setUrgency] = useState("Short-Notice (1-2w)");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requisitionSuccess, setRequisitionSuccess] = useState<{
    id: string;
    matchedCount: number;
    matched: Array<{ name: string; specialty: string; target_hourly_rate: number }>;
  } | null>(null);

  const steps = [
    {
      title: "Define Coverage Need",
      icon: FilePlus,
      summary: "Facility sets shift dates, clinical specialty, location, target compensation, and urgency parameters.",
      deliverable: "Standardized shift requisition specification with clear clinical scope.",
    },
    {
      title: "Surface Available Physicians",
      icon: UsersThree,
      summary: "Automated indexing filters for active state licensure, verified clinical distance, and schedule alignment.",
      deliverable: "Direct roster of matching, verified clinicians ready for evaluation.",
    },
    {
      title: "Review Transparent Terms",
      icon: Scales,
      summary: "Both parties view unbundled rate structures, explicit facility expectations, and exact net compensation.",
      deliverable: "Zero hidden agency markups or disputed shift terms.",
    },
    {
      title: "Issue Direct Request",
      icon: PaperPlaneRight,
      summary: "Hospital issues coverage request directly; physician accepts, declines, or queries details via documented log.",
      deliverable: "Time-stamped audit trail of terms and binding mutual intent.",
    },
    {
      title: "Advance Credential Readiness",
      icon: ShieldCheck,
      summary: "Reusable documentation packets and expiration monitoring prepare dossiers for hospital medical staff review.",
      deliverable: "Standardized packet submitted to institution committee for final privileging.",
    },
    {
      title: "Measure Operational Outcomes",
      icon: ChartLineUp,
      summary: "System records fill latency, shift completion rate, cost savings, and mutual feedback for longitudinal analysis.",
      deliverable: "Grounded empirical data validating efficiency gains for hospital leadership.",
    },
  ];

  const handleRequisitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName || !contactEmail) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/coverage-needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_name: facilityName,
          specialty,
          state,
          start_date: startDate,
          end_date: endDate,
          shift_type: shiftType,
          target_rate: targetRate,
          urgency,
          contact_name: contactName,
          contact_email: contactEmail,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRequisitionSuccess({
          id: data.requisitionId,
          matchedCount: data.matchedPhysiciansCount,
          matched: data.matchedPhysicians || [],
        });
      }
    } catch (err) {
      console.error("Requisition error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setRequisitionSuccess(null);
    setIsModalOpen(false);
  };

  return (
    <section id="pipeline" className="bg-white py-14 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-700 font-semibold mb-3 block">
            OPERATIONAL PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-3 sm:mb-4">
            How Direct Coverage Operates
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-[65ch]">
            A documented six-stage workflow engineered to replace fragmented recruiter calls with structured, verifiable coordination.
          </p>
        </div>

        {/* Horizontal Scroll / Grid Stage Navigation */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-0 scrollbar-none snap-x mb-6 sm:mb-8">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 sm:p-5 rounded-lg border transition-all shrink-0 w-[240px] sm:w-auto snap-start cursor-pointer ${
                  isSelected
                    ? "border-blue-700 bg-blue-50/40 shadow-sm ring-1 ring-blue-700"
                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md ${
                      isSelected ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    <IconComponent size={18} />
                  </div>
                  <span className="font-mono text-xs text-slate-400">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {step.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Inspector */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-700 font-semibold block mb-1">
                Selected Stage 0{activeStep + 1} of 06
              </span>
              <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                {steps[activeStep].title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                {steps[activeStep].summary}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 rounded-md bg-white border border-slate-200 p-3 text-xs font-medium text-slate-800 shadow-2xs">
                <span className="font-semibold text-blue-700 shrink-0">Output Deliverable:</span>
                <span className="text-slate-700">{steps[activeStep].deliverable}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
              {activeStep === 0 && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-blue-700 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition shadow-2xs cursor-pointer"
                >
                  <FilePlus size={16} />
                  <span>Test Shift Requisition</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                  className="flex-1 sm:flex-none inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
                >
                  <CaretLeft size={16} />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                  className="flex-1 sm:flex-none inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 active:scale-[0.98] cursor-pointer"
                >
                  <span>Next</span>
                  <CaretRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Shift Requisition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FilePlus size={20} className="text-blue-700" />
                <h3 className="text-base font-semibold text-slate-900">
                  Simulate Shift Requisition
                </h3>
              </div>
              <button
                type="button"
                onClick={resetModal}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {requisitionSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle size={32} weight="bold" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    Requisition Registered & Clinicians Surfaced
                  </h4>
                  <p className="font-mono text-xs text-blue-700 mt-1 font-semibold">
                    Requisition ID: {requisitionSuccess.id}
                  </p>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-left text-xs space-y-2">
                  <div className="font-medium text-slate-800">
                    Direct Matched Physicians ({requisitionSuccess.matchedCount} available):
                  </div>
                  {requisitionSuccess.matched.map((m, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-1 border-b border-slate-200 last:border-b-0"
                    >
                      <span className="font-medium text-slate-900">{m.name}</span>
                      <span className="font-mono text-blue-700">${m.target_hourly_rate}/hr</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetModal}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-blue-700 px-5 text-xs font-semibold text-white hover:bg-blue-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequisitionSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Hospital / Facility Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. Hendricks Regional Health"
                    className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Specialty</label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="Hospitalist">Hospitalist</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Anesthesiology">Anesthesiology</option>
                      <option value="Critical Care / ICU">Critical Care / ICU</option>
                      <option value="General Surgery">General Surgery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="IN">Indiana (IN)</option>
                      <option value="IL">Illinois (IL)</option>
                      <option value="OH">Ohio (OH)</option>
                      <option value="KY">Kentucky (KY)</option>
                      <option value="MI">Michigan (MI)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Target Rate ($/hr)</label>
                    <input
                      type="number"
                      required
                      value={targetRate}
                      onChange={(e) => setTargetRate(Number(e.target.value))}
                      className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Urgency</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="Urgent (<48h)">Urgent (&lt;48h)</option>
                      <option value="Short-Notice (1-2w)">Short-Notice (1-2w)</option>
                      <option value="Planned (>30d)">Planned (&gt;30d)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Contact Coordinator</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Sarah Connor, RN"
                      className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Institutional Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="sconnor@regionalhealth.org"
                      className="w-full rounded-md border border-slate-300 p-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="rounded-md border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <SpinnerGap size={14} className="animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <span>Submit Requisition</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}