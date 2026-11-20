"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";

// ── Event config ──────────────────────────────────────────────
const HIDE_AFTER = new Date("2026-12-31T23:59:59+05:30").getTime();
const SHOW_DELAY_MS = 2600; // preloader (1.5s) + a beat of hero
const SEEN_KEY = "hackx11-champions-seen";
const SLIDE_MS = 5000; // time each winner photo stays on screen
const ALBUM_URL =
  "https://www.xtreamyouth.com/events/community/university-of-kelaniya/hackx-national-hackathon-series-2026-grand-finals/";
const TRACK = "hackX 11.0";
const WINNERS = [
  { place: 1, photo: "/winners/place-1.webp", label: "1st Place", team: "Crisis Crew", from: "Sri Lanka Institute of Information Technology (SLIIT)" },
  { place: 2, photo: "/winners/place-2.webp", label: "2nd Place", team: "Vector 0", from: "University of Peradeniya" },
  { place: 3, photo: "/winners/place-3.webp", label: "3rd Place", team: "Division Zero", from: "University of Kelaniya" },
] as const;

// Title-sequence beats (ms on screen). After the last one, the final reveal holds.
const BEATS = [1100, 1300, 1100, 1300];
const EASE = [0.16, 1, 0.3, 1] as const;

/** Full-bleed winner photos, cross-fading with a slow push-in. */
function WinnerSlides({ show, index }: { show: boolean; index: number }) {
  return (
    <motion.div
      className="gf-video"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {WINNERS.map((w, i) => (
        <motion.img
          key={w.photo}
          src={w.photo}
          alt=""
          className="gf-slide"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.08 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: i === index ? SLIDE_MS / 1000 + 1.2 : 1.2, ease: "linear" },
          }}
        />
      ))}
      <div className="gf-legibility" />
    </motion.div>
  );
}

