"use client";

import React, { useEffect, useRef } from "react";

export interface InteractiveGridBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  gridSize?: number;
  gridColor?: string;
  effectColor?: string;
  trailLength?: number;
  idleSpeed?: number;
  glow?: boolean;
  glowRadius?: number;
  children?: React.ReactNode;
  idleRandomCount?: number;
}

const InteractiveGridBackground: React.FC<InteractiveGridBackgroundProps> = ({
  gridSize = 24,
  gridColor = "rgba(255, 255, 255, 0.05)",
  effectColor = "rgba(91, 184, 255, 0.6)",
  trailLength = 4,
  idleSpeed = 0.5,
  glow = true,
  glowRadius = 15,
  children,
  idleRandomCount = 2,
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const idleTargetsRef = useRef<{ x: number; y: number }[]>([]);
  const idlePositionsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseActiveRef = useRef(false);
  const lastMouseTimeRef = useRef(Date.now());
  const isVisibleRef = useRef(false); // Performance optimization

  // Intersection Observer to pause rendering when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Mouse tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      // Check if mouse is actually inside this specific card
      if (rawX < 0 || rawY < 0 || rawX > rect.width || rawY > rect.height) {
        mouseActiveRef.current = false;
        return;
      }

      mouseActiveRef.current = true;
      lastMouseTimeRef.current = Date.now();

      const snappedX = Math.floor(rawX / gridSize);
      const snappedY = Math.floor(rawY / gridSize);

      const last = trailRef.current[0];
      if (!last || last.x !== snappedX || last.y !== snappedY) {
        trailRef.current.unshift({ x: snappedX, y: snappedY });
        if (trailRef.current.length > trailLength) trailRef.current.pop();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [gridSize, trailLength]);

  // Drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let canvasWidth = container.clientWidth;
    let canvasHeight = container.clientHeight;

    // Handle resize dynamically for cards
    const resizeObserver = new ResizeObserver(() => {
      canvasWidth = container.clientWidth;
      canvasHeight = container.clientHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    });
    resizeObserver.observe(container);

    let animationFrameId: number;

    const draw = () => {
      if (!isVisibleRef.current) {
        // Skip heavy canvas drawing if the card is off-screen!
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      const cols = Math.floor(canvasWidth / gridSize);
      const rows = Math.floor(canvasHeight / gridSize);

      // Initialize idle positions lazily based on actual card size
      if (idleTargetsRef.current.length === 0 && cols > 0) {
        const marginX = Math.max(1, Math.floor(cols * 0.2));
        const marginY = Math.max(1, Math.floor(rows * 0.2));
        const innerCols = Math.max(1, cols - marginX * 2);
        const innerRows = Math.max(1, rows - marginY * 2);
        
        idleTargetsRef.current = Array.from({ length: idleRandomCount }, () => ({
          x: marginX + Math.floor(Math.random() * innerCols),
          y: marginY + Math.floor(Math.random() * innerRows),
        }));
        idlePositionsRef.current = idleTargetsRef.current.map((p) => ({ ...p }));
      }

      // Idle logic
      const idleThreshold = 500;
      if (Date.now() - lastMouseTimeRef.current > idleThreshold || !mouseActiveRef.current) {
        mouseActiveRef.current = false;

        // Standard smooth wandering idle animation constrained to the center
        idlePositionsRef.current.forEach((pos, i) => {
          const target = idleTargetsRef.current[i];
          const dx = target.x - pos.x;
          const dy = target.y - pos.y;

          if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            const marginX = Math.max(1, Math.floor(cols * 0.15));
            const marginY = Math.max(1, Math.floor(rows * 0.15));
            const innerCols = Math.max(1, cols - marginX * 2);
            const innerRows = Math.max(1, rows - marginY * 2);
            
            idleTargetsRef.current[i] = {
              x: marginX + Math.floor(Math.random() * innerCols),
              y: marginY + Math.floor(Math.random() * innerRows),
            };
          } else {
            // Using a very small multiplier (0.02) makes the movement extremely smooth and minimal
            pos.x += dx * 0.02;
            pos.y += dy * 0.02;
          }

          const roundedX = Math.round(pos.x);
          const roundedY = Math.round(pos.y);
          const last = trailRef.current[0];
          if (!last || last.x !== roundedX || last.y !== roundedY) {
            trailRef.current.unshift({ x: roundedX, y: roundedY });
            if (trailRef.current.length > trailLength * idleRandomCount) {
              trailRef.current.pop();
            }
          }
        });
      }

      // Draw active cells
      trailRef.current.forEach((cell, idx) => {
        const alpha = Math.max(0, 1 - idx * (1 / trailLength));
        const rgbaColor = effectColor.replace(/[\d.]+\)$/g, `${alpha})`);

        ctx.fillStyle = rgbaColor;
        if (glow) {
          ctx.shadowColor = rgbaColor;
          ctx.shadowBlur = glowRadius;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [gridSize, effectColor, trailLength, idleSpeed, glow, glowRadius, idleRandomCount]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={{ width: "100%", height: "100%" }} {...props}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      <div className="relative z-10 w-full h-full pointer-events-none">{children}</div>
    </div>
  );
};

export default InteractiveGridBackground;
