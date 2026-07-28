"use client";

import { motion } from "framer-motion";
import { Heart, ShieldCheck, Users, Sparkles, MapPin, Coffee } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Passion for the Polo",
    desc: "Every member here shares one obsession — the Volkswagen Polo. From the hatch to the GT, we celebrate the engineering.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible Driving",
    desc: "Speed has its place — the track. On community drives, discipline and road safety always come first.",
  },
  {
    icon: Users,
    title: "Family Friendly",
    desc: "Bring your co-driver, your kids, your dog. Every drive is built to include the people you love.",
  },
  {
    icon: Sparkles,
    title: "Premium Experiences",
    desc: "Curated meets, partner venues, and experiences that match the standard our cars are built to.",
  },
  {
    icon: MapPin,
    title: "Scenic Road Trips",
    desc: "From Nandi Hills at sunrise to the Western Ghats — we chase the roads worth driving.",
  },
  {
    icon: Coffee,
    title: "Cars & Coffee",
    desc: "Sunday mornings, engines off, conversations on. Our signature ritual for the community.",
  },
];

export default function About() {
  return (
    <section id="about" className="carbon-bg relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Who We Are
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl md:text-6xl">
            More Than a Club.
            <br />
            <span className="text-silver-light">A Family Built on Four Wheels.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-silver">
            ThePoloClub.BLR brings together Volkswagen Polo owners across
            Bengaluru who believe driving is best shared. We&apos;re a
            community rooted in respect for the road, love for German
            engineering, and the kind of friendships only a long drive can
            build.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group rounded-2xl border border-base-border bg-base-panel/60 p-7 transition-all duration-300 hover:border-accent/50 hover:bg-base-panel"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-off">
                <p.icon size={22} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold uppercase tracking-wide">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-silver">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
