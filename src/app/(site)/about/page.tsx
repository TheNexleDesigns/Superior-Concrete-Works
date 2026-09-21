import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Superior Concrete Works makes strong, lasting concrete products in Trinidad & Tobago, from balusters and columns to flower pots and window moulds.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="page-top">
      <div className="container page-head">
        <h1 className="display h1" style={{ maxWidth: "16ch" }}>Strong pieces, made to last.</h1>
        <p className="lead muted">Superior Concrete Works makes concrete products in Trinidad &amp; Tobago, and takes proper care of the customers who order them.</p>
      </div>

      <section className="section--tight" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="container split">
          <Reveal>
            <h2 className="display h2">What we make.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="prose">
              <p>We make concrete balusters, columns, flower pots and window moulds, along with other decorative and architectural concrete pieces. We also offer balustrade molds.</p>
              <p>Our pieces are used on balconies, verandas, staircases, entrances and terraces, and in gardens and outdoor spaces.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section on-dark grain">
        <div className="container split" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <h2 className="display h2">How we work.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="prose">
              <p>Concrete is heavy, permanent and honest. We put that into everything we make: strength, durability and attention to detail.</p>
              <p>We take proper care of our customers. We listen to what you need, and we do our best to satisfy every client.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal>
            <h2 className="display h2">Based in Trinidad &amp; Tobago.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="prose">
              <p>We serve customers locally, and this website gives customers everywhere a way to see what we make and get in touch.</p>
              <p>Outside Trinidad &amp; Tobago? International orders are arranged directly with us on WhatsApp.</p>
              <div className="btn-row" style={{ marginTop: "1.5rem" }}>
                <Link href="/contact" className="btn btn--solid">Request a quote</Link>
                <Link href="/products" className="btn btn--line">Explore products</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
