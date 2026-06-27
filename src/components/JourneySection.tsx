"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionTemplate, type MotionValue } from "framer-motion";
import BorderGlow from "@/components/ui/BorderGlow";
import TimelineRod from "@/components/ui/TimelineRod";

/* ─── Event Data ─── */
const events = [
  {
    id: "registrations",
    date: "June 23",
    title: "Registrations Open",
    description:
      "Create your team, submit your details, and secure your place in Sri Lanka's premier inter-university startup challenge.",
    accentColor: "#5BB8FF",
    glowColor: "205 100 68",
    colors: ["#5BB8FF", "#1A6FD4", "#0A3878"],
    imageUrl: "/timeline-images/registration.webp",
  },
  {
    id: "proposal",
    date: "July 31",
    title: "Proposal Submission",
    description:
      "Present your startup concept through a proposal and introductory video, showcasing the problem, solution, and potential behind your idea.",
    accentColor: "#1A6FD4",
    glowColor: "212 78 47",
    colors: ["#1A6FD4", "#5BB8FF", "#0A3878"],
    imageUrl: "/timeline-images/submission.webp",
  },
  {
    id: "designx",
    date: "Sep – Oct",
    title: "designX Workshops",
    description:
      "Refine your business model, validate your solution, and gain valuable insights through expert-led startup development workshops.",
    accentColor: "#0A3878",
    glowColor: "215 85 26",
    colors: ["#0A3878", "#1A6FD4", "#5BB8FF"],
    imageUrl: "/timeline-images/Workshops.webp",
  },
  {
    id: "ideax",
    date: "October 3",
    title: "ideaX: Semi-Finals",
    description:
      "Pitch your idea before an expert judging panel and compete for a place among the nation's top startup teams.",
    accentColor: "#5BB8FF",
    glowColor: "205 100 68",
    colors: ["#5BB8FF", "#1A6FD4", "#0A3878"],
    imageUrl: "/timeline-images/semifinals.webp",
  },
  {
    id: "finals",
    date: "November 11",
    title: "Grand Finals",
    description:
      "Take the national stage and present your fully developed startup to industry leaders, investors, and distinguished guests.",
    accentColor: "#1A6FD4",
    glowColor: "212 78 47",
    colors: ["#1A6FD4", "#5BB8FF", "#0A3878"],
    imageUrl: "/timeline-images/grandfinals.webp",
  },
];

/* ════════════════════════════════════════════
   START ICON — floating artifact image
   Sits at the very top of the line
   ════════════════════════════════════════════ */
function StartImage({ scrollYProgress }: { scrollYProgress: any }) {
  // Reduced vertical travel to stay anchored to the line
  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-45, 45]); // Increased rotation

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center z-20"
      style={{ width: 80, height: 80 }}
    >
      {/* Background plate: completely masks the rail behind the image */}
      <div
        className="absolute rounded-full"
        style={{ width: 60, height: 60, background: "#010814", zIndex: 0 }}
      />
      <motion.img 
        src="/timeline-start.webp" 
        alt="Timeline Start" 
        style={{ y, rotate }}
        className="relative z-10 w-[70px] md:w-[85px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] object-contain" 
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   END ICON — rotating end orb, charged by the
   energy reaching the bottom of the line
   ════════════════════════════════════════════ */
function EndImage({ scrollYProgress, progress }: { scrollYProgress: MotionValue<number>; progress: MotionValue<number> }) {
  // Continuous smooth rotation across the section's scroll length
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  // Glow ramps up as the energy front nears the orb
  const glow = useTransform(progress, [0.5, 0.95], [0.2, 1]);
  const glowScale = useTransform(progress, [0.5, 0.95], [0.6, 1]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center z-20 w-[80px] h-[80px] md:w-[140px] md:h-[140px]"
    >
      {/* Energy aura that intensifies as the conduit arrives */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "180%",
          height: "180%",
          opacity: glow,
          scale: glowScale,
          background: "radial-gradient(circle, rgba(91,184,255,0.45) 0%, rgba(26,111,212,0.12) 45%, transparent 72%)",
          filter: "blur(6px)",
          zIndex: 0,
        }}
      />
      {/* Background plate to mask the end of the timeline rail */}
      <div
        className="absolute rounded-full w-[46px] h-[46px] md:w-[80px] md:h-[80px]"
        style={{ background: "#010814", zIndex: 1 }}
      />

      <motion.img
        src="/timeline-images/endorb.webp"
        alt="Timeline End"
        style={{ rotate }}
        className="relative z-10 w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
      />
    </motion.div>
  );
}

/* ─── Individual event row ───
   A true scroll-driven orbit around the central pole. As the row passes through
   the viewport its card revolves on a circle around the rod: it swings in from
   the right (and slightly behind), sweeps to the front-centre — closest to the
   camera, largest and clearest — then continues around to the left and away.
   The composition of `rotateY(θ) translateZ(R)` places the card ON the orbit and
   turns it to face outward, so it reads like a camera orbiting the pole. */
function EventRow({
  event,
  index,
  isDesktop,
}: {
  event: (typeof events)[0];
  index: number;
  isDesktop: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  // θ sweeps right → centre → left as the row crosses the viewport.
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [112, 0, -112]);
  const orbitOpacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0, 1, 1, 0]);
  const transform = useMotionTemplate`perspective(1300px) rotateY(${rotateY}deg) translateZ(300px)`;

  // Mobile: no room to orbit — a clean fade/slide up.
  const mobileOpacity = useTransform(scrollYProgress, [0.12, 0.42], [0, 1]);
  const mobileY = useTransform(scrollYProgress, [0.12, 0.42], [44, 0]);

  return (
    <div ref={rowRef} className="relative flex justify-center py-10 md:py-20">
      {isDesktop ? (
        <motion.div
          style={{ transform, opacity: orbitOpacity }}
          className="relative z-10 w-[min(460px,86vw)] [transform-style:preserve-3d] will-change-transform"
        >
          <GlassCard event={event} />
        </motion.div>
      ) : (
        <motion.div
          style={{ opacity: mobileOpacity, y: mobileY }}
          className="relative z-10 w-full max-w-[440px]"
        >
          <GlassCard event={event} />
        </motion.div>
      )}
    </div>
  );
}

/* ─── Liquid glass card ─── */
function GlassCard({ event }: { event: (typeof events)[0] }) {
  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor={event.glowColor}
      backgroundColor="rgba(8, 26, 58, 0.55)"
      borderRadius={16}
      glowRadius={30}
      glowIntensity={0.8}
      coneSpread={25}
      animated={false}
      colors={event.colors}
      fillOpacity={0}
      className="w-full max-w-[420px] backdrop-blur-2xl backdrop-saturate-150"
    >
      <div
        className="relative p-7 w-full h-full rounded-[inherit]"
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        {/* Top refraction line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${event.accentColor}55, transparent)`,
          }}
        />
        {/* Corner glow */}
        <div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${event.accentColor}12 0%, transparent 70%)`,
          }}
        />

        {/* Date — raised closest to the viewer */}
        <div className="mb-2 relative z-10" style={{ transform: "translateZ(60px)" }}>
          <span
            className="block text-[10px] font-semibold tracking-[0.2em] uppercase select-none"
            style={{ color: event.accentColor, opacity: 0.85 }}
          >
            {event.date}
          </span>
        </div>

        <h3
          className="text-white font-extrabold text-xl md:text-2xl tracking-tight leading-tight mb-3 relative z-10 text-left"
          style={{ transform: "translateZ(42px)", filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.5))" }}
        >
          {event.title}
        </h3>
        <p
          className="text-white/55 text-sm leading-relaxed font-light relative z-10 text-left"
          style={{ transform: "translateZ(18px)" }}
        >
          {event.description}
        </p>
      </div>
    </BorderGlow>
  );
}

/* ════════════════════════════════════════════
   MAIN SECTION
   ════════════════════════════════════════════ */
export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 20%", "end 80%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  // The 3D orbit only applies where there's room to swing (tablet / desktop).
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative w-full bg-[#010814] pt-12 pb-8 md:pt-20 md:pb-20 overflow-hidden z-10"
    >
      {/* Ambient Background - Optimized */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(91,184,255,0.04) 0%, rgba(91,184,255,0) 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">

        {/* ─── Header ─── */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight"
          >
            The Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/40 text-sm mt-4 tracking-wide text-center max-w-md mx-auto"
          >
            Every great venture starts somewhere. Yours starts here.
          </motion.p>
        </div>

        {/* ─── Timeline body ─── */}
        {/*
          Structure:
            [icon row]          ← StartGem, line begins here
            [event rows...]     ← each has its own dot
            [icon row]          ← EndTrophy, line ends here

          The line is absolutely positioned across the full inner block.
          We use padding-top/bottom on the icon rows so the line runs
          edge-to-edge through the center of each icon.
        */}
        <div className="relative" id="timeline-body">

          {/* ── 3D energy rod down the centre — energises as you scroll ── */}
          <TimelineRod progress={smoothProgress} />

          {/* ── START IMAGE ── */}
          <div data-tl-start className="relative z-20 flex justify-center pb-8 -mt-4">
            <StartImage scrollYProgress={scrollYProgress} />
          </div>

          {/* ── EVENT ROWS ── */}
          {events.map((event, index) => (
            <EventRow key={event.id} event={event} index={index} isDesktop={isDesktop} />
          ))}

          {/* ── END CARD ── the awakening, revealed at the foot of the line ── */}
          <div data-tl-end className="relative z-20 flex justify-center" style={{ paddingTop: 24 }}>
            <EndImage scrollYProgress={scrollYProgress} progress={smoothProgress} />
          </div>
        </div>
      </div>

      {/* Bottom blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #010814)" }}
      />
    </section>
  );
}
