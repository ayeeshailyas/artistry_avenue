import { MessageCircle } from "lucide-react";

// Set VITE_WHATSAPP_NUMBER in .env to the studio's real WhatsApp Business
// number, in international format with no leading + or spaces (e.g. 923001234567).
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "923000000000";

export function whatsAppLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export default function WhatsAppButton() {
  const defaultMessage =
    "Hello Artistry Avenue! I'd like to ask about an order.";

  return (
    <a
      href={whatsAppLink(defaultMessage)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] shadow-lift flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-300 ease-silk"
    >
      <MessageCircle size={26} className="text-white" fill="white" />
    </a>
  );
}
