"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { GalleryPhoto } from "@/lib/types";

const fallbackPhotos: GalleryPhoto[] = [
  { id: "f1", created_at: "", sort_order: 0, url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop", caption: "Nandi Hills sunrise drive" },
  { id: "f2", created_at: "", sort_order: 1, url: "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=900&auto=format&fit=crop", caption: "Cars & Coffee, Indiranagar" },
  { id: "f3", created_at: "", sort_order: 2, url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=900&auto=format&fit=crop", caption: "GTI meet, Whitefield" },
  { id: "f4", created_at: "", sort_order: 3, url: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=900&auto=format&fit=crop", caption: "Track day, Kari Motor Speedway" },
  { id: "f5", created_at: "", sort_order: 4, url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=900&auto=format&fit=crop", caption: "Western Ghats road trip" },
  { id: "f6", created_at: "", sort_order: 5, url: "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?q=80&w=900&auto=format&fit=crop", caption: "Night drive, Nice Road" },
  { id: "f7", created_at: "", sort_order: 6, url: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=900&auto=format&fit=crop", caption: "Family meet, Bannerghatta" },
  { id: "f8", created_at: "", sort_order: 7, url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=900&auto=format&fit=crop", caption: "Detailing day" },
  { id: "f9", created_at: "", sort_order: 8, url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=900&auto=format&fit=crop", caption: "Coastal highway run" },
];

export default function GalleryGrid({ photos }: { photos?: GalleryPhoto[] }) {
  const items = photos && photos.length > 0 ? photos : fallbackPhotos;

  return (
    <section className="carbon-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl"
            >
              <img
                src={p.url}
                alt={p.caption || "Gallery photo"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {p.caption && (
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-base/90 via-base/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="font-display text-sm font-semibold uppercase tracking-wide text-off">
                    {p.caption}
                  </p>
                  <span className="mt-1 flex items-center gap-1.5 text-xs text-silver">
                    <Heart size={13} className="text-accent" fill="currentColor" />
                    {Math.floor(Math.random() * 80) + 20}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
