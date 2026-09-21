"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Moves its child slowly against the scroll. Only runs while visible, and never with reduced motion. */
export function Parallax({ children, speed = 0.16, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = true;
    const watch = el.parentElement ?? el;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "80px" });
    io.observe(watch);
    const update = () => {
      raf = 0;
      if (visible) el.style.transform = `translate3d(0, ${Math.round(window.scrollY * speed)}px, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return <div ref={ref} className={className}>{children}</div>;
}
