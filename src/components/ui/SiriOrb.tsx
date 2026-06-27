"use client";

/**
 * Siri-like live gradient orb.
 *
 * A circular badge with a slowly rotating multi-colour conic wash, a drifting
 * "liquid" highlight blob, and a glossy sheen — giving the impression of a
 * living, breathing assistant indicator. Pure CSS, honours reduced-motion.
 */
export default function SiriOrb({
  size = 34,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`siri-orb ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="siri-orb__blob" />
      <span className="siri-orb__gloss" />
    </span>
  );
}
