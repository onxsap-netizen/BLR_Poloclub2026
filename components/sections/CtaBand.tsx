"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-base py-24 md:py-32">
      <div className="absolute inset-0 bg-red-glow opacity-70" />
      <div className="chevron-strip absolute top-0 left-0 w-full opacity-40" />
      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl font-bold uppercase leading-tight sm:text-5xl md:text-6xl"
        >
          Your Polo Deserves <span className="text-accent">a Family.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-lg text-silver"
        >
          Applications are reviewed by our team to keep the community close-knit,
          responsible, and genuinely passionate.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-9"
        >
          <Link
            href="/join"
            className="focus-ring inline-block rounded-full bg-accent px-10 py-4 font-display text-base font-semibold uppercase tracking-wider text-off transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(227,6,19,0.5)]"
          >
            Start Your Application
          </Link>
        </motion.div>
      </div>
      <div className="chevron-strip absolute bottom-0 left-0 w-full opacity-40" />
    </section>
  );
}
