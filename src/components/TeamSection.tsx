"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import BorderGlow from "@/components/ui/BorderGlow";

/* ─── OC Data ─── */
const coordinators = [
  {
    name: "Ashan Perera",
    role: "President — hackX 11.0",
    email: "president@hackx.lk",
    phone: "+94 77 000 0001",
    avatar: "/OC Images/Draft OC.webp",
  },
  {
    name: "Dilmi Rathnayake",
    role: "Secretary General",
    email: "secretary@hackx.lk",
    phone: "+94 77 000 0002",
    avatar: "/OC Images/Draft OC.webp",
  },
  {
    name: "Kavinda Silva",
    role: "Head of Technology",
    email: "tech@hackx.lk",
    phone: "+94 77 000 0003",
    avatar: "/OC Images/Draft OC.webp",
  },
  {
    name: "Nethmi Fernando",
    role: "Head of Marketing",
    email: "marketing@hackx.lk",
    phone: "+94 77 000 0004",
    avatar: "/OC Images/Draft OC.webp",
  },
  {
    name: "Isuru Wickrama",
    role: "Head of Finance",
    email: "finance@hackx.lk",
    phone: "+94 77 000 0005",
    avatar: "/OC Images/Draft OC.webp",
  },
];

function CoordCard({ coord }: { coord: typeof coordinators[0] }) {
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
      <div className="relative w-full h-full flex flex-col justify-end p-5 md:p-6 rounded-[24px] overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coord.avatar}
            alt={coord.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

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
          <p className="text-white font-extrabold text-lg md:text-xl tracking-tight leading-tight mb-1 text-center md:text-left">
            {coord.name}
          </p>
          <p className="text-[#5BB8FF] text-xs md:text-sm font-semibold tracking-wide mb-4 text-center md:text-left">
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

export default function TeamSection() {
  const [active, setActive] = useState(1000); // Start high for infinite looping
  const N = coordinators.length;

  const next = useCallback(() => setActive(a => a + 1), []);
  const prev = useCallback(() => setActive(a => a - 1), []);

  const [isMobile, setIsMobile] = useState(false);
  const [translateXStep, setTranslateXStep] = useState(280);
  // Use a ref so the auto-scroll interval always reads the live value
  // without a stale closure — avoids the race condition where isMobile
  // is false on first render and starts the timer before handleResize fires.
  const isMobileRef = useRef(false);
  // Native touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      isMobileRef.current = mobile;
      setIsMobile(mobile);
      if (!mobile) {
        const val = width * 0.22;
        setTranslateXStep(Math.max(260, Math.min(val, 310)));
      }
    };
    handleResize(); // sets isMobileRef.current immediately
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll only on desktop — reads live ref value inside the interval
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isMobileRef.current) {
        setActive((a) => a + 1);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []); // empty deps — timer is always running, ref controls whether it advances

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) next(); // swipe left → next
      else prev();           // swipe right → prev
    }
    touchStartX.current = null;
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

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs font-bold tracking-[0.2em] uppercase text-[#5BB8FF] mb-3 block text-center md:text-left"
            >
              Organising Committee
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.07 }}
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight text-center md:text-left"
            >
              Meet the OC.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="text-white/55 mt-4 text-sm md:text-base font-light leading-relaxed max-w-lg text-center md:text-left mx-auto md:mx-0"
            >
              Have a question? Reach the right person directly. Our team is ready to propel your startup journey forward.
            </motion.p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
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

        {/* ─── Straight Line Carousel ─── */}
        <div 
          className="relative w-full h-[350px] md:h-[550px] mt-8 md:mt-16 flex justify-center items-center overflow-hidden [perspective:1200px]"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
            const absoluteIndex = active + offset;
            const wrappedIndex = ((absoluteIndex % N) + N) % N;
            const coord = coordinators[wrappedIndex];
            const absOffset = Math.abs(offset);
            
            // Align in a straight horizontal line (no rotateZ, no translateY curve)
            const rotateZ = 0;
            const translateY = 0;
            
            // Dynamic translation for responsive horizontal spread
            const translateX = isMobile
              ? `calc(${offset} * clamp(200px, 20vw, 320px))`
              : `${offset * translateXStep}px`; 
            
            const scale = isMobile 
              ? (1 - absOffset * 0.20) 
              : (1 - absOffset * 0.05); // Slightly shrink outer cards for focus/depth
              
            const opacity = isMobile
              ? (absOffset > 1 ? 0 : (absOffset === 0 ? 1 : 0.35))
              : (absOffset > 2 ? 0 : 1); // Hide items too far out
              
            const zIndex = 20 - absOffset; // Center item on top
            
            return (
              <motion.div
                key={absoluteIndex}
                className="absolute w-[220px] h-[320px] md:w-[280px] md:h-[420px] cursor-pointer"
                initial={{
                  x: translateX,
                  y: translateY,
                  rotateZ: rotateZ,
                  scale: scale,
                  opacity: 0,
                }}
                animate={{
                  x: translateX,
                  y: translateY,
                  rotateZ: rotateZ,
                  scale: scale,
                  zIndex: zIndex,
                  opacity: opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 28,
                  mass: 0.8
                }}
                onClick={() => setActive(absoluteIndex)}
              >
                <CoordCard coord={coord} />
              </motion.div>
            );
          })}
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
