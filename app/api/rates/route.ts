import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SPECIALTY_BENCHMARKS: Record<
  string,
  { median_rate: number; min_rate: number; max_rate: number; description: string }
> = {
  Hospitalist: {
    median_rate: 235,
    min_rate: 190,
    max_rate: 275,
    description: "Inpatient internal medicine & telemetry shift coverage.",
  },
  "Emergency Medicine": {
    median_rate: 285,
    min_rate: 240,
    max_rate: 340,
    description: "Level II-IV trauma centers and community emergency departments.",
  },
  Anesthesiology: {
    median_rate: 320,
    min_rate: 270,
    max_rate: 380,
    description: "General OR, obstetric, and trauma surgical support.",
  },
  "Critical Care / ICU": {
    median_rate: 310,
    min_rate: 260,
    max_rate: 365,
    description: "Intensivist coverage for closed and open intensive care units.",
  },
  "General Surgery": {
    median_rate: 340,
    min_rate: 280,
    max_rate: 420,
    description: "Emergency surgical call, appendectomy, and acute laparotomy.",
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get("specialty") || "Hospitalist";
  const benchmark = SPECIALTY_BENCHMARKS[specialty] || SPECIALTY_BENCHMARKS["Hospitalist"];

  const hourlyRate = Math.max(
    100,
    Math.min(600, parseInt(searchParams.get("rate") || String(benchmark.median_rate), 10))
  );

  const platformFee = Math.round(hourlyRate * 0.12);
  const totalFacilityCost = hourlyRate + platformFee;
  const legacyMarkup = Math.round(hourlyRate * 0.45);
  const legacyFacilityCost = hourlyRate + legacyMarkup;

  const hourlySavings = legacyFacilityCost - totalFacilityCost;
  const shift12hSavings = hourlySavings * 12;
  const week40hSavings = hourlySavings * 40;
  const annualVacancySavings = hourlySavings * 1800; // ~150 shifts/yr

  return NextResponse.json({
    specialty,
    hourlyRate,
    platformFee,
    totalFacilityCost,
    legacyMarkup,
    legacyFacilityCost,
    savings: {
      hourly: hourlySavings,
      shift12h: shift12hSavings,
      week40h: week40hSavings,
      annualEstimate: annualVacancySavings,
      savingsPercentage: Math.round((hourlySavings / legacyFacilityCost) * 100),
    },
    benchmarks: SPECIALTY_BENCHMARKS,
  });
}
