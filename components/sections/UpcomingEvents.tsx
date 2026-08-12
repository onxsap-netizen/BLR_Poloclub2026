import EventRegisterButton from "@/components/events/EventRegisterButton";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
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
        <div className="text-center">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Upcoming Events
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase text-white md:text-5xl">
            Mark Your <span className="text-accent">Calendar</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 transition hover:border-accent/40"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
               {event.cover_image_url ? (` and `src={event.cover_image_url}`.
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : null}
                {event.category ? (
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    {event.category}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold uppercase text-white">
                  {event.title}
                </h3>

                <p className="mt-3 flex items-center gap-2 text-sm text-silver">
                  <Calendar className="h-4 w-4 shrink-0 text-accent" />
                  <span>
                    {formatDate(event.event_date)}
                    {event.event_time ? " · " + event.event_time : ""}
                  </span>
                </p>

                {event.location ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-silver">
                    <MapPin className="h-4 w-4 shrink-0 text-accent" />
                    <span>{event.location}</span>
                  </p>
                ) : null}

                {event.description ? (
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-silver">
                    {event.description}
                  </p>
                ) : null}

                <div className="mt-auto">
                  <EventRegisterButton
                    title={event.title}
                    date={formatDate(event.event_date)}
                    location={event.location ?? undefined}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
