import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import UpcomingEvents from "@/components/sections/UpcomingEvents";
import Events from "@/components/sections/Events";
import GalleryPreview from "@/components/sections/GalleryPreview";
import CtaBand from "@/components/sections/CtaBand";
import { getPublishedEvents } from "@/lib/publicData";

export const revalidate = 60;

export default async function Home() {
  const events = await getPublishedEvents();
  const upcoming = events.slice(0, 3);

  return (
    <>
      <Hero />
      <About />
      {upcoming.length > 0 && <UpcomingEvents events={upcoming} />}
      <Events />
      <GalleryPreview />
      <CtaBand />
    </>
  );
}
