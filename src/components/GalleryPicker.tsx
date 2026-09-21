"use client";
import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function GalleryPicker({ images, name }: { images: ProductImage[]; name: string }) {
  const [i, setI] = useState(0);
  const cur = images[i] ?? images[0];
  return (
    <>
      <div className="pdp__main">
        <Image src={cur.url} alt={cur.alt || name} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
      </div>
      {images.length > 1 && (
        <div className="pdp__thumbs" role="group" aria-label="Product images">
          {images.map((im, idx) => (
            <button key={im.url} type="button" className="pdp__thumb" aria-current={idx === i} aria-label={`Show image ${idx + 1}`} onClick={() => setI(idx)}>
              <Image src={im.url} alt="" width={72} height={72} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
