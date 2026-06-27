"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Timeline volumetric energy.
 *
 * A dense, underwater-style drift of light motes that orbit the central axis in
 * 3D and fall downward. To read as a real luminous volume rather than flat dots
 * it layers several effects:
 *   - a soft breathing haze column the particles live inside (light scattering)
 *   - depth-of-field: far/back motes use a diffuse, blurred sprite; near ones a
 *     sharp one — with size & brightness also scaled by depth
 *   - colour-temperature variation: a mix of white-hot and cool-blue motes
 *   - motion trails: a short streak along each mote's path so flow + orbit read
 *   - a scroll-driven energy front (dim below, bright above) with a glowing head
 *
 * Optimised: a few pre-rendered glow sprites blitted with additive compositing,
 * capped DPR, paused off-screen, static under reduced motion.
 */

type Particle = {
  theta: number;
  r: number;
  x: number;
  y: number;
  vy: number;
  rot: number;
  size: number;
  tint: number; // 0 = white-hot, 1 = cool blue
};

const TOP = 20;
const TWO_PI = Math.PI * 2;

function makeSprite(stops: [number, string][], size = 96) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const [o, col] of stops) grad.addColorStop(o, col);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(size / 2, size / 2, size / 2, 0, TWO_PI);
    g.fill();
  }
  return c;
}

