import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { site } from "@/lib/config";
import { waLink, waGeneralMessage } from "@/lib/whatsapp";
import { HeroArt } from "./HeroArt";
import { HeroVideo } from "./HeroVideo";
import { Parallax } from "./Parallax";
import { IconWhatsApp } from "./Icons";

// The video layer only exists if you have added /public/hero/hero.mp4. Add hero-poster.jpg too for a still frame while it loads.
const hasVideo = existsSync(join(process.cwd(), "public/hero/hero.mp4"));
const hasPoster = existsSync(join(process.cwd(), "public/hero/hero-poster.jpg"));

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

export function Hero() {
  return (
    <section className="hero on-dark" aria-labelledby="hero-title">
      <Parallax className="hero__art"><HeroArt /></Parallax>
      {hasVideo && <HeroVideo poster={hasPoster ? "/hero/hero-poster.jpg" : undefined} />}
      <div className="hero__scrim" />
      <div className="container hero__content">
        <h1 id="hero-title" className="display h-hero hero__title">
          <span className="line"><span style={d(0.55)}>Concrete</span></span>
          <span className="line"><span style={d(0.67)}>crafted</span></span>
          <span className="line"><span style={d(0.79)}>to last.</span></span>
        </h1>
        <p className="hero__sub">
          Balusters, columns, flower pots and window moulds from Trinidad &amp; Tobago. Made strong, finished with care.
        </p>
        <div className="btn-row hero__actions">
          <Link href="/contact" className="btn btn--light">Request a quote</Link>
          <Link href="/products" className="btn btn--line">Explore products</Link>
          <a href={waLink(waGeneralMessage())} className="btn btn--wa" target="_blank" rel="noopener noreferrer">
            <IconWhatsApp /> WhatsApp us
          </a>
        </div>
        <p className="hero__note">{site.currencyNote}</p>
      </div>
    </section>
  );
}
