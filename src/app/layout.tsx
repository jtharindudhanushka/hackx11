import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hackx.lk";
const TITLE = "hackX 11.0 — Sri Lanka's Premier Inter-University Startup Challenge";
const DESCRIPTION =
  "Where university students turn bold ideas into real ventures. Backed by the nation. Built by students. Eleven years running.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "hackX",
    "hackX 11.0",
    "startup challenge",
    "Sri Lanka",
    "inter-university",
    "University of Kelaniya",
    "student startups",
    "entrepreneurship",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "hackX 11.0",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/hackxlogo.webp",
        alt: "hackX 11.0",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/hackxlogo.webp"],
  },
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-black text-white">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
