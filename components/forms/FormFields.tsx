"use client";

import { forwardRef } from "react";

export const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="mb-2 block font-display text-sm font-semibold uppercase tracking-wider text-silver-light">
    {children} {required && <span className="text-accent">*</span>}
  </label>
);

export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1.5 text-xs font-medium text-accent-glow">{message}</p> : null;

export const TextInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      ref={ref}
      {...props}
      className="focus-ring w-full rounded-xl border border-base-border bg-base-elevated px-4 py-3.5 text-off placeholder:text-silver/50 transition-colors focus:border-accent"
    />
  )
);
TextInput.displayName = "TextInput";

export const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => (
    <textarea
      ref={ref}
      {...props}
      rows={props.rows ?? 4}
      className="focus-ring w-full resize-none rounded-xl border border-base-border bg-base-elevated px-4 py-3.5 text-off placeholder:text-silver/50 transition-colors focus:border-accent"
    />
  )
);
TextArea.displayName = "TextArea";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ children, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className="focus-ring w-full appearance-none rounded-xl border border-base-border bg-base-elevated bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238B8D91%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat px-4 py-3.5 pr-10 text-off transition-colors focus:border-accent"
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function RadioPills({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`focus-ring flex-1 rounded-xl border px-5 py-3.5 font-display text-sm font-semibold uppercase tracking-wider transition-all ${
            value === opt.value
              ? "border-accent bg-accent text-off"
              : "border-base-border bg-base-elevated text-silver-light hover:border-silver"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