export default function TimelineRod({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Sharp warm-white, sharp cool-blue, and a diffuse haze sprite for far DoF.
    const spriteWhite = makeSprite([
      [0, "rgba(255,255,255,0.95)"],
      [0.28, "rgba(210,240,255,0.55)"],
      [0.65, "rgba(120,200,255,0.16)"],
      [1, "rgba(91,184,255,0)"],
    ]);
    const spriteBlue = makeSprite([
      [0, "rgba(196,226,255,0.9)"],
      [0.3, "rgba(91,160,255,0.45)"],
      [0.7, "rgba(40,110,210,0.14)"],
      [1, "rgba(26,90,200,0)"],
    ]);
    const spriteHaze = makeSprite([
      [0, "rgba(150,205,255,0.5)"],
      [0.5, "rgba(91,165,255,0.12)"],
      [1, "rgba(91,165,255,0)"],
    ]);

    let W = 0;
    let H = 0;
    let cx = 0;
    let rMax = 70;
    let startY = TOP;
    let endY = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;

    const initParticles = (count: number) => {
      particles = [];
      const span = Math.max(1, endY - startY);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * TWO_PI;
        const r = rMax * (0.12 + Math.random() * 0.88);
        const y = startY + Math.random() * span;
        const x = cx + Math.cos(theta) * r;
        particles.push({
          theta,
          r,
          x,
          y,
          vy: 0.25 + Math.random() * 1.2,
          rot: (0.003 + Math.random() * 0.009) * (Math.random() < 0.8 ? 1 : -1),
          size: 3 + Math.random() * 34,
          tint: Math.random() < 0.4 ? 1 : 0,
        });
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      cx = W / 2;
      rMax = mobile ? 64 : Math.min(150, W * 0.11);
      // Anchor the energy between the start orb and the end orb.
      const sEl = parent.querySelector<HTMLElement>("[data-tl-start]");
      const eEl = parent.querySelector<HTMLElement>("[data-tl-end]");
      startY = sEl ? sEl.offsetTop + sEl.offsetHeight / 2 : TOP;
      endY = eEl ? eEl.offsetTop + eEl.offsetHeight / 2 : H;
      initParticles(Math.min(540, Math.max(90, Math.round((endY - startY) * (mobile ? 0.08 : 0.14)))));
    };

    const drawHaze = (frontY: number, t: number) => {
      const breathe = 0.55 + 0.45 * Math.sin(t * 0.0011);
      const hazeW = rMax * 2.4;
      // energised portion — brighter, breathing
      const eg = ctx.createLinearGradient(cx - hazeW / 2, 0, cx + hazeW / 2, 0);
      eg.addColorStop(0, "rgba(46,124,214,0)");
      eg.addColorStop(0.5, `rgba(70,150,235,${0.05 + 0.045 * breathe})`);
      eg.addColorStop(1, "rgba(46,124,214,0)");
      ctx.fillStyle = eg;
      ctx.fillRect(cx - hazeW / 2, startY, hazeW, Math.max(0, frontY - startY));
      // dormant portion — faint
      const dg = ctx.createLinearGradient(cx - hazeW / 2, 0, cx + hazeW / 2, 0);
      dg.addColorStop(0, "rgba(46,124,214,0)");
      dg.addColorStop(0.5, "rgba(60,130,220,0.02)");
      dg.addColorStop(1, "rgba(46,124,214,0)");
      ctx.fillStyle = dg;
      ctx.fillRect(cx - hazeW / 2, frontY, hazeW, Math.max(0, endY - frontY));
    };

    // Slim central energy line the motes orbit around — fills as you scroll.
    const drawCenterLine = (frontY: number) => {
      // dormant track (start → end)
      ctx.fillStyle = "rgba(120,180,255,0.06)";
      ctx.fillRect(cx - 0.75, startY, 1.5, Math.max(0, endY - startY));
      // energised glow + core (start → front)
      const h = Math.max(0, frontY - startY);
      const glow = ctx.createLinearGradient(cx - 5, 0, cx + 5, 0);
      glow.addColorStop(0, "rgba(91,184,255,0)");
      glow.addColorStop(0.5, "rgba(120,200,255,0.22)");
      glow.addColorStop(1, "rgba(91,184,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - 5, startY, 10, h);
      ctx.fillStyle = "rgba(238,248,255,0.85)";
      ctx.fillRect(cx - 0.9, startY, 1.8, h);
    };

    const drawHead = (frontY: number, t: number) => {
      const pulse = 0.62 + 0.38 * Math.sin(t * 0.006);
      const s = 46 * pulse + 26;
      ctx.globalAlpha = 0.9;
      ctx.drawImage(spriteWhite, cx - s / 2, frontY - s / 2, s, s);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(cx, frontY, 2.6, 0, TWO_PI);
      ctx.fill();
    };

    const step = (frontY: number, t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      drawHaze(frontY, t);
      drawCenterLine(frontY);

      const span = Math.max(1, endY - startY);
      for (const p of particles) {
        const prevX = p.x;
        const prevY = p.y;
        if (!reduced) {
          p.theta += p.rot;
          p.y += p.vy;
          if (p.y > endY) p.y -= span;
        }
        const depth = Math.sin(p.theta); // -1 back .. 1 front
        const ds = (depth + 1) / 2;
        p.x = cx + Math.cos(p.theta) * p.r;
        const s = p.size * (0.5 + ds * 0.9);
        const energised = p.y < frontY ? 1 : 0.18;

        // Motion trail (skip across the wrap jump)
        if (!reduced && Math.abs(p.y - prevY) < 40) {
          ctx.strokeStyle = `rgba(170,212,255,${0.1 * ds * energised})`;
          ctx.lineWidth = Math.max(1, s * 0.1);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        // Depth-of-field: far/back motes use the diffuse, blurred sprite
        const sprite = ds < 0.42 ? spriteHaze : p.tint ? spriteBlue : spriteWhite;
        ctx.globalAlpha = (0.08 + 0.46 * ds) * energised;
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      drawHead(frontY, t);
      ctx.globalCompositeOperation = "source-over";
    };

    const render = (t: number) => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      const p = Math.min(1, Math.max(0, progress.get()));
      step(startY + p * (endY - startY), t);
    };

    const renderStatic = () => {
      const p = Math.min(1, Math.max(0, progress.get()));
      step(startY + p * (endY - startY), 0);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) renderStatic();
    });
    ro.observe(parent);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let unsub = () => {};
    if (reduced) {
      renderStatic();
      unsub = progress.on("change", renderStatic);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      unsub();
    };
  }, [progress]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true" />;
}
