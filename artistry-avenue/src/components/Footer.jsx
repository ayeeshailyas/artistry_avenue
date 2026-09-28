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

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3ZM8.4 18H6V10.3h2.4V18ZM7.2 9.2a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8ZM18 18h-2.4v-3.7c0-.9 0-2.1-1.3-2.1s-1.5 1-1.5 2V18h-2.4v-7.7h2.3v1.1h.1c.3-.6 1.1-1.3 2.3-1.3 2.5 0 2.9 1.6 2.9 3.8V18Z" />
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

          <div className="flex items-center gap-4 text-plum">
            {/* Replace these placeholder URLs with your own social profile links. */}
            <a href="https://www.instagram.com/artistry_avenue16?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" aria-label="Instagram" className="hover:text-wine">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-wine">
              <LinkedInIcon />
            </a>
            <a href="mailto:hello@artistryavenue.com" aria-label="Email" className="hover:text-wine">
              <Mail size={18} />
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
