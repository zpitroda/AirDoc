"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { AirDocLogo } from "./AirDocLogo";

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md">
          <AirDocLogo variant="full" size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#evidence"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Evidence
          </Link>
          <Link
            href="#pipeline"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Pipeline
          </Link>
          <Link
            href="#capabilities"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Capabilities
          </Link>
          <Link
            href="#governance"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Governance
          </Link>
          <Link
            href="#validation"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Validation
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="#intake"
            className="inline-flex h-9 items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 active:scale-[0.98]"
          >
            Request Pilot Access
          </Link>
        </div>

        {/* Mobile Hamburger Button with 44px touch target */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-3 pb-6 md:hidden shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            <Link
              href="#evidence"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Evidence
            </Link>
            <Link
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Pipeline
            </Link>
            <Link
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Capabilities
            </Link>
            <Link
              href="#governance"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Governance
            </Link>
            <Link
              href="#validation"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Validation
            </Link>
            <div className="pt-3">
              <Link
                href="#intake"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[48px] w-full items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 active:scale-[0.98]"
              >
                Request Pilot Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}