import EventRegisterButton from "@/components/events/EventRegisterButton";
"use client";
   import { useState } from "react";
   import RegisterDialog from "@/components/events/RegisterDialog";
import Image from "next/image";
import { Calendar, MapPin, Car } from "lucide-react";
import type { Event } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UpcomingEvents({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <section className="bg-base py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Upcoming Events
          </span>
          <p className="mt-4 text-silver">
            No events scheduled right now — check back soon or follow us on Instagram
            for the latest updates.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-base py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 text-center">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Upcoming Events
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">
            Mark Your <span className="text-accent">Calendar</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="group overflow-hidden rounded-2xl border border-base-border bg-base-panel transition-colors hover:border-accent/50"
            >
              <div className="relative aspect-video overflow-hidden bg-base-elevated">
                {event.cover_image_url ? (
                  <Image
                    src={event.cover_image_url}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-silver">
                    <Car size={32} />
                  </div>
                )}
                <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-wider text-off">
                  {event.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold uppercase leading-tight tracking-wide">
                  {event.title}
                </h3>
                <p className="mt-3 flex items-center gap-2 text-sm text-silver">
                  <Calendar size={15} className="text-accent" />
                  {formatDate(event.event_date)}
                  {event.event_time ? ` · ${event.event_time}` : ""}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-silver">
                  <MapPin size={15} className="text-accent" /> {event.location}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-silver">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
