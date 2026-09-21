"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { waLink, waProductMessage } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";
import { IconWhatsApp } from "./Icons";

export function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const quote = product.price === null;
  const sold = product.availability === "out_of_stock";

  const onAdd = () => {
    add({ id: product.id, slug: product.slug, name: product.name, category: product.category, price: product.price, image: product.images?.[0]?.url }, qty);
    setAdded(true);
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <input aria-label="Quantity" inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, Math.min(999, parseInt(e.target.value.replace(/\D/g, ""), 10) || 1)))} />
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(999, q + 1))}>+</button>
        </div>
        <button type="button" className="btn btn--solid" onClick={onAdd} disabled={sold}>
          {sold ? "Out of stock" : quote ? "Add to quote request" : "Add to cart"}
        </button>
      </div>
      <p role="status" className="small" style={{ minHeight: "1.5em" }}>
        {added && (<>Added. <Link href="/cart" style={{ fontWeight: 600 }}>View your cart</Link></>)}
      </p>
      <div className="btn-row">
        <a className="btn btn--wa" href={waLink(waProductMessage(product.name))} target="_blank" rel="noopener noreferrer">
          <IconWhatsApp /> Ask about this product
        </a>
        <Link className="btn btn--line" href={`/contact?product=${encodeURIComponent(product.slug)}`}>Request a quote</Link>
      </div>
    </div>
  );
}
