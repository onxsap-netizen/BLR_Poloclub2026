"use client";

import { useEffect, useRef, useState } from "react";

const COC_VERSION = "2026-08-12";

type CocSection = { title: string; items: string[] };

const CODE_OF_CONDUCT: CocSection[] = [
  {
    title: "Respect First",
    items: [
      "Treat every member, their family, fellow road users, venue staff, sponsors, and partners with courtesy and respect.",
    ],
  },
  {
    title: "Drive Responsibly",
    items: [
      "Safety is our highest priority.",
      "All participating vehicles must be in safe, roadworthy condition.",
      "Drive cautiously, adhering to speed limits and road rules at all times.",
      "Avoid dangerous overtakes, racing, drifting, or reckless driving.",
      "Maintain convoy discipline.",
      "Carry a basic emergency kit and contact details during events.",
      "Respect instructions given by the Convoy Coordinator and Event Team at all times.",
      "Adhere to child safety seat regulations when children are present.",
    ],
  },
  {
    title: "Pops & Bangs / Revving",
    items: [
      "Unnecessary revving, pops & bangs, launch control, or excessive exhaust noise is not permitted during community events.",
      "These are allowed only at a designated location and only after approval from the Event Coordinator.",
    ],
  },
  {
    title: "Event Rules",
    items: [
      "A safety and itinerary briefing will be conducted before each event.",
      "Arrive on time to avoid delays and ensure smooth coordination.",
      "Cars without number plates will not be tolerated.",
      "Group driving: maintain a safe following distance, use hand signals or agreed communication devices, and stick to designated routes.",
      "Park responsibly, avoiding damage to property or inconvenience to others.",
      "Follow all laws and ordinances of the areas visited during events.",
    ],
  },
  {
    title: "Environmental Responsibilities",
    items: [
      "Dispose of all trash properly; leave locations cleaner than found.",
      "Avoid unnecessary idling and maintain your vehicle to reduce emissions.",
      "Avoid damaging natural environments during off-road activities.",
    ],
  },
  {
    title: "Members Only",
    items: [
      "Club events are exclusively for registered members unless otherwise announced.",
    ],
  },
  {
    title: "No Alcohol or Drugs",
    items: [
      "Driving under the influence of alcohol or drugs is strictly prohibited. Any member found violating this rule will be removed from the event immediately.",
    ],
  },
  {
    title: "Represent the Community",
    items: [
      "Every member represents ThePoloClub.BLR. Conduct yourself in a manner that reflects positively on the community both on and off the road.",
    ],
  },
  {
    title: "Zero Tolerance",
    items: [
      "Any behaviour that compromises the safety, reputation, or experience of other members - including repeated rule violations, aggressive behaviour, or misconduct - may result in immediate removal from the event and/or permanent removal from ThePoloClub.BLR without prior notice.",
    ],
  },
  {
    title: "Dispute Resolution",
    items: [
      "Address conflict privately and respectfully, involving club leaders. Disputes should not be handled in the group.",
      "Concerns or violations can be reported confidentially, without fear of reprisal.",
    ],
  },
  {
    title: "Legal and Liability",
    items: [
      "Ensure your vehicle is insured as per legal requirements.",
      "Members acknowledge personal responsibility during events.",
      "The club is not responsible for individual actions or accidents during official and non-official events.",
    ],
  },
  {
    title: "Events & Costs",
    items: [
      "Most regular drives and meets run on a Dutch basis - each member bears their own costs (food, beverages, tolls, fuel, etc.).",
      "Where an event involves photography, videography, venue bookings, merchandise, or permits, a participation fee may be announced in advance, before registrations open.",
    ],
  },
  {
    title: "WhatsApp Group Etiquette",
    items: [
      "Treat all members with courtesy and respect.",
      "Keep conversations relevant to the community, events, Volkswagen, and automotive discussions.",
      "No abusive language, personal attacks, bullying, harassment, or discrimination of any kind.",
      "No political, religious, offensive, NSFW, or unrelated promotional content without prior approval from the Community Team.",
      "Respect differing opinions and maintain healthy discussions.",
      "Avoid spam, repeated forwards, or excessive messages.",
    ],
  },
];

const COC_IMPORTANT =
  "Violation of any community or event rule may result in immediate removal from the event and/or permanent removal from ThePoloClub.BLR without any refund or prior notice. All decisions made by the organising team are final.";

type Props = {
  event: {
    slug?: string;
    title: string;
    date?: string;
    location?: string;
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

  useEffect(() => {
    if (open) {
      setStep("terms");
      setReadToEnd(false);
      setAgreed(false);
      setError(null);
      setInviteUrl(null);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setReadToEnd(true);
  };

  const submit = async () => {
    setError(null);
    const digits = phone.replace(/\D/g, "").slice(-10);

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.slug ?? "event"}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: digits,
          car: car.trim(),
          eventTitle: event.title,
          cocVersion: COC_VERSION,
        }),
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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-neutral-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-500">
              {step === "done" ? "ALMOST THERE" : "REGISTER"}
            </p>
            <h3 className="mt-1 text-lg font-bold text-white">{event.title}</h3>
            {event.date && (
              <p className="mt-1 text-sm text-neutral-400">
                {event.date}
                {event.location ? ` - ${event.location}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-2 py-1 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            X
          </button>
        </header>

        {step === "terms" && (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-neutral-300"
            >
              <p className="mb-5 text-neutral-400">
                ThePoloClub.BLR is built on respect, responsibility, and a shared passion
                for the Volkswagen Polo. Please read before registering.
              </p>

              {CODE_OF_CONDUCT.map((section, i) => (
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
                {COC_IMPORTANT}
              </p>

              <p className="mt-5 text-center text-xs italic text-neutral-500">
                We don&apos;t just drive together. We represent a community together.
              </p>
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
                  I have read and agree to the ThePoloClub.BLR Code of Conduct, and I
                  participate at my own risk.
                </span>
              </label>

              {!readToEnd && (
                <p className="text-xs text-neutral-500">
                  Scroll to the end to continue.
                </p>
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
            <Field
              label="Full name"
              value={name}
              onChange={setName}
              placeholder="Your name"
            />
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
              {loading ? "CONFIRMING..." : "CONFIRM REGISTRATION"}
            </button>

            <p className="text-center text-xs text-neutral-500">
              We&apos;ll only use your number for this drive.
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 p-5 text-center">
            <p className="text-sm text-neutral-300">
              Thanks for registering for{" "}
              <span className="text-white">{event.title}</span>. Send us a quick WhatsApp
              message and we&apos;ll add you to the event group.
            </p>

            {inviteUrl ? (
              
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full bg-[#25D366] py-3 text-sm font-bold tracking-wide text-black transition hover:brightness-110"
              >
                MESSAGE US ON WHATSAPP
              </a>
            ) : (
              <p className="text-sm text-neutral-400">
                We&apos;ll reach out to you on {phone} shortly.
              </p>
            )}

            <button
              onClick={onClose}
              className="text-xs text-neutral-500 hover:text-neutral-300"
            >
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
