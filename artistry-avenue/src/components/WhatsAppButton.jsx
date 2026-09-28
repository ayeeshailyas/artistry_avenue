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
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-9 w-9 fill-none stroke-white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L4 20l.9-3.7A8.5 8.5 0 1 1 20.5 11.7Z" />
        <path d="M8.3 7.8c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4-.1.6.5 1 1.2 1.7 2.2 2.2.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .4-.2 1.1-.7 1.5-.5.4-1.1.6-1.8.5-1-.1-2.4-.7-3.8-1.9-1.1-1-1.9-2.2-2.1-3.2-.2-1 .1-2.1.4-2.5Z" />
      </svg>
    </a>
  );
}
