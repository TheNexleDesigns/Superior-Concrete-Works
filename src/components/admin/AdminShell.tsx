"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getSupabase } from "@/lib/supabase/client";

type State = "loading" | "signed-out" | "not-admin" | "ok";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/quotes", label: "Quote requests" },
  { href: "/admin/gallery", label: "Gallery" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    let alive = true;
    const check = async () => {
      const { data } = await sb.auth.getUser();
      if (!alive) return;
      if (!data.user) { setState("signed-out"); return; }
      setEmail(data.user.email ?? "");
      setUid(data.user.id);
      const { data: row } = await sb.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (!alive) return;
      setState(row ? "ok" : "not-admin");
    };
    check();
    const { data: sub } = sb.auth.onAuthStateChange(() => { check(); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const { error } = await getSupabase().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    setBusy(false);
    if (error) setErr("That email and password did not work.");
  }
  const signOut = () => getSupabase().auth.signOut();

  if (state === "loading") return <div className="admin-wrap"><div className="container admin-main"><p>Loading…</p></div></div>;

  if (state === "signed-out") {
    return (
      <div className="admin-wrap">
        <form className="login-box" onSubmit={signIn}>
          <h1 className="h3">Owner sign in</h1>
          <div className="field"><label htmlFor="a-email">Email</label><input id="a-email" name="email" type="email" className="input" autoComplete="username" required /></div>
          <div className="field"><label htmlFor="a-pass">Password</label><input id="a-pass" name="password" type="password" className="input" autoComplete="current-password" required /></div>
          {err && <p role="alert" className="error-text">{err}</p>}
          <button className="btn btn--solid" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          <Link href="/" className="link">Back to the website</Link>
        </form>
      </div>
    );
  }

  if (state === "not-admin") {
    return (
      <div className="admin-wrap">
        <div className="login-box" style={{ maxWidth: 640 }}>
          <h1 className="h3">This account is not set up as an admin yet</h1>
          <p>You are signed in as <strong>{email}</strong>, but this account has not been given admin access.</p>
          <p className="small muted">To grant access, run this once in the Supabase SQL editor:</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "var(--plaster)", padding: "1rem", fontSize: "0.85rem", overflowX: "auto" }}>{`insert into public.admins (user_id) values ('${uid}');`}</pre>
          <button className="btn btn--line" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-bar">
        <div className="container admin-bar__in">
          <strong style={{ marginRight: "0.5rem" }}>Superior Concrete Works</strong>
          <nav aria-label="Admin" style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={(n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)) ? "page" : undefined}>{n.label}</Link>
            ))}
          </nav>
          <span style={{ marginLeft: "auto", display: "flex", gap: "0.25rem" }}>
            <Link href="/" target="_blank">View site</Link>
            <button type="button" onClick={signOut}>Sign out</button>
          </span>
        </div>
      </div>
      <div className="container admin-main">{children}</div>
    </div>
  );
}