/** Masked line reveal — transform-only, so nothing reflows. */
function Line({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="gf-mask">
      <motion.span
        className="gf-line"
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-105%", transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] } }}
        transition={{ duration: 0.7, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Beat({ lines, className }: { lines: React.ReactNode[]; className: string }) {
  return (
    <motion.div className={`gf-beat ${className}`} exit={{ transition: { duration: 0.35 } }}>
      {lines.map((l, i) => (
        <Line key={i} delay={i * 0.08}>
          {l}
        </Line>
      ))}
    </motion.div>
  );
}

export default function GrandFinalsPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const final = step >= BEATS.length;
  const [slide, setSlide] = useState(0);

  // Cycle the winner photos once the final reveal is up
  useEffect(() => {
    if (!open || !final || reduce) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % WINNERS.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [open, final, reduce]);

  useEffect(() => {
    if (Date.now() > HIDE_AFTER) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Advance the title sequence
  useEffect(() => {
    if (!open || final) return;
    if (reduce) {
      setStep(BEATS.length);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), BEATS[step]);
    return () => clearTimeout(t);
  }, [open, step, final, reduce]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }, []);

  // Lock scroll + Esc to close
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, close]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="gf"
          role="dialog"
          aria-modal="true"
          aria-label="hackX 11.0 Grand Finals — meet the champions"
          className="gf-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          transition={{ duration: 0.5 }}
        >
          <div className="gf-abyss" />

          <WinnerSlides show={final} index={slide} />

          {/* Cinematic letterbox */}
          <motion.div className="gf-bar gf-bar-top" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.7, ease: EASE }} />
          <motion.div className="gf-bar gf-bar-bot" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.7, ease: EASE }} />

          {/* Title beats */}
          <div className="gf-center">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <Beat key="b0" className="gf-kicker" lines={["Sri Lanka’s Premier"]} />
              )}
              {step === 1 && (
                <Beat key="b1" className="gf-headline" lines={["Inter-University", "Startup Challenge"]} />
              )}
              {step === 2 && (
                <motion.img
                  key="b2"
                  src="/hackxlogo.webp"
                  alt="hackX 11.0"
                  className="gf-logo-big"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              )}
              {step === 3 && (
                <Beat key="b3" className="gf-headline gf-huge" lines={["Meet the Champions"]} />
              )}
            </AnimatePresence>
          </div>

          {/* Final reveal */}
          {final && (
            <div className="gf-final">
              <motion.img src="/hackxlogo.webp" alt="hackX 11.0" className="gf-logo-sm" {...rise(0.05)} />
              <p className="gf-eyebrow">
                <Line delay={0.15}>The Grand Finals · 11 November 2026</Line>
              </p>
              <h2 className="gf-venue gf-congrats">
                <Line delay={0.25}>Congratulations!</Line>
              </h2>
              <motion.p className="gf-when" {...rise(0.45)}>
                To the {TRACK} champions, and to every team that made it to the finals.
              </motion.p>

              <motion.ol className="gf-podium" {...rise(0.58)}>
                {WINNERS.map((w, i) => (
                  <li key={w.place} className={`gf-winner gf-p${w.place}${i === slide ? " gf-on" : ""}`}>
                    <span className="gf-place">{w.label}</span>
                    <strong className="gf-team">{w.team}</strong>
                    <small className="gf-from">{w.from}</small>
                  </li>
                ))}
              </motion.ol>

              <motion.div className="gf-actions" {...rise(0.74)}>
                <a
                  href={ALBUM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full max-w-[260px] sm:w-[245px] h-[50px] px-5 flex items-center justify-center text-[14px] sm:text-[15px] font-semibold whitespace-nowrap gap-2 shrink-0"
                >
                  <span>View Photo Album</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
                <button className="gf-ghost" onClick={close}>
                  Explore the Site
                </button>
              </motion.div>
            </div>
          )}

          {!final && (
            <button className="gf-skip" onClick={() => setStep(BEATS.length)}>
              Skip
            </button>
          )}
          <button className="gf-close" onClick={close} aria-label="Close">
            ×
          </button>

          <style>{css}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const css = `
.gf-root{position:fixed;inset:0;z-index:9999;overflow:hidden;font-family:'TT Hoves Pro',system-ui,sans-serif;color:#fff;background:#010814}
.gf-abyss{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#061733 0%,#020b1c 55%,#010814 100%)}

.gf-video{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.gf-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 30%;will-change:opacity,transform}
.gf-legibility{position:absolute;inset:0;background:linear-gradient(180deg,rgba(1,8,20,.15) 0%,transparent 30%,rgba(1,8,20,.55) 62%,rgba(1,8,20,.92) 100%)}

.gf-bar{position:absolute;left:0;right:0;height:clamp(28px,7vh,72px);background:#000;z-index:3}
.gf-bar-top{top:0;transform-origin:top}
.gf-bar-bot{bottom:0;transform-origin:bottom}

.gf-center{position:absolute;inset:0;z-index:4;display:grid;place-items:center;padding:0 20px;text-align:center;pointer-events:none}
.gf-beat{display:flex;flex-direction:column;align-items:center;font-family:'TT Hoves Pro',system-ui,sans-serif;font-weight:600;line-height:1.05;letter-spacing:-0.02em;color:#fff}
.gf-mask{display:block;overflow:hidden;padding:.06em 0 .12em}
.gf-line{display:block;will-change:transform}
.gf-kicker{font-weight:300;font-size:clamp(1.6rem,4.5vw,3.4rem);color:rgba(255,255,255,.8)}
.gf-headline{font-size:clamp(2rem,7vw,5.6rem)}
.gf-huge{font-size:clamp(2.6rem,9vw,7.5rem)}
.gf-logo-big{width:clamp(200px,34vw,440px);height:auto}

.gf-final{position:absolute;left:0;right:0;bottom:clamp(40px,10vh,110px);z-index:4;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 20px}
.gf-logo-sm{width:clamp(96px,10vw,130px);height:auto;margin-bottom:12px}
.gf-eyebrow{margin:0 0 2px;font-size:clamp(14px,1.5vw,18px);font-weight:300;color:rgba(255,255,255,.75)}
.gf-venue{margin:0;font-family:'TT Hoves Pro',system-ui,sans-serif;font-weight:600;line-height:1;letter-spacing:-0.03em;
  font-size:clamp(3rem,10vw,8rem);color:#fff;text-shadow:0 6px 40px rgba(0,0,0,.5)}
.gf-when{margin:12px 0 20px;font-size:clamp(1rem,1.8vw,1.3rem);font-weight:400;color:rgba(255,255,255,.85)}
.gf-when span{color:#5BB8FF;margin:0 .4em}

.gf-skip{position:absolute;z-index:5;right:20px;bottom:calc(clamp(28px,7vh,72px) + 14px);padding:8px 18px;border-radius:999px;font-size:13px;
  color:rgba(255,255,255,.75);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);cursor:pointer}
.gf-close{position:absolute;z-index:5;top:calc(clamp(28px,7vh,72px) + 12px);right:16px;width:38px;height:38px;border-radius:50%;font-size:22px;line-height:1;color:#fff;
  background:rgba(1,8,20,.4);border:1px solid rgba(255,255,255,.2);cursor:pointer}
.gf-skip:hover,.gf-close:hover{background:rgba(255,255,255,.15)}

.gf-root{--gf-accent:#5BB8FF}
.gf-final{top:clamp(28px,7vh,72px);overflow-y:auto;scrollbar-width:none}
.gf-final>:first-child{margin-top:auto}
.gf-congrats{font-size:clamp(2rem,7vw,5.5rem)}
.gf-podium{list-style:none;margin:0 0 22px;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;width:min(100%,860px);align-items:end}
.gf-winner{display:flex;flex-direction:column;align-items:center;gap:4px;padding:16px 14px;border-radius:16px;background:rgba(1,8,20,.55);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.gf-p1{order:2;padding:22px 14px;border-color:var(--gf-accent);box-shadow:0 0 40px -12px var(--gf-accent)}
.gf-p2{order:1}.gf-p3{order:3}
.gf-winner{transition:border-color .5s,background .5s}
.gf-on{border-color:rgba(255,255,255,.55);background:rgba(1,8,20,.72)}
.gf-p1.gf-on{border-color:var(--gf-accent)}
.gf-place{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--gf-accent)}
.gf-team{font-size:clamp(1.05rem,1.6vw,1.35rem);font-weight:600;line-height:1.15}
.gf-p1 .gf-team{font-size:clamp(1.25rem,2vw,1.7rem)}
.gf-from{font-size:12px;line-height:1.35;color:rgba(255,255,255,.65)}
.gf-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center;width:100%}
.gf-ghost{height:50px;padding:0 22px;border-radius:999px;font-size:14px;font-weight:500;color:#fff;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.2);cursor:pointer}
.gf-ghost:hover{background:rgba(255,255,255,.14)}

@media (max-width:767px){
  .gf-final{bottom:calc(clamp(28px,7vh,72px) + 20px)}
  .gf-when{margin:10px 0 16px}
  .gf-podium{grid-template-columns:1fr;gap:8px;margin-bottom:16px}
  .gf-winner{flex-direction:row;flex-wrap:wrap;justify-content:center;column-gap:8px;row-gap:2px;padding:10px 12px}
  .gf-p1{order:0;padding:12px}.gf-p2,.gf-p3{order:0}
  .gf-from{width:100%}
  .gf-ghost{height:44px}
  .gf-logo-sm{width:84px;margin-bottom:6px}
}
`;
