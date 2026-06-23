"use client";

export default function AmbassadorSection() {
  return (
    <section id="ambassadors" className="relative w-full bg-[#010814] pt-10 pb-10 md:pt-20 md:pb-20 overflow-hidden z-10">
      {/* Seamless top blend */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none" 
        style={{ background: "linear-gradient(to bottom, #010814, transparent)" }} 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left: Content & Integrated Description */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1] text-center lg:text-left">
              The hackX 11.0 <br className="hidden lg:block" /> Ambassador Network
            </h2>
            <div className="text-[1.05rem] text-white/60 font-light leading-relaxed mb-6 md:mb-10 max-w-xl text-center lg:text-left mx-auto lg:mx-0">
              <p>
                Become the official link between hackX 11.0 and your university. As a hackX Ambassador, you&apos;ll promote Sri Lanka&apos;s premier inter-university startup challenge on your campus, share competition updates, encourage students to participate, connect the organizing committee with student communities, and gain official recognition, exclusive learning and networking opportunities, certificates, and exciting rewards.
              </p>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <a 
                href={process.env.NEXT_PUBLIC_AMBASSADOR_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#1A6FD4] to-[#5BB8FF] text-white font-bold tracking-wide hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(91,184,255,0.3)] hover:shadow-[0_0_30px_rgba(91,184,255,0.5)]"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right: Ambassador Image with Hover Glow */}
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center min-h-[400px] relative group">
            {/* Background glowing aura */}
            <div className="absolute w-[80%] h-[80%] bg-[#5BB8FF]/5 group-hover:bg-[#5BB8FF]/15 rounded-full blur-[80px] transition-colors duration-700 pointer-events-none" />
            
            <div className="relative w-full max-w-[480px] aspect-[4/3] z-10 transition-transform duration-500 group-hover:scale-[1.02]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/Ambassador image.png"
                alt="hackX Ambassador" 
                className="w-full h-full object-contain rounded-3xl transition-transform duration-700 scale-90 group-hover:scale-95"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
