import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "T-Shirt Pre-Orders — hackX 11.0",
  description: "Pre-order the official hackX 11.0 T-shirt. Select your level to continue to the order form.",
  alternates: {
    canonical: "/preorder-tshirt",
  },
};

const levels = [
  { id: "01", href: "https://go.hackx.lk/level01" },
  { id: "02", href: "https://go.hackx.lk/level02" },
  { id: "03", href: "https://go.hackx.lk/level03" },
  { id: "04", href: "https://go.hackx.lk/level04" },
];

export default function PreorderTshirtPage() {
  return (
    <main className="relative min-h-screen w-full bg-brand-black overflow-hidden flex flex-col">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-sky/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-5xl w-full mx-auto px-6 md:px-8 pt-8 flex items-center justify-between">
        <Link href="/" className="relative block" style={{ width: "140px", height: "46px" }}>
          <Image src="/hackxlogo.webp" alt="hackX Logo" fill sizes="140px" className="object-contain object-left" priority />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
      </header>

      {/* Content */}
      <section className="relative z-10 flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-3 mb-12 md:mb-16">
          <span className="eyebrow">Official Merch</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.5rem)] md:text-5xl xl:text-6xl font-extrabold title-gradient tracking-tight uppercase">
            T-Shirt Pre-Orders
          </h1>
          <p className="text-white/55 text-sm md:text-base font-light max-w-md leading-relaxed">
            Select your level to continue to the order form.
          </p>
          <div className="mt-2 h-px w-full max-w-sm bg-gradient-to-r from-transparent via-brand-sky/40 to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {levels.map((level) => (
            <a
              key={level.id}
              href={level.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md px-6 py-6 md:px-8 md:py-8 transition-all duration-300 hover:bg-brand-dark-blue/60 hover:border-brand-sky/40 hover:shadow-[0_0_30px_rgba(91,184,255,0.1)]"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] font-mono text-white/40 group-hover:text-brand-sky transition-colors">
                  LEVEL
                </span>
                <span className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {level.id}
                </span>
              </div>
              <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white/5 text-white/60 transition-all duration-300 group-hover:bg-brand-sky group-hover:text-brand-black group-hover:shadow-[0_0_15px_rgba(91,184,255,0.5)]">
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/35">
          Each order form opens in a new tab.
        </p>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto px-6 md:px-8 pb-8">
        <div className="pt-5 border-t border-white/10 text-center md:text-left">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} hackX 11.0.</p>
        </div>
      </footer>
    </main>
  );
}
