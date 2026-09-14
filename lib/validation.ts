import { StakeholderRole } from "./types";

export const ALLOWED_ROLES: StakeholderRole[] = [
  "Hospital Executive",
  "Medical Staff Coordinator",
  "Rural Clinic Director",
  "Locum Physician",
  "Healthcare Partner",
];

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: {
    role: StakeholderRole;
    name: string;
    email: string;
    organization: string;
    region: string;
    comments: string;
  };
}

export function validatePilotIntake(data: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      errors: { body: "Invalid request payload format." },
      sanitized: {
        role: "Hospital Executive",
        name: "",
        email: "",
        organization: "",
        region: "",
        comments: "",
      },
    };
  }

  const raw = data as Record<string, unknown>;

  // Role validation
  const rawRole = typeof raw.role === "string" ? raw.role.trim() : "";
  const role = ALLOWED_ROLES.includes(rawRole as StakeholderRole)
    ? (rawRole as StakeholderRole)
    : ("" as StakeholderRole);
  if (!role) {
    errors.role = `Please select a valid role from: ${ALLOWED_ROLES.join(", ")}`;
  }

  // Name validation
  const name = typeof raw.name === "string" ? raw.name.trim().replace(/[<>]/g, "") : "";
  if (!name || name.length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  } else if (name.length > 100) {
    errors.name = "Full name cannot exceed 100 characters.";
  }

  // Email validation
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  if (!email) {
    errors.email = "Institutional email address is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address (e.g. name@hospital.org).";
  } else if (email.length > 150) {
    errors.email = "Email address cannot exceed 150 characters.";
  }

  // Organization validation
  const organization = typeof raw.organization === "string" ? raw.organization.trim().replace(/[<>]/g, "") : "";
  if (!organization || organization.length < 2) {
    errors.organization = "Hospital or practice organization is required.";
  } else if (organization.length > 150) {
    errors.organization = "Organization name cannot exceed 150 characters.";
  }

  // Region validation
  const region = typeof raw.region === "string" ? raw.region.trim().replace(/[<>]/g, "") : "";
  if (!region || region.length < 2) {
    errors.region = "State or geographic region is required.";
  } else if (region.length > 100) {
    errors.region = "Region cannot exceed 100 characters.";
  }

  // Comments validation (optional)
  const comments = typeof raw.comments === "string" ? raw.comments.trim().replace(/[<>]/g, "") : "";
  if (comments.length > 3000) {
    errors.comments = "Operational notes cannot exceed 3000 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      role: role || "Hospital Executive",
      name,
      email,
      organization,
      region,
      comments,
    },
  };
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// -------------------------
// In-Memory Rate Limiting
// -------------------------

interface RateRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateRecord>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 15; // 15 submissions per 15 min per IP

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const clientRecord = rateLimitStore.get(ip) || { timestamps: [] };

  // Filter timestamps within the current window
  const validTimestamps = clientRecord.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldestTimestamp + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  validTimestamps.push(now);
  rateLimitStore.set(ip, { timestamps: validTimestamps });

  // Periodically clean up stale entries (every 200 entries)
  if (rateLimitStore.size > 200) {
    for (const [key, val] of rateLimitStore.entries()) {
      const active = val.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, { timestamps: active });
      }
    }
  }

  return { allowed: true };
}

const adminAuthLimitStore = new Map<string, RateRecord>();
const ADMIN_AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ADMIN_AUTH_PER_WINDOW = 5; // 5 failed attempts per 15 min per IP

export function checkAdminAuthRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const clientRecord = adminAuthLimitStore.get(ip) || { timestamps: [] };

  const validTimestamps = clientRecord.timestamps.filter((t) => now - t < ADMIN_AUTH_WINDOW_MS);

  if (validTimestamps.length >= MAX_ADMIN_AUTH_PER_WINDOW) {
    const oldestTimestamp = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldestTimestamp + ADMIN_AUTH_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true };
}

export function recordAdminAuthFailure(ip: string): void {
  const now = Date.now();
  const clientRecord = adminAuthLimitStore.get(ip) || { timestamps: [] };
  const validTimestamps = clientRecord.timestamps.filter((t) => now - t < ADMIN_AUTH_WINDOW_MS);
  validTimestamps.push(now);
  adminAuthLimitStore.set(ip, { timestamps: validTimestamps });
}

export function resetAdminAuthLimit(ip: string): void {
  adminAuthLimitStore.delete(ip);
}
