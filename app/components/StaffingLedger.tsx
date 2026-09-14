import { Buildings, UserCircle, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function StaffingLedger() {
  const hospitalFrictions = [
    {
      title: "Opaque Cost Structures",
      detail: "Facilities frequently pay substantial agency overhead without visibility into clinician compensation versus intermediary margins.",
    },
    {
      title: "Urgent Coverage Vacancies",
      detail: "Critical-access and community facilities struggle with sudden gaps, relying on fragmented phone calls and scattered broker networks.",
    },
    {
      title: "Repeated Credential Chasing",
      detail: "Medical staff offices must reconstruct clinician files from scratch for every placement, extending timelines by weeks.",
    },
  ];

  const physicianFrictions = [
    {
      title: "Redundant Administrative Submissions",
      detail: "Physicians repeatedly re-submit primary source documents, work histories, references, and immunizations to multiple agencies.",
    },
    {
      title: "Limited Rate Transparency",
      detail: "Clinicians rarely know the bill-rate paid by the hospital, creating misaligned incentives and reduced compensation clarity.",
    },
    {
      title: "Constrained Schedule Autonomy",
      detail: "Locum doctors depend on recruiter outreach chains rather than directly managing regional availability and preferred parameters.",
    },
  ];

  return (
    <section className="bg-slate-50 py-14 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-3 sm:mb-4">
            The Structural Inefficiencies in Temporary Staffing
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-[65ch]">
            Traditional locum tenens relies on layered recruiting chains that separate hospitals and physicians, adding delay and unnecessary cost.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Hospital Side */}
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-blue-700">
                <Buildings size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Hospital Administration Realities</h3>
                <p className="text-xs text-slate-500">Chief Medical Officers & Staffing Coordinators</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {hospitalFrictions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Physician Side */}
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-blue-700">
                <UserCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Physician Practice Realities</h3>
                <p className="text-xs text-slate-500">Locum Tenens & Independent Clinicians</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {physicianFrictions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Foundation Hypothesis Box */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50/50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900">The AirDoc Hypothesis</h4>
                <p className="mt-1 text-sm text-slate-700 max-w-[70ch] leading-relaxed">
                  A direct, transparent marketplace with reusable documentation workflows can reduce emergency vacancy lead times and avoid excessive intermediary expense, verified through institutional pilot trials.
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-mono text-blue-800 bg-blue-100 px-3 py-1.5 rounded-md font-medium">
              Pilot Research Focus
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}