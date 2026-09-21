"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Optional hero video. Drop hero.mp4 (and hero-poster.jpg) into /public/hero and it fades in over the drawn backdrop.
 * If the file is missing, slow, blocked by data-saver, or motion is reduced, the backdrop simply stays.
 */
export function HeroVideo({ poster }: { poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) setSkip(true);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [skip]);

  if (skip) return null;
  return (
    <video
      ref={ref}
      className="hero__video"
      data-ready={ready}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden
      onCanPlay={() => setReady(true)}
      onError={() => setSkip(true)}
    >
      <source src="/hero/hero.mp4" type="video/mp4" onError={() => setSkip(true)} />
    </video>
  );
}
