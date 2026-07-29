"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { codeOfConduct } from "@/lib/codeOfConduct";

export default function RulesList() {
  return (
    <section className="carbon-bg py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="space-y-6 rounded-2xl border border-base-border bg-base-elevated p-6 md:p-10">
          {codeOfConduct.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              className="border-b border-base-border/60 pb-6 last:border-b-0 last:pb-0"
            >
              <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-off">
                {rule.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-silver">{rule.body}</p>
            </motion.div>
          ))}

          <div className="flex items-center justify-center gap-2 pt-2 text-xs uppercase tracking-widest text-silver/60">
            <ShieldCheck size={14} className="text-accent" />
            End of Code of Conduct
          </div>
        </div>
      </div>
    </section>
  );
}
