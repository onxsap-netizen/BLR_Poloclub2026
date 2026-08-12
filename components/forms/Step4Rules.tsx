"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import { codeOfConduct, cocImportant, cocMotto } from "@/lib/codeOfConduct";

type Step4RulesProps = {
  onSubmit?: () => void;
  onBack?: () => void;
  submitting?: boolean;
  submitError?: string | null;
  [key: string]: unknown;
};

export default function Step4Rules({
  onSubmit,
  onBack,
  submitting = false,
  submitError = null,
}: Step4RulesProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    if (isBottom) setScrolledToBottom(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-white">Community Code of Conduct</h3>
        <p className="mt-1 text-sm text-neutral-400">
          Please read through before joining. Scroll to the end to continue.
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-72 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-neutral-300"
      >
        {codeOfConduct.map((section, i) => (
          <section key={section.title} className="mb-5">
            <h4 className="mb-2 text-sm font-bold text-white">
              <span className="text-red-500">{i + 1}.</span> {section.title}
            </h4>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red-500/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-xs text-neutral-300">
          <strong className="text-white">Important: </strong>
          {cocImportant}
        </p>

        <p className="mt-5 text-center text-xs italic text-neutral-500">{cocMotto}</p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={accepted}
          disabled={!scrolledToBottom}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-red-600 disabled:opacity-40"
        />
        <span className={scrolledToBottom ? "" : "opacity-50"}>
          I have read and agree to the ThePoloClub.BLR Code of Conduct, and I participate
          at my own risk.
        </span>
      </label>

      {!scrolledToBottom && (
        <p className="text-xs text-neutral-500">Scroll to the end to continue.</p>
      )}

      {submitError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 rounded-full border border-white/15 py-3 text-sm font-bold tracking-wide text-neutral-300 transition hover:bg-white/5 disabled:opacity-50"
        >
          BACK
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!accepted || submitting}
          className="flex-1 rounded-full bg-red-600 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              SUBMITTING
            </span>
          ) : (
            "SUBMIT APPLICATION"
          )}
        </button>
      </div>
    </motion.div>
  );
}
