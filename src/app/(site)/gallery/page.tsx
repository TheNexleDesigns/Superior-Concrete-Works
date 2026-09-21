import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/GalleryGrid";
import { IconFacebook, IconTikTok } from "@/components/Icons";
import { getGallery } from "@/lib/data";
import { site } from "@/lib/config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description: "Concrete balusters, columns, flower pots and window moulds from Superior Concrete Works.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <div className="page-top">
      <div className="container page-head">
        <h1 className="display h1">Gallery</h1>
        <p className="lead muted">Balusters, columns, flower pots, window moulds and finished work.</p>
      </div>
      <div className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        {items.length > 0 ? (
          <GalleryGrid items={items} />
        ) : (
          <div className="empty">
            <p className="lead">Photos are coming soon.</p>
            <p className="muted" style={{ maxWidth: "52ch" }}>In the meantime, you can see recent work on our Facebook and TikTok pages, or ask us for pictures of a specific product.</p>
            <div className="btn-row">
              <a className="btn btn--solid" href={site.tiktok} target="_blank" rel="noopener noreferrer"><IconTikTok /> TikTok</a>
              <a className="btn btn--line" href={site.facebook} target="_blank" rel="noopener noreferrer"><IconFacebook /> Facebook</a>
              <Link className="btn btn--line" href="/contact">Ask for photos</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
