import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "var(--formwork)", color: "var(--ink-inv)" }}>
      <div style={{ display: "grid", gap: "1.25rem", maxWidth: "36rem" }}>
        <h1 className="display h1">That page is not here.</h1>
        <p className="lead" style={{ color: "var(--ink-inv-2)" }}>The link may be old, or the product may no longer be listed.</p>
        <div className="btn-row">
          <Link href="/products" className="btn btn--light">Browse products</Link>
          <Link href="/" className="btn btn--line">Home</Link>
        </div>
      </div>
    </main>
  );
}
