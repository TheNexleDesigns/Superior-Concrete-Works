import { formatTTD } from "@/lib/format";
import { showDemoBadges } from "@/lib/config";
import type { Product } from "@/lib/types";

/** Shows the TTD price, or "Request a quote" when no price is set. Never converts currencies. */
export function Price({ product, large = false }: { product: Pick<Product, "price" | "is_demo">; large?: boolean }) {
  if (product.price === null) {
    return <span className={large ? "price pdp__price" : "price"}>Request a quote</span>;
  }
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
      <span className={large ? "price pdp__price" : "price"}>{formatTTD(product.price)}</span>
      {showDemoBadges && product.is_demo && <span className="tag">Sample price</span>}
    </span>
  );
}
