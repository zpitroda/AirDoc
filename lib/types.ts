export type StakeholderRole =
  | "Hospital Executive"
  | "Medical Staff Coordinator"
  | "Rural Clinic Director"
  | "Locum Physician"
  | "Healthcare Partner";

export type SubmissionStatus =
  | "PENDING_REVIEW"
  | "INTERVIEW_SCHEDULED"
  | "PILOT_CANDIDATE"
  | "ARCHIVED";

export interface PilotSubmission {
  id: string; // e.g. "AD-PLT-2026-7842"
  role: StakeholderRole;
  name: string;
  email: string;
  organization: string;
  region: string;
  comments: string;
  status: SubmissionStatus;
  ip_address: string;
  user_agent: string;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export type ShiftType = "Day" | "Night" | "24h Call" | "Flexible";

export type CoverageUrgency = "Urgent (<48h)" | "Short-Notice (1-2w)" | "Planned (>30d)";

export type CoverageNeedStatus = "OPEN" | "MATCHED" | "FULFILLED" | "CANCELLED";

export interface CoverageNeed {
  id: string; // e.g. "AD-REQ-2026-1049"
  facility_name: string;
  specialty: string;
  state: string;
  start_date: string;
  end_date: string;
  shift_type: ShiftType;
  target_rate: number;
  urgency: CoverageUrgency;
  contact_name: string;
  contact_email: string;
  notes: string;
  status: CoverageNeedStatus;
  created_at: string;
}

export interface PhysicianProfile {
  id: string;
  name: string;
  specialty: string;
  subspecialty?: string;
  primary_state: string;
  compact_licensed: boolean;
  active_licenses: string[];
  max_travel_radius_miles: number;
  experience_years: number;
  critical_access_experience: boolean;
  target_hourly_rate: number;
  availability: {
    next_available: string;
    preferred_shifts: ShiftType[];
  };
}

export interface SystemMetrics {
  totalSubmissions: number;
  statusCounts: Record<SubmissionStatus, number>;
  roleCounts: Record<string, number>;
  totalCoverageNeeds: number;
  recentActivityCount: number;
}
