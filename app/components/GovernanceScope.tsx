import { ShieldCheck, WarningCircle } from "@phosphor-icons/react/dist/ssr";

export function GovernanceScope() {
  const boundaries = [
    {
      domain: "Primary Source Verification & Credentialing",
      airdocRole: "Organizes clinician dossiers, tracks document expiration dates, and prepares structured files.",
      hospitalRole: "Conducts primary-source verification and retains full regulatory authority over credential approvals.",
    },
    {
      domain: "Clinical Privileging",
      airdocRole: "Stores documented procedure logs, board certifications, and requested specialty privileges.",
      hospitalRole: "Medical Executive Committee and Governing Board grant clinical privileges per hospital bylaws.",
    },
    {
      domain: "Staffing Selection & Mutual Matching",
      airdocRole: "Provides search filters by distance, licensure, rate, schedule, and direct request messaging.",
      hospitalRole: "Department chairs and medical directors make independent clinical hiring and coverage decisions.",
    },
    {
      domain: "Quality Assurance & Patient Safety",
      airdocRole: "Records verified shift hours, incident logs, and bilateral stakeholder evaluations.",
      hospitalRole: "Maintains standard peer review, internal morbidity reviews, and clinical safety oversight.",
    },
  ];

  return (
    <section id="governance" className="bg-slate-50 py-14 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-700 font-semibold mb-3 block">
            GOVERNANCE AND SCOPE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-3 sm:mb-4">
            Institutional Safeguards & Clear Operating Boundaries
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-[65ch]">
            AirDoc is engineered to enhance discovery and coordination while respecting the statutory authority of hospital credentialing bodies.
          </p>
        </div>

        {/* Boundary Table: Responsive Mobile Cards + Desktop Ledger */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm mb-8">
          {/* Desktop Table Header */}
          <div className="hidden md:grid md:grid-cols-12 border-b border-slate-200 bg-slate-100/70 p-4 font-mono text-xs font-semibold text-slate-700">
            <div className="md:col-span-3">FUNCTIONAL DOMAIN</div>
            <div className="md:col-span-5 text-blue-800">AIRDOC PLATFORM COORDINATION</div>
            <div className="md:col-span-4 text-slate-800">HOSPITAL MEDICAL STAFF JURISDICTION</div>
          </div>

          <div className="divide-y divide-slate-200">
            {boundaries.map((b, idx) => (
              <div key={idx} className="p-5 sm:p-6 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs sm:text-sm">
                <div className="md:col-span-3 font-semibold text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-700 shrink-0" />
                  <span className="text-sm">{b.domain}</span>
                </div>
                
                {/* Mobile AirDoc role with label */}
                <div className="md:col-span-5 text-slate-600 leading-relaxed">
                  <span className="md:hidden block text-[11px] font-mono font-semibold uppercase text-blue-700 mb-1">
                    AirDoc Coordination:
                  </span>
                  {b.airdocRole}
                </div>

                {/* Mobile Hospital role with label */}
                <div className="md:col-span-4 text-slate-800 font-medium leading-relaxed bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-md border md:border-0 border-slate-200/80">
                  <span className="md:hidden block text-[11px] font-mono font-semibold uppercase text-slate-500 mb-1">
                    Hospital Jurisdiction:
                  </span>
                  {b.hospitalRole}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explicit Status & Validation Disclosure */}
        <div className="rounded-lg border border-slate-300 bg-white p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              <WarningCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Early-Stage Customer Discovery Notice
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[85ch]">
                AirDoc is currently an early-stage concept in customer discovery and field validation. The workflows and financial models described reflect proposed mechanisms under active evaluation with medical staff professionals, recruiters, and physicians. AirDoc does not claim completed placements, active hospital clients, or regulatory exemptions until formally supported by clinical pilot data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}