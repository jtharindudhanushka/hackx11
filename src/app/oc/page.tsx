"use client";

/* ─────────────────────────────────────────────────────────────
   /oc — STANDALONE SANDBOX COPY of the "Contact Us" OC section.
   This is an isolated copy of <TeamSection /> so we can iterate on
   the OC cards here without touching the live homepage. Once the
   design is finalized, port the changes back into
   src/components/TeamSection.tsx.
   ───────────────────────────────────────────────────────────── */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import BorderGlow from "@/components/ui/BorderGlow";

/* ─── OC Data ─── */
const coordinators = [
  {
    name: "Praveen Madawalage",
    role: "Chief Coordinator",
    email: "praveen.hackx@gmail.com",
    phone: "+94 77 286 8600",
    avatar: "/OC/Praveen.webp",
  },
  {
    name: "Tharushi Kulathunga",
    role: "Chief Coordinator",
    email: "tharushi.hackx@gmail.com",
    phone: "+94 70 725 3446",
    avatar: "/OC/Tharushi.webp",
  },
  {
    name: "Sameera Ekanayaka",
    role: "Financial Coordinator",
    email: "sameera.hackx@gmail.com",
    phone: "+94 76 142 7662",
    avatar: "/OC/Sameera.webp",
  },
  {
    name: "Imasha Karunathilaka",
    role: "Financial Coordinator",
    email: "imashaa.hackx@gmail.com",
    phone: "+94 77 485 2074",
    avatar: "/OC/Imasha.webp",
  },
  {
    name: "Tharindu Dhanushka",
    role: "Partnership Coordinator",
    email: "tharindu.hackx@gmail.com",
    phone: "+94 76 219 5995",
    avatar: "/OC/Tharindu.webp",
  },
  {
    name: "Thilini Bhagya",
    role: "Partnership Coordinator",
    email: "thilini.hackx@gmail.com",
    phone: "+94 76 947 6496",
    avatar: "/OC/Thilini.webp",
  },
  {
    name: "Charith Fonseka",
    role: "Marketing Coordinator",
    email: "charith.hackx@gmail.com",
    phone: "+94 78 256 7430",
    avatar: "/OC/Charith.webp",
  },
  {
    name: "Manumi Senevirathna",
    role: "Marketing Coordinator",
    email: "manumi.hackx@gmail.com",
    phone: "+94 77 015 0508",
    avatar: "/OC/Manumi.webp",
  },
];

/* ─────────────────────────────────────────────────────────────
   useHoverReveal — Lando-style cursor-trail reveal (no WebGL).

   A 2D canvas sits over the base photo. As the pointer moves, we
   stamp feathered, jittered brush blobs into an offscreen alpha
   "mask", then composite the overlay image through that mask
   (destination-in). After a short hold the mask is eroded through a
   noise texture (destination-out) so the trail dissolves like ink —
   giving the sticker-peel look. The rAF loop runs ONLY while hovering
   (+ a short fade tail). Disabled on touch / coarse-pointer devices and
   when prefers-reduced-motion is set (the static photo just shows).
   ───────────────────────────────────────────────────────────── */
function useHoverReveal(
  containerRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  overlaySrc: string,
  radiusRatio = 0.26,
  fade = 0.12, // ink-dissolve erosion strength per frame
  holdFrames = 28,
) {
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Only enable where a precise pointer can hover; respect reduced motion.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;

    const vctx = canvas.getContext("2d");
    if (!vctx) return;

    // Offscreen alpha mask.
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    if (!mctx) return;

    // Pre-rendered feathered brush sprite (drawImage is far cheaper than
    // building a radial gradient on every stamp).
    const brush = document.createElement("canvas");
    brush.width = brush.height = 128;
    const bctx = brush.getContext("2d")!;
    const bg = bctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    bg.addColorStop(0, "rgba(255,255,255,1)");
    bg.addColorStop(0.55, "rgba(255,255,255,0.85)");
    bg.addColorStop(1, "rgba(255,255,255,0)");
    bctx.fillStyle = bg;
    bctx.beginPath();
    bctx.arc(64, 64, 64, 0, Math.PI * 2);
    bctx.fill();

    // Smooth "cloudy" noise texture — used to erode the mask into organic
    // tendrils during the fade, giving an ink-dissolving-in-water look
    // instead of a flat linear fade. Rebuilt whenever the canvas resizes.
    const noise = document.createElement("canvas");
    function buildNoise() {
      // Very fine cells (a few device-px each) → no visible "bubbles". The
      // slight blur on upscale melts the grid into a silky, near-uniform
      // texture, so the dissolve reads smooth with only a whisper of grain.
      const cell = 3; // device px per noise cell (smaller = smoother)
      const lw = Math.max(2, Math.round(W / cell));
      const lh = Math.max(2, Math.round(H / cell));
      const low = document.createElement("canvas");
      low.width = lw; low.height = lh;
      const lctx = low.getContext("2d")!;
      const img = lctx.createImageData(lw, lh);
      for (let i = 0; i < lw * lh; i++) {
        img.data[i * 4] = 255;
        img.data[i * 4 + 1] = 255;
        img.data[i * 4 + 2] = 255;
        // Bias toward lower alpha so the erosion tendrils stay fine.
        img.data[i * 4 + 3] = Math.floor(Math.pow(Math.random(), 1.4) * 255);
      }
      lctx.putImageData(img, 0, 0);
      noise.width = W; noise.height = H;
      const nctx = noise.getContext("2d")!;
      nctx.imageSmoothingEnabled = true;
      nctx.filter = "blur(1.2px)"; // silk-smooth the upscaled grid
      nctx.drawImage(low, 0, 0, W, H);
      nctx.filter = "none";
    }

    const overlay = new Image();
    let ready = false;
    let ox = 0, oy = 0, ow = 0, oh = 0; // cover-fit box for the overlay
    let W = 0, H = 0, dpr = 1, r = 60;

    const OVERLAY_SCALE = 1.04; // very slight zoom on the revealed figure
    function computeCover() {
      const iw = overlay.naturalWidth, ih = overlay.naturalHeight;
      if (!iw || !ih) return;
      const s = Math.max(W / iw, H / ih) * OVERLAY_SCALE;
      ow = iw * s; oh = ih * s;
      ox = (W - ow) / 2; oy = H - oh; // center horizontally, anchor to bottom
    }

    function layout() {
      const rect = container!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(rect.width * dpr));
      H = Math.max(1, Math.round(rect.height * dpr));
      canvas!.width = W; canvas!.height = H;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      mask.width = W; mask.height = H;
      r = Math.max(40 * dpr, rect.width * dpr * radiusRatio);
      buildNoise();
      if (ready) computeCover();
    }

    let lastX = 0, lastY = 0, hasLast = false, hovering = false;
    let sinceStamp = 0, raf = 0, running = false;

    overlay.onload = () => { ready = true; computeCover(); };
    overlay.src = overlaySrc;

    function stampBlob(x: number, y: number) {
      for (let k = 0; k < 3; k++) {
        const jr = r * (0.55 + Math.random() * 0.55);
        const jx = x + (Math.random() - 0.5) * r * 0.6;
        const jy = y + (Math.random() - 0.5) * r * 0.6;
        mctx!.globalAlpha = 0.5 + Math.random() * 0.4;
        mctx!.drawImage(brush, jx - jr, jy - jr, jr * 2, jr * 2);
      }
      mctx!.globalAlpha = 1;
    }

    function stampLine(x0: number, y0: number, x1: number, y1: number) {
      const dist = Math.hypot(x1 - x0, y1 - y0);
      const step = Math.max(1, r * 0.2);
      const n = Math.max(1, Math.ceil(dist / step));
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        stampBlob(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
      }
    }

    function frame() {
      sinceStamp++;

      if (sinceStamp > holdFrames) {
        // Hover trail: hold, then ink-dissolve fade out.
        const t = sinceStamp - holdFrames;
        mctx!.globalCompositeOperation = "destination-out";
        mctx!.globalAlpha = fade;
        mctx!.drawImage(noise, 0, 0);
        mctx!.globalAlpha = 1;
        mctx!.fillStyle = `rgba(0,0,0,${Math.min(0.22, 0.012 + t * 0.0035)})`;
        mctx!.fillRect(0, 0, W, H);
        mctx!.globalCompositeOperation = "source-over";
      }

      vctx!.clearRect(0, 0, W, H);
      if (ready) {
        // Compose the suit over an opaque dark backdrop, clipped to the mask —
        // so where the suit PNG is transparent the person's photo never bleeds
        // through inside the reveal.
        vctx!.globalCompositeOperation = "source-over";
        vctx!.fillStyle = "#010814"; // card background
        vctx!.fillRect(0, 0, W, H);
        vctx!.drawImage(overlay, ox, oy, ow, oh);
        vctx!.globalCompositeOperation = "destination-in";
        vctx!.drawImage(mask, 0, 0);
        vctx!.globalCompositeOperation = "source-over";
      }

      // Stop once the pointer is gone and the trail has fully faded.
      const faded = sinceStamp > holdFrames + 90;
      if (!hovering && faded) {
        running = false;
        vctx!.clearRect(0, 0, W, H);
        mctx!.clearRect(0, 0, W, H);
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function ensureRunning() {
      if (!running) { running = true; sinceStamp = 0; raf = requestAnimationFrame(frame); }
    }

    function onMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;
      hovering = true;
      if (hasLast) stampLine(lastX, lastY, x, y); else stampBlob(x, y);
      lastX = x; lastY = y; hasLast = true;
      sinceStamp = 0; // reset the hold timer on each new reveal
      ensureRunning();
    }
    function onEnter() { hovering = true; hasLast = false; sinceStamp = 0; ensureRunning(); }
    function onLeave() { hovering = false; hasLast = false; }

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(container);
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    return () => {
      ro.disconnect();
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef, canvasRef, overlaySrc, radiusRatio, fade, holdFrames]);
}

