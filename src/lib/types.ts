import type { CategorySlug } from "./config";

export type ProductImage = { url: string; alt: string; illustrative?: boolean };
export type ProductDetail = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  short_description: string | null;
  description: string | null;
  price: number | null; // TTD. null = request a quote
  price_currency: "TTD";
  is_demo: boolean;
  availability: "in_stock" | "made_to_order" | "on_request" | "out_of_stock";
  featured: boolean;
  active: boolean;
  images: ProductImage[];
  details: ProductDetail[];
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  image_url: string;
  alt: string;
  caption: string | null;
  category: string | null;
  illustrative: boolean;
  sort_order: number;
};

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | null;
  qty: number;
  image?: string;
};

export type PlacedOrder = {
  order_number: string;
  kind: "order" | "quote";
  total: number | null;
  items: { name: string; qty: number; unit_price: number | null }[];
  customer_name: string;
};
