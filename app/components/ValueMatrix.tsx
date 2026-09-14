import { Check, Hospital, Stethoscope, Heartbeat } from "@phosphor-icons/react/dist/ssr";

export function ValueMatrix() {
  const stakeholderGroups = [
    {
      title: "Hospitals & Health Systems",
      icon: Hospital,
      targetAudience: "Chief Medical Officers, CFOs & Staffing Directors",
      benefits: [
        "Faster identification of credentialed, licensed clinicians",
        "Transparent billing comparisons with clear overhead splits",
        "Reduced administrative hours spent chasing repeated paperwork",
        "Proactive visibility into urgent department vacancies",
        "Lower avoidable staffing expenditures from agency price gouging",
      ],
    },
    {
      title: "Locum Tenens Physicians",
      icon: Stethoscope,
      targetAudience: "Independent Physicians & Hospitalists",
      benefits: [
        "Direct visibility into total facility billing and net compensation",
        "Complete ownership of calendar, travel radius, and shift parameters",
        "Reusable credential dossier avoiding redundant document collection",
        "Direct communication with hospital medical staff coordinators",
        "Reduced dependence on layered intermediary recruiter commission",
      ],
    },
    {
      title: "Patients & Rural Communities",
      icon: Heartbeat,
      targetAudience: "Critical Access Facilities & Regional Populations",
      benefits: [
        "Dependable local clinical access preventing emergency department closures",
        "Fewer patient transfers caused by sudden physician shift gaps",
        "Greater provider stability for community-based specialty clinics",
        "Protection of regional hospital operating margins and service lines",
        "Long-term healthcare workforce resilience across underserved regions",
      ],
    },
  ];

  return (
    <section className="bg-white py-14 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-3 sm:mb-4">
            Aligned Value Across the Healthcare Ecosystem
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-[65ch]">
            Temporary staffing works best when facilities, clinicians, and communities share transparent incentives rather than competing against opaque intermediary models.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stakeholderGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-8 shadow-sm transition-all hover:bg-white hover:border-slate-300"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-700 text-white mb-6">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {group.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mb-6 pb-4 border-b border-slate-200">
                    {group.targetAudience}
                  </p>

                  <ul className="space-y-3.5">
                    {group.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 mt-0.5">
                          <Check size={11} weight="bold" />
                        </div>
                        <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}