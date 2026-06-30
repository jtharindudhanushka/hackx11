"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const memories = [
  {
    src: "/Memories/Expert%20Deliberation.webp",
    title: "Expert Deliberation",
    description: "Judges evaluating ideas with insight"
  },
  {
    src: "/Memories/Focused%20Audience.webp",
    title: "Focused Audience",
    description: "Engaged minds absorbing every presentation"
  },
  {
    src: "/Memories/Team%20Showcase.webp",
    title: "Team Showcase",
    description: "Confident innovators ready to make an impact"
  },
  {
    src: "/Memories/Prize%20Presentation.webp",
    title: "Prize Presentation",
    description: "Celebrating innovation and outstanding achievement"
  },
  {
    src: "/Memories/The%20Team.webp",
    title: "The Team",
    description: "The team behind hackX National Hackathon Series 2025"
  }
];

const MemoryCard = ({ memory, idx, activeIndex, isMobile, cardRef }: any) => {
  const isCenterActive = isMobile && activeIndex === idx;

  return (
    <div 
      ref={cardRef}
      className={`relative w-[280px] h-[300px] md:w-[450px] md:h-[400px] rounded-3xl overflow-hidden shrink-0 border border-white/5 shadow-xl group cursor-pointer`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#010814] via-transparent to-transparent opacity-80 z-10 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
      
      <img 
        src={memory.src} 
        alt={memory.title} 
        className={`w-full h-full object-cover transition-all duration-700 ${isCenterActive ? 'grayscale-0 scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'}`}
      />

      <div className={`absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 transition-all duration-300 bg-gradient-to-t from-[#010814]/90 via-transparent to-transparent ${isCenterActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0'}`}>
        <h3 className="text-xl font-extrabold text-white mb-1.5">{memory.title}</h3>
        <p className="text-white/70 text-xs md:text-sm font-light leading-relaxed">
          {memory.description}
        </p>
      </div>
    </div>
  );
};

export default function MemoriesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setActiveIndex(null);
      return;
    }

    let animationFrameId: number;
    const checkCenter = () => {
      const centerX = window.innerWidth / 2;
      let closestIdx = -1;
      let minDistance = Infinity;

      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Skip elements completely out of horizontal view to avoid edge cases
        if (rect.right < 0 || rect.left > window.innerWidth) return;
        
        const elCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - elCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = index;
        }
      });

      setActiveIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
      animationFrameId = requestAnimationFrame(checkCenter);
    };

    animationFrameId = requestAnimationFrame(checkCenter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMobile]);

  return (
    <section id="memories" className="relative w-full bg-[#010814] pt-12 pb-10 md:py-20 overflow-hidden z-10">
      {/* Seamless top blend */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, #010814, transparent)" }} />
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10 mb-10 md:mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Moments of Innovation
          </h2>
          <p className="text-lg text-white/60 font-light max-w-3xl mx-auto text-center">
            Experience the highlights, energy, and unforgettable moments that have defined hackX over the years.
          </p>
        </motion.div>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden flex items-center bg-[#010814] marquee-container">
        {/* Shadow overlays for smooth fade on edges */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#010814] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#010814] to-transparent z-20 pointer-events-none" />
        
        <div className="flex w-max animate-marquee">
          
          <div className="flex gap-4 md:gap-6 px-2 md:px-3">
            {memories.map((memory, idx) => (
              <MemoryCard 
                key={`set1-${idx}`} 
                memory={memory} 
                idx={idx} 
                activeIndex={activeIndex} 
                isMobile={isMobile}
                cardRef={(el: HTMLDivElement) => { cardRefs.current[idx] = el; }} 
              />
            ))}
          </div>

          <div className="flex gap-4 md:gap-6 px-2 md:px-3">
            {memories.map((memory, idx) => (
              <MemoryCard 
                key={`set2-${idx}`} 
                memory={memory} 
                idx={idx + memories.length} 
                activeIndex={activeIndex} 
                isMobile={isMobile}
                cardRef={(el: HTMLDivElement) => { cardRefs.current[idx + memories.length] = el; }} 
              />
            ))}
          </div>

        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-10 md:mt-12 text-center relative z-10">
        <p className="text-xl text-white font-medium mb-8">
          Every name on that list started with one idea. What is yours?
        </p>
        <a
          href={process.env.NEXT_PUBLIC_REGISTRATION_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Register Now
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .marquee-container:hover .animate-marquee,
        .marquee-container:active .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
