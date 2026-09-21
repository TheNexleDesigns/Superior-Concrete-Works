"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { waLink } from "@/lib/whatsapp";
import { IconWhatsApp } from "./Icons";

type Opt = { slug: string; name: string };
type Line = { key: number; product: string; qty: string };

export function QuoteForm({ options }: { options: Opt[] }) {
  const params = useSearchParams();
  const pre = params.get("product");
  const preName = options.find((o) => o.slug === pre)?.name ?? "";
  const [lines, setLines] = useState<Line[]>([{ key: 1, product: preName, qty: "1" }]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const nextKey = useMemo(() => ({ n: 2 }), []);

  const setLine = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    if (f.get("company")) { setStatus("done"); return; } // honeypot
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    if (!name) { setError("Please add your name."); return; }
    if (!email && !phone) { setError("Please add an email or a phone / WhatsApp number so we can reply."); return; }
    const items = lines.filter((l) => l.product.trim()).map((l) => ({ product: l.product.trim(), qty: Math.max(1, parseInt(l.qty, 10) || 1) }));
    const message = String(f.get("message") ?? "").trim();
    const country = String(f.get("country") ?? "").trim();
    setStatus("sending");
    const { error: err } = await getSupabase().from("quote_requests").insert({
      name, email: email || null, phone: phone || null, country: country || null, items, message: message || null,
    });
    if (err) { setStatus("error"); setError("We could not send your request. Please try again, or message us on WhatsApp."); return; }
    setSummary(
      `Hi Superior Concrete Works, I just sent a quote request on your website.\n\n${items.map((i) => `${i.qty} x ${i.product}`).join("\n") || "General inquiry"}${message ? `\n\n${message}` : ""}\n\nName: ${name}${country ? `\nCountry: ${country}` : ""}`,
    );
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div style={{ display: "grid", gap: "1.25rem" }}>
        <p className="notice notice--ok" role="status"><strong>Request sent.</strong> We will get back to you as soon as we can.</p>
        <p>For a faster reply, you can also send it on WhatsApp.</p>
        <div><a className="btn btn--wa" href={waLink(summary)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Send on WhatsApp</a></div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field-row">
        <div className="field"><label htmlFor="q-name">Name</label><input id="q-name" name="name" className="input" autoComplete="name" required /></div>
        <div className="field"><label htmlFor="q-phone">Phone / WhatsApp</label><input id="q-phone" name="phone" type="tel" inputMode="tel" className="input" autoComplete="tel" /></div>
      </div>
      <div className="field-row">
        <div className="field"><label htmlFor="q-email">Email</label><input id="q-email" name="email" type="email" className="input" autoComplete="email" /></div>
        <div className="field"><label htmlFor="q-country">Country <span className="hint">(optional)</span></label><input id="q-country" name="country" className="input" autoComplete="country-name" /></div>
      </div>

      <fieldset style={{ border: 0, padding: 0, margin: 0 }} className="field">
        <legend className="label" style={{ padding: 0, marginBottom: "0.5rem" }}>Products you are interested in</legend>
        <div className="lines">
          {lines.map((l, idx) => (
            <div key={l.key} className="line-item">
              <div>
                <label className="sr-only" htmlFor={`q-prod-${l.key}`}>Product {idx + 1}</label>
                <input id={`q-prod-${l.key}`} className="input" list="q-products" placeholder="Choose or type a product" value={l.product} onChange={(e) => setLine(l.key, { product: e.target.value })} />
              </div>
              <div>
                <label className="sr-only" htmlFor={`q-qty-${l.key}`}>Quantity for product {idx + 1}</label>
                <input id={`q-qty-${l.key}`} className="input" inputMode="numeric" placeholder="Qty" value={l.qty} onChange={(e) => setLine(l.key, { qty: e.target.value.replace(/\D/g, "") })} />
              </div>
              {lines.length > 1 && <button type="button" className="remove-btn" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} aria-label={`Remove product ${idx + 1}`}>Remove</button>}
            </div>
          ))}
        </div>
        <datalist id="q-products">{options.map((o) => <option key={o.slug} value={o.name} />)}</datalist>
        <div><button type="button" className="link" style={{ background: "none", borderTop: 0, borderInline: 0, cursor: "pointer" }} onClick={() => setLines((ls) => [...ls, { key: nextKey.n++, product: "", qty: "1" }])}>Add another product</button></div>
      </fieldset>

      <div className="field"><label htmlFor="q-message">Project details <span className="hint">(sizes, quantities, anything we should know)</span></label><textarea id="q-message" name="message" className="textarea" /></div>
      <div aria-hidden style={{ position: "absolute", left: "-9999px" }}><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p role="alert" className="notice notice--err">{error}</p>}
      <div><button type="submit" className="btn btn--solid" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send request"}</button></div>
    </form>
  );
}
