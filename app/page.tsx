import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { MacroEvidence } from "./components/MacroEvidence";
import { StaffingLedger } from "./components/StaffingLedger";
import { OperationalPipeline } from "./components/OperationalPipeline";
import { PlatformCapabilities } from "./components/PlatformCapabilities";
import { ValueMatrix } from "./components/ValueMatrix";
import { GovernanceScope } from "./components/GovernanceScope";
import { FounderValidation } from "./components/FounderValidation";
import { PilotIntakeForm } from "./components/PilotIntakeForm";
import { InstitutionalFooter } from "./components/InstitutionalFooter";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Nav />
      <main className="flex-1">
        <Hero />
        <MacroEvidence />
        <StaffingLedger />
        <OperationalPipeline />
        <PlatformCapabilities />
        <ValueMatrix />
        <GovernanceScope />
        <FounderValidation />
        <PilotIntakeForm />
      </main>
      <InstitutionalFooter />
    </div>
  );
}