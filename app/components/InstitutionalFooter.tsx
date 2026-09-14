import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { AirDocLogo } from "./AirDocLogo";

export function InstitutionalFooter() {
  const citations = [
    {
      title: "AAMC Physician Shortage Projections",
      citation: "Association of American Medical Colleges (AAMC). The Complexities of Physician Supply and Demand: Projections From 2021 to 2036.",
      url: "https://www.aamc.org/news/press-releases/new-aamc-report-shows-continuing-projected-physician-shortage",
    },
    {
      title: "AMA Credentialing Preparation Guide",
      citation: "American Medical Association (AMA). Credentialing and Privileging: A Guide for Physicians and Healthcare Facilities (90-120 day standard).",
      url: "https://www.ama-assn.org/system/files/credentialing-physician-prep-guide.pdf",
    },
    {
      title: "AHA Contract Labor Expense Study",
      citation: "American Hospital Association (AHA). Workforce Shortages Surge Hospital Labor Expenses (258% increase 2019-2022 across 1,000+ facilities).",
      url: "https://www.aha.org/news/headline/2023-03-08-hospitals-contract-labor-costs-surge-amid-workforce-shortages",
    },
    {
      title: "AHA Cost of Caring Analysis",
      citation: "American Hospital Association (AHA). 2025 Cost of Caring Report (Workforce compensation represents 56% of total expenses, $890B total).",
      url: "https://www.aha.org/guides-and-reports/2026-03-09-2025-cost-caring-report",
    },
  ];

  return (
    <footer className="bg-slate-100/80 text-slate-600 py-16 text-xs border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 pb-12 border-b border-slate-200">
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md">
              <AirDocLogo variant="full" size="sm" />
            </Link>
            <p className="text-slate-600 text-xs leading-relaxed max-w-[38ch]">
              A proposed technology-enabled direct marketplace connecting healthcare facilities with qualified physicians for urgent temporary coverage.
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              Coverage when it matters. Clarity at every step.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-2">
                Inquiries & Direct Contact
              </span>
              <a
                href="mailto:founders@airdochealth.com?subject=AirDoc%20Institutional%20Inquiry"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50/50 transition group"
                title="Send email to AirDoc founders"
              >
                <EnvelopeSimple size={15} className="text-blue-700 group-hover:scale-110 transition-transform" />
                <span>founders@airdochealth.com</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-800 mb-4">
              Institutional Citations & Evidence Base
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {citations.map((c, idx) => (
                <div key={idx} className="rounded-md border border-slate-200 bg-white p-3 space-y-1">
                  <div className="font-semibold text-slate-900 text-xs">
                    {c.title}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {c.citation}
                  </p>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-700 hover:text-blue-800 underline block pt-1"
                  >
                    View Source Report
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            Early-Stage Customer Discovery. AirDoc does not replace hospital credentialing, privileging, or medical executive committee governance.
          </p>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <Link href="#evidence" className="hover:text-slate-900 transition">
              Evidence
            </Link>
            <Link href="#pipeline" className="hover:text-slate-900 transition">
              Pipeline
            </Link>
            <Link href="#governance" className="hover:text-slate-900 transition">
              Governance
            </Link>
            <Link href="#intake" className="hover:text-slate-900 transition">
              Pilot Intake
            </Link>
            <a
              href="mailto:founders@airdochealth.com?subject=AirDoc%20Institutional%20Inquiry"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-800 transition"
            >
              <EnvelopeSimple size={13} />
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}