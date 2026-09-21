"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/lib/config";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { waLink, waGeneralMessage } from "@/lib/whatsapp";

export function ProductBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("category") ?? "all";
  const present = new Set(products.map((p) => p.category));
  const shown = active === "all" ? products : products.filter((p) => p.category === active);
  const set = (slug: string) => router.replace(slug === "all" ? "/products" : `/products?category=${slug}`, { scroll: false });

  return (
    <>
      <div className="chips" role="group" aria-label="Filter by category">
        <button type="button" className="chip" aria-pressed={active === "all"} onClick={() => set("all")}>All</button>
        {categories.filter((c) => present.has(c.slug)).map((c) => (
          <button key={c.slug} type="button" className="chip" aria-pressed={active === c.slug} onClick={() => set(c.slug)}>{c.name}</button>
        ))}
      </div>
      {shown.length === 0 ? (
        <div className="empty">
          <p className="lead">Nothing listed here yet.</p>
          <p className="muted">Ask us directly and we will tell you what we can make.</p>
          <div className="btn-row">
            <Link href="/contact" className="btn btn--solid">Request a quote</Link>
            <a className="btn btn--line" href={waLink(waGeneralMessage())} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          </div>
        </div>
      ) : (
        <div className="pgrid" aria-live="polite">
          {shown.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 3} />)}
        </div>
      )}
    </>
  );
}
