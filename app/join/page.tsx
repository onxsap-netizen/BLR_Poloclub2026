import type { Metadata } from "next";
import JoinForm from "@/components/forms/JoinForm";

export const metadata: Metadata = {
  title: "Join Community",
  description:
    "Apply to join ThePoloClub.BLR — Bangalore's Volkswagen Polo enthusiast community.",
};

export default function JoinPage() {
  return (
    <section className="carbon-bg relative min-h-screen pb-24 pt-32 md:pt-40">
      <div className="absolute inset-0 bg-red-glow opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Membership Application
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl md:text-6xl">
            Join <span className="text-accent">ThePoloClub.BLR</span>
          </h1>
          <p className="mt-5 text-lg text-silver">
            Four short steps. Our team reviews every application to keep this
            community close-knit and genuine.
          </p>
        </div>
        <JoinForm />
      </div>
    </section>
  );
}
