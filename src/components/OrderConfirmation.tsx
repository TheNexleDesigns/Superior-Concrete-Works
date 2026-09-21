"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatTTD } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import type { PlacedOrder } from "@/lib/types";
import { IconWhatsApp } from "./Icons";

export function OrderConfirmation() {
  const [order, setOrder] = useState<(PlacedOrder & { country?: string }) | null | undefined>(undefined);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("scw-last-order");
      setOrder(raw ? JSON.parse(raw) : null);
    } catch { setOrder(null); }
  }, []);

  if (order === undefined) return <p className="muted">Loading…</p>;
  if (!order) {
    return (
      <div className="empty">
        <p className="lead">There is no recent order to show.</p>
        <Link href="/products" className="btn btn--solid">Browse products</Link>
      </div>
    );
  }
  const lines = order.items.map((i) => `${i.qty} x ${i.name}${i.unit_price === null ? " (quote needed)" : ` (${formatTTD(i.unit_price)} each)`}`).join("\n");
  const totalLine = order.total === null ? "Total: to be confirmed by you" : `Total: ${formatTTD(order.total)} (TTD)`;
  const message = `Hi Superior Concrete Works, I just placed ${order.kind === "quote" ? "a quote request" : "an order"} on your website.\n\nReference: ${order.order_number}\n${lines}\n${totalLine}\n\nName: ${order.customer_name}${order.country ? `\nCountry: ${order.country}` : ""}`;

  return (
    <div className="prose" style={{ display: "grid", gap: "1.5rem", maxWidth: "60ch" }}>
      <div className="notice notice--ok">
        <p><strong>{order.kind === "quote" ? "Quote request saved." : "Order saved."}</strong> Your reference is <strong>{order.order_number}</strong>.</p>
      </div>
      <p className="lead">One more step: send it to us on WhatsApp so we can confirm everything with you.</p>
      <div><a className="btn btn--wa" href={waLink(message)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Send on WhatsApp</a></div>
      <ul className="cart-list" style={{ maxWidth: "60ch" }}>
        {order.items.map((i) => (
          <li key={i.name} className="cart-row" style={{ gridTemplateColumns: "1fr auto" }}>
            <span>{i.qty} × {i.name}</span>
            <span className="price">{i.unit_price === null ? "Quote" : formatTTD(i.unit_price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="price" style={{ fontSize: "1.3rem" }}>{order.total === null ? "Total to be confirmed" : `Total ${formatTTD(order.total)}`}</p>
      <p className="small muted">We do not send any message for you. Nothing is charged online. We will confirm prices, payment and delivery with you on WhatsApp.</p>
      <Link href="/products" className="link">Keep browsing</Link>
    </div>
  );
}
