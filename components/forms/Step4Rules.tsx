"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import { codeOfConduct } from "@/lib/codeOfConduct";

export default function Step4Rules({
  onSubmit,
  onBack,
  submitting,
  submitError,
}: {
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
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
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display text-2xl font-bold uppercase">Community Code of Conduct</h3>
        <p className="mt-1 text-sm text-silver">
          Please read the complete code of conduct below. Scroll to the bottom to continue.
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-[420px] space-y-5 overflow-y-auto rounded-xl border border-base-border bg-base-elevated p-6"
      >
        {codeOfConduct.map((rule) => (
          <div key={rule.title}>
            <h4 className="font-display text-base font-semibold uppercase tracking-wide text-off">
              {rule.title}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-silver">{rule.body}</p>
          </div>
        ))}
        <div className="pt-2 text-center text-xs uppercase tracking-widest text-silver/60">
          — End of Code of Conduct —
        </div>
      </div>

      {!scrolledToBottom && (
        <p className="flex items-center gap-2 text-xs text-silver">
          <AlertCircle size={14} className="text-accent" />
          Scroll to the bottom of the rules to enable the checkbox.
        </p>
      )}

      <label
        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
          scrolledToBottom ? "border-base-border bg-base-panel" : "cursor-not-allowed border-base-border/50 opacity-50"
        }`}
      >
        <input
          type="checkbox"
          disabled={!scrolledToBottom}
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="focus-ring mt-1 h-5 w-5 accent-accent"
        />
        <span className="text-sm text-silver-light">
          I have read and agree to all rules in ThePoloClub.BLR Community Code of Conduct.
        </span>
      </label>

      {submitError && (
        <p className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm text-accent-glow">
          <AlertCircle size={16} /> {submitError}
        </p>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="focus-ring rounded-full border border-silver/40 px-9 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-silver-light hover:border-off hover:text-off"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!accepted || submitting}
          onClick={onSubmit}
          className="focus-ring flex items-center gap-2 rounded-full bg-accent px-9 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-off transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </motion.div>
  );
}
