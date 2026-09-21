import { site } from "./config";

export function waLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const waProductMessage = (name: string) =>
  `Hi Superior Concrete Works, I'm interested in your ${name}. Could you provide more information and pricing?`;

export const waGeneralMessage = () =>
  "Hi Superior Concrete Works, I'd like to ask about your concrete products.";
