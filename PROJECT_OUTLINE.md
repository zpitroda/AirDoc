# AirDoc - Project Outline & Specification

> **Core Promise:** *Coverage when it matters. Clarity at every step.*  
> **Status:** Early-Stage Customer Discovery & Validation (Updated September 2026)  
> **Co-Founders:** Soroosh Kermani (Purdue University), Zachary Pitroda (Purdue University)

---

## 1. Executive Summary & Purpose

**AirDoc** is a technology-enabled direct marketplace connecting healthcare facilities that need urgent temporary physician coverage (locum tenens) with qualified physicians available to work.

### Purpose & Mission
- **Our Purpose:** Help hospitals maintain access to care while reducing unnecessary costs and friction in temporary physician staffing.
- **Mission:** To reduce avoidable healthcare costs and protect patient access by making temporary physician coverage faster, clearer, and more direct.
- **Vision:** A healthcare workforce system in which hospitals can fill urgent physician gaps without opaque pricing, scattered information, or unnecessary administrative delay.
- **Long-Term Goal:** To become the trusted infrastructure layer for temporary physician staffing: helping facilities discover qualified clinical talent, helping doctors access transparent opportunities, and using operational data to anticipate future coverage needs before they become emergencies.

---

## 2. Market Problem & Key Evidence

When a physician cannot cover a shift, the downstream consequences extend far beyond an empty schedule-impacting patient access, clinician burnout, emergency transfers, service line availability, and hospital operational solvency.

### Critical Industry Metrics
- **Shortage:** Projected U.S. physician shortfall of **13,500 to 86,000 physicians by 2036** (*Source: AAMC*).
- **Credentialing Lag:** Institutional credentialing processes currently require **90-120 days** on average (*Source: AMA*).
- **Escalating Costs:** Hospital contract-labor expenses surged **258% from 2019 to 2022** (*Source: AHA*).
- **Labor Burden:** In 2024, hospital labor costs totaled **$890 billion**, representing **56% of total hospital operating expenses** (*Source: AHA 2025 Cost of Caring Report, published 2026*).

### Current Challenges
1. **Urgent Vacancies:** Hospitals need short-notice coverage, yet qualified clinicians remain fragmented across siloed agency rosters.
2. **Limited Price Visibility:** Hospitals face opaque agency markups without knowing clinician compensation vs. gross spend; physicians have no visibility into what hospitals are charged.
3. **Repeated Administrative Burden:** Physicians repeatedly re-submit licenses, CVs, work histories, references, and insurance documents to multiple entities.
4. **Slow Credentialing:** Incomplete, non-standardized document collection delays start dates and causes unnecessary downtime.
5. **Vulnerability of Rural & Community Facilities:** Smaller, critical-access hospitals face candidate shortages and limited negotiating leverage against legacy staffing firms.

### The AirDoc Hypothesis
A transparent marketplace combined with a reusable credential workflow will substantially reduce time-to-coverage, eliminate repetitive administrative overhead, and compress intermediary markups-validated via pilot hospital and physician deployments.

---

## 3. The 6-Step AirDoc Workflow

```
[1. Post Need] â”€â”€> [2. Surface Matches] â”€â”€> [3. Review Transparent Info]
       â”‚
       â””â”€â”€> [4. Direct Request] â”€â”€> [5. Credentialing Readiness] â”€â”€> [6. Measure Outcomes]
```

1. **Hospital Posts a Coverage Need:** Facility specifies specialty, date range, shift expectations, location, compensation/rate, and urgency.
2. **Relevant Physicians Identified:** Matching algorithms surface candidates based on availability, state licensure, distance/travel, clinical experience, and preferences.
3. **Both Sides Review Clear Information:** Hospitals inspect verified qualifications and transparent costs; physicians review full assignment scope and net compensation.
4. **Direct Request & Mutual Agreement:** Hospitals request physicians directly; physicians accept, decline, or communicate within an audited workflow.
5. **Credentialing Readiness Acceleration:** Reusable clinician dossiers and pre-flight readiness checks streamline verification. *(Final credentialing and privileging remain strictly with the hospital/authorized institution).*
6. **Outcomes & Analytics Tracking:** The system captures response times, fill rates, time-to-credential, net costs, administrative hours saved, and participant satisfaction.

---

## 4. Proposed Platform Capabilities

- **Searchable Physician Marketplace:** Real-time search by medical specialty, sub-specialty, state license status, board certification, and verified skills.
- **Interactive Map-Based Discovery:** Geographic visualization of coverage needs, regional clinician density, and travel radius filters.
- **Transparent Rates & Assignment Terms:** Clear breakdown of hospital rate, provider compensation, travel, and platform fees with zero hidden markups.
- **Dynamic Availability Calendars:** Physicians maintain open dates, shift preferences (day/night/call), and blackout periods.
- **Direct Messaging & In-Platform Requests:** Audited communication channels between facility staffing coordinators and physicians.
- **Reusable Clinician Dossiers:** Standardized digital profile storing verified licenses, NPI, DEA, board certifications, peer references, immunization records, and work history.
- **Credential Readiness & Expiration Monitoring:** Automated alerts for expiring state licenses, certifications, DEA registrations, and missing documentation.
- **Status Pipeline Tracking:** End-to-end milestone tracker from initial request through credential submission, committee approval, first shift, and completion.
- **Predictive Coverage Analytics:** Hospital dashboards tracking historical vacancy cycles, seasonal staffing spikes, and forward-looking schedule risks.

---

## 5. Scope Boundary: What AirDoc Is NOT

- **Not a Replacement for Medical Staff Verification:** AirDoc does **not** replace the hospital's legal and regulatory obligation to verify primary sources, credential clinicians, or grant hospital privileges.
- **Not an Employment Decision-Maker:** AirDoc facilitates discovery, workflow preparation, and data transparency; final clinical staffing and appointment decisions rest solely with authorized healthcare institutions.
- **Not an Opaque Brokerage:** AirDoc operates as an open infrastructure layer, not an intermediary extracting asymmetric information rents.

---

## 6. Value Proposition by Stakeholder

| Stakeholder | Key Value Delivered |
| :--- | :--- |
| **Hospitals & Facilities** | â€¢ Rapid access to verified, available clinicians<br>â€¢ Full transparency on staffing costs and bill rates<br>â€¢ Drastic reduction in recruiter outreach and repetitive document chasing<br>â€¢ Lower avoidable emergency staffing costs and reduced vacancy downtime |
| **Physicians** | â€¢ Complete visibility into assignment expectations and compensation<br>â€¢ Greater autonomy over schedule, travel, and geography<br>â€¢ Single reusable profile eliminating repeated credential paperwork<br>â€¢ Direct line of communication with hospital leadership |
| **Patients & Communities** | â€¢ Continuity of local clinical services in rural and community hospitals<br>â€¢ Fewer ER diverts, cancelled procedures, and service shutdowns<br>â€¢ Sustainable healthcare delivery model focused on community care access |

---

## 7. Current Project Status & Product Principles

- **Phase:** Early-stage customer discovery, user research, and interactive prototype validation.
- **Evidence-Based Guardrails:** Marketing materials and platform copy must refrain from making claims of guaranteed cost savings, specific speed metrics, active customer relationships, or regulatory certifications until formally validated by clinical pilots.
- **Architectural Tenet:** Build modular, modern, clean web software (Next.js, TypeScript, Tailwind CSS, Motion) that delivers high trust, crisp typography, and seamless data visualization for healthcare administrators and doctors.
