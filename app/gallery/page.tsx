import type { Metadata } from "next";
import GalleryGrid from "@/components/sections/GalleryGrid";
import CtaBand from "@/components/sections/CtaBand";
import { getGalleryPhotos } from "@/lib/publicData";

export const metadata: Metadata = {
  title: "Member Gallery",
  description:
    "Photos from ThePoloClub.BLR drives, meets, and events — captured by our members across Bangalore and beyond.",
};

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center bg-base pt-24">
        <div className="absolute inset-0 bg-red-glow opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Gallery
          </span>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-tight sm:text-6xl md:text-7xl">
            Moments From <span className="text-accent">the Road</span>
          </h1>
        </div>
      </section>
      <GalleryGrid photos={photos} />
      <CtaBand />
    </>
  );
}
