"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/config";
import { waLink, waGeneralMessage } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";
import { BrandMark, IconBag, IconClose, IconMenu, IconPhone, IconWhatsApp } from "./Icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const home = pathname === "/";
  const solid = !home || scrolled || open;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); menuBtn.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="site-header" data-solid={solid}>
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label={`${site.name} home`}>
            <BrandMark className="brand__mark" />
            <span className="brand__name">Superior<br />Concrete Works</span>
          </Link>
          <nav className="nav" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isCurrent(l.href) ? "page" : undefined}>{l.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/cart" className="icon-btn" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
              <IconBag />
              {count > 0 && <span className="cart-count" aria-hidden>{count}</span>}
            </Link>
            <Link href="/contact" className="btn btn--light btn--sm header-cta">Request a quote</Link>
            <button ref={menuBtn} type="button" className="icon-btn menu-btn" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className="menu-panel" data-open={open} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
        <div className="menu-panel__top">
          <span className="brand"><BrandMark className="brand__mark" /><span className="brand__name">Superior<br />Concrete Works</span></span>
          <button type="button" className="icon-btn" aria-label="Close menu" onClick={() => { setOpen(false); menuBtn.current?.focus(); }}>
            <IconClose />
          </button>
        </div>
        <nav aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isCurrent(l.href) ? "page" : undefined}>{l.label}</Link>
          ))}
          <Link href="/cart">Cart{count > 0 ? ` (${count})` : ""}</Link>
        </nav>
        <div className="menu-panel__foot">
          <Link href="/contact" className="btn btn--light">Request a quote</Link>
          <a className="btn btn--wa" href={waLink(waGeneralMessage())} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp us</a>
          <a className="btn btn--line" href={site.phoneTel}><IconPhone /> {site.phoneDisplay}</a>
        </div>
      </div>
    </>
  );
}
