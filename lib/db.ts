import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import {
  PilotSubmission,
  CoverageNeed,
  PhysicianProfile,
  SystemMetrics,
  SubmissionStatus,
  StakeholderRole,
} from "./types";

const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// Engine Detection: Native node:sqlite (Node 22+) with Atomic JSON Store Fallback (Node 18/20 LTS)
// ---------------------------------------------------------------------------
let DatabaseSyncClass: any = null;
try {
  const sqlite = require("node:sqlite");
  if (sqlite && sqlite.DatabaseSync) {
    DatabaseSyncClass = sqlite.DatabaseSync;
  }
} catch {
  DatabaseSyncClass = null;
}

let isSqliteAvailable = !!DatabaseSyncClass;
let sqliteDbInstance: any = null;

function getDataDir(): string {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      console.error("Failed to create data directory:", e);
    }
  }
  return dataDir;
}

// ---------------------------------------------------------------------------
// 1. SQLite Engine Implementation
// ---------------------------------------------------------------------------
function getSqliteDb(): any {
  if (sqliteDbInstance) return sqliteDbInstance;
  if (!isSqliteAvailable || !DatabaseSyncClass) return null;

  try {
    const dataDir = getDataDir();
    const dbPath = path.join(dataDir, "airdoc.sqlite");
    sqliteDbInstance = new DatabaseSyncClass(dbPath);

    sqliteDbInstance.exec(`
      CREATE TABLE IF NOT EXISTS pilot_submissions (
        id TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        organization TEXT NOT NULL,
        region TEXT NOT NULL,
        comments TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
        ip_address TEXT DEFAULT '',
        user_agent TEXT DEFAULT '',
        internal_notes TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_submissions_created ON pilot_submissions (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON pilot_submissions (status);
      CREATE INDEX IF NOT EXISTS idx_submissions_role ON pilot_submissions (role);

      CREATE TABLE IF NOT EXISTS coverage_needs (
        id TEXT PRIMARY KEY,
        facility_name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        state TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        shift_type TEXT NOT NULL,
        target_rate REAL NOT NULL,
        urgency TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        notes TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'OPEN',
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_coverage_created ON coverage_needs (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_coverage_specialty ON coverage_needs (specialty);
    `);

    return sqliteDbInstance;
  } catch (err) {
    console.warn("SQLite initialization failed, gracefully falling back to JSON store:", err);
    isSqliteAvailable = false;
    sqliteDbInstance = null;
    return null;
  }
}

function isUsingSqlite(): boolean {
  return isSqliteAvailable && !!getSqliteDb();
}

// ---------------------------------------------------------------------------
// 2. Atomic JSON Store Fallback (Guarantees zero-crash operation on Node 18/20 LTS VPS)
// ---------------------------------------------------------------------------
interface JsonDbSchema {
  pilot_submissions: PilotSubmission[];
  coverage_needs: CoverageNeed[];
}

function getJsonStorePath(): string {
  return path.join(getDataDir(), "airdoc_store.json");
}

function readJsonStore(): JsonDbSchema {
  const storePath = getJsonStorePath();
  if (!fs.existsSync(storePath)) {
    const empty: JsonDbSchema = { pilot_submissions: [], coverage_needs: [] };
    writeJsonStore(empty);
    return empty;
  }
  try {
    const raw = fs.readFileSync(storePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Warning: Error reading JSON store, initializing fresh:", err);
    return { pilot_submissions: [], coverage_needs: [] };
  }
}

function writeJsonStore(data: JsonDbSchema): void {
  const storePath = getJsonStorePath();
  const tempPath = `${storePath}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, storePath);
  } catch (err) {
    console.error("Error writing JSON store:", err);
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch {}
  }
}

// ---------------------------------------------------------------------------
// Unified Pilot Submissions API
// ---------------------------------------------------------------------------

export function savePilotSubmission(
  submission: Omit<PilotSubmission, "id" | "status" | "internal_notes" | "created_at" | "updated_at">
): PilotSubmission {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `AD-PLT-${year}-${randomSuffix}`;
  const now = new Date().toISOString();

  const record: PilotSubmission = {
    ...submission,
    id,
    status: "PENDING_REVIEW",
    internal_notes: "",
    created_at: now,
    updated_at: now,
  };

  if (isUsingSqlite()) {
    const db = getSqliteDb();
    const stmt = db.prepare(`
      INSERT INTO pilot_submissions (
        id, role, name, email, organization, region, comments, status,
        ip_address, user_agent, internal_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      record.id,
      record.role,
      record.name,
      record.email,
      record.organization,
      record.region,
      record.comments || "",
      record.status,
      record.ip_address || "",
      record.user_agent || "",
      record.internal_notes,
      record.created_at,
      record.updated_at
    );
  } else {
    const store = readJsonStore();
    store.pilot_submissions.unshift(record);
    writeJsonStore(store);
  }

  return record;
}

