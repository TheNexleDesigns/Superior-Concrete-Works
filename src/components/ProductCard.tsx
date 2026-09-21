import Image from "next/image";
import Link from "next/link";
import { categoryName } from "@/lib/config";
import type { Product } from "@/lib/types";
import { Price } from "./Price";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const img = product.images?.[0];
  return (
    <Link href={`/products/${product.slug}`} className="pcard">
      <div className="pcard__media">
        {img ? (
          <Image src={img.url} alt={img.alt || product.name} fill sizes="(max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw" priority={priority} />
        ) : (
          <ProductArt category={product.category} uid={product.slug} title={product.name} />
        )}
      </div>
      <div className="pcard__meta">
        <span className="pcard__cat">{categoryName(product.category)}</span>
        <h3 className="h3">{product.name}</h3>
        <div className="pcard__price"><Price product={product} /></div>
      </div>
    </Link>
  );
}
