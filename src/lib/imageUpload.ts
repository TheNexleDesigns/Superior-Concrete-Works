"use client";
import { getSupabase } from "./supabase/client";

/** Shrinks and converts a photo to WebP in the browser before upload, so the site stays fast. */
export async function optimizeImage(file: File, maxSide = 1600): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", 0.84));
    return blob && blob.type === "image/webp" ? blob : file;
  } catch {
    return file;
  }
}

export async function uploadImage(folder: "products" | "gallery", file: File): Promise<string> {
  const blob = await optimizeImage(file);
  const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const sb = getSupabase();
  const { error } = await sb.storage.from("site-images").upload(path, blob, { contentType: blob.type || "image/jpeg", cacheControl: "31536000" });
  if (error) throw error;
  return sb.storage.from("site-images").getPublicUrl(path).data.publicUrl;
}
