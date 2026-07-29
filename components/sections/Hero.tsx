"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import ParticleField from "@/components/ui/ParticleField";

const stats = [
  { value: "100+", label: "Members" },
  { value: "∞", label: "Drives" },
  { value: "100%", label: "Passion" },
  { value: "1+", label: "Cities" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-base">
      {/* Cinematic background layer */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(10,10,11,0.5) 0%, rgba(10,10,11,0.75) 55%, rgba(10,10,11,1) 100%), url('https://images.unsplash.com/photo-1617814076231-24437c53d40d?q=80&w=2400&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-red-glow" />
        {/* Fog layers */}
        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 left-0 h-64 w-[140%] bg-gradient-to-t from-base/90 via-base/30 to-transparent blur-2xl"
        />
        <ParticleField />
      </div>

      {/* Glassmorphism content card */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Bengaluru&apos;s Volkswagen Polo Community
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-glow font-display text-[15vw] font-black uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
        >
          ThePolo<span className="text-accent">Club</span>
          <span className="text-silver-light">.BLR</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 font-display text-2xl font-medium uppercase tracking-[0.15em] text-silver-light sm:text-3xl"
        >
          One Drive. <span className="text-off">One Family.</span> One Community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/join"
            className="focus-ring group relative overflow-hidden rounded-full bg-accent px-9 py-4 font-display text-base font-semibold uppercase tracking-wider text-off transition-transform hover:scale-[1.03]"
          >
            <span className="relative z-10">Join Community</span>
            <span className="absolute inset-0 -translate-x-full bg-accent-glow transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
          <Link
            href="/events"
            className="focus-ring rounded-full border border-silver/40 bg-white/5 px-9 py-4 font-display text-base font-semibold uppercase tracking-wider text-off backdrop-blur-sm transition-colors hover:border-off"
          >
            Upcoming Drives
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-16 grid grid-cols-4 gap-3 sm:gap-10"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="font-mono text-2xl font-bold text-off sm:text-4xl">
                {s.value}
              </span>
              <span className="mt-1 font-display text-[11px] uppercase tracking-[0.15em] text-silver sm:text-sm">
                {s.label}
              </span>
              {i < stats.length - 1 && (
                <span className="mt-3 hidden h-8 w-px bg-base-border sm:block" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 z-10"
      >
        <ChevronDown className="text-silver" size={28} />
      </motion.div>

      <div className="chevron-strip absolute bottom-0 left-0 w-full opacity-70" />
    </section>
  );
}
