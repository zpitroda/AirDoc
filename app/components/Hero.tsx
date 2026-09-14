"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, FileText } from "@phosphor-icons/react";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-700 font-semibold mb-3 sm:mb-4">
              EARLY-STAGE CUSTOMER DISCOVERY
            </span>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-4 sm:mb-6">
              Direct Temporary Physician Coverage for Critical Care Gaps
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[54ch] mb-6 sm:mb-8">
              Connecting hospitals with qualified physicians through transparent rates, schedule discovery, and reusable credential workflows.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="#intake"
                className="inline-flex min-h-[48px] sm:h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 active:scale-[0.98]"
              >
                Request Pilot Access
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#pipeline"
                className="inline-flex min-h-[48px] sm:h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 active:scale-[0.98]"
              >
                <FileText size={16} />
                Review Platform Brief
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full"
          >
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/images/hospital_operations_hub.jpg"
                  alt="Hospital administrative operations center and medical director coordination workspace"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}