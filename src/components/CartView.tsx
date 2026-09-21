"use client";
import Image from "next/image";
import Link from "next/link";
import { formatTTD } from "@/lib/format";
import { site } from "@/lib/config";
import { useCart } from "./CartProvider";
import { ProductArt } from "./ProductArt";

export function CartView() {
  const { items, ready, setQty, remove } = useCart();
  if (!ready) return <p className="muted">Loading your cart…</p>;
  if (items.length === 0) {
    return (
      <div className="empty">
        <p className="lead">Your cart is empty.</p>
        <Link href="/products" className="btn btn--solid">Browse products</Link>
      </div>
    );
  }
  const needsQuote = items.some((i) => i.price === null);
  const subtotal = items.reduce((n, i) => (i.price === null ? n : n + i.price * i.qty), 0);

  return (
    <div className="two-col">
      <ul className="cart-list" aria-label="Items in your cart">
        {items.map((i) => (
          <li key={i.id} className="cart-row">
            <div className="cart-row__img">
              {i.image ? <Image src={i.image} alt="" fill sizes="84px" /> : <ProductArt category={i.category} uid={`c-${i.slug}`} />}
            </div>
            <div className="cart-row__body">
              <div>
                <Link href={`/products/${i.slug}`}><strong>{i.name}</strong></Link>
                <p className="small muted">{i.price === null ? "Price on request" : `${formatTTD(i.price)} each`}</p>
              </div>
              <div className="cart-row__foot">
                <div className="qty" role="group" aria-label={`Quantity for ${i.name}`}>
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                  <output aria-live="polite">{i.qty}</output>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                </div>
                <span className="price">{i.price === null ? "Quote needed" : formatTTD(i.price * i.qty)}</span>
                <button type="button" className="remove-btn" onClick={() => remove(i.id)} aria-label={`Remove ${i.name}`}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="summary" aria-label="Order summary">
        <h2 className="h3">Summary</h2>
        <div className="summary__row"><span>{needsQuote ? "Priced items" : "Subtotal"}</span><span className="price">{formatTTD(subtotal)}</span></div>
        {needsQuote && <p className="small muted">Some items need a quote. We will confirm the full price with you on WhatsApp.</p>}
        <p className="small muted">{site.currencyNote} Delivery and international shipping are arranged directly with us.</p>
        <Link href="/checkout" className="btn btn--solid">{needsQuote ? "Send order for a quote" : "Continue to checkout"}</Link>
        <Link href="/products" className="link">Keep browsing</Link>
      </aside>
    </div>
  );
}
