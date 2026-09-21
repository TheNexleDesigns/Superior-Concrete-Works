"use client";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

type Quote = {
  id: string; created_at: string; status: string; name: string; email: string | null; phone: string | null;
  country: string | null; message: string | null; items: { product: string; qty: number }[];
};
const statuses = ["new", "contacted", "closed"];

export default function AdminQuotes() {
  const [rows, setRows] = useState<Quote[] | null>(null);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await getSupabase().from("quote_requests").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) setMsg(error.message); else setRows((data ?? []) as Quote[]);
  }, []);
  useEffect(() => { load(); }, [load]);
  async function setStatus(id: string, status: string) {
    const { error } = await getSupabase().from("quote_requests").update({ status }).eq("id", id);
    if (error) setMsg(error.message); else load();
  }
  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <h1 className="display h2">Quote requests</h1>
      {msg && <p role="alert" className="notice notice--err">{msg}</p>}
      {rows === null && <p>Loading…</p>}
      {rows?.length === 0 && <p className="muted">No quote requests yet.</p>}
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {rows?.map((q) => {
          const phone = (q.phone ?? "").replace(/[^\d]/g, "");
          return (
            <details key={q.id} className="admin-card" style={{ padding: "1rem 1.25rem" }}>
              <summary style={{ cursor: "pointer", display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem", alignItems: "center" }}>
                <strong>{q.name}</strong>
                <span className="badge">{q.status}</span>
                <span className="muted small">{new Date(q.created_at).toLocaleString()}</span>
                <span className="muted small">{q.items.map((i) => `${i.qty} × ${i.product}`).join(", ")}</span>
              </summary>
              <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
                <p>{q.phone && <><strong>Phone:</strong> {q.phone} · </>}{q.email && <><strong>Email:</strong> {q.email} · </>}{q.country && <><strong>Country:</strong> {q.country}</>}</p>
                {q.message && <p style={{ whiteSpace: "pre-wrap" }}>{q.message}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                  <label className="small" htmlFor={`qs-${q.id}`}>Status</label>
                  <select id={`qs-${q.id}`} className="select" style={{ width: "auto" }} value={q.status} onChange={(e) => setStatus(q.id, e.target.value)}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {phone && <a className="btn btn--wa btn--sm" href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${q.name}, this is Superior Concrete Works about your quote request.`)}`} target="_blank" rel="noopener noreferrer">Reply on WhatsApp</a>}
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
