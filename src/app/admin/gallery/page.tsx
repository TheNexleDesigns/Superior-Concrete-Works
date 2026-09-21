"use client";
import { useCallback, useEffect, useState } from "react";
import { uploadImage } from "@/lib/imageUpload";
import { getSupabase } from "@/lib/supabase/client";
import type { GalleryItem } from "@/lib/types";

export default function AdminGallery() {
  const [rows, setRows] = useState<GalleryItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const load = useCallback(async () => {
    const { data, error } = await getSupabase().from("gallery_items").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) setMsg({ ok: false, text: error.message }); else setRows((data ?? []) as GalleryItem[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const files = (form.elements.namedItem("files") as HTMLInputElement).files;
    if (!files?.length) { setMsg({ ok: false, text: "Choose at least one photo." }); return; }
    setBusy(true); setMsg(null);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage("gallery", file);
        const { error } = await getSupabase().from("gallery_items").insert({
          image_url: url, alt: String(f.get("alt") ?? ""), caption: String(f.get("caption") ?? "") || null, illustrative: f.get("illustrative") === "on",
        });
        if (error) throw error;
      }
      form.reset();
      setMsg({ ok: true, text: "Added to the gallery." });
      load();
    } catch (ex) { setMsg({ ok: false, text: (ex as Error).message }); }
    setBusy(false);
  }
  async function del(g: GalleryItem) {
    if (!window.confirm("Remove this photo from the gallery?")) return;
    const { error } = await getSupabase().from("gallery_items").delete().eq("id", g.id);
    if (error) setMsg({ ok: false, text: error.message }); else load();
  }

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <h1 className="display h2">Gallery</h1>
      <form className="admin-card form" onSubmit={onSubmit}>
        <div className="field"><label htmlFor="g-files">Photos</label><input id="g-files" name="files" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple /></div>
        <div className="field-row">
          <div className="field"><label htmlFor="g-alt">Describe the photo <span className="hint">(for screen readers and search)</span></label><input id="g-alt" name="alt" className="input" /></div>
          <div className="field"><label htmlFor="g-cap">Caption <span className="hint">(optional)</span></label><input id="g-cap" name="caption" className="input" /></div>
        </div>
        <label className="check"><input type="checkbox" name="illustrative" /> This is an illustrative image, not a photo of a real installation</label>
        {msg && <p role={msg.ok ? "status" : "alert"} className={`notice ${msg.ok ? "notice--ok" : "notice--err"}`}>{msg.text}</p>}
        <div><button className="btn btn--solid" disabled={busy}>{busy ? "Uploading…" : "Add to gallery"}</button></div>
      </form>
      <div className="img-row">
        {rows?.map((g) => (
          <div key={g.id} className="img-tile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image_url} alt={g.alt} />
            <span className="small">{g.caption || g.alt || "No description"}</span>
            <button type="button" className="remove-btn" onClick={() => del(g)}>Remove</button>
          </div>
        ))}
      </div>
      {rows?.length === 0 && <p className="muted">No photos yet.</p>}
    </div>
  );
}
