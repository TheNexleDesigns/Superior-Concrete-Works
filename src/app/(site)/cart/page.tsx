import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="page-top">
      <div className="container page-head"><h1 className="display h1">Your cart</h1></div>
      <div className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}><CartView /></div>
    </div>
  );
}
