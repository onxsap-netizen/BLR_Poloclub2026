import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://thepoloclub.blr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ThePoloClub.BLR | One Drive. One Family. One Community.",
    template: "%s | ThePoloClub.BLR",
  },
  description:
    "Bangalore's premier Volkswagen Polo enthusiast community. Weekend drives, Cars & Coffee, track days, and a family of Polo owners who share one passion. Join ThePoloClub.BLR.",
  keywords: [
    "ThePoloClub.BLR",
    "Volkswagen Polo Bangalore",
    "VW Polo club India",
    "Polo GT Bangalore",
    "car community Bangalore",
    "Cars and Coffee Bangalore",
    "VW enthusiast club",
  ],
  authors: [{ name: "ThePoloClub.BLR" }],
  openGraph: {
    title: "ThePoloClub.BLR | One Drive. One Family. One Community.",
    description:
      "Bangalore's premier Volkswagen Polo enthusiast community. Join weekend drives, Cars & Coffee meets, and track days.",
    url: siteUrl,
    siteName: "ThePoloClub.BLR",
    images: [{ url: "/images/logo.jpg", width: 640, height: 640, alt: "ThePoloClub.BLR Logo" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThePoloClub.BLR",
    description: "Bangalore's premier Volkswagen Polo enthusiast community.",
    images: ["/images/logo.jpg"],
  },
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ThePoloClub.BLR",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.jpg`,
    description:
      "Bangalore's premier Volkswagen Polo enthusiast community — one drive, one family, one community.",
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en" className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
