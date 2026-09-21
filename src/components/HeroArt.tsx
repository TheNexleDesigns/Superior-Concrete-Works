import { balusterPath } from "@/lib/art";

/** Balustrade elevation used as the hero backdrop. Loads instantly and stays sharp if the video is missing or slow. */
export function HeroArt() {
  const count = 11;
  const s = 1.28;
  const floorY = 792;
  const top = floorY - 410 * s;
  const xs = Array.from({ length: count }, (_, i) => 60 + i * 148);
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden focusable={false}>
      <defs>
        <linearGradient id="h-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f3d3a" />
          <stop offset="1" stopColor="#2c2b29" />
        </linearGradient>
        <radialGradient id="h-light" cx="0.82" cy="0.18" r="0.75">
          <stop offset="0" stopColor="#c9a27a" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#c9a27a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#c9a27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h-cyl" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#4a4743" />
          <stop offset="0.3" stopColor="#8a857b" />
          <stop offset="0.55" stopColor="#b6b1a5" />
          <stop offset="0.82" stopColor="#6e6a62" />
          <stop offset="1" stopColor="#3b3936" />
        </linearGradient>
        <linearGradient id="h-rail" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a8a397" />
          <stop offset="0.4" stopColor="#7d786e" />
          <stop offset="1" stopColor="#4a4743" />
        </linearGradient>
        <linearGradient id="h-floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4d4a46" />
          <stop offset="1" stopColor="#262523" />
        </linearGradient>
        <filter id="h-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.34 0" result="na" />
          <feComposite in="na" in2="SourceGraphic" operator="in" result="ng" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="ng" /></feMerge>
        </filter>
        <filter id="h-soft"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <rect width="1600" height="900" fill="url(#h-wall)" />
      <rect width="1600" height="900" fill="url(#h-light)" />
      <rect y={floorY + 44} width="1600" height="900" fill="url(#h-floor)" />
      {/* soft shadows on the floor */}
      <g filter="url(#h-soft)" opacity="0.55">
        {xs.map((cx) => (
          <ellipse key={`s${cx}`} cx={cx - 34} cy={floorY + 58} rx="62" ry="9" fill="#111" />
        ))}
      </g>
      <g filter="url(#h-grain)">
        <rect x="-20" y={top - 46} width="1640" height="44" fill="url(#h-rail)" />
        <rect x="-20" y={top - 2} width="1640" height="14" fill="#3b3936" />
        {xs.map((cx, i) => (
          <path key={cx} className="hb" style={{ ["--i" as string]: i }} d={balusterPath(cx, top + 10, s * 0.97)} fill="url(#h-cyl)" />
        ))}
        <rect x="-20" y={floorY} width="1640" height="46" fill="url(#h-rail)" />
      </g>
    </svg>
  );
}
