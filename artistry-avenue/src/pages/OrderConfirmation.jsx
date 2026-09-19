import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { formatPrice } from "../lib/format";
import { whatsAppLink } from "../components/WhatsAppButton";

export default function OrderConfirmation() {
  const { state } = useLocation();

  if (!state?.order) return <Navigate to="/" replace />;

  const { order } = state;
  const isWhatsApp = order.payment_method === "whatsapp";

  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 md:px-10 py-24 min-h-[60vh] flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center mb-6">
          <CheckCircle2 size={34} className="text-wine" />
        </div>

        {isWhatsApp ? (
          <>
            <h1 className="font-display text-3xl text-plum mb-3">Almost there</h1>
            <p className="text-stone max-w-md mb-2 leading-relaxed">
              Your order has been saved and WhatsApp should have opened with the details
              already filled in. Just hit send, and our studio will confirm availability
              and payment with you directly.
            </p>
            <p className="text-wine font-display text-xl mb-8">{order.id}</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl text-plum mb-3">Order placed</h1>
            <p className="text-stone max-w-md mb-2 leading-relaxed">
              Thank you — your order has been received and saved to our system.
              Reference number:
            </p>
            <p className="text-wine font-display text-xl mb-4">{order.id}</p>
            <p className="text-stone mb-8">
              Total due on delivery: <span className="text-plum">{formatPrice(order.total)}</span>
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link to="/shop" className="bg-plum text-paper text-sm px-7 py-3.5 rounded-pill hover:bg-wine transition-colors">
            Continue Shopping
          </Link>
          {isWhatsApp ? (
            <a
              href={whatsAppLink(`Following up on my order ${order.id} — just checking in!`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-hairline text-plum text-sm px-7 py-3.5 rounded-pill hover:border-[#25D366] hover:text-[#128C4A] transition-colors"
            >
              <MessageCircle size={15} /> Open WhatsApp again
            </a>
          ) : (
            <a
              href={whatsAppLink(`Hi! I'd like to check on my order ${order.id}.`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-hairline text-plum text-sm px-7 py-3.5 rounded-pill hover:border-[#25D366] hover:text-[#128C4A] transition-colors"
            >
              <MessageCircle size={15} /> Chat with the studio
            </a>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
