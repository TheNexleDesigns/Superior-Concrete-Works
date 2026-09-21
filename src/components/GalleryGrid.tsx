"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import { IconChevronLeft, IconChevronRight, IconClose } from "./Icons";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => { setOpen(null); opener.current?.focus(); }, []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, close, step]);

  const cur = open === null ? null : items[open];
  return (
    <>
      <div className="masonry">
        {items.map((g, i) => (
          <button key={g.id} type="button" aria-label={`Open image: ${g.alt || g.caption || `photo ${i + 1}`}`} onClick={(e) => { opener.current = e.currentTarget; setOpen(i); }}>
            <Image src={g.image_url} alt={g.alt || g.caption || "Concrete work"} width={900} height={1100} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" loading={i < 3 ? "eager" : "lazy"} style={{ width: "100%", height: "auto" }} />
          </button>
        ))}
      </div>
      {cur && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <button ref={closeBtn} type="button" className="icon-btn lb-close" aria-label="Close" onClick={close}><IconClose /></button>
          {items.length > 1 && <button type="button" className="icon-btn lb-prev" aria-label="Previous image" onClick={() => step(-1)}><IconChevronLeft /></button>}
          {items.length > 1 && <button type="button" className="icon-btn lb-next" aria-label="Next image" onClick={() => step(1)}><IconChevronRight /></button>}
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.image_url} alt={cur.alt || cur.caption || "Concrete work"} />
            {(cur.caption || cur.illustrative) && <figcaption>{cur.caption}{cur.illustrative ? " (illustrative image)" : ""}</figcaption>}
          </figure>
        </div>
      )}
    </>
  );
}
