import { balusterPath } from "@/lib/art";

type Tone = "light" | "dark";

/**
 * Vector stand-in shown until a product has a real photo.
 * Drawn objects only — no photos, nothing pretending to be a real installation.
 */
export function ProductArt({ category, tone = "light", uid = "a", title, tile = false, align = "center" }: { category: string; tone?: Tone; uid?: string; title?: string; tile?: boolean; align?: "center" | "right" }) {
  const id = `${category}-${uid}`;
  const dark = tone === "dark";
  const bgA = dark ? "#4a4744" : "#e6e3dc";
  const bgB = dark ? "#2c2b29" : "#cfcbc2";
  const floor = dark ? "#242321" : "#c3bfb5";

  const objects: Record<string, React.ReactNode> = {
    balusters: (
      <>
        <rect x="36" y="40" width="328" height="26" fill={`url(#cyl-${id})`} />
        {[92, 200, 308].map((cx) => (
          <path key={cx} d={balusterPath(cx, 64, 0.9)} fill={`url(#cyl-${id})`} />
        ))}
        <rect x="36" y="433" width="328" height="24" fill={`url(#cyl-${id})`} />
      </>
    ),
    columns: (
      <>
        <rect x="132" y="66" width="136" height="16" fill={`url(#cyl-${id})`} />
        <rect x="148" y="82" width="104" height="22" fill={`url(#cyl-${id})`} />
        <path d="M162 104h76l-6 300h-64z" fill={`url(#cyl-${id})`} />
        {[176, 192, 208, 224].map((x) => (
          <path key={x} d={`M${x} 108v292`} stroke="rgba(0,0,0,.14)" strokeWidth="2" />
        ))}
        <rect x="146" y="404" width="108" height="20" fill={`url(#cyl-${id})`} />
        <rect x="132" y="424" width="136" height="24" fill={`url(#cyl-${id})`} />
      </>
    ),
    "flower-pots": (
      <>
        <rect x="124" y="236" width="152" height="34" fill={`url(#cyl-${id})`} />
        <path d="M134 270h132l-22 160h-88z" fill={`url(#cyl-${id})`} />
        <rect x="152" y="430" width="96" height="18" fill={`url(#cyl-${id})`} />
        <ellipse cx="200" cy="236" rx="76" ry="9" fill="rgba(0,0,0,.35)" />
      </>
    ),
    "window-moulds": (
      <>
        <rect x="78" y="116" width="244" height="26" fill={`url(#cyl-${id})`} />
        <path d="M176 142h48l-8 26h-32z" fill={`url(#cyl-${id})`} />
        <path d="M96 142h208v270H96z" fill={`url(#cyl-${id})`} />
        <rect x="128" y="176" width="144" height="224" fill="#2f2e2c" />
        <rect x="128" y="176" width="144" height="224" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <rect x="84" y="412" width="232" height="28" fill={`url(#cyl-${id})`} />
      </>
    ),
    molds: (
      <>
        <rect x="132" y="70" width="64" height="378" rx="6" fill={`url(#mold-${id})`} />
        <rect x="204" y="70" width="64" height="378" rx="6" fill={`url(#mold-${id})`} />
        <path d={balusterPath(164, 96, 0.78)} fill="rgba(0,0,0,.09)" />
        <path d={balusterPath(236, 96, 0.78)} fill="rgba(0,0,0,.09)" />
      </>
    ),
    other: (
      <>
        <circle cx="200" cy="250" r="118" fill={`url(#cyl-${id})`} />
        <circle cx="200" cy="250" r="92" fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="3" />
        <circle cx="200" cy="250" r="58" fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="3" />
        <circle cx="200" cy="250" r="22" fill={`url(#cyl-${id})`} stroke="rgba(0,0,0,.16)" strokeWidth="3" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio={tile ? (align === "right" ? "xMaxYMax meet" : "xMidYMax meet") : "xMidYMid slice"} role="img" aria-label={title ?? "Illustration"} focusable={false}>
      <defs>
        <radialGradient id={`bg-${id}`} cx="0.6" cy="0.3" r="0.9">
          <stop offset="0" stopColor={bgA} />
          <stop offset="1" stopColor={bgB} />
        </radialGradient>
        <linearGradient id={`cyl-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7b766c" />
          <stop offset="0.28" stopColor="#b3aea2" />
          <stop offset="0.52" stopColor="#cdc8bc" />
          <stop offset="0.8" stopColor="#8f8a7f" />
          <stop offset="1" stopColor="#6a655c" />
        </linearGradient>
        <linearGradient id={`mold-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#dcd9d2" />
          <stop offset="0.5" stopColor="#f6f5f2" />
          <stop offset="1" stopColor="#cbc8c0" />
        </linearGradient>
        <filter id={`grain-${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0" result="na" />
          <feComposite in="na" in2="SourceGraphic" operator="in" result="ng" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="ng" /></feMerge>
        </filter>
      </defs>
      {!tile && <rect width="400" height="500" fill={`url(#bg-${id})`} />}
      {!tile && <rect y="446" width="400" height="54" fill={floor} opacity="0.7" />}
      <ellipse cx="200" cy="452" rx="150" ry="9" fill="rgba(0,0,0,.28)" />
      <g filter={`url(#grain-${id})`}>{objects[category] ?? objects.other}</g>
    </svg>
  );
}
