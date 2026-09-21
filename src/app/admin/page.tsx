"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

type Counts = { products: number; demo: number; orders: number; quotes: number };

export default function AdminHome() {
  const [c, setC] = useState<Counts | null>(null);
  useEffect(() => {
    const sb = getSupabase();
    const n = async (t: string, f?: (q: any) => any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      let q = sb.from(t).select("*", { count: "exact", head: true });
      if (f) q = f(q);
      const { count } = await q;
      return count ?? 0;
    };
    (async () => {
      const [products, demo, orders, quotes] = await Promise.all([
        n("products"),
        n("products", (q) => q.eq("is_demo", true)),
        n("orders", (q) => q.eq("status", "new")),
        n("quote_requests", (q) => q.eq("status", "new")),
      ]);
      setC({ products, demo, orders, quotes });
    })();
  }, []);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <h1 className="display h2">Overview</h1>
      {c && c.demo > 0 && (
        <div className="notice"><strong>{c.demo} product{c.demo === 1 ? " still has" : "s still have"} demo pricing.</strong> Open <Link href="/admin/products">Products</Link>, set the real price (or leave it blank for &quot;Request a quote&quot;), and untick &quot;Demo listing&quot; before you launch.</div>
      )}
      <div className="admin-grid admin-grid--3">
        <Link href="/admin/products" className="stat" style={{ textDecoration: "none" }}><b>{c?.products ?? "–"}</b><span>Products</span></Link>
        <Link href="/admin/orders" className="stat" style={{ textDecoration: "none" }}><b>{c?.orders ?? "–"}</b><span>New orders</span></Link>
        <Link href="/admin/quotes" className="stat" style={{ textDecoration: "none" }}><b>{c?.quotes ?? "–"}</b><span>New quote requests</span></Link>
      </div>
      <p className="small muted">Changes you make here show on the public site within about a minute.</p>
    </div>
  );
}
