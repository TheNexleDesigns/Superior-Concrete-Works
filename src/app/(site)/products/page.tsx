import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductBrowser } from "@/components/ProductBrowser";
import { getProducts } from "@/lib/data";
import { site } from "@/lib/config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products",
  description: "Concrete balusters, columns, flower pots, window moulds and balustrade molds from Superior Concrete Works in Trinidad & Tobago.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="page-top">
      <div className="container page-head">
        <h1 className="display h1">Products</h1>
        <p className="lead muted">Browse the range, add pieces to your cart, or ask us for a quote. {site.currencyNote}</p>
      </div>
      <div className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <Suspense fallback={<p className="muted">Loading products…</p>}>
          <ProductBrowser products={products} />
        </Suspense>
      </div>
    </div>
  );
}
