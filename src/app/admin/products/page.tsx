"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { categoryName } from "@/lib/config";
import { formatTTD } from "@/lib/format";
import { getSupabase } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

export default function AdminProducts() {
  const [rows, setRows] = useState<Product[] | null>(null);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await getSupabase().from("products").select("*").order("sort_order").order("name");
    if (error) setMsg(error.message); else setRows((data ?? []) as Product[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function toggle(p: Product) {
    const { error } = await getSupabase().from("products").update({ active: !p.active }).eq("id", p.id);
    if (error) setMsg(error.message); else load();
  }
  async function del(p: Product) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await getSupabase().from("products").delete().eq("id", p.id);
    if (error) setMsg(error.message); else load();
  }

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <h1 className="display h2">Products</h1>
        <Link href="/admin/products/new" className="btn btn--solid">Add a product</Link>
      </div>
      {msg && <p role="alert" className="notice notice--err">{msg}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Name</th><th>Category</th><th>Price (TTD)</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan={5}>Loading…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={5}>No products yet.</td></tr>}
            {rows?.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong>{p.is_demo && <> <span className="badge badge--warn">Demo</span></>}{p.featured && <> <span className="badge">Featured</span></>}</td>
                <td>{categoryName(p.category)}</td>
                <td>{p.price === null ? "Request a quote" : formatTTD(p.price)}</td>
                <td>{p.active ? "Visible" : "Hidden"}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link href={`/admin/products/${p.id}`} className="link" style={{ marginRight: "0.75rem" }}>Edit</Link>
                  <button type="button" className="remove-btn" onClick={() => toggle(p)}>{p.active ? "Hide" : "Show"}</button>
                  <button type="button" className="remove-btn" onClick={() => del(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
