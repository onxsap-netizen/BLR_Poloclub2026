"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, MapPin, Calendar, Car, EyeOff } from "lucide-react";
import type { Event } from "@/lib/types";
import { deleteEvent } from "@/lib/eventActions";
import EventFormModal from "./EventFormModal";

export default function AdminEvents({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [editing, setEditing] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (event: Event) => {
    setEditing(event);
    setShowForm(true);
  };

  const handleSaved = (event: Event) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      const updated = exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event];
      return updated.sort((a, b) => a.event_date.localeCompare(b.event_date));
    });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setDeletingId(id);
    const result = await deleteEvent(id);
    setDeletingId(null);
    if (result.success) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-silver">
          {events.length} event{events.length !== 1 ? "s" : ""} · manage what shows on the public Events page
        </p>
        <button
          onClick={openNew}
          className="focus-ring flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-off transition-transform hover:scale-[1.02]"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-base-border p-12 text-center text-silver">
          No events yet. Create your first one to show it on the public Events page.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-xl border border-base-border bg-base-panel"
            >
              <div className="relative aspect-video bg-base-elevated">
                {event.cover_image_url ? (
                  <Image src={event.cover_image_url} alt={event.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-silver">
                    <Car size={28} />
                  </div>
                )}
                {!event.is_published && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-base/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-silver">
                    <EyeOff size={11} /> Draft
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="font-display text-[11px] font-semibold uppercase tracking-widest text-accent">
                  {event.category}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold uppercase leading-tight">
                  {event.title}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-silver">
                  <Calendar size={13} className="text-accent" />
                  {new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {event.event_time ? ` · ${event.event_time}` : ""}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-silver">
                  <MapPin size={13} className="text-accent" /> {event.location}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEdit(event)}
                    className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-full border border-silver/40 py-2 text-xs font-semibold uppercase tracking-wider hover:border-off"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deletingId === event.id}
                    className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-full border border-accent/40 py-2 text-xs font-semibold uppercase tracking-wider text-accent hover:bg-accent/10 disabled:opacity-40"
                  >
                    <Trash2 size={13} /> {deletingId === event.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <EventFormModal event={editing} onClose={() => setShowForm(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}
