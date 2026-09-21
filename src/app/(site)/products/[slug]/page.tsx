import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/ProductActions";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { Price } from "@/components/Price";
import { GalleryPicker } from "@/components/GalleryPicker";
import { availabilityLabel, categoryName, site } from "@/lib/config";
import { getProduct, getProducts } from "@/lib/data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product not found" };
  const description = p.short_description ?? `${p.name} from Superior Concrete Works in Trinidad & Tobago.`;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description, url: `/products/${p.slug}`, images: p.images?.[0] ? [{ url: p.images[0].url }] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();

  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const paras = (product.description ?? "").split(/\n{2,}/).filter(Boolean);
  const illustrative = product.images?.some((i) => i.illustrative);

  // Structured data. Price is only published when it is a real (non-demo) TTD price.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? undefined,
    category: categoryName(product.category),
    brand: { "@type": "Brand", name: site.name },
    image: product.images?.map((i) => (i.url.startsWith("http") ? i.url : `${site.url}${i.url}`)),
    offers:
      product.price !== null && !product.is_demo
        ? { "@type": "Offer", price: product.price.toFixed(2), priceCurrency: "TTD", url: `${site.url}/products/${product.slug}` }
        : undefined,
  };

  return (
    <div className="page-top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container" style={{ paddingBlock: "1.5rem 4rem" }}>
        <nav aria-label="Breadcrumb" className="small muted" style={{ marginBottom: "1.5rem" }}>
          <Link href="/products">Products</Link> / <Link href={`/products?category=${product.category}`}>{categoryName(product.category)}</Link> / <span aria-current="page">{product.name}</span>
        </nav>
        <div className="pdp">
          <div className="pdp__gallery">
            {product.images?.length ? (
              <GalleryPicker images={product.images} name={product.name} />
            ) : (
              <div className="pdp__main"><ProductArt category={product.category} uid="pdp" title={product.name} /></div>
            )}
            {illustrative && <p className="pdp__caption">Illustrative image. Photos of the finished product are on the way.</p>}
          </div>
          <div className="pdp__info">
            <div>
              <p className="muted">{categoryName(product.category)}</p>
              <h1 className="display h1" style={{ fontSize: "var(--fs-h2)", marginTop: "0.5rem" }}>{product.name}</h1>
            </div>
            <div>
              <Price product={product} large />
              <p className="small muted" style={{ marginTop: "0.4rem" }}>{site.currencyNote}</p>
            </div>
            {product.short_description && <p className="lead">{product.short_description}</p>}
            {paras.length > 0 && <div className="prose muted">{paras.map((t, i) => <p key={i}>{t}</p>)}</div>}
            <dl className="dl">
              <div><dt>Availability</dt><dd>{availabilityLabel[product.availability]}</dd></div>
              {product.details?.map((d) => (<div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>))}
            </dl>
            <ProductActions product={product} />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="section" style={{ background: "var(--slab-2)" }} aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title" className="display h2" style={{ marginBottom: "2rem" }}>More like this.</h2>
            <div className="pgrid pgrid--4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}
    </div>
  );
}
