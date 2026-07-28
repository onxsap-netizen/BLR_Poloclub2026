import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="carbon-bg border-t border-base-border">
      <div className="chevron-strip" />
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="ThePoloClub.BLR"
                width={48}
                height={48}
                className="rounded-full ring-1 ring-accent/40"
              />
              <span className="font-display text-lg font-semibold uppercase tracking-wide">
                ThePoloClub<span className="text-accent">.BLR</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver">
              One Drive. One Family. One Community. Bangalore&apos;s home for
              Volkswagen Polo owners and enthusiasts.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-accent">
              Explore
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-silver-light">
              <li><Link href="/about" className="hover:text-off">About Us</Link></li>
              <li><Link href="/events" className="hover:text-off">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-off">Gallery</Link></li>
              <li><Link href="/join" className="hover:text-off">Join Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-accent">
              Community
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-silver-light">
              <li className="flex items-center gap-2"><MapPin size={15} className="text-accent" /> Bengaluru, Karnataka</li>
              <li>500+ Members</li>
              <li>15+ Cities Represented</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-accent">
              Follow the Drive
            </h4>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.instagram.com/thepoloclub.blr/"
                aria-label="Instagram"
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-base-border transition-colors hover:border-accent hover:text-accent"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-base-border transition-colors hover:border-accent hover:text-accent"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-base-border pt-6 text-xs text-silver md:flex-row">
          <p>&copy; {new Date().getFullYear()} ThePoloClub.BLR. All rights reserved.</p>
          <p className="plate-number text-silver">DRIVE · RESPECT · FAMILY</p>
        </div>
      </div>
    </footer>
  );
}
