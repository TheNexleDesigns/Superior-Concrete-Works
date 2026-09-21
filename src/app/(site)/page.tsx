import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { CategoryPanels } from "@/components/CategoryPanels";
import { MoldScrub } from "@/components/MoldScrub";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { HeroArt } from "@/components/HeroArt";
import { IconWhatsApp } from "@/components/Icons";
import { site } from "@/lib/config";
import { getGallery, getProducts } from "@/lib/data";
import { waLink, waGeneralMessage } from "@/lib/whatsapp";

export const revalidate = 60;

const uses = [
  ["Balconies", "A row of balusters gives the rail its rhythm."],
  ["Verandas", "Turned shapes that set the tone from the street."],
  ["Staircases", "A steady line that follows the climb."],
  ["Entrances", "The first detail people notice at the front door."],
  ["Terraces", "Character for outdoor living spaces."],
];

export default async function HomePage() {
  const [products, gallery] = await Promise.all([getProducts(), getGallery()]);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="range-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div style={{ display: "grid", gap: "1rem" }}>
              <h2 id="range-title" className="display h2">What we make.</h2>
              <p className="lead muted">Balusters, columns, flower pots, window moulds and more. Pick a category, or ask about something specific.</p>
            </div>
            <Link href="/products" className="btn btn--line">All products</Link>
          </div>
          <CategoryPanels />
        </div>
      </section>

      <MoldScrub />

      <section className="section" aria-labelledby="uses-title">
        <div className="container split">
          <Reveal>
            <h2 id="uses-title" className="display h2">Where balusters fit.</h2>
            <p className="lead muted" style={{ marginTop: "1.25rem" }}>
              A baluster is a detail people see every day. Tell us about your project and we will help you work out what you need.
            </p>
            <div className="btn-row" style={{ marginTop: "1.75rem" }}>
              <Link href="/contact" className="btn btn--solid">Request a quote</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="uses">
              {uses.map(([name, text]) => (
                <li key={name}>
                  <h3 className="h3">{name}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section" style={{ background: "var(--slab-2)" }} aria-labelledby="featured-title">
          <div className="container">
            <div className="section-head section-head--split">
              <h2 id="featured-title" className="display h2">Featured pieces.</h2>
              <Link href="/products" className="link">Browse every product</Link>
            </div>
            <div className="pgrid pgrid--4">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section on-dark grain" aria-labelledby="order-title">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-head">
            <h2 id="order-title" className="display h2">Order from anywhere.</h2>
            <p className="lead muted">
              International orders are arranged directly with us on WhatsApp. {site.currencyNote}
            </p>
          </div>
          <Reveal>
            <ol className="steps">
              <li>
                <h3 className="h3">Choose your pieces</h3>
                <p>Add products to your cart, or request a quote if you need something specific.</p>
              </li>
              <li>
                <h3 className="h3">Send your order</h3>
                <p>We save your order and open a WhatsApp chat with the details filled in.</p>
              </li>
              <li>
                <h3 className="h3">Confirm with us</h3>
                <p>We confirm prices, payment and delivery with you directly, including shipping outside Trinidad &amp; Tobago.</p>
              </li>
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="care-title">
        <div className="container split">
          <Reveal>
            <h2 id="care-title" className="display h2">Built with care.</h2>
            <p className="lead muted" style={{ marginTop: "1.25rem" }}>
              We listen first. Every order gets proper attention, and we do our best to give each customer what they need.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="care-list">
              <li><h3 className="h3">We listen</h3><p>Tell us what you are building and what you need.</p></li>
              <li><h3 className="h3">We pay attention</h3><p>Sizes, quantities and details matter, and we treat them that way.</p></li>
              <li><h3 className="h3">We build to last</h3><p>Strong pieces, made with craftsmanship and finished with care.</p></li>
              <li><h3 className="h3">We keep it straightforward</h3><p>Clear, professional service from your first message.</p></li>
            </ul>
          </Reveal>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section--tight" style={{ paddingBottom: "clamp(4rem, 9vw, 8rem)" }} aria-labelledby="gallery-title">
          <div className="container">
            <div className="section-head section-head--split">
              <h2 id="gallery-title" className="display h2">Recent work.</h2>
              <Link href="/gallery" className="link">See the gallery</Link>
            </div>
            <div className="pgrid pgrid--4">
              {gallery.slice(0, 4).map((g) => (
                <Link key={g.id} href="/gallery" className="pcard">
                  <div className="pcard__media">
                    <Image src={g.image_url} alt={g.alt || g.caption || "Concrete work"} fill sizes="(max-width: 900px) 50vw, 25vw" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-final on-dark grain" aria-labelledby="cta-title">
        <div className="cta-final__art" aria-hidden><HeroArt /></div>
        <div className="container cta-final__inner">
          <h2 id="cta-title" className="display h1" style={{ maxWidth: "14ch" }}>Let&apos;s build something that lasts.</h2>
          <p className="lead muted">Have a project in mind? Talk to Superior Concrete Works about the concrete products you need.</p>
          <div className="btn-row">
            <Link href="/contact" className="btn btn--light">Request a quote</Link>
            <a href={waLink(waGeneralMessage())} className="btn btn--wa" target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  );
}
