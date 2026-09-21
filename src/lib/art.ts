// Vector drawing of a turned baluster, used for the hero and for product tiles that have no photo yet.
type Pt = { y: number; r: number; hard?: boolean };

// Half-width (r) at each height (y) of the profile. `hard` marks square corners.
const PROFILE: Pt[] = [
  { y: 0, r: 34, hard: true },
  { y: 28, r: 34, hard: true },
  { y: 28, r: 17, hard: true },
  { y: 60, r: 15 },
  { y: 62, r: 15, hard: true },
  { y: 62, r: 27, hard: true },
  { y: 74, r: 27, hard: true },
  { y: 74, r: 17, hard: true },
  { y: 96, r: 20 },
  { y: 150, r: 44 },
  { y: 225, r: 57 },
  { y: 300, r: 40 },
  { y: 335, r: 21 },
  { y: 338, r: 21, hard: true },
  { y: 338, r: 29, hard: true },
  { y: 350, r: 29, hard: true },
  { y: 350, r: 19, hard: true },
  { y: 372, r: 19 },
  { y: 372, r: 38, hard: true },
  { y: 410, r: 38, hard: true },
];

export const BALUSTER_HEIGHT = 410;

type P2 = [number, number, boolean];

function run(pts: P2[]): string {
  let d = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    if (p1[2] || p2[2]) {
      d += `L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    } else {
      const p0 = pts[i - 1] ?? p1;
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
  }
  return d;
}

/** SVG path for one baluster centred on cx, top edge at `top`, scaled by s. */
export function balusterPath(cx: number, top: number, s: number): string {
  const right: P2[] = PROFILE.map((p) => [cx + p.r * s, top + p.y * s, !!p.hard]);
  const left: P2[] = PROFILE.map((p) => [cx - p.r * s, top + p.y * s, !!p.hard]).reverse() as P2[];
  return `M${right[0][0].toFixed(1)} ${right[0][1].toFixed(1)}${run(right)}L${left[0][0].toFixed(1)} ${left[0][1].toFixed(1)}${run(left)}Z`;
}
