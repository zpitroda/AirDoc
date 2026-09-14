import Image from "next/image";
import {
  GraduationCap,
  Chats,
  MapPin,
  LinkedinLogo,
  Cpu,
  Stethoscope,
  ShieldCheck,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";

export function FounderValidation() {
  return (
    <section id="validation" className="bg-white py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl leading-tight mb-4">
            Founding Team & Discovery Leadership
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-[65ch]">
            AirDoc is founded by Purdue University researchers combining healthcare operations insight with biomedical systems engineering to solve acute physician staffing bottlenecks.
          </p>
        </div>

        {/* Co-Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Soroosh Kermani */}
          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-8 shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope size={18} className="text-blue-700" />
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-700 font-semibold">
                      CO-FOUNDER
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Soroosh Kermani</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Clinical Operations & Field Validation</p>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-1 text-xs font-mono text-slate-700 shrink-0">
                  <GraduationCap size={16} className="text-blue-700" />
                  <span>Purdue</span>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Leads field discovery and stakeholder research across hospital chief medical officers, credentialing directors, and locum physicians to identify the root causes of temporary staffing delays and vacancy costs.
                </p>
                <p>
                  Drawing on clinical preparation and healthcare systems research at Purdue University, Soroosh focuses on aligning economic incentives between rural facilities and clinicians, eliminating opaque brokerage markups while ensuring continuous patient access.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <TrendUp size={14} className="text-blue-700 shrink-0" />
                  <span>Hospital discovery interviews & clinical workflow analysis</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <ShieldCheck size={14} className="text-blue-700 shrink-0" />
                  <span>Institutional alignment for rural & community health systems</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Purdue University</span>
              <a
                href="https://www.linkedin.com/in/soroosh-kermani-28022b25b/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 transition"
              >
                <LinkedinLogo size={16} weight="fill" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>

          {/* Zachary Pitroda */}
          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-8 shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu size={18} className="text-blue-700" />
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-700 font-semibold">
                      CO-FOUNDER
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Zachary Pitroda</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Technology & Systems Architecture</p>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-1 text-xs font-mono text-slate-700 shrink-0">
                  <GraduationCap size={16} className="text-blue-700" />
                  <span>Purdue (2026)</span>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Directs the technical architecture for AirDoc, engineering the reusable credential dossier infrastructure, automated compliance monitoring, and direct schedule matching engines.
                </p>
                <p>
                  Drawing on engineering background at Purdue University and proven experience building complex biomedical data platforms and accelerated knowledge graphs, Zachary builds the infrastructure that transforms fragmented staffing coordination into secure, auditable digital workflows.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <ShieldCheck size={14} className="text-blue-700 shrink-0" />
                  <span>Digital credential dossier schemas & automated expiration telemetry</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Cpu size={14} className="text-blue-700 shrink-0" />
                  <span>Direct matching algorithms across licensure, distance, and shift schedules</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Purdue University (2026)</span>
              <a
                href="https://www.linkedin.com/in/zachary-pitroda-079b56309/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 transition"
              >
                <LinkedinLogo size={16} weight="fill" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* Validation Context Banner with Real Image */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold">
                <Chats size={18} />
                <span>FIELD RESEARCH METHODOLOGY</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Grounding Architecture in Frontline Operational Realities
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The founding team conducts structured field interviews with medical staff professionals, hospital staffing coordinators, and practicing locum physicians across the Midwest. Rather than building speculative software in isolation, every capability is shaped by real credentialing cycle times and actual coverage budgets.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin size={16} className="text-blue-700" />
                  <span>Indiana & Midwest Regional Focus</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <GraduationCap size={16} className="text-blue-700" />
                  <span>Purdue University Research Roots</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/images/regional_hospital_exterior.jpg"
                    alt="Regional community hospital and critical access care facility exterior"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}