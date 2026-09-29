import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { whatsAppLink } from "./WhatsAppButton";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    showToast("You're on the list — welcome to the Avenue.");
    setEmail("");
  }

  return (
    <footer className="bg-paper-dim border-t border-hairline">
      <div className="max-w-container mx-auto px-5 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Artistry Avenue" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-lg text-plum">Artistry Avenue</span>
          </div>
          <p className="text-sm text-stone leading-relaxed max-w-xs">
            Sparkle stationery, considered down to the last page. Journals, fine
            writing and small desk objects made to be kept, not just used.
          </p>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-plum uppercase mb-4">Shop</h4>
          <ul className="flex flex-col gap-3 text-sm text-stone">
            <li><Link to="/shop/journals" className="hover:text-wine">Journals</Link></li>
            <li><Link to="/shop/writing" className="hover:text-wine">Fine Writing</Link></li>
            <li><Link to="/shop/cards" className="hover:text-wine">Greeting Cards</Link></li>
            <li><Link to="/shop/desk" className="hover:text-wine">Desk Edit</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-plum uppercase mb-4">Support</h4>
          <ul className="flex flex-col gap-3 text-sm text-stone">
            <li><Link to="/about" className="hover:text-wine">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-wine">Contact</Link></li>
            <li><a href={whatsAppLink("Hello Artistry Avenue! I have a question.")} target="_blank" rel="noreferrer" className="hover:text-wine">WhatsApp Us</a></li>
            <li><Link to="/account" className="hover:text-wine">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-plum uppercase mb-4">Stay in touch</h4>
          <p className="text-sm text-stone mb-4">Early access to new collections & studio notes.</p>

          <div className="flex flex-col items-start gap-3 text-sm text-plum">
            <a href="https://www.instagram.com/artistry_avenue16/" target="_blank" rel="noreferrer" aria-label="Instagram: artistry_avenue16" className="inline-flex items-center gap-2 hover:text-wine">
              <InstagramIcon />
              <span>artistry_avenue16</span>
            </a>

            <a href="mailto:artistry.ave16@gmail.com" aria-label="Email us: artistry.ave16@gmail.com" className="inline-flex flex-wrap items-center gap-2 hover:text-wine">
              <Mail size={18} />
              <span>artistry.ave16@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="max-w-container mx-auto px-5 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone">
          <span>© {new Date().getFullYear()} Artistry Avenue. All rights reserved.</span>
          <span>Handled with care, wrapped with a seal.</span>
        </div>
      </div>
    </footer>
  );
}
