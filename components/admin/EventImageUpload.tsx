"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadEventImage } from "@/lib/eventActions";

export function EventImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadEventImage(formData);
    setUploading(false);
    if (result.success && result.url) {
      onChange(result.url);
    } else {
      setError(result.error || "Upload failed");
    }
  };

  return (
    <div>
      <p className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
        {label}
      </p>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`focus-ring group relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          value ? "border-accent/60 bg-accent/5" : "border-base-border bg-base-elevated hover:border-silver"
        }`}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-accent" size={24} />
        ) : value ? (
          <Image src={value} alt={label} fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="text-silver" size={20} />
            <span className="text-xs text-silver">Click to upload</span>
          </div>
        )}
        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label={`Remove ${label}`}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-base/80 text-off backdrop-blur-sm hover:bg-accent"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-accent-glow">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
