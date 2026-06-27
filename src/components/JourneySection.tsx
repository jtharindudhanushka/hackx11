"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import BorderGlow from "@/components/ui/BorderGlow";

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
   END ICON — rotating end artifact
   Sits at the very bottom of the line
   ════════════════════════════════════════════ */
function EndImage({ scrollYProgress }: { scrollYProgress: any }) {
  // Continuous smooth rotation across the entire section's scroll length
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center z-20 w-[80px] h-[80px] md:w-[140px] md:h-[140px]"
    >
      {/* Background plate to mask the end of the timeline rail */}
      <div
        className="absolute rounded-full w-[46px] h-[46px] md:w-[80px] md:h-[80px]"
        style={{ background: "#010814", zIndex: 0 }}
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

/* ─── Individual event row ─── */
function EventRow({
  event,
  index,
  smx,
  smy,
}: {
  event: (typeof events)[0];
  index: number;
  smx: any;
  smy: any;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 80%", "start 30%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cardX = useTransform(scrollYProgress, [0, 1], [isEven ? -40 : 40, 0]);
  const imgX = useTransform(scrollYProgress, [0, 1], [isEven ? 40 : -40, 0]);

  return (
    <div
      ref={rowRef}
      className="relative grid grid-cols-[48px_1fr] md:grid-cols-[1fr_48px_1fr] items-center gap-0 py-6 md:py-14"
    >
      {/* ── COLUMN 1: LEFT card/image on desktop, DOT on mobile ── */}
      <div className="hidden md:flex justify-end pr-8 md:pr-12">
        {isEven ? (
          <motion.div style={{ opacity, x: cardX }}>
            <GlassCard event={event} />
          </motion.div>
        ) : (
          <motion.div style={{ opacity, x: imgX }} className="w-full flex justify-center max-w-[420px]">
            <EventImage event={event} index={index} rowRef={rowRef} smx={smx} smy={smy} />
          </motion.div>
        )}
      </div>

      {/* Mobile Dot (first column on mobile) */}
      <div className="flex md:hidden justify-center items-center relative z-10">
        <motion.div style={{ opacity }}>
          <motion.div
            className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: event.accentColor }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: event.accentColor }}
              animate={{
                boxShadow: [
                  `0 0 0px 0px ${event.accentColor}00`,
                  `0 0 8px 3px ${event.accentColor}70`,
                  `0 0 0px 0px ${event.accentColor}00`,
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── COLUMN 2: CENTER dot on desktop, CARD on mobile ── */}
      <div className="hidden md:flex justify-center items-center relative z-10">
        <motion.div style={{ opacity }}>
          <motion.div
            className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: event.accentColor }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: event.accentColor }}
              animate={{
                boxShadow: [
                  `0 0 0px 0px ${event.accentColor}00`,
                  `0 0 8px 3px ${event.accentColor}70`,
                  `0 0 0px 0px ${event.accentColor}00`,
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Card (second column on mobile) */}
      <div className="flex md:hidden justify-start pl-4 pr-2">
        <motion.div style={{ opacity }} className="w-full">
          <GlassCard event={event} />
        </motion.div>
      </div>

      {/* ── COLUMN 3: RIGHT card/image on desktop, hidden on mobile ── */}
      <div className="hidden md:flex justify-start pl-8 md:pl-12">
        {isEven ? (
          <motion.div style={{ opacity, x: imgX }} className="w-full flex justify-center max-w-[420px]">
            <EventImage event={event} index={index} rowRef={rowRef} smx={smx} smy={smy} />
          </motion.div>
        ) : (
          <motion.div style={{ opacity, x: cardX }}>
            <GlassCard event={event} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Liquid glass card ─── */
function GlassCard({ event }: { event: (typeof events)[0] }) {
  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor={event.glowColor}
      backgroundColor="rgba(4, 20, 50, 0.45)"
      borderRadius={16}
      glowRadius={30}
      glowIntensity={0.8}
      coneSpread={25}
      animated={false}
      colors={event.colors}
      fillOpacity={0}
      className="w-full max-w-[420px]"
    >
      <div className="relative p-7 overflow-hidden w-full h-full">
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

        {/* Date — tight above the title */}
        <div className="mb-2 relative z-10">
          <span
            className="block text-[10px] font-semibold tracking-[0.2em] uppercase select-none"
            style={{ color: event.accentColor, opacity: 0.8 }}
          >
            {event.date}
          </span>
        </div>

        <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight leading-tight mb-3 relative z-10 text-left">
          {event.title}
        </h3>
        <p className="text-white/55 text-sm leading-relaxed font-light relative z-10 text-left">
          {event.description}
        </p>
      </div>
    </BorderGlow>
  );
}

/* ─── Event floating image ─── */
function EventImage({ event, index, rowRef, smx, smy }: { event: (typeof events)[0]; index: number; rowRef: React.RefObject<HTMLDivElement | null>; smx: any; smy: any }) {
  // Use a full-viewport scroll hook for continuous floating parallax as it moves across screen
  const { scrollYProgress: floatProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  // Increased scroll reactivity
  const y = useTransform(floatProgress, [0, 1], [100, -100]);
  const rotateRange = index % 2 === 0 ? [-20, 20] : [20, -20];
  const rotate = useTransform(floatProgress, [0, 1], rotateRange);

  // Mouse reactivity
  const mx = useTransform(smx, [-1, 1], index % 2 === 0 ? [-40, 40] : [40, -40]);
  const my = useTransform(smy, [-1, 1], [-40, 40]);

  return (
    <motion.div
      className="relative w-full flex justify-center items-center"
      style={{ y, rotate }}
    >
      <motion.img 
        src={event.imageUrl} 
        alt={event.title} 
        style={{ x: mx, y: my }}
        className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] object-contain max-w-[250px] md:max-w-[320px]" 
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   MAIN SECTION
   ════════════════════════════════════════════ */
export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse tracking logic for interactive floating
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 100 };
  const smx = useSpring(mouseX, springConfig);
  const smy = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) * 2 - 1);
    mouseY.set((clientY / innerHeight) * 2 - 1);
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 20%", "end 80%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  /* The center column is 48px wide — line is 1px centered within it */
  const lineLeft = "calc(50% - 0.5px)";

  return (
    <section
      id="timeline"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#010814] pt-12 pb-8 md:pt-20 md:pb-20 overflow-hidden z-10"
    >
      {/* Ambient Background - Optimized */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(91,184,255,0.04) 0%, rgba(91,184,255,0) 70%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">

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

          {/* ── Faint background rail — spans full height of this block ── */}
          <div
            className="absolute top-[24px] bottom-0 w-px pointer-events-none left-6 md:left-1/2 md:-translate-x-1/2"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          {/* ── Scroll-filled colored line ── */}
          <div
            className="absolute top-[24px] w-px overflow-hidden pointer-events-none left-6 md:left-1/2 md:-translate-x-1/2"
            style={{ height: "calc(100% - 24px)" }}
          >
            <motion.div
              className="w-full origin-top"
              style={{
                height: lineHeight,
                background: "linear-gradient(to bottom, #5BB8FF 0%, #1A6FD4 100%)",
                boxShadow: "0 0 6px rgba(91,184,255,0.5)",
              }}
            />
          </div>

          {/* ── START IMAGE ── */}
          <div
            className="relative z-20 flex justify-start ml-[-16px] md:justify-center md:ml-0 pb-8 -mt-4"
          >
            <StartImage scrollYProgress={scrollYProgress} />
          </div>

          {/* ── EVENT ROWS ── */}
          {events.map((event, index) => (
            <EventRow key={event.id} event={event} index={index} smx={smx} smy={smy} />
          ))}

          {/* ── END IMAGE ── pushed down; cover strip blocks line below image center ── */}
          <div className="relative z-20 flex justify-start ml-[-16px] md:justify-center md:ml-0" style={{ paddingTop: 24 }}>
            {/* Downward cover: blocks the rail that bleeds below the center */}
            <div
              className="absolute left-6 md:left-1/2 -translate-x-1/2"
              style={{
                top: "50%",
                width: 6,
                height: "200px",
                background: "#010814",
                zIndex: 1,
              }}
            />
            <EndImage scrollYProgress={scrollYProgress} />
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
