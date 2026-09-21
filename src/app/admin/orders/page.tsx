"use client";
import { useCallback, useEffect, useState } from "react";
import { formatTTD } from "@/lib/format";
import { getSupabase } from "@/lib/supabase/client";
import { waLink } from "@/lib/whatsapp";

type Order = {
  id: string; order_number: string; created_at: string; status: string; kind: string;
  customer_name: string; email: string | null; phone: string; country: string | null;
  delivery_address: string | null; notes: string | null; total: number | null;
  items: { name: string; qty: number; unit_price: number | null; is_demo?: boolean }[];
};
const statuses = ["new", "confirmed", "paid", "shipped", "completed", "cancelled"];

export default function AdminOrders() {
  const [rows, setRows] = useState<Order[] | null>(null);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await getSupabase().from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) setMsg(error.message); else setRows((data ?? []) as Order[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    const { error } = await getSupabase().from("orders").update({ status }).eq("id", id);
    if (error) setMsg(error.message); else load();
  }

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <h1 className="display h2">Orders</h1>
      {msg && <p role="alert" className="notice notice--err">{msg}</p>}
      {rows === null && <p>Loading…</p>}
      {rows?.length === 0 && <p className="muted">No orders yet.</p>}
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {rows?.map((o) => {
          const phone = o.phone.replace(/[^\d]/g, "");
          return (
            <details key={o.id} className="admin-card" style={{ padding: "1rem 1.25rem" }}>
              <summary style={{ cursor: "pointer", display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem", alignItems: "center" }}>
                <strong>{o.order_number}</strong>
                <span>{o.customer_name}</span>
                <span className="badge">{o.kind === "quote" ? "Quote needed" : "Order"}</span>
                <span className="badge">{o.status}</span>
                <span className="muted small">{new Date(o.created_at).toLocaleString()}</span>
                <span style={{ marginLeft: "auto" }} className="price">{o.total === null ? "To confirm" : formatTTD(o.total)}</span>
              </summary>
              <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
                <ul>{o.items.map((i, k) => <li key={k}>{i.qty} × {i.name} {i.unit_price === null ? "(quote needed)" : `— ${formatTTD(i.unit_price)} each`}{i.is_demo ? " (demo price)" : ""}</li>)}</ul>
                <p><strong>Phone:</strong> {o.phone}{o.email && <> · <strong>Email:</strong> {o.email}</>}{o.country && <> · <strong>Country:</strong> {o.country}</>}</p>
                {o.delivery_address && <p><strong>Delivery address:</strong> {o.delivery_address}</p>}
                {o.notes && <p><strong>Notes:</strong> {o.notes}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                  <label className="small" htmlFor={`st-${o.id}`}>Status</label>
                  <select id={`st-${o.id}`} className="select" style={{ width: "auto" }} value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {phone && <a className="btn btn--wa btn--sm" href={waLink().replace(/wa\.me\/\d+/, `wa.me/${phone}`) + `?text=${encodeURIComponent(`Hi ${o.customer_name}, this is Superior Concrete Works about your order ${o.order_number}.`)}`} target="_blank" rel="noopener noreferrer">Reply on WhatsApp</a>}
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
