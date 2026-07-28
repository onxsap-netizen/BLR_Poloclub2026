"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?q=80&w=800&auto=format&fit=crop",
];

export default function GalleryPreview() {
  return (
    <section className="carbon-bg relative py-24 md:py-32">
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
              Member Gallery
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl md:text-6xl">
              Captured on the <span className="text-accent">Road</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="focus-ring flex items-center gap-2 rounded-full border border-silver/40 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider transition-colors hover:border-accent hover:text-accent"
          >
            Full Gallery <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {images.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`group relative aspect-square overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 row-span-2 sm:col-span-1 sm:row-span-2 md:aspect-auto md:h-full" : ""
              }`}
            >
              <img
                src={src}
                alt="ThePoloClub.BLR member drive"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
