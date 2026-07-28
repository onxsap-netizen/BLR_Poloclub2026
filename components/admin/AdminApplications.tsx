"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  X,
  Check,
  Ban,
  Clock,
  Users,
  FileCheck,
  FileX,
  ChevronRight,
} from "lucide-react";
import type { Application, ApplicationStatus } from "@/lib/types";
import { updateApplicationStatus } from "@/lib/adminActions";
import { exportApplicationsToExcel } from "@/lib/exportExcel";

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  approved: "border-green-500/40 bg-green-500/10 text-green-400",
  rejected: "border-accent/40 bg-accent/10 text-accent",
};

export default function AdminApplications({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    }),
    [applications]
  );

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchesFilter = filter === "all" || a.status === filter;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.registration_number.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [applications, filter, query]);

  const openDetail = (app: Application) => {
    setSelected(app);
    setNotes(app.admin_notes || "");
  };

  const handleDecision = async (status: ApplicationStatus) => {
    if (!selected) return;
    setBusy(true);
    const result = await updateApplicationStatus(selected.id, status, notes);
    setBusy(false);
    if (result.success) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selected.id
            ? { ...a, status, admin_notes: notes, reviewed_at: new Date().toISOString() }
            : a
        )
      );
      setSelected(null);
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-end">
          <button
            onClick={() => exportApplicationsToExcel(filtered)}
            className="focus-ring flex items-center gap-2 rounded-full border border-silver/40 px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wider hover:border-accent hover:text-accent"
          >
            <Download size={16} /> Export to Excel
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total, icon: Users, key: "all" as const },
            { label: "Pending", value: stats.pending, icon: Clock, key: "pending" as const },
            { label: "Approved", value: stats.approved, icon: FileCheck, key: "approved" as const },
            { label: "Rejected", value: stats.rejected, icon: FileX, key: "rejected" as const },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setFilter(s.key)}
              className={`focus-ring rounded-xl border p-5 text-left transition-colors ${
                filter === s.key ? "border-accent bg-accent/10" : "border-base-border bg-base-panel hover:border-silver"
              }`}
            >
              <s.icon size={18} className="text-accent" />
              <p className="mt-2 font-mono text-2xl font-bold">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-silver">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-base-border bg-base-elevated px-4 py-3">
          <Search size={18} className="text-silver" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, city, or registration number..."
            className="w-full bg-transparent text-off placeholder:text-silver/50 focus:outline-none"
          />
        </div>

        {/* Applications list */}
        <div className="mt-6 overflow-hidden rounded-xl border border-base-border">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-silver">No applications found.</div>
          ) : (
            <div className="divide-y divide-base-border">
              {filtered.map((app) => (
                <button
                  key={app.id}
                  onClick={() => openDetail(app)}
                  className="focus-ring flex w-full items-center justify-between gap-4 bg-base-panel/60 p-5 text-left transition-colors hover:bg-base-panel"
                >
                  <div className="flex items-center gap-4">
                    {app.photo_side_url || app.photo_front_url ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-base-border">
                        <Image
                          src={(app.photo_side_url || app.photo_front_url)!}
                          alt={app.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-base-border bg-base-elevated text-silver">
                        <Users size={18} />
                      </div>
                    )}
                    <div>
                      <p className="font-display text-base font-semibold uppercase tracking-wide">
                        {app.full_name}
                      </p>
                      <p className="text-sm text-silver">
                        {app.polo_variant} · {app.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider ${statusStyles[app.status]}`}
                    >
                      {app.status}
                    </span>
                    <ChevronRight size={18} className="text-silver" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase">{selected.full_name}</h2>
                  <p className="text-sm text-silver">{selected.email} · {selected.phone_number}</p>
                </div>
                <button onClick={() => setSelected(null)} className="focus-ring rounded-full p-2 hover:bg-base-panel">
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[selected.photo_front_url, selected.photo_rear_url, selected.photo_side_url, selected.photo_interior_url].map(
                  (url, i) =>
                    url && (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-base-border">
                        <Image src={url} alt="Car" fill className="object-cover" />
                      </div>
                    )
                )}
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <Row label="City / Occupation" value={`${selected.city} · ${selected.occupation}`} />
                <Row
                  label="Car"
                  value={`${selected.polo_variant} (${selected.car_year}) · ${selected.transmission} · ${selected.fuel_type} · ${selected.car_colour}`}
                />
                <Row label="Registration" value={selected.registration_number} mono />
                <Row label="Modified" value={selected.is_modified ? selected.modification_details || "Yes" : "No"} />
                <Row label="Why join" value={selected.why_join} />
                <Row label="Polo story" value={selected.polo_story} />
                <Row label="Emergency contact" value={`${selected.emergency_contact_name} · ${selected.emergency_contact_number}`} />
                <Row label="Insurance" value={selected.has_insurance ? "Provided" : "Not provided"} />
                <Row label="Previously in another club" value={selected.previous_club ? selected.previous_club_details || "Yes" : "No"} />
                <Row label="Ever removed from a community" value={selected.ever_removed ? "Yes" : "No"} />
              </div>

              <div className="mt-6">
                <label className="mb-2 block font-display text-sm font-semibold uppercase tracking-wider text-silver-light">
                  Admin Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="focus-ring w-full resize-none rounded-xl border border-base-border bg-base-elevated px-4 py-3 text-off"
                  placeholder="Internal notes about this application..."
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  disabled={busy}
                  onClick={() => handleDecision("approved")}
                  className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-off transition-transform hover:scale-[1.02] disabled:opacity-40"
                >
                  <Check size={16} /> Approve
                </button>
                <button
                  disabled={busy}
                  onClick={() => handleDecision("rejected")}
                  className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-off transition-transform hover:scale-[1.02] disabled:opacity-40"
                >
                  <Ban size={16} /> Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-b border-base-border pb-3">
      <p className="font-display text-xs font-semibold uppercase tracking-wider text-silver">{label}</p>
      <p className={`mt-1 text-off ${mono ? "plate-number" : ""}`}>{value}</p>
    </div>
  );
}
