"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";
import type { Event } from "@/lib/types";
import { createEvent, updateEvent, type EventInput } from "@/lib/eventActions";
import { EventImageUpload } from "./EventImageUpload";
import { EventGalleryUpload } from "./EventGalleryUpload";

const categories = [
  "Upcoming Drives",
  "Cars & Coffee",
  "Breakfast Drives",
  "Night Drives",
  "Track Days",
  "Family Meets",
];

export default function EventFormModal({
  event,
  onClose,
  onSaved,
}: {
  event: Event | null;
  onClose: () => void;
  onSaved: (event: Event) => void;
}) {
  const [form, setForm] = useState<EventInput>({
    title: event?.title || "",
    category: event?.category || categories[0],
    description: event?.description || "",
    event_date: event?.event_date || "",
    event_time: event?.event_time || "",
    location: event?.location || "",
    cover_image_url: event?.cover_image_url || null,
    gallery_urls: event?.gallery_urls || [],
    is_published: event?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof EventInput>(key: K, value: EventInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.title || !form.description || !form.event_date || !form.location) {
      setError("Please fill in title, description, date, and location.");
      return;
    }
    setSaving(true);
    setError(null);

    if (event) {
      const result = await updateEvent(event.id, form);
      setSaving(false);
      if (result.success) {
        onSaved({ id: event.id, created_at: event.created_at, ...form });
      } else {
        setError(result.error || "Failed to save event");
      }
    } else {
      const result = await createEvent(form);
      setSaving(false);
      if (result.success && result.id) {
        onSaved({ id: result.id, created_at: new Date().toISOString(), ...form });
      } else {
        setError(result.error || "Failed to save event");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase">
            {event ? "Edit Event" : "New Event"}
          </h2>
          <button onClick={onClose} className="focus-ring rounded-full p-2 hover:bg-base-panel">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
              Event Title
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Sunrise Drive to Nandi Hills"
              className="focus-ring w-full rounded-xl border border-base-border bg-base-elevated px-4 py-3 text-off placeholder:text-silver/50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="focus-ring w-full rounded-xl border border-base-border bg-base-elevated px-4 py-3 text-off"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Nandi Hills, Bengaluru"
                className="focus-ring w-full rounded-xl border border-base-border bg-base-elevated px-4 py-3 text-off placeholder:text-silver/50"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
                Date
              </label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => set("event_date", e.target.value)}
                className="focus-ring w-full rounded-xl border border-base-border bg-base-elevated px-4 py-3 text-off"
              />
            </div>
            <div>
              <label className="mb-2 block font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
                Time (optional)
              </label>
              <input
                value={form.event_time || ""}
                onChange={(e) => set("event_time", e.target.value)}
                placeholder="e.g. 6:00 AM"
                className="focus-ring w-full rounded-xl border border-base-border bg-base-elevated px-4 py-3 text-off placeholder:text-silver/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="Describe the route, meeting point, and what to expect..."
              className="focus-ring w-full resize-none rounded-xl border border-base-border bg-base-elevated px-4 py-3 text-off placeholder:text-silver/50"
            />
          </div>

          <EventImageUpload
            label="Cover Image"
            value={form.cover_image_url}
            onChange={(url) => set("cover_image_url", url)}
          />

          <EventGalleryUpload
            urls={form.gallery_urls}
            onChange={(urls) => set("gallery_urls", urls)}
          />

          <label className="flex items-center gap-3 rounded-xl border border-base-border bg-base-panel p-4">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
            <span className="text-sm text-silver-light">
              Published (visible on the public Events page)
            </span>
          </label>

          {error && (
            <p className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm text-accent-glow">
              <AlertCircle size={16} /> {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="focus-ring rounded-full border border-silver/40 px-7 py-3 font-display text-sm font-semibold uppercase tracking-wider text-silver-light hover:border-off hover:text-off"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="focus-ring flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-display text-sm font-semibold uppercase tracking-wider text-off transition-transform hover:scale-[1.02] disabled:opacity-40"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : event ? "Save Changes" : "Create Event"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
