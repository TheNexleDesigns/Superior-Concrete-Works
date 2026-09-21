import type { Metadata } from "next";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <div className="page-top">
      <div className="container page-head"><h1 className="display h1">Terms &amp; Conditions</h1></div>
      <div className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
      <div className="prose">
        <h2>Prices</h2>
        <p>{site.currencyNote} We do not convert prices into other currencies. Where a product shows &quot;Request a quote&quot;, the price is confirmed with you directly.</p>
        <h2>Orders and quotes</h2>
        <p>Orders and quote requests made through this website are requests. An order is confirmed when Superior Concrete Works confirms the price, availability, payment and delivery with you, usually on WhatsApp. No payment is taken on this website.</p>
        <h2>Delivery and shipping</h2>
        <p>Delivery, and shipping outside Trinidad &amp; Tobago, are arranged directly with us. Contact us to discuss what is possible for your order.</p>
        <h2>Product information and images</h2>
        <p>We do our best to keep product details accurate. Images marked as illustrative show the style of a product and may differ from the finished item. Please ask us if you need to confirm a detail before you order.</p>
        <h2>Contact</h2>
        <p>Questions about these terms? Call or message us on {site.phoneDisplay}.</p>
      </div>
      </div>
    </div>
  );
}
