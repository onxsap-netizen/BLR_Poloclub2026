"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Coffee, Sunrise, Moon, Flag, Users2, ArrowUpRight } from "lucide-react";

const events = [
  {
    icon: Flag,
    title: "Upcoming Drives",
    desc: "Curated routes through Bangalore's best driving roads, every month.",
    tag: "Monthly",
  },
  {
    icon: Coffee,
    title: "Cars & Coffee",
    desc: "Sunday morning meets. Park up, talk cars, drink great coffee.",
    tag: "Weekly",
  },
  {
    icon: Sunrise,
    title: "Breakfast Drives",
    desc: "Early starts, empty roads, and a proper breakfast at the end.",
    tag: "Monthly",
  },
  {
    icon: Moon,
    title: "Night Drives",
    desc: "City lights, quiet highways — a different side of the Polo experience.",
    tag: "Bi-Monthly",
  },
  {
    icon: Flag,
    title: "Track Days",
    desc: "Take your Polo to the limit, safely, on a closed circuit.",
    tag: "Quarterly",
  },
  {
    icon: Users2,
    title: "Family Meets",
    desc: "All-ages community gatherings built around food, cars, and conversation.",
    tag: "Quarterly",
  },
];

export default function Events() {
  return (
    <section id="events" className="relative bg-base py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
              What We Do
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl md:text-6xl">
              Every Drive Tells <span className="text-accent">a Story</span>
            </h2>
          </div>
          <Link
            href="/events"
            className="focus-ring flex items-center gap-2 rounded-full border border-silver/40 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider transition-colors hover:border-accent hover:text-accent"
          >
            View All Events <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-base-border bg-gradient-to-b from-base-panel to-base-elevated p-7"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-all duration-500 group-hover:bg-accent/25" />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 text-accent">
                    <e.icon size={22} />
                  </div>
                  <span className="plate-number rounded-full border border-base-border px-3 py-1 text-[10px] uppercase tracking-widest text-silver">
                    {e.tag}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold uppercase tracking-wide">
                  {e.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">
                  {e.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
