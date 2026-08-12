"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  event: {
    slug: string;
    title: string;
    date?: string;
    location?: string;
    terms?: string[];
  };
  open: boolean;
  onClose: () => void;
};

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

  // reset when reopened
  useEffect(() => {
    if (open) {
      setStep("terms");
      setReadToEnd(false);
      setAgreed(false);
      setError(null);
      setInviteUrl(null);
    }
  }, [open]);

  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // if terms are short enough not to scroll, unlock immediately
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 4) setReadToEnd(true);
  }, [open, step]);

  if (!open) return null;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setReadToEnd(true);
  };

  const submit = async () => {
    setError(null);
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(digits))
      return setError("Enter a valid 10-digit mobile number.");

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: digits, car: car.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setInviteUrl(data.whatsappUrl);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Register for ${event.title}`}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-neutral-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-500">
              {step === "done" ? "YOU'RE IN" : "REGISTER"}
            </p>
            <h3 className="mt-1 text-lg font-bold text-white">{event.title}</h3>
            {event.date && (
              <p className="mt-1 text-sm text-neutral-400">
                {event.date}
                {event.location ? ` · ${event.location}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </header>

        {step === "terms" && (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-neutral-300"
            >
              <ul className="space-y-3">
                {(event.terms?.length ? event.terms : DEFAULT_TERMS).map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <footer className="space-y-3 border-t border-white/10 p-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={agreed}
                  disabled={!readToEnd}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-red-600 disabled:opacity-40"
                />
                <span className={readToEnd ? "" : "opacity-50"}>
                  I have read and agree to the terms above.
                </span>
              </label>
              {!readToEnd && (
                <p className="text-xs text-neutral-500">Scroll to the end to continue.</p>
              )}
              <button
                disabled={!agreed}
                onClick={() => setStep("form")}
                className="w-full rounded-full bg-red-600 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
              >
                CONTINUE
              </button>
            </footer>
          </>
        )}

        {step === "form" && (
          <div className="space-y-4 p-5">
            <Field label="Full name" value={name} onChange={setName} placeholder="Your name" />
            <Field
              label="WhatsApp number"
              value={phone}
              onChange={setPhone}
              placeholder="9876543210"
              inputMode="numeric"
            />
            <Field
              label="Car (optional)"
              value={car}
              onChange={setCar}
              placeholder="Polo GT TSI"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full rounded-full bg-red-600 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {loading ? "CONFIRMING…" : "CONFIRM & GET GROUP LINK"}
            </button>
            <p className="text-center text-xs text-neutral-500">
              We'll only use your number for this drive's group.
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 p-5 text-center">
            <p className="text-sm text-neutral-300">
              You're registered for <span className="text-white">{event.title}</span>. Join the
              group for route details and timing updates.
            </p>
            {inviteUrl ? (
              
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full bg-[#25D366] py-3 text-sm font-bold tracking-wide text-black transition hover:brightness-110"
              >
                JOIN WHATSAPP GROUP
              </a>
            ) : (
              <p className="text-sm text-neutral-400">
                Group link coming soon — we'll message you on {phone}.
              </p>
            )}
            <button onClick={onClose} className="text-xs text-neutral-500 hover:text-neutral-300">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-neutral-400">
        {label.toUpperCase()}
      </span>
      <input
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-red-500 focus:outline-none"
      />
    </label>
  );
}

const DEFAULT_TERMS = [
  "Obey all traffic laws. No racing, no street takeovers, no blocking public roads.",
  "Valid licence, insurance, and PUC required. Helmets for any two-wheelers.",
  "Zero tolerance for alcohol or substances before or during the drive.",
  "Maintain convoy discipline and a safe following distance. Marshals' instructions are final.",
  "You participate at your own risk. ThePoloClub.BLR is not liable for damage, injury, or fines.",
  "Photos and video taken at the event may be used on our social channels.",
];
