import type { Metadata } from "next";
import Events from "@/components/sections/Events";
import UpcomingEvents from "@/components/sections/UpcomingEvents";
import GalleryPreview from "@/components/sections/GalleryPreview";
import CtaBand from "@/components/sections/CtaBand";
import { getPublishedEvents } from "@/lib/publicData";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming drives, Cars & Coffee meets, track days, and family gatherings hosted by ThePoloClub.BLR in Bangalore.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <section className="relative flex min-h-[45vh] items-center justify-center bg-base pt-24">
        <div className="absolute inset-0 bg-red-glow opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Calendar
          </span>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-tight sm:text-6xl md:text-7xl">
            Where We <span className="text-accent">Drive Next</span>
          </h1>
        </div>
      </section>
      <UpcomingEvents events={events} />
      <Events />
      <GalleryPreview />
      <CtaBand />
    </>
  );
}