export function getPilotSubmissions(filters?: {
  role?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): { submissions: PilotSubmission[]; total: number } {
  if (isUsingSqlite()) {
    const db = getSqliteDb();
    let whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (filters?.role && filters.role !== "ALL") {
      whereClauses.push("role = ?");
      params.push(filters.role);
    }

    if (filters?.status && filters.status !== "ALL") {
      whereClauses.push("status = ?");
      params.push(filters.status);
    }

    if (filters?.search && filters.search.trim() !== "") {
      whereClauses.push("(name LIKE ? OR organization LIKE ? OR email LIKE ? OR region LIKE ?)");
      const searchTerm = `%${filters.search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countStmt = db.prepare(`SELECT COUNT(*) as count FROM pilot_submissions ${whereSql}`);
    const countResult = countStmt.get(...params) as { count: number };
    const total = countResult ? countResult.count : 0;

    const limit = filters?.limit ?? 50;
    const offset = filters?.offset ?? 0;
    const querySql = `
      SELECT * FROM pilot_submissions
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const queryStmt = db.prepare(querySql);
    const rows = queryStmt.all(...params, limit, offset) as unknown as PilotSubmission[];

    return { submissions: rows, total };
  } else {
    const store = readJsonStore();
    let list = [...store.pilot_submissions];

    if (filters?.role && filters.role !== "ALL") {
      list = list.filter((s) => s.role === filters.role);
    }

    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((s) => s.status === filters.status);
    }

    if (filters?.search && filters.search.trim() !== "") {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.organization.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? 50;
    const page = list.slice(offset, offset + limit);

    return { submissions: page, total };
  }
}

export function getPilotSubmissionById(id: string): PilotSubmission | null {
  if (isUsingSqlite()) {
    const db = getSqliteDb();
    const stmt = db.prepare("SELECT * FROM pilot_submissions WHERE id = ?");
    const row = stmt.get(id);
    return (row as unknown as PilotSubmission) || null;
  } else {
    const store = readJsonStore();
    return store.pilot_submissions.find((s) => s.id === id) || null;
  }
}

export function updatePilotSubmissionStatus(
  id: string,
  status?: SubmissionStatus,
  internalNotes?: string
): PilotSubmission | null {
  const existing = getPilotSubmissionById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updatedStatus = status || existing.status;
  const updatedNotes = internalNotes !== undefined ? internalNotes : existing.internal_notes;

  if (isUsingSqlite()) {
    const db = getSqliteDb();
    const stmt = db.prepare(`
      UPDATE pilot_submissions
      SET status = ?, internal_notes = ?, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(updatedStatus, updatedNotes, now, id);
    return getPilotSubmissionById(id);
  } else {
    const store = readJsonStore();
    const index = store.pilot_submissions.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated: PilotSubmission = {
      ...store.pilot_submissions[index],
      status: updatedStatus,
      internal_notes: updatedNotes,
      updated_at: now,
    };

    store.pilot_submissions[index] = updated;
    writeJsonStore(store);
    return updated;
  }
}

export function deletePilotSubmission(id: string): boolean {
  if (isUsingSqlite()) {
    const db = getSqliteDb();
    const stmt = db.prepare("DELETE FROM pilot_submissions WHERE id = ?");
    stmt.run(id);
    return true;
  } else {
    const store = readJsonStore();
    store.pilot_submissions = store.pilot_submissions.filter((s) => s.id !== id);
    writeJsonStore(store);
    return true;
  }
}

export function exportPilotSubmissionsCSV(): string {
  const { submissions } = getPilotSubmissions({ limit: 10000 });
  const headers = [
    "Reference ID",
    "Role",
    "Full Name",
    "Email",
    "Organization",
    "Region",
    "Comments",
    "Status",
    "Internal Notes",
    "Submitted At",
  ];

  const escapeCSV = (val: string | null | undefined) => {
    if (!val) return '""';
    let str = String(val);
    // Neutralize spreadsheet formula injection (=, +, -, @, tabs)
    if (/^[=+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = submissions.map((s) => [
    escapeCSV(s.id),
    escapeCSV(s.role),
    escapeCSV(s.name),
    escapeCSV(s.email),
    escapeCSV(s.organization),
    escapeCSV(s.region),
    escapeCSV(s.comments),
    escapeCSV(s.status),
    escapeCSV(s.internal_notes),
    escapeCSV(s.created_at),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}

// ---------------------------------------------------------------------------
// Unified Coverage Needs Requisitions API
// ---------------------------------------------------------------------------

export function saveCoverageNeed(
  need: Omit<CoverageNeed, "id" | "status" | "created_at">
): CoverageNeed {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `AD-REQ-${year}-${randomSuffix}`;
  const now = new Date().toISOString();

  const record: CoverageNeed = {
    ...need,
    id,
    status: "OPEN",
    created_at: now,
  };

  if (isUsingSqlite()) {
    const db = getSqliteDb();
    const stmt = db.prepare(`
      INSERT INTO coverage_needs (
        id, facility_name, specialty, state, start_date, end_date, shift_type,
        target_rate, urgency, contact_name, contact_email, notes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      record.id,
      record.facility_name,
      record.specialty,
      record.state,
      record.start_date,
      record.end_date,
      record.shift_type,
      record.target_rate,
      record.urgency,
      record.contact_name,
      record.contact_email,
      record.notes || "",
      record.status,
      record.created_at
    );
  } else {
    const store = readJsonStore();
    store.coverage_needs.unshift(record);
    writeJsonStore(store);
  }

  return record;
}

export function getCoverageNeeds(): CoverageNeed[] {
  if (isUsingSqlite()) {
    const db = getSqliteDb();
    const stmt = db.prepare("SELECT * FROM coverage_needs ORDER BY created_at DESC LIMIT 50");
    return stmt.all() as unknown as CoverageNeed[];
  } else {
    const store = readJsonStore();
    return store.coverage_needs.slice(0, 50);
  }
}

// ---------------------------------------------------------------------------
// System Metrics & Rollup
// ---------------------------------------------------------------------------

export function getSystemMetrics(): SystemMetrics & { engine: string } {
  const statusCounts: Record<SubmissionStatus, number> = {
    PENDING_REVIEW: 0,
    INTERVIEW_SCHEDULED: 0,
    PILOT_CANDIDATE: 0,
    ARCHIVED: 0,
  };
  const roleCounts: Record<string, number> = {};

  if (isUsingSqlite()) {
    const db = getSqliteDb();
    const totalStmt = db.prepare("SELECT COUNT(*) as count FROM pilot_submissions");
    const totalSubmissions = (totalStmt.get() as { count: number }).count;

    const statusRows = db
      .prepare("SELECT status, COUNT(*) as count FROM pilot_submissions GROUP BY status")
      .all() as { status: SubmissionStatus; count: number }[];

    for (const row of statusRows) {
      if (row.status in statusCounts) {
        statusCounts[row.status] = row.count;
      }
    }

    const roleRows = db
      .prepare("SELECT role, COUNT(*) as count FROM pilot_submissions GROUP BY role")
      .all() as { role: StakeholderRole; count: number }[];

    for (const row of roleRows) {
      roleCounts[row.role] = row.count;
    }

    const coverageStmt = db.prepare("SELECT COUNT(*) as count FROM coverage_needs");
    const totalCoverageNeeds = (coverageStmt.get() as { count: number }).count;

    return {
      totalSubmissions,
      statusCounts,
      roleCounts,
      totalCoverageNeeds,
      recentActivityCount: totalSubmissions + totalCoverageNeeds,
      engine: "SQLite (node:sqlite)",
    };
  } else {
    const store = readJsonStore();
    const totalSubmissions = store.pilot_submissions.length;

    for (const sub of store.pilot_submissions) {
      if (sub.status in statusCounts) {
        statusCounts[sub.status]++;
      }
      roleCounts[sub.role] = (roleCounts[sub.role] || 0) + 1;
    }

    const totalCoverageNeeds = store.coverage_needs.length;

    return {
      totalSubmissions,
      statusCounts,
      roleCounts,
      totalCoverageNeeds,
      recentActivityCount: totalSubmissions + totalCoverageNeeds,
      engine: "Atomic JSON Store (Node 18/20 LTS Fallback)",
    };
  }
}

// ---------------------------------------------------------------------------
// Physician Roster Mock Discovery Dataset
// ---------------------------------------------------------------------------

const MOCK_PHYSICIANS: PhysicianProfile[] = [
  {
    id: "PHY-101",
    name: "Dr. Marcus Vance, MD",
    specialty: "Hospitalist",
    subspecialty: "Internal Medicine",
    primary_state: "IN",
    compact_licensed: true,
    active_licenses: ["IN", "IL", "OH", "KY", "MI"],
    max_travel_radius_miles: 150,
    experience_years: 11,
    critical_access_experience: true,
    target_hourly_rate: 235,
    availability: {
      next_available: "2026-09-22",
      preferred_shifts: ["Day", "Night"],
    },
  },
  {
    id: "PHY-102",
    name: "Dr. Elena Rostova, MD",
    specialty: "Emergency Medicine",
    subspecialty: "Trauma Life Support",
    primary_state: "IL",
    compact_licensed: true,
    active_licenses: ["IL", "IN", "WI", "IA"],
    max_travel_radius_miles: 200,
    experience_years: 9,
    critical_access_experience: true,
    target_hourly_rate: 285,
    availability: {
      next_available: "2026-09-18",
      preferred_shifts: ["Night", "24h Call"],
    },
  },
  {
    id: "PHY-103",
    name: "Dr. Jonathan Chen, DO",
    specialty: "Anesthesiology",
    subspecialty: "Cardiac & General",
    primary_state: "OH",
    compact_licensed: true,
    active_licenses: ["OH", "IN", "KY", "PA"],
    max_travel_radius_miles: 120,
    experience_years: 14,
    critical_access_experience: false,
    target_hourly_rate: 320,
    availability: {
      next_available: "2026-09-25",
      preferred_shifts: ["Day", "Flexible"],
    },
  },
  {
    id: "PHY-104",
    name: "Dr. Sarah Jenkins, MD",
    specialty: "Critical Care / ICU",
    subspecialty: "Pulmonology",
    primary_state: "KY",
    compact_licensed: true,
    active_licenses: ["KY", "IN", "TN", "OH"],
    max_travel_radius_miles: 175,
    experience_years: 12,
    critical_access_experience: true,
    target_hourly_rate: 310,
    availability: {
      next_available: "2026-09-20",
      preferred_shifts: ["Night", "24h Call"],
    },
  },
  {
    id: "PHY-105",
    name: "Dr. Devlin Brooks, MD",
    specialty: "General Surgery",
    subspecialty: "Emergency General Surgery",
    primary_state: "MI",
    compact_licensed: false,
    active_licenses: ["MI", "IN"],
    max_travel_radius_miles: 100,
    experience_years: 16,
    critical_access_experience: true,
    target_hourly_rate: 340,
    availability: {
      next_available: "2026-10-01",
      preferred_shifts: ["24h Call", "Flexible"],
    },
  },
];

export function getPhysicians(filters?: {
  specialty?: string;
  state?: string;
  imlcOnly?: boolean;
}): PhysicianProfile[] {
  return MOCK_PHYSICIANS.filter((p) => {
    if (filters?.specialty && filters.specialty !== "all" && p.specialty !== filters.specialty) {
      return false;
    }
    if (filters?.state && filters.state !== "all" && !p.active_licenses.includes(filters.state)) {
      return false;
    }
    if (filters?.imlcOnly && !p.compact_licensed) {
      return false;
    }
    return true;
  });
}
