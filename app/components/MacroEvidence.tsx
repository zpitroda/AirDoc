export function MacroEvidence() {
  const metrics = [
    {
      value: "86,000",
      prefix: "Up to",
      label: "Projected U.S. physician shortage by 2036",
      source: "Association of American Medical Colleges (AAMC)",
      context: "Projected shortfall range of 13,500 to 86,000 clinicians across primary and specialty care.",
    },
    {
      value: "90-120",
      suffix: "days",
      label: "Institutional credentialing timeline",
      source: "American Medical Association (AMA) Guide",
      context: "Standard duration required for primary-source verification and institutional committee approvals.",
    },
    {
      value: "258%",
      prefix: "+",
      label: "Contract-labor cost escalation (2019-2022)",
      source: "American Hospital Association (AHA)",
      context: "Surge in agency staffing expenses across more than 1,000 surveyed community hospitals.",
    },
    {
      value: "$890B",
      prefix: "",
      label: "Total hospital labor expenditure in 2024",
      source: "AHA 2025 Cost of Caring Report",
      context: "Workforce compensation and related expenses represented 56% of total hospital operating costs.",
    },
  ];

  return (
    <section id="evidence" className="bg-white py-14 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-3 sm:mb-4">
            Structural Pressures in Physician Staffing
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-[65ch]">
            When vacancies arise on short notice, institutions face administrative delays, unpredictable agency margins, and acute care disruptions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/70 p-6 transition-colors hover:border-slate-300"
            >
              <div>
                <div className="flex items-baseline gap-1 font-mono text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">
                  {item.prefix && <span className="text-xl text-blue-700 font-sans font-medium">{item.prefix}</span>}
                  <span>{item.value}</span>
                  {item.suffix && <span className="text-sm font-sans font-normal text-slate-500 ml-1">{item.suffix}</span>}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900 leading-snug">
                  {item.label}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {item.context}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80">
                <span className="text-[11px] font-mono text-slate-500 block">
                  Source: {item.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}