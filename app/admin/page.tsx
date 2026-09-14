"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LockKey,
  SignOut,
  DownloadSimple,
  ArrowsClockwise,
  MagnifyingGlass,
  CheckCircle,
  Clock,
  UserCheck,
  Archive,
  CaretDown,
  FileText,
  Buildings,
  User,
  ShieldCheck,
  X,
  ChatCircleText,
} from "@phosphor-icons/react";
import { PilotSubmission, SubmissionStatus, SystemMetrics, CoverageNeed } from "@/lib/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard state
  const [submissions, setSubmissions] = useState<PilotSubmission[]>([]);
  const [coverageNeeds, setCoverageNeeds] = useState<CoverageNeed[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<"intakes" | "coverage">("intakes");
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Detailed Modal / Drawer
  const [selectedSubmission, setSelectedSubmission] = useState<PilotSubmission | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        setIsAuthenticated(!!data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (roleFilter !== "ALL") queryParams.set("role", roleFilter);
      if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
      if (searchQuery.trim()) queryParams.set("search", searchQuery.trim());

      const [intakeRes, coverageRes] = await Promise.all([
        fetch(`/api/intake?${queryParams.toString()}`),
        fetch("/api/coverage-needs"),
      ]);

      if (intakeRes.ok) {
        const intakeData = await intakeRes.json();
        setSubmissions(intakeData.submissions || []);
        setMetrics(intakeData.metrics || null);
      }

      if (coverageRes.ok) {
        const coverageData = await coverageRes.json();
        setCoverageNeeds(coverageData.needs || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, statusFilter, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput("");
      } else {
        setAuthError(data.error || "Incorrect administrative password");
      }
    } catch {
      setAuthError("Failed to connect to authentication service");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    try {
      const res = await fetch(`/api/intake/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
        );
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/intake/${selectedSubmission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internal_notes: editingNotes }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === selectedSubmission.id ? { ...sub, internal_notes: editingNotes } : sub
          )
        );
        setSelectedSubmission((prev) => (prev ? { ...prev, internal_notes: editingNotes } : null));
      }
    } catch (err) {
      console.error("Save notes error:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // 1. Loading screen while verifying cookie
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 font-sans text-slate-700">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-700 border-t-transparent" />
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Checking Credentials...
          </p>
        </div>
      </div>
    );
  }

  // 2. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/30">
              <LockKey size={24} weight="bold" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              AirDoc Operational Portal
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Restricted Customer Discovery & Pilot Administration
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="rounded-md bg-red-950/60 border border-red-800/80 p-3 text-xs text-red-300">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Security Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter access password"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1.5 text-[11px] text-slate-500">
                Contact systems administration if you require access credentials.
              </p>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-500 active:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            >
              {isAuthenticating ? "Verifying..." : "Access Discovery Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Authenticated Discovery Management Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-700 font-mono text-xs font-bold text-white">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">AirDoc Discovery Console</span>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-mono font-medium text-blue-800">
                  Admin v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Purdue Customer Validation & Pilot Intake Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/api/intake?format=csv"
              download
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition"
            >
              <DownloadSimple size={15} />
              <span className="hidden sm:inline">Export CSV</span>
            </a>

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition"
              title="Refresh Data"
            >
              <ArrowsClockwise size={15} className={isLoading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-slate-100 px-3 text-xs font-medium text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <SignOut size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Total Inquiries
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {metrics?.totalSubmissions ?? submissions.length}
              </span>
              <span className="text-xs text-slate-500">leads</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Hospital Executives
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-blue-700">
                {metrics?.roleCounts?.["Hospital Executive"] ?? 0}
              </span>
              <span className="text-xs text-slate-500">leadership</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Locum Physicians
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-700">
                {metrics?.roleCounts?.["Locum Physician"] ?? 0}
              </span>
              <span className="text-xs text-slate-500">clinicians</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Pending Review
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-600">
                {metrics?.statusCounts?.["PENDING_REVIEW"] ?? 0}
              </span>
              <span className="text-xs text-slate-500">awaiting call</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("intakes")}
            className={`pb-3 border-b-2 transition ${
              activeTab === "intakes"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Pilot Access Inquiries ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("coverage")}
            className={`pb-3 border-b-2 transition ${
              activeTab === "coverage"
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Shift Requisitions ({coverageNeeds.length})
          </button>
        </div>

        {activeTab === "intakes" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, organization, email, or region..."
                  className="w-full rounded-md border border-slate-300 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="Hospital Executive">Hospital Executive</option>
                  <option value="Medical Staff Coordinator">Medical Staff Coordinator</option>
                  <option value="Rural Clinic Director">Rural Clinic Director</option>
                  <option value="Locum Physician">Locum Physician</option>
                  <option value="Healthcare Partner">Healthcare Partner</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="PILOT_CANDIDATE">Pilot Candidate</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Name & Contact</th>
                      <th className="py-3 px-4">Organization</th>
                      <th className="py-3 px-4">Region</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          No pilot discovery inquiries found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub) => {
                        const statusColors: Record<SubmissionStatus, string> = {
                          PENDING_REVIEW: "bg-amber-50 text-amber-800 border-amber-200",
                          INTERVIEW_SCHEDULED: "bg-blue-50 text-blue-800 border-blue-200",
                          PILOT_CANDIDATE: "bg-emerald-50 text-emerald-800 border-emerald-200",
                          ARCHIVED: "bg-slate-100 text-slate-600 border-slate-200",
                        };

                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/75 transition">
                            <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                              {sub.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-800">
                                {sub.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-900">{sub.name}</div>
                              <a
                                href={`mailto:${sub.email}`}
                                className="text-blue-700 hover:underline text-[11px]"
                              >
                                {sub.email}
                              </a>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800">
                              {sub.organization}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{sub.region}</td>
                            <td className="py-3.5 px-4">
                              <select
                                value={sub.status}
                                onChange={(e) =>
                                  handleStatusChange(sub.id, e.target.value as SubmissionStatus)
                                }
                                className={`rounded border px-2 py-1 text-[11px] font-medium cursor-pointer ${
                                  statusColors[sub.status]
                                }`}
                              >
                                <option value="PENDING_REVIEW">Pending Review</option>
                                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                                <option value="PILOT_CANDIDATE">Pilot Candidate</option>
                                <option value="ARCHIVED">Archived</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSubmission(sub);
                                  setEditingNotes(sub.internal_notes || "");
                                }}
                                className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                              >
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "coverage" && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="py-3 px-4">Req Code</th>
                      <th className="py-3 px-4">Facility</th>
                      <th className="py-3 px-4">Specialty</th>
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">Coverage Dates</th>
                      <th className="py-3 px-4">Target Rate</th>
                      <th className="py-3 px-4">Urgency</th>
                      <th className="py-3 px-4">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {coverageNeeds.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          No shift coverage requisitions registered yet.
                        </td>
                      </tr>
                    ) : (
                      coverageNeeds.map((need) => (
                        <tr key={need.id} className="hover:bg-slate-50/75 transition">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                            {need.id}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-900">
                            {need.facility_name}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-800 font-medium">
                              {need.specialty}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                            {need.state}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {need.start_date} &rarr; {need.end_date}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                            ${need.target_rate}/hr
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-800 font-medium">
                              {need.urgency}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">{need.contact_name}</div>
                            <a
                              href={`mailto:${need.contact_email}`}
                              className="text-blue-700 hover:underline text-[11px]"
                            >
                              {need.contact_email}
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Detail & Researcher Notes Drawer Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-900 text-sm">
                    {selectedSubmission.id}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {selectedSubmission.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Full Name</span>
                  <span className="font-semibold text-slate-900">{selectedSubmission.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email Address</span>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-medium text-blue-700 hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Hospital / Organization</span>
                  <span className="font-semibold text-slate-900">
                    {selectedSubmission.organization}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Region</span>
                  <span className="font-semibold text-slate-900">{selectedSubmission.region}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block mb-1">
                  Primary Coverage Bottleneck / Operational Notes
                </span>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto">
                  {selectedSubmission.comments || "No comments provided."}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block mb-1">
                  Internal Researcher Notes (Purdue Discovery Log)
                </span>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record interview notes, preliminary scheduling times, or trial suitability..."
                  className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-[11px] font-mono text-slate-400">
                  Recorded: {new Date(selectedSubmission.created_at).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="rounded-md bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingNotes ? "Saving..." : "Save Internal Notes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
