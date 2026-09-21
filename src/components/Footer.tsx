import Link from "next/link";
import { site } from "@/lib/config";
import { waLink, waGeneralMessage } from "@/lib/whatsapp";
import { BrandMark, IconFacebook, IconPhone, IconTikTok, IconWhatsApp } from "./Icons";

export function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: "1rem" }}>
              <BrandMark className="brand__mark" />
              <span className="brand__name">Superior<br />Concrete Works</span>
            </div>
            <p className="muted small" style={{ maxWidth: "34ch" }}>
              Concrete balusters, columns, flower pots, window moulds and more. Based in Trinidad &amp; Tobago, with an online presence for customers wherever they are.
            </p>
            <p className="muted small" style={{ marginTop: "1rem", maxWidth: "34ch" }}>{site.currencyNote}</p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/cart">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h2>Products</h2>
            <ul>
              <li><Link href="/products?category=balusters">Balusters</Link></li>
              <li><Link href="/products?category=columns">Columns</Link></li>
              <li><Link href="/products?category=flower-pots">Flower pots</Link></li>
              <li><Link href="/products?category=window-moulds">Window moulds</Link></li>
              <li><Link href="/products?category=molds">Balustrade molds</Link></li>
            </ul>
          </div>
          <div>
            <h2>Get in touch</h2>
            <ul>
              <li><a href={site.phoneTel}><IconPhone /> {site.phoneDisplay}</a></li>
              <li><a href={waLink(waGeneralMessage())} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp</a></li>
              <li><a href={site.facebook} target="_blank" rel="noopener noreferrer"><IconFacebook /> Facebook</a></li>
              <li><a href={site.tiktok} target="_blank" rel="noopener noreferrer"><IconTikTok /> TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Superior Concrete Works. All rights reserved.</span>
          <span style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
