import Link from "next/link";
import { site } from "@/lib/config";
import { waLink, waGeneralMessage } from "@/lib/whatsapp";
import { IconMail, IconPhone, IconWhatsApp } from "./Icons";

/** Call / WhatsApp / Quote, always in reach on phones. On desktop the round WhatsApp button takes over. */
export function MobileBar() {
  return (
    <>
      <nav className="mobile-bar" aria-label="Quick contact">
        <a href={site.phoneTel}><IconPhone /> Call</a>
        <a className="is-wa" href={waLink(waGeneralMessage())} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp</a>
        <Link href="/contact"><IconMail /> Quote</Link>
      </nav>
      <a className="wa-fab" href={waLink(waGeneralMessage())} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <IconWhatsApp />
      </a>
    </>
  );
}
