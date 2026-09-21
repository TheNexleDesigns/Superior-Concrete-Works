"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { availabilityLabel, categories } from "@/lib/config";
import { slugify } from "@/lib/format";
import { uploadImage } from "@/lib/imageUpload";
import { getSupabase } from "@/lib/supabase/client";
import type { Product, ProductDetail, ProductImage } from "@/lib/types";

type Form = {
  name: string; slug: string; category: string; short_description: string; description: string;
  price: string; is_demo: boolean; availability: string; featured: boolean; active: boolean; sort_order: string;
  images: ProductImage[]; details: ProductDetail[];
};

const blank: Form = {
  name: "", slug: "", category: "balusters", short_description: "", description: "", price: "", is_demo: false,
  availability: "on_request", featured: false, active: true, sort_order: "100", images: [], details: [],
};

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";
  const [f, setF] = useState<Form>(blank);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await getSupabase().from("products").select("*").eq("id", id).maybeSingle();
      if (error || !data) { setMsg({ ok: false, text: error?.message ?? "Product not found." }); setLoading(false); return; }
      const p = data as Product;
      setF({
        name: p.name, slug: p.slug, category: p.category, short_description: p.short_description ?? "", description: p.description ?? "",
        price: p.price === null ? "" : String(p.price), is_demo: p.is_demo, availability: p.availability, featured: p.featured, active: p.active,
        sort_order: String(p.sort_order), images: p.images ?? [], details: p.details ?? [],
      });
      setSlugTouched(true);
      setLoading(false);
    })();
  }, [id, isNew]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((cur) => ({ ...cur, [k]: v }));

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setMsg(null);
    try {
      const added: ProductImage[] = [];
      for (const file of Array.from(files)) added.push({ url: await uploadImage("products", file), alt: f.name });
      set("images", [...f.images, ...added]);
    } catch (e) {
      setMsg({ ok: false, text: `Upload failed: ${(e as Error).message}` });
    }
    setBusy(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const price = f.price.trim() === "" ? null : Number(f.price);
    if (price !== null && (!Number.isFinite(price) || price < 0)) { setMsg({ ok: false, text: "Price must be a number in TTD, or left blank for “Request a quote”." }); return; }
    if (!f.name.trim()) { setMsg({ ok: false, text: "Add a product name." }); return; }
    const slug = slugify(f.slug || f.name);
    if (!slug) { setMsg({ ok: false, text: "Add a web address (slug) for this product." }); return; }
    setBusy(true);
    const row = {
      name: f.name.trim(), slug, category: f.category,
      short_description: f.short_description.trim() || null, description: f.description.trim() || null,
      price, is_demo: f.is_demo, availability: f.availability, featured: f.featured, active: f.active,
      sort_order: parseInt(f.sort_order, 10) || 0,
      images: f.images, details: f.details.filter((d) => d.label.trim() && d.value.trim()),
    };
    const sb = getSupabase();
    const { data, error } = isNew
      ? await sb.from("products").insert(row).select("id").single()
      : await sb.from("products").update(row).eq("id", id).select("id").single();
    setBusy(false);
    if (error) {
      setMsg({ ok: false, text: error.code === "23505" ? "Another product already uses that web address. Change the slug." : error.message });
      return;
    }
    if (isNew && data) router.replace(`/admin/products/${data.id}`);
    setMsg({ ok: true, text: "Saved. It appears on the public site within about a minute." });
  }

  if (loading) return <p>Loading…</p>;

  return (
    <form className="form" onSubmit={save} style={{ maxWidth: 860 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        <h1 className="display h2">{isNew ? "Add a product" : "Edit product"}</h1>
        <Link href="/admin/products" className="link">Back to products</Link>
      </div>

      <div className="admin-card">
        <div className="field-row">
          <div className="field"><label htmlFor="p-name">Name</label>
            <input id="p-name" className="input" value={f.name} onChange={(e) => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} required /></div>
          <div className="field"><label htmlFor="p-slug">Web address <span className="hint">(/products/…)</span></label>
            <input id="p-slug" className="input" value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} required /></div>
        </div>
        <div className="field-row">
          <div className="field"><label htmlFor="p-cat">Category</label>
            <select id="p-cat" className="select" value={f.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select></div>
          <div className="field"><label htmlFor="p-price">Price in TTD <span className="hint">(leave blank for “Request a quote”)</span></label>
            <input id="p-price" className="input" inputMode="decimal" value={f.price} onChange={(e) => set("price", e.target.value.replace(/[^0-9.]/g, ""))} placeholder="e.g. 95.00" /></div>
        </div>
        <div className="field"><label htmlFor="p-short">Short description</label>
          <input id="p-short" className="input" value={f.short_description} onChange={(e) => set("short_description", e.target.value)} maxLength={200} /></div>
        <div className="field"><label htmlFor="p-desc">Full description <span className="hint">(leave a blank line between paragraphs)</span></label>
          <textarea id="p-desc" className="textarea" value={f.description} onChange={(e) => set("description", e.target.value)} /></div>
      </div>

      <div className="admin-card">
        <h2 className="h3">Photos</h2>
        <div className="img-row">
          {f.images.map((im, i) => (
            <div key={im.url} className="img-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt="" />
              <label className="sr-only" htmlFor={`alt-${i}`}>Description of photo {i + 1}</label>
              <input id={`alt-${i}`} className="input" style={{ minHeight: 40, fontSize: "0.9rem" }} value={im.alt} placeholder="Describe the photo" onChange={(e) => set("images", f.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
              <label className="check small"><input type="checkbox" checked={!!im.illustrative} onChange={(e) => set("images", f.images.map((x, j) => (j === i ? { ...x, illustrative: e.target.checked } : x)))} /> Illustrative image</label>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {i > 0 && <button type="button" className="remove-btn" onClick={() => { const a = [...f.images]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; set("images", a); }}>Move up</button>}
                <button type="button" className="remove-btn" onClick={() => set("images", f.images.filter((_, j) => j !== i))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="field"><label htmlFor="p-files">Add photos <span className="hint">(they are resized automatically; the first one is the main photo)</span></label>
          <input id="p-files" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} disabled={busy} /></div>
      </div>

      <div className="admin-card">
        <h2 className="h3">Details</h2>
        <p className="small muted">Only add facts you have confirmed, such as height or finish. They show on the product page.</p>
        {f.details.map((d, i) => (
          <div key={i} className="field-row" style={{ alignItems: "end" }}>
            <div className="field"><label htmlFor={`dl-${i}`}>Label</label><input id={`dl-${i}`} className="input" value={d.label} onChange={(e) => set("details", f.details.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} /></div>
            <div className="field"><label htmlFor={`dv-${i}`}>Value</label><input id={`dv-${i}`} className="input" value={d.value} onChange={(e) => set("details", f.details.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} /></div>
            <button type="button" className="remove-btn" onClick={() => set("details", f.details.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <div><button type="button" className="btn btn--line btn--sm" onClick={() => set("details", [...f.details, { label: "", value: "" }])}>Add a detail</button></div>
      </div>

      <div className="admin-card">
        <div className="field-row">
          <div className="field"><label htmlFor="p-av">Availability</label>
            <select id="p-av" className="select" value={f.availability} onChange={(e) => set("availability", e.target.value)}>
              {Object.entries(availabilityLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></div>
          <div className="field"><label htmlFor="p-order">Sort order <span className="hint">(lower shows first)</span></label>
            <input id="p-order" className="input" inputMode="numeric" value={f.sort_order} onChange={(e) => set("sort_order", e.target.value.replace(/\D/g, ""))} /></div>
        </div>
        <label className="check"><input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} /> Visible on the website</label>
        <label className="check"><input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured on the homepage</label>
        <label className="check"><input type="checkbox" checked={f.is_demo} onChange={(e) => set("is_demo", e.target.checked)} /> Demo listing <span className="hint">(sample price, replace before launch)</span></label>
      </div>

      {msg && <p role={msg.ok ? "status" : "alert"} className={`notice ${msg.ok ? "notice--ok" : "notice--err"}`}>{msg.text}</p>}
      <div><button className="btn btn--solid" disabled={busy}>{busy ? "Working…" : "Save product"}</button></div>
    </form>
  );
}
