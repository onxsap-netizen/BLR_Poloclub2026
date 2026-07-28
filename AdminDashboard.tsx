"use client";

import { useState } from "react";
import { Users, CalendarDays, Images } from "lucide-react";
import type { Application, Event, GalleryPhoto } from "@/lib/types";
import AdminApplications from "./AdminApplications";
import AdminEvents from "./AdminEvents";
import AdminGallery from "./AdminGallery";

type Tab = "applications" | "events" | "gallery";

export default function AdminDashboard({
  initialApplications,
  initialEvents,
  initialGalleryPhotos,
}: {
  initialApplications: Application[];
  initialEvents: Event[];
  initialGalleryPhotos: GalleryPhoto[];
}) {
  const [tab, setTab] = useState<Tab>("applications");

  const pendingCount = initialApplications.filter((a) => a.status === "pending").length;

  return (
    <div className="carbon-bg min-h-screen pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-silver">ThePoloClub.BLR management</p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-base-border">
          <button
            onClick={() => setTab("applications")}
            className={`focus-ring flex items-center gap-2 border-b-2 px-4 py-3 font-display text-sm font-semibold uppercase tracking-wider transition-colors ${
              tab === "applications"
                ? "border-accent text-off"
                : "border-transparent text-silver hover:text-silver-light"
            }`}
          >
            <Users size={16} /> Applications
            {pendingCount > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-off">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("events")}
            className={`focus-ring flex items-center gap-2 border-b-2 px-4 py-3 font-display text-sm font-semibold uppercase tracking-wider transition-colors ${
              tab === "events"
                ? "border-accent text-off"
                : "border-transparent text-silver hover:text-silver-light"
            }`}
          >
            <CalendarDays size={16} /> Events
          </button>
          <button
            onClick={() => setTab("gallery")}
            className={`focus-ring flex items-center gap-2 border-b-2 px-4 py-3 font-display text-sm font-semibold uppercase tracking-wider transition-colors ${
              tab === "gallery"
                ? "border-accent text-off"
                : "border-transparent text-silver hover:text-silver-light"
            }`}
          >
            <Images size={16} /> Gallery
          </button>
        </div>

        <div className="mt-8">
          {tab === "applications" ? (
            <AdminApplications initialApplications={initialApplications} />
          ) : tab === "events" ? (
            <AdminEvents initialEvents={initialEvents} />
          ) : (
            <AdminGallery initialPhotos={initialGalleryPhotos} />
          )}
        </div>
      </div>
    </div>
  );
}
