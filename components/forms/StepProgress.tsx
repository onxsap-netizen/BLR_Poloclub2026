"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = ["Personal", "Your Car", "About You", "Rules"];

export function StepProgress({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-12 flex max-w-2xl items-center justify-between">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-sm font-bold transition-colors ${
                  isDone
                    ? "border-accent bg-accent text-off"
                    : isActive
                    ? "border-accent text-accent"
                    : "border-base-border text-silver"
                }`}
              >
                {isDone ? <Check size={18} /> : stepNum}
              </div>
              <span
                className={`hidden font-display text-[11px] font-semibold uppercase tracking-wider sm:block ${
                  isActive ? "text-off" : "text-silver"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNum < steps.length && (
              <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-base-border sm:mx-3">
                <motion.div
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-y-0 left-0 bg-accent"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
