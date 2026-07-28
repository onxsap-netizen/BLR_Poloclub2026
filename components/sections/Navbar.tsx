"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/join", label: "Join" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-3 focus-ring rounded-full">
            <Image
              src="/images/logo.jpg"
              alt="ThePoloClub.BLR"
              width={44}
              height={44}
              className="rounded-full ring-1 ring-accent/40"
              priority
            />
            <span className="hidden font-display text-xl font-semibold uppercase tracking-wide sm:block">
              ThePoloClub<span className="text-accent">.BLR</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="focus-ring rounded font-display text-[15px] font-medium uppercase tracking-wider text-silver-light transition-colors hover:text-off"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/join"
              className="focus-ring rounded-full bg-accent px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-off transition-all hover:bg-accent-glow hover:shadow-[0_0_24px_rgba(227,6,19,0.5)]"
            >
              Join Community
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="focus-ring rounded p-2 md:hidden"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="glass fixed inset-x-0 top-[64px] z-40 px-5 py-6 md:hidden"
          >
            <div className="flex flex-col gap-5">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-lg font-medium uppercase tracking-wide text-silver-light"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/join"
                onClick={() => setOpen(false)}
                className="rounded-full bg-accent px-6 py-3 text-center font-display text-sm font-semibold uppercase tracking-wider"
              >
                Join Community
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
