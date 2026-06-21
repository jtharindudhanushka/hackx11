"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useState, useRef } from "react";
import { PixelCanvas } from "@/components/ui/pixel-canvas";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const StatCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    {...fade(delay)}
    className={`relative overflow-hidden rounded-3xl bg-[#041A3A]/20 backdrop-blur-[40px] border border-white/5 shadow-sm transition-all duration-500 hover:bg-[#041A3A]/35 hover:border-white/10 group ${className}`}
  >
    <PixelCanvas
      gap={10}
      speed={20}
      colors={["#1A6FD4", "#5BB8FF", "#0A3878"]}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/[0.03] group-hover:to-transparent transition-colors duration-500 pointer-events-none" />
    <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-8 text-center">{children}</div>
  </motion.div>
);

export default function NewSection2() {
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Mouse tracking hooks
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

  // Scroll tracking hooks
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scroll Parallax Transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [10, -20]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [-10, 30]);

  // Mouse Parallax Transforms
  const mx1 = useTransform(smx, [-1, 1], [-25, 25]);
  const my1 = useTransform(smy, [-1, 1], [-25, 25]);
  const mx2 = useTransform(smx, [-1, 1], [30, -30]);
  const my2 = useTransform(smy, [-1, 1], [30, -30]);
  const mx3 = useTransform(smx, [-1, 1], [-40, 40]);
  const my3 = useTransform(smy, [-1, 1], [-40, 40]);

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#010814] pt-12 md:pt-28 pb-0 overflow-hidden z-10"
    >
      {/* Ambient blobs - Optimized without CSS blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(26,111,212,0.15) 0%, rgba(26,111,212,0) 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -60, 60, 0], y: [0, 60, -60, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(91,184,255,0.1) 0%, rgba(91,184,255,0) 70%)" }}
        />
      </div>

      {/* Floating 3D Artifact Images */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-20">
        
        {/* Top Left (Cylinder) */}
        <motion.div 
          style={{ y: y1, rotate: rotate1 }} 
          className="absolute top-[2%] left-[42%] w-[250px] xl:w-[350px] opacity-90 hidden md:block"
        >
          <motion.img 
            src="/section 2/Top left.webp" 
            alt="Artifact" 
            style={{ x: mx1, y: my1 }}
            className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Top Right (Pillar) */}
        <motion.div 
          style={{ y: y2, rotate: rotate2 }} 
          className="absolute top-[5%] -right-[2%] xl:-right-[5%] w-[220px] xl:w-[320px] opacity-90 hidden md:block"
        >
          <motion.img 
            src="/section 2/Top Right.webp" 
            alt="Artifact" 
            style={{ x: mx2, y: my2 }}
            className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Bottom Center (Brick) */}
        <motion.div 
          style={{ y: y3, rotate: rotate3 }} 
          className="absolute top-[35%] left-[60%] w-[280px] xl:w-[400px] opacity-90 hidden md:block"
        >
          <motion.img 
            src="/section 2/Bottom Center.webp" 
            alt="Artifact" 
            style={{ x: mx3, y: my3 }}
            className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-50">
        {/* Eyebrow */}
        <motion.div {...fade(0)} className="flex justify-center md:justify-start mb-8 md:mb-16">
          <div className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#5BB8FF] animate-pulse shadow-[0_0_10px_#5BB8FF]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">
              What is hackX?
            </span>
          </div>
        </motion.div>

        {/* ── Two-Column Layout: Left = Narrative, Right = Bento Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">

          {/* LEFT — Narrative */}
          <div className="md:col-span-6 flex flex-col space-y-8 md:pt-4">
            <motion.h2
              {...fade(0.05)}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05] text-center md:text-left"
            >
              More Than a<br className="hidden md:block" /> Hackathon.
            </motion.h2>

            <motion.div {...fade(0.15)} className="space-y-6 text-[1.05rem] md:text-[1.15rem] text-white/55 font-light leading-relaxed relative z-30 text-center md:text-left">
              <p>
                hackX 11.0 is Sri Lanka&apos;s premier inter-university startup challenge, organized by the Industrial
                Management Science Students&apos; Association at the Department of Industrial Management,
                University of Kelaniya.
              </p>
              <p>
                hackX provides a platform for undergraduate students to work in teams and transform real-world problems into innovative solutions with startup potential. Whether it is a product, service, or technology-driven solution, participants will receive guidance, mentorship, and industry exposure through multiple phases of the competition to help develop, validate, and refine their ideas into viable business ventures.
              </p>
            </motion.div>

            <motion.div {...fade(0.25)} className="relative z-30 flex justify-center md:justify-start">
              <button className="btn-primary">
                Delegate Booklet
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* RIGHT — Bento Stats Grid */}
          <div className="md:col-span-6 grid grid-cols-2 gap-5 relative z-30">
            {/* Stat: 11 Editions */}
            <StatCard className="col-span-1 min-h-[200px]" delay={0.1}>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">11</div>
              <p className="text-white/75 font-medium tracking-wide text-sm">Editions</p>
              <p className="text-[10px] text-white/35 mt-1 uppercase tracking-widest">More Than a Decade of Innovation</p>
            </StatCard>

            {/* Stat: 25+ Universities */}
            <StatCard className="col-span-1 min-h-[200px]" delay={0.18}>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">25+</div>
              <p className="text-white/75 font-medium tracking-wide text-sm">Universities</p>
              <p className="text-[10px] text-white/35 mt-1 uppercase tracking-widest">Represented Nationwide</p>
            </StatCard>

            {/* Stat: 265+ Teams — spans full width */}
            <StatCard className="col-span-2 min-h-[220px]" delay={0.26}>
              <div
                className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #5BB8FF 0%, #ffffff 60%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 18px rgba(91,184,255,0.35))",
                }}
              >
                265+
              </div>
              <p className="text-white/75 font-medium text-lg tracking-wide">Teams Participating</p>
              <p className="text-xs text-white/35 mt-1 uppercase tracking-widest">Registered in 2025</p>
            </StatCard>
          </div>
        </div>

        {/* ── Video Player ── */}
        <motion.div
          {...fade(0.2)}
          className="w-full mt-16 md:mt-24 relative z-50"
        >
          {/* Label */}
          <motion.p {...fade(0.1)} className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6 text-center">
            Watch — hackX 10.0 Grand Finals
          </motion.p>

          <div className="relative w-full rounded-[2rem] p-[1px] group">
            {/* Animated shimmer border */}
            <div
              className="absolute inset-0 rounded-[2rem] opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, rgba(91,184,255,0) 0%, rgba(91,184,255,0.7) 50%, rgba(91,184,255,0) 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmerBorder 3s linear infinite",
              }}
            />
            {/* Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-[#5BB8FF] opacity-[0.06] blur-2xl pointer-events-none group-hover:opacity-[0.12] transition-opacity duration-700" />

            {/* Frame */}
            <div className="relative rounded-[2rem] bg-[#010814]/90 p-3 md:p-5 border border-white/5">
              <div className="aspect-video w-full rounded-[1.25rem] overflow-hidden bg-black relative border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                {isPlaying ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/JSFG-IE8n_c?autoplay=1&modestbranding=1&rel=0&color=white"
                    title="hackX Previous Year Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                  />
                ) : (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 w-full h-full group/btn flex items-center justify-center overflow-hidden"
                    aria-label="Play video"
                  >
                    {/* Thumbnail Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://img.youtube.com/vi/JSFG-IE8n_c/maxresdefault.jpg"
                      alt="hackX Grand Finals Thumbnail"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-100 group-hover/btn:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 transition-opacity duration-500 group-hover/btn:opacity-90" />
                    
                    {/* Play Button Icon */}
                    <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:bg-[#5BB8FF]/20 group-hover/btn:border-[#5BB8FF]/40 shadow-lg shadow-black/40">
                      <svg
                        className="w-8 h-8 fill-current transition-transform duration-300 group-hover/btn:scale-105"
                        viewBox="0 0 24 24"
                      >
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                      {/* Glow ripple effect */}
                      <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover/btn:animate-ping group-hover/btn:opacity-100 duration-1000" />
                    </div>
                  </button>
                )}
              </div>
            </div>

            <style>{`
              @keyframes shimmerBorder {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `}</style>
          </div>
        </motion.div>
      </div>

      {/* Seamless bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 md:h-48 pointer-events-none z-40"
        style={{ background: "linear-gradient(to bottom, transparent, #010814)" }}
      />
    </section>
  );
}
