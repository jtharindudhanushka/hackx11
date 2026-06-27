"use client";

/**
 * Premium animated download icon.
 *
 * Idle: the arrow rests inside an open tray.
 * On hover of the closest `.group` ancestor (e.g. the button), the arrow
 * performs a smooth "downloading" loop — sliding down through the tray while a
 * fresh arrow eases in from above — and the tray base draws a subtle pulse.
 *
 * Animation is driven by scoped CSS so it couples to the parent button's hover
 * without any JS/state. Honours `prefers-reduced-motion`.
 */
export default function AnimatedDownloadIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`dl-icon ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="dl-icon__svg">
        {/* Tray — the open box that catches the file */}
        <path
          className="dl-icon__tray"
          d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrow — shaft + head, animated as a group */}
        <g className="dl-icon__arrow">
          <line
            x1="12"
            y1="3.5"
            x2="12"
            y2="13.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M7.5 9.5 12 14l4.5-4.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </span>
  );
}
