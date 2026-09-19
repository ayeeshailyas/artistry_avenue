import { Link } from "react-router-dom";
import { Camera, Globe, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { whatsAppLink } from "./WhatsAppButton";

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
          <form onSubmit={handleSubscribe} className="flex items-center border-b border-plum/40 pb-2 mb-5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-transparent outline-none text-sm text-plum placeholder:text-stone flex-1"
            />
            <button type="submit" className="text-sm text-wine hover:text-wine-dark">Join</button>
          </form>
          <div className="flex items-center gap-4 text-plum">
            <a href="#" aria-label="Instagram" className="hover:text-wine"><Camera size={17} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-wine"><Globe size={17} /></a>
            <a href="mailto:hello@artistryavenue.com" aria-label="Email" className="hover:text-wine"><Mail size={17} /></a>
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
