import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/OrderConfirmation";

export const metadata: Metadata = { title: "Order received", robots: { index: false } };

export default function OrderPage() {
  return (
    <div className="page-top">
      <div className="container page-head"><h1 className="display h1">Thank you.</h1></div>
      <div className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}><OrderConfirmation /></div>
    </div>
  );
}
