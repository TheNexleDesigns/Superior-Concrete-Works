import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import { IconFacebook, IconPhone, IconTikTok, IconWhatsApp } from "@/components/Icons";
import { getProducts } from "@/lib/data";
import { site } from "@/lib/config";
import { waLink, waGeneralMessage } from "@/lib/whatsapp";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Ask Superior Concrete Works about balusters, columns, flower pots, window moulds and more. Send a quote request, call, or message us on WhatsApp.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const products = await getProducts();
  const options = products.map((p) => ({ slug: p.slug, name: p.name }));
  return (
    <div className="page-top">
      <div className="container page-head">
        <h1 className="display h1">Request a quote</h1>
        <p className="lead muted">Tell us what you need. Ask about one product or several. Only your name and a way to reach you are required.</p>
      </div>
      <div className="container split" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <Suspense fallback={<p className="muted">Loading the form…</p>}>
          <QuoteForm options={options} />
        </Suspense>
        <aside style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <h2 className="h3">Or reach us directly</h2>
          <div className="contact-list">
            <a href={waLink(waGeneralMessage())} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp {site.phoneDisplay}</a>
            <a href={site.phoneTel}><IconPhone /> Call {site.phoneDisplay}</a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer"><IconFacebook /> Facebook</a>
            <a href={site.tiktok} target="_blank" rel="noopener noreferrer"><IconTikTok /> TikTok</a>
          </div>
          <p className="small muted">Based in Trinidad &amp; Tobago. Customers outside Trinidad &amp; Tobago are welcome to get in touch, and international orders are arranged directly with us on WhatsApp. {site.currencyNote}</p>
        </aside>
      </div>
    </div>
  );
}
