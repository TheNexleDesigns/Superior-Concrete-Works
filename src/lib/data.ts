import { createClient } from "@supabase/supabase-js";
import type { GalleryItem, Product } from "./types";

// Server-side, read-only, public data. Pages using this revalidate every minute.
function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await db()
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Product[];
  } catch (e) {
    console.error("getProducts failed:", (e as Error).message);
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await db()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw error;
    return (data as Product | null) ?? null;
  } catch (e) {
    console.error("getProduct failed:", (e as Error).message);
    return null;
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await db()
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as GalleryItem[];
  } catch (e) {
    console.error("getGallery failed:", (e as Error).message);
    return [];
  }
}
