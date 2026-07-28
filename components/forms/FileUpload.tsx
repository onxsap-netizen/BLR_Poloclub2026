"use client";

import { useRef, useState } from "react";
import { Upload, X, Check } from "lucide-react";

export function FileUpload({
  label,
  onFileSelect,
  accept = "image/*",
}: {
  label: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect(file);
    setFileName(file?.name ?? null);
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const clear = () => {
    onFileSelect(null);
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <p className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-silver-light">
        {label}
      </p>
      <div
        onClick={() => inputRef.current?.click()}
        className={`focus-ring group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          fileName ? "border-accent/60 bg-accent/5" : "border-base-border bg-base-elevated hover:border-silver"
        }`}
      >
        {preview ? (
          <img src={preview} alt={`${label} preview`} className="h-full w-full object-cover" />
        ) : fileName ? (
          <div className="flex flex-col items-center gap-2 px-2 text-center">
            <Check className="text-accent" size={22} />
            <span className="truncate text-xs text-silver-light">{fileName}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="text-silver" size={20} />
            <span className="text-xs text-silver">Upload</span>
          </div>
        )}
        {fileName && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            aria-label={`Remove ${label}`}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-base/80 text-off backdrop-blur-sm hover:bg-accent"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
