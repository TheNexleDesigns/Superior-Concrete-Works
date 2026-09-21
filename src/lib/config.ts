// One place for business details. Only facts supplied by the business live here.
export const site = {
  name: "Superior Concrete Works",
  titleDefault: "Superior Concrete Works | Concrete Products in Trinidad & Tobago",
  description:
    "Superior Concrete Works makes concrete balusters, columns, flower pots and window moulds in Trinidad & Tobago. Browse the range and request a quote on WhatsApp.",
  phoneDisplay: "+1 (868) 372-8232",
  phoneTel: "tel:+18683728232",
  whatsappNumber: "18683728232",
  facebook: "https://www.facebook.com/profile.php?id=61571897604926",
  tiktok: "https://www.tiktok.com/@superiorconcreteworks",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, ""),
  currencyNote: "Prices are listed in Trinidad & Tobago Dollars (TTD).",
} as const;

// Turn this off (env var) once real prices replace the demo ones.
export const showDemoBadges = process.env.NEXT_PUBLIC_SHOW_DEMO_PRICE_BADGE !== "false";

export const categories = [
  { slug: "balusters", name: "Balusters", blurb: "Turned concrete balusters for balconies, verandas, staircases and terraces." },
  { slug: "columns", name: "Columns", blurb: "Concrete columns for entrances, verandas and porches." },
  { slug: "flower-pots", name: "Flower pots", blurb: "Flower pots and planters for gardens, entrances and outdoor spaces." },
  { slug: "window-moulds", name: "Window moulds", blurb: "Decorative moulds that frame a window and finish a facade." },
  { slug: "molds", name: "Balustrade molds", blurb: "Molds for casting concrete balusters." },
  { slug: "other", name: "Other concrete products", blurb: "Other decorative and architectural concrete pieces." },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? "Concrete products";

export const availabilityLabel: Record<string, string> = {
  in_stock: "In stock",
  made_to_order: "Made to order",
  on_request: "Availability on request",
  out_of_stock: "Out of stock",
};
