"use client";
import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

// Browser client. Used by the checkout, quote form and the /admin area.
// Access rules live in the database (Row Level Security), not in this file.
export function getSupabase() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase environment variables are missing.");
    client = createBrowserClient(url, key);
  }
  return client;
}
