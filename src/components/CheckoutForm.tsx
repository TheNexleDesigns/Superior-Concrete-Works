"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatTTD } from "@/lib/format";
import { getSupabase } from "@/lib/supabase/client";
import { site } from "@/lib/config";
import { useCart } from "./CartProvider";

export function CheckoutForm() {
  const { items, ready, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!ready) return <p className="muted">Loading…</p>;
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    if (f.get("company")) { router.push("/"); return; } // honeypot: bots fill this in
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    if (!name || !phone) { setError("Please add your name and a phone or WhatsApp number."); return; }
    setBusy(true);
    try {
      const { data, error: err } = await getSupabase().rpc("place_order", {
        p_name: name,
        p_email: String(f.get("email") ?? ""),
        p_phone: phone,
        p_country: String(f.get("country") ?? ""),
        p_address: String(f.get("address") ?? ""),
        p_notes: String(f.get("notes") ?? ""),
        p_items: items.map((i) => ({ product_id: i.id, qty: i.qty })),
      });
      if (err) throw err;
      sessionStorage.setItem("scw-last-order", JSON.stringify({ ...data, customer_name: name, country: String(f.get("country") ?? "") }));
      clear();
      router.push("/order");
    } catch (ex) {
      const msg = (ex as { message?: string }).message ?? "";
      setError(
        msg.includes("no longer available")
          ? "One of the items in your cart is no longer available. Please review your cart."
          : "We could not send your order. Please try again, or message us on WhatsApp.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="two-col">
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="field-row">
          <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" className="input" autoComplete="name" required /></div>
          <div className="field"><label htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" type="tel" className="input" autoComplete="tel" inputMode="tel" required /></div>
        </div>
        <div className="field-row">
          <div className="field"><label htmlFor="email">Email <span className="hint">(optional)</span></label><input id="email" name="email" type="email" className="input" autoComplete="email" /></div>
          <div className="field"><label htmlFor="country">Country <span className="hint">(optional)</span></label><input id="country" name="country" className="input" autoComplete="country-name" /></div>
        </div>
        <div className="field"><label htmlFor="address">Delivery address <span className="hint">(optional, we can confirm this on WhatsApp)</span></label><textarea id="address" name="address" className="textarea" style={{ minHeight: 88 }} autoComplete="street-address" /></div>
        <div className="field"><label htmlFor="notes">Notes <span className="hint">(optional)</span></label><textarea id="notes" name="notes" className="textarea" style={{ minHeight: 88 }} /></div>
        <div aria-hidden style={{ position: "absolute", left: "-9999px" }}><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
        {error && <p role="alert" className="notice notice--err">{error}</p>}
        <div><button type="submit" className="btn btn--solid" disabled={busy}>{busy ? "Sending…" : needsQuote ? "Send order for a quote" : "Place order"}</button></div>
        <p className="small muted">Placing an order saves it with us and opens the next step, where you send it to us on WhatsApp. We confirm payment and delivery with you there. Nothing is charged online.</p>
      </form>
      <aside className="summary" aria-label="Order summary">
        <h2 className="h3">Your order</h2>
        <ul style={{ display: "grid", gap: "0.6rem" }}>
          {items.map((i) => (
            <li key={i.id} className="summary__row">
              <span>{i.qty} × {i.name}</span>
              <span className="price">{i.price === null ? "Quote" : formatTTD(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="summary__row summary__total"><span>{needsQuote ? "Priced items" : "Total"}</span><span className="price">{formatTTD(subtotal)}</span></div>
        <p className="small muted">{site.currencyNote} Final prices are confirmed by Superior Concrete Works.</p>
        <Link href="/cart" className="link">Edit cart</Link>
      </aside>
    </div>
  );
}
