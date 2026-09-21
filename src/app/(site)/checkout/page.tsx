import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="page-top">
      <div className="container page-head"><h1 className="display h1">Checkout</h1></div>
      <div className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}><CheckoutForm /></div>
    </div>
  );
}
