import Link from "next/link";
import { categories } from "@/lib/config";
import { ProductArt } from "./ProductArt";
import { IconArrow } from "./Icons";

const layout: Record<string, string> = {
  balusters: "cat--lead",
  columns: "cat--side",
  "flower-pots": "cat--third",
  "window-moulds": "cat--third",
  molds: "cat--third",
};

export function CategoryPanels() {
  return (
    <div className="cat-grid">
      {categories.map((c) =>
        c.slug === "other" ? (
          <Link key={c.slug} href="/products?category=other" className="cat cat--wide">
            <div className="cat__body">
              <h3 className="h3">{c.name}</h3>
              <p>{c.blurb} Ask us if you don&apos;t see what you need.</p>
            </div>
            <IconArrow width={28} height={28} aria-hidden />
          </Link>
        ) : (
          <Link key={c.slug} href={`/products?category=${c.slug}`} className={`cat ${layout[c.slug] ?? ""}`}>
            <div className="cat__art"><ProductArt category={c.slug} tone="dark" uid="tile" title="" tile align={c.slug === "balusters" ? "right" : "center"} /></div>
            <div className="cat__body">
              <h3 className="h3">{c.name}</h3>
              <p>{c.blurb}</p>
              <span className="link" style={{ color: "var(--plaster)", borderColor: "var(--bronze-hi)" }}>Explore</span>
            </div>
          </Link>
        ),
      )}
    </div>
  );
}
