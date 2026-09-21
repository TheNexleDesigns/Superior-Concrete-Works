import type { Metadata } from "next";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <div className="page-top">
      <div className="container page-head"><h1 className="display h1">Privacy Policy</h1></div>
      <div className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
      <div className="prose">
        <p>This page explains how this website handles the information you give us.</p>
        <h2>What we collect</h2>
        <p>When you send a quote request or place an order, we collect the details you type in: your name, phone or WhatsApp number, and, if you choose to add them, your email, country, delivery address and notes. We also save the products and quantities you ask about.</p>
        <p>Your cart is stored in your own browser so it is still there when you come back. It is not sent to us until you place an order.</p>
        <h2>How we use it</h2>
        <p>We use your details to reply to you, prepare quotes, confirm orders and arrange delivery or shipping.</p>
        <h2>WhatsApp, Facebook and TikTok</h2>
        <p>Buttons on this site open WhatsApp, Facebook or TikTok. Nothing is sent to WhatsApp until you press send there. Those services have their own privacy policies.</p>
        <h2>Storage</h2>
        <p>Requests and orders are stored in the website&apos;s database, which only the business owner can view.</p>
        <h2>Questions</h2>
        <p>To ask about your information, call or message us on {site.phoneDisplay}.</p>
      </div>
      </div>
    </div>
  );
}
