"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 108; // change if you regenerate the frames with a different length
const frameSrc = (set: "desk" | "mob", n: number) => `/scrub/${set}/f_${String(n).padStart(3, "0")}.webp`;

const captions = ["It starts with the mold.", "The two halves part.", "The baluster stands finished."];

/**
 * Scroll-driven sequence: a two-part mold opens and a concrete baluster is revealed.
 * Frames are drawn on a canvas as you scroll. Phones get a centre-cropped set that is lighter to download.
 * With reduced motion the section is static and shows the finished frame.
 */
export function MoldScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reduced) { setStage(2); return; }
    const section = sectionRef.current;
    const stageEl = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stageEl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobileMq = window.matchMedia("(max-width: 899px)");
    let set: "desk" | "mob" = mobileMq.matches ? "mob" : "desk";
    let frames: (HTMLImageElement | undefined)[] = [];
    let started = false;
    let cancelled = false;
    let target = 0;
    let current = 0;
    let lastDrawn = -1;
    let raf = 0;
    let curStage = 0;
    let w = 0;
    let h = 0;

    const loadFrames = () => {
      if (started) return;
      started = true;
      frames = new Array(FRAME_COUNT);
      let next = 0;
      const pump = () => {
        if (cancelled || next >= FRAME_COUNT) return;
        const i = next++;
        const img = new Image();
        img.decoding = "async";
        img.onload = () => { frames[i] = img; if (i === 0 || Math.abs(i - Math.round(current * (FRAME_COUNT - 1))) < 2) { lastDrawn = -1; schedule(); } pump(); };
        img.onerror = () => pump();
        img.src = frameSrc(set, i + 1);
      };
      for (let k = 0; k < 6; k++) pump();
    };

    const size = () => {
      const r = stageEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawn = -1;
    };

    const draw = (index: number) => {
      let i = index;
      while (i >= 0 && !frames[i]) i--;
      const img = frames[i];
      if (!img) return;
      if (index === lastDrawn && i === index) return;
      lastDrawn = i === index ? index : -1;
      ctx.clearRect(0, 0, w, h); // the CSS backdrop shows through, so the frame edges blend in
      const contain = set === "mob";
      const s = contain ? Math.min(w / img.naturalWidth, h / img.naturalHeight) : Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const measure = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      target = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };

    const tick = () => {
      raf = 0;
      current += (target - current) * 0.2;
      if (Math.abs(target - current) < 0.0004) current = target;
      draw(Math.round(current * (FRAME_COUNT - 1)));
      barRef.current?.style.setProperty("--p", String(current));
      const st = current < 0.34 ? 0 : current < 0.7 ? 1 : 2;
      if (st !== curStage) { curStage = st; setStage(st); }
      if (current !== target) raf = requestAnimationFrame(tick);
    };
    function schedule() { if (!raf) raf = requestAnimationFrame(tick); }

    const onScroll = () => { measure(); schedule(); };
    const onResize = () => {
      const next: "desk" | "mob" = mobileMq.matches ? "mob" : "desk";
      if (next !== set) { set = next; started = false; frames = []; loadFrames(); }
      size(); measure(); schedule();
    };

    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) loadFrames(); }, { rootMargin: "1600px 0px" });
    io.observe(section);
    size(); measure(); current = target; schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const posterFrame = reduced ? FRAME_COUNT : 1;
  return (
    <section ref={sectionRef} className="scrub" data-static={reduced} aria-labelledby="scrub-title">
      <div className="scrub__stick">
        <div ref={stageRef} className="scrub__stage">
          <picture>
            <source media="(max-width: 899px)" srcSet={frameSrc("mob", posterFrame)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="scrub__poster" src={frameSrc("desk", posterFrame)} alt="" width={1280} height={720} decoding="async" />
          </picture>
          {!reduced && <canvas ref={canvasRef} className="scrub__canvas" aria-hidden />}
        </div>
        <div className="scrub__text">
          <h2 id="scrub-title" className="display scrub__title">Details that define the space.</h2>
          <div className="scrub__cap" aria-live="polite">
            {captions.map((c, i) => (
              <p key={c} data-on={stage === i}>{c}</p>
            ))}
          </div>
          <div className="scrub__foot">
            <Link href="/products?category=balusters" className="btn btn--solid btn--sm">See our balusters</Link>
            <small>Illustrative animation. Scroll to watch it.</small>
          </div>
        </div>
        <i ref={barRef as React.RefObject<HTMLElement>} className="scrub__progress" aria-hidden><i /></i>
      </div>
    </section>
  );
}
