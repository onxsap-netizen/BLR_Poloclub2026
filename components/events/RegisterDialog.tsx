"use client";

import { useEffect, useRef, useState } from "react";
import { codeOfConduct, cocImportant, cocMotto } from "@/lib/codeOfConduct";

const COC_VERSION = "2026-08-12";

type Props = {
  event: { slug?: string; title: string; date?: string; location?: string };
  open: boolean;
  onClose: () => void;
};

const INPUT_CLS = "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-red-500 focus:outline-none";
const RED_BTN = "w-full rounded-full bg-red-600 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400";

export default function RegisterDialog({ event, open, onClose }: Props) {
  const [step, setStep] = useState<"terms" | "form" | "done">("terms");
  const [readToEnd, setReadToEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep("terms");
    setReadToEnd(false);
    setAgreed(false);
    setError(null);
    setInviteUrl(null);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 4) setReadToEnd(true);
  }, [open, step]);

  if (!open) return null;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setReadToEnd(true);
  };

  const submit = async () => {
    setError(null);
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(digits)) return setError("Enter a valid 10-digit mobile number.");
    setLoading(true);
    try {
      const res = await fetch("/api/events/" + (event.slug ?? "event") + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: digits, car: car.trim(), eventTitle: event.title, cocVersion: COC_VERSION }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setInviteUrl(data.whatsappUrl ?? null);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-neutral-900 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>

        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-500">{step === "done" ? "ALMOST THERE" : "REGISTER"}</p>
            <h3 className="mt-1 text-lg font-bold text-white">{event.title}</h3>
            {event.date ? <p className="mt-1 text-sm text-neutral-400">{event.date}{event.location ? " - " + event.location : ""}</p> : null}
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full px-2 py-1 text-neutral-400 hover:bg-white/10 hover:text-white">X</button>
        </header>

        {step === "terms" ? (
          <>
            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-neutral-300">
              <p className="mb-5 text-neutral-400">ThePoloClub.BLR is built on respect, responsibility, and a shared passion for the Volkswagen Polo. Please read before registering.</p>
              {codeOfConduct.map((section, i) => (
                <section key={section.title} className="mb-5">
                  <h4 className="mb-2 text-sm font-bold text-white"><span className="text-red-500">{i + 1}.</span> {section.title}</h4>
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red-500/70" /><span>{item}</span></li>
                    ))}
                  </ul>
                </section>
              ))}
              <p className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-xs text-neutral-300"><strong className="text-white">Important: </strong>{cocImportant}</p>
              <p className="mt-5 text-center text-xs italic text-neutral-500">{cocMotto}</p>
            </div>

            <footer className="space-y-3 border-t border-white/10 p-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-300">
                <input type="checkbox" checked={agreed} disabled={!readToEnd} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-red-600 disabled:opacity-40" />
                <span className={readToEnd ? "" : "opacity-50"}>I have read and agree to the ThePoloClub.BLR Code of Conduct, and I participate at my own risk.</span>
              </label>
              {!readToEnd ? <p className="text-xs text-neutral-500">Scroll to the end to continue.</p> : null}
              <button disabled={!agreed} onClick={() => setStep("form")} className={RED_BTN}>CONTINUE</button>
            </footer>
          </>
        ) : null}

        {step === "form" ? (
          <div className="space-y-4 p-5">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-neutral-400">FULL NAME</span>
              <input value={name} placeholder="Your name" onChange={(e) => setName(e.target.value)} className={INPUT_CLS} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-neutral-400">WHATSAPP NUMBER</span>
              <input value={phone} inputMode="numeric" placeholder="9876543210" onChange={(e) => setPhone(e.target.value)} className={INPUT_CLS} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-neutral-400">CAR (OPTIONAL)</span>
              <input value={car} placeholder="Polo GT TSI" onChange={(e) => setCar(e.target.value)} className={INPUT_CLS} />
            </label>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button onClick={submit} disabled={loading} className={RED_BTN}>{loading ? "CONFIRMING..." : "CONFIRM REGISTRATION"}</button>
            <p className="text-center text-xs text-neutral-500">We only use your number for this drive.</p>
          </div>
        ) : null}

        {step === "done" ? (
          <div className="space-y-4 p-5 text-center">
            <p className="text-sm text-neutral-300">Thanks for registering for <span className="text-white">{event.title}</span>. Send us a quick WhatsApp message and we will add you to the event group.</p>
            {inviteUrl ? (
              <button type="button" onClick={() => window.open(inviteUrl, "_blank", "noopener,noreferrer")} className="w-full rounded-full bg-[#25D366] py-3 text-sm font-bold tracking-wide text-black transition hover:brightness-110">MESSAGE US ON WHATSAPP</button>
            ) : (
              <p className="text-sm text-neutral-400">We will reach out to you on {phone} shortly.</p>
            )}
            <button onClick={onClose} className="text-xs text-neutral-500 hover:text-neutral-300">Close</button>
          </div>
        ) : null}

      </div>
    </div>
  );
}
