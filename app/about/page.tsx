import type { Metadata } from "next";
import About from "@/components/sections/About";
import CtaBand from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ThePoloClub.BLR — Bangalore's Volkswagen Polo enthusiast community built on responsible driving, family values, and premium experiences.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[50vh] items-center justify-center bg-base pt-24">
        <div className="absolute inset-0 bg-red-glow opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Our Story
          </span>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-tight sm:text-6xl md:text-7xl">
            Built on the Road,
            <br />
            <span className="text-silver-light">Bound by the Badge.</span>
          </h1>
        </div>
      </section>
      <About />
      <CtaBand />
    </>
  );
}
