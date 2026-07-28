"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ChevronUp, ChevronDown, ImageOff } from "lucide-react";
import type { GalleryPhoto } from "@/lib/types";
import {
  bulkUploadGalleryPhotos,
  deleteGalleryPhoto,
  reorderGalleryPhotos,
  updateGalleryPhotoCaption,
} from "@/lib/galleryActions";

export default function AdminGallery({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState<{ done: number; total: number } | null>(null);
  const [failures, setFailures] = useState<{ fileName: string; error: string }[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    setUploading(true);
    setFailures([]);
    setUploadCount({ done: 0, total: files.length });

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    // All files upload in parallel server-side (see bulkUploadGalleryPhotos),
    // so this is a single round trip rather than one request per file.
    const result = await bulkUploadGalleryPhotos(formData);

    setPhotos((prev) => [...prev, ...result.uploaded]);
    setUploadCount({ done: result.uploaded.length, total: files.length });
    setFailures(result.failures.filter((f) => f.fileName));
    setUploading(false);
  };

  const handleCaptionChange = (id: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const handleCaptionBlur = async (id: string, caption: string) => {
    await updateGalleryPhotoCaption(id, caption);
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    const result = await deleteGalleryPhoto(id);
    if (result.success) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    }
    setBusyId(null);
  };

  const move = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= photos.length) return;
    const next = [...photos];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setPhotos(next);
    await reorderGalleryPhotos(next.map((p) => p.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold uppercase tracking-wide">
            Gallery Photos
          </h3>
          <p className="mt-1 text-sm text-silver">
            Uploaded here appear on the public /gallery page, most recent first (or in the order below).
          </p>
        </div>
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-off transition-colors hover:bg-accent-glow disabled:opacity-50"
        >
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {uploading ? "Uploading…" : "Bulk Upload Photos"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploadCount && (
        <p className="mt-3 text-xs text-silver-light">
          Uploaded {uploadCount.done} of {uploadCount.total} photo{uploadCount.total === 1 ? "" : "s"}.
        </p>
      )}

      {failures.length > 0 && (
        <div className="mt-3 rounded-lg border border-accent/40 bg-accent/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-glow">
            {failures.length} file{failures.length === 1 ? "" : "s"} failed to upload
          </p>
          <ul className="mt-1.5 space-y-0.5 text-xs text-silver">
            {failures.map((f, i) => (
              <li key={i}>
                {f.fileName}: {f.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-base-border py-16 text-silver">
          <ImageOff size={28} />
          <p className="text-sm">No gallery photos yet. Bulk upload some above.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-xl border border-base-border bg-base-elevated"
            >
              <div className="relative aspect-video">
                <Image src={photo.url} alt={photo.caption || "Gallery photo"} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  disabled={busyId === photo.id}
                  aria-label="Delete photo"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-base/80 text-off backdrop-blur-sm hover:bg-accent disabled:opacity-50"
                >
                  {busyId === photo.id ? <Loader2 className="animate-spin" size={14} /> : <X size={14} />}
                </button>
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-base/80 text-off backdrop-blur-sm hover:bg-accent disabled:opacity-30"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === photos.length - 1}
                    aria-label="Move down"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-base/80 text-off backdrop-blur-sm hover:bg-accent disabled:opacity-30"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={photo.caption}
                placeholder="Add a caption…"
                onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                onBlur={(e) => handleCaptionBlur(photo.id, e.target.value)}
                className="focus-ring w-full border-t border-base-border bg-transparent px-3 py-2 text-sm text-off placeholder:text-silver"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
