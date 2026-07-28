"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, X, Loader2 } from "lucide-react";
import { bulkUploadEventImages } from "@/lib/eventActions";

export function EventGalleryUpload({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    // All files upload in parallel server-side, in a single round trip,
    // instead of one request per file.
    const result = await bulkUploadEventImages(formData);

    if (result.urls.length > 0) {
      onChange([...urls, ...result.urls]);
    }
    if (result.failures.length > 0) {
      const names = result.failures.map((f) => f.fileName).join(", ");
      setError(`Failed to upload: ${names}`);
    }

    setUploading(false);
  };

  const remove = (url: string) => onChange(urls.filter((u) => u !== url));

  return (
    <div>
      <p className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
        Gallery Images
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((url) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-base-border">
            <Image src={url} alt="Event gallery" fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-base/80 text-off opacity-0 backdrop-blur-sm transition-opacity hover:bg-accent group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-base-border bg-base-elevated text-silver hover:border-silver disabled:opacity-50"
        >
          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          <span className="text-[10px] uppercase tracking-wider">Add</span>
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-accent-glow">{error}</p>}
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
  );
}
