"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Calculator,
  Compass,
  BellRinging,
  CalendarCheck,
} from "@phosphor-icons/react";

export function PlatformCapabilities() {
  const [hourlyRate, setHourlyRate] = useState(240);
  const legacyBrokerMarkup = Math.round(hourlyRate * 0.45);
  const platformFee = Math.round(hourlyRate * 0.12);

  return (
    <section id="capabilities" className="bg-slate-50 py-14 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-3 sm:mb-4">
            Platform Capabilities Under Development
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-[65ch]">
            Targeted operational modules designed to replace broker telephone chains with transparent direct coordination.
          </p>
        </div>

        {/* Bento Grid: 2 + 3 = 5 cells */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cell 1: Reusable Credential Dossier (Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-blue-700 mb-2">
                <ShieldCheck size={16} />
                <span>CREDENTIAL COMPLIANCE</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                Reusable Clinician Profiles and Dossiers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[55ch]">
                Organize primary-source verification materials, state licenses, board certifications, and work histories in a structured format ready for hospital medical staff services.
              </p>
            </div>

            <div className="relative aspect-[16/9] w-full border-t border-slate-100 bg-slate-100">
              <Image
                src="/images/credential_verification_office.jpg"
                alt="Medical staff services office and credentialing coordinator workspace"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Cell 2: Transparent Rate Breakdown Calculator (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-blue-700 mb-2">
                <Calculator size={16} />
                <span>FINANCIAL TRANSPARENCY</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                Transparent Rate Visibility
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Direct compensation modeling where hospitals and physicians see the exact split, eliminating hidden agency margins.
              </p>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-700">Physician Target Rate:</span>
                  <span className="text-sm font-mono font-semibold text-slate-900">${hourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="180"
                  max="350"
                  step="10"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-3 accent-blue-700 cursor-pointer"
                  aria-label="Physician target hourly rate slider"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                  <span>$180/hr</span>
                  <span>$350/hr</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Physician Net Pay:</span>
                  <span className="font-semibold text-slate-900">${hourlyRate}.00/hr</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">AirDoc Coordination (12%):</span>
                  <span className="font-semibold text-blue-700">+${platformFee}.00/hr</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200 text-slate-800">
                  <span className="font-medium">Total Facility Cost:</span>
                  <span className="font-bold text-slate-900">${hourlyRate + platformFee}.00/hr</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-500 text-[11px]">
                  <span>Legacy Agency Total (~45% markup):</span>
                  <span className="line-through text-slate-400">${hourlyRate + legacyBrokerMarkup}.00/hr</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 block">
                Representative simulation for customer discovery evaluation.
              </span>
            </div>
          </div>

          {/* Cell 3: Geographic Discovery (Span 4) */}
          <div className="lg:col-span-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-blue-700 mb-2">
                <Compass size={16} />
                <span>REGIONAL MATCHING</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                Map-Based Regional Discovery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Locate physicians by travel proximity, multi-state Compact licensure, and specific critical-access hospital experience.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-700 space-y-1.5">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Active Licenses:</span>
                <span className="font-semibold text-blue-700">IN, IL, OH, KY, MI</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Facility Radius:</span>
                <span className="text-slate-900">120 miles</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">IMLC Status:</span>
                <span className="text-emerald-700 font-semibold">Verified Active</span>
              </div>
            </div>
          </div>

          {/* Cell 4: Expiration & Document Alerts (Span 4) */}
          <div className="lg:col-span-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-blue-700 mb-2">
                <BellRinging size={16} />
                <span>ALERT TELEMETRY</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                Automated Expiration Alerts
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Automated monitors track state medical licenses, DEA registrations, and life support certifications before gaps occur.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
                <span className="font-medium">State Medical License</span>
                <span className="font-mono text-[11px] text-emerald-700">Valid (320 days)</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-blue-50 border border-blue-200 px-3 py-2 text-xs text-blue-800">
                <span className="font-medium">DEA Federal Registration</span>
                <span className="font-mono text-[11px] text-blue-700">Verified Active</span>
              </div>
            </div>
          </div>

          {/* Cell 5: Physician Availability Calendars (Span 4) */}
          <div className="lg:col-span-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-blue-700 mb-2">
                <CalendarCheck size={16} />
                <span>SCHEDULE DISCOVERY</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                Physician Availability Calendars
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Physicians set exact calendar windows, shift formats, and weekend preferences for direct matching with facility rotas.
              </p>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] bg-slate-50 p-3 rounded-md border border-slate-200">
              <span className="text-slate-400 font-semibold">M</span>
              <span className="text-slate-400 font-semibold">T</span>
              <span className="text-slate-400 font-semibold">W</span>
              <span className="text-slate-400 font-semibold">T</span>
              <span className="text-slate-400 font-semibold">F</span>
              <span className="text-slate-400 font-semibold">S</span>
              <span className="text-slate-400 font-semibold">S</span>

              <span className="p-1 rounded bg-blue-100 text-blue-800 font-semibold">12</span>
              <span className="p-1 rounded bg-blue-100 text-blue-800 font-semibold">13</span>
              <span className="p-1 rounded bg-blue-100 text-blue-800 font-semibold">14</span>
              <span className="p-1 rounded bg-blue-700 text-white font-semibold">15</span>
              <span className="p-1 rounded bg-blue-700 text-white font-semibold">16</span>
              <span className="p-1 text-slate-300">17</span>
              <span className="p-1 text-slate-300">18</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}