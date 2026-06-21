"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { PixelCanvas } from "@/components/ui/pixel-canvas";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const prizes = [
  {
    rank: "1st",
    label: "Grand Champions",
    tagline: "The pinnacle. National recognition, investor access, and a prize that matches the ambition.",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.18)",
    imageUrl: "/winner-cards/1.webp",
    pixelColors: ["#FFD700", "#FFF3A0", "#D4A800", "#FFEA50"],
    size: "large",
  },
  {
    rank: "2nd",
    label: "Runners-Up",
    tagline: "Second on stage. First in line for what comes next.",
    accent: "#C0C8D8",
    glow: "rgba(192,200,216,0.14)",
    imageUrl: "/winner-cards/2.webp",
    pixelColors: ["#C0C8D8", "#E8ECF4", "#9098A8", "#D8DDE8"],
    size: "medium",
  },
  {
    rank: "3rd",
    label: "Third Place",
    tagline: "The podium is proof. Your idea earned its place on a national stage.",
    accent: "#CD8B4A",
    glow: "rgba(205,139,74,0.14)",
    imageUrl: "/winner-cards/3.webp",
    pixelColors: ["#CD7F32", "#E8A060", "#A05828", "#D4944A"],
    size: "medium",
  },
];

export default function PrizesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#010814] pt-10 pb-10 md:py-20 overflow-hidden z-10">

      {/* Ambient deep glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(91,184,255,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span {...fade(0)} className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#5BB8FF] mb-5">
            What You Win
          </motion.span>
          <motion.h2
            {...fade(0.08)}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6"
          >
            Built for Builders.<br className="hidden md:block" /> Rewarded Like Champions.
          </motion.h2>
          <motion.p {...fade(0.16)} className="text-lg text-white/50 font-light max-w-xl mx-auto leading-relaxed text-center">
            Three podium spots. Real prizes. Real investor exposure. And recognition on Sri Lanka&apos;s biggest student innovation stage.
          </motion.p>
        </div>

        {/* Prize Cards — Dynamic Order: 1st | 2nd | 3rd on mobile (via order-x), 2nd | 1st | 3rd on desktop */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">
          {[prizes[0], prizes[1], prizes[2]].map((prize, visualIdx) => {
            const isFirst = prize.size === "large";
            const orderClass = 
              prize.rank === "1st" ? "order-1 md:order-2" :
              prize.rank === "2nd" ? "order-2 md:order-1" :
              "order-3 md:order-3";

            return (
              <motion.div
                key={prize.rank}
                {...fade(0.1 + visualIdx * 0.1)}
                className={`w-full md:w-[330px] relative group flex flex-col ${orderClass}`}
                style={{ alignSelf: "stretch" }}
              >
              <div
                  className="relative overflow-hidden rounded-3xl h-full flex flex-col justify-between p-6 md:p-8 flex-1 group-hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(145deg, #031126 0%, #010610 100%)",
                    backdropFilter: "blur(32px) saturate(1.6)",
                    WebkitBackdropFilter: "blur(32px) saturate(1.6)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    minHeight: isFirst ? "440px" : "380px",
                    transition: "box-shadow 0.5s ease, border-color 0.5s ease, transform 0.5s ease",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = `0 0 0 1px ${prize.accent}35, 0 0 28px ${prize.accent}22, 0 0 64px ${prize.accent}0C`;
                    el.style.borderColor = `${prize.accent}35`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "none";
                    el.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                    {/* Pixel canvas — gold/silver/bronze on hover */}
                    <PixelCanvas
                      gap={12}
                      speed={28}
                      colors={prize.pixelColors}
                      style={{ opacity: 0.35 }}
                    />
                    <div>
                      {/* Badge icon — mix-blend-mode: multiply erases white bg over dark card */}
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3 + visualIdx, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-6 relative mx-auto md:mx-0"
                        style={{
                          width: isFirst ? 108 : 86,
                          height: isFirst ? 108 : 86,
                        }}
                      >
                        {/* Accent glow behind the icon */}
                        <div
                          className="absolute inset-0 rounded-full blur-2xl"
                          style={{
                            background: `radial-gradient(circle, ${prize.accent}40 0%, transparent 70%)`,
                            transform: "scale(1.2)",
                          }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prize.imageUrl}
                          alt={prize.label}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            mixBlendMode: "multiply",
                            filter: `drop-shadow(0 4px 16px ${prize.accent}60)`,
                            position: "relative",
                            zIndex: 1,
                          }}
                        />
                      </motion.div>

                      {/* Rank */}
                      <div
                        className="font-extrabold tracking-tight mb-2 leading-none text-center md:text-left"
                        style={{
                          fontSize: isFirst ? "3.5rem" : "2.75rem",
                          background: `linear-gradient(135deg, ${prize.accent} 0%, rgba(255,255,255,0.75) 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {prize.rank}
                      </div>

                      <p className="text-white font-bold text-lg mb-3 tracking-tight text-center md:text-left">{prize.label}</p>
                      <p className="text-white/45 font-light text-sm leading-relaxed text-center md:text-left">{prize.tagline}</p>
                    </div>


                    <div
                      className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
                      style={{ background: `radial-gradient(circle at bottom right, ${prize.glow} 0%, transparent 70%)` }}
                    />
                  </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note */}
        <motion.p {...fade(0.5)} className="text-center text-white/30 text-xs mt-12 tracking-wide">
          Plus: Mentorship access · Investor introductions · National media coverage · hackX Digital Certificate
        </motion.p>
      </div>

      {/* Seamless blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #010814)" }}
      />
    </section>
  );
}