function CoordCard({ coord }: { coord: typeof coordinators[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useHoverReveal(cardRef, canvasRef, "/OC/HoverOverlay.webp");

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="205 100 68" // Brand Sky Blue HSL
      backgroundColor="rgba(3, 17, 38, 0.4)"
      borderRadius={24}
      glowRadius={32}
      glowIntensity={1.1}
      coneSpread={25}
      animated={false}
      colors={['#1A6FD4', '#5BB8FF', '#0A3878']}
      fillOpacity={0}
      className="w-full h-full group"
    >
      <div ref={cardRef} className="relative w-full h-full flex flex-col justify-end p-5 md:p-6 rounded-[24px] overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coord.avatar}
            alt={coord.name}
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Cursor-trail reveal layer (sits above the photo, below the text) */}
        <canvas ref={canvasRef} className="absolute inset-0 z-[11] pointer-events-none" />

        {/* Blurred fade overlay from the bottom up behind the text details */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] z-10 bg-gradient-to-t from-[#010814] via-[#010814]/75 to-transparent backdrop-blur-xl pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, black 35%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 35%, transparent 100%)",
          }}
        />

        {/* Info overlay (sitting clean on top of the blurred fade background) */}
        <div className="relative z-20 flex flex-col w-full">
          <p className="text-white font-extrabold text-lg md:text-xl tracking-tight leading-tight mb-1 text-center">
            {coord.name}
          </p>
          <p className="text-[#5BB8FF] text-xs md:text-sm font-semibold tracking-wide mb-4 text-center">
            {coord.role}
          </p>

          {/* Always show contact details as glass buttons */}
          <div className="flex gap-2 w-full">
            <a
              href={`mailto:${coord.email}`}
              className="flex-1 py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-[#1A6FD4]/20 hover:border-[#5BB8FF]/30 transition-all duration-300 text-center flex items-center justify-center gap-1.5 text-xs text-white/80 hover:text-white"
              onClick={e => e.stopPropagation()}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span className="truncate">Email</span>
            </a>
            <a
              href={`tel:${coord.phone.replace(/\s/g, "")}`}
              className="flex-1 py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-[#1A6FD4]/20 hover:border-[#5BB8FF]/30 transition-all duration-300 text-center flex items-center justify-center gap-1.5 text-xs text-white/80 hover:text-white"
              onClick={e => e.stopPropagation()}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span>Call</span>
            </a>
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}

function OCSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);

  const getMetrics = () => {
    const isMob = typeof window !== "undefined" && window.innerWidth < 768;
    const gap = isMob ? 12 : 16; // gap-3 is 12px, gap-4 is 16px
    const cardWidth = isMob ? 220 : 280;
    const totalItemWidth = cardWidth + gap;
    const cycleWidth = coordinators.length * totalItemWidth;
    return { totalItemWidth, cycleWidth };
  };

  // Initialize scroll position to start of the second cycle
  useEffect(() => {
    if (scrollRef.current) {
      const { cycleWidth } = getMetrics();
      scrollRef.current.scrollLeft = cycleWidth;
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { cycleWidth } = getMetrics();
    // Seamless loop: when past 2 cycles jump back 1 cycle, when before 1 cycle jump forward 1 cycle
    if (el.scrollLeft >= cycleWidth * 2) {
      el.scrollLeft -= cycleWidth;
    } else if (el.scrollLeft < cycleWidth * 0.5) {
      el.scrollLeft += cycleWidth;
    }
  };

  // Auto-advance scroll natively
  useEffect(() => {
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (el && !isInteracting.current) {
        const { cycleWidth } = getMetrics();
        // If we've scrolled past 1 full cycle, jump back by 1 cycle instantly (no glitch)
        if (el.scrollLeft >= cycleWidth * 2) {
          el.scrollLeft -= cycleWidth;
        } else {
          el.scrollLeft += 1;
        }
      }
    }, 16); // ~60fps smooth crawl
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    const { totalItemWidth } = getMetrics();
    scrollRef.current?.scrollBy({ left: totalItemWidth, behavior: "smooth" });
  };

  const prev = () => {
    const { totalItemWidth } = getMetrics();
    scrollRef.current?.scrollBy({ left: -totalItemWidth, behavior: "smooth" });
  };

  return (
    <section
      id="oc"
      className="relative w-full bg-[#010814] pt-10 pb-10 md:py-20 overflow-hidden z-10"
    >
      {/* Ambient background blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(91,184,255,0.04) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.07 }}
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight text-center md:text-left"
            >
              Contact Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="text-white/55 mt-4 text-sm md:text-base font-light leading-relaxed max-w-lg text-center md:text-left mx-auto md:mx-0"
            >
              Have a question? Reach the right person directly. Our team is ready to assist you every step of the way.
            </motion.p>
          </div>

          {/* Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-advancing infinite native scroll container */}
      <div className="relative w-full overflow-hidden bg-[#010814] mt-8 md:mt-12">
        {/* Shadow overlays for smooth fade on edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#010814] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#010814] to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 px-6 md:px-12 py-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar items-center h-[360px] md:h-[460px]"
          onMouseEnter={() => { isInteracting.current = true; }}
          onMouseLeave={() => { isInteracting.current = false; }}
          onTouchStart={() => { isInteracting.current = true; }}
          onTouchEnd={() => { isInteracting.current = false; }}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* 3 cycles: start in cycle 1 (scrollLeft=cycleWidth), reset when past cycle 2 or before cycle 0.5 */}
          {[...coordinators, ...coordinators, ...coordinators].map((coord, idx) => (
            <div key={idx} className="relative w-[220px] h-[320px] md:w-[280px] md:h-[420px] shrink-0 snap-center">
              <CoordCard coord={coord} />
            </div>
          ))}

        </div>
      </div>

      {/* Seamless blend into the next dark section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #010814)" }}
      />
    </section>
  );
}

export default function OCSandboxPage() {
  return (
    <main style={{ background: "#010814", minHeight: "100vh", width: "100%", overflowX: "clip" }} className="flex items-center">
      <OCSection />
    </main>
  );
}
