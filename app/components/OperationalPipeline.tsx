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
} from "@phosphor-icons/react";

export function OperationalPipeline() {
  const [activeStep, setActiveStep] = useState(0);

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
                className={`text-left p-4 sm:p-5 rounded-lg border transition-all shrink-0 w-[240px] sm:w-auto snap-start ${
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

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                className="flex-1 sm:flex-none inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200"
              >
                <CaretLeft size={16} />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                className="flex-1 sm:flex-none inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 active:scale-[0.98]"
              >
                <span>Next</span>
                <CaretRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}