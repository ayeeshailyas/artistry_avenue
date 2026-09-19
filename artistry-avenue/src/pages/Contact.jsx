import { useState } from "react";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useToast } from "../context/ToastContext";
import { whatsAppLink } from "../components/WhatsAppButton";

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    showToast("Message sent — we'll reply within a day.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 md:px-10 py-16">
        <p className="text-xs tracking-widest2 text-wine uppercase mb-2">Get in Touch</p>
        <h1 className="font-display text-4xl text-plum mb-12">Contact the Studio</h1>

        <div className="grid md:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-stone">Name</span>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-transparent border-b border-plum/30 focus:border-wine py-2 text-sm text-plum outline-none transition-colors"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-stone">Email</span>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="bg-transparent border-b border-plum/30 focus:border-wine py-2 text-sm text-plum outline-none transition-colors"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-stone">Message</span>
              <textarea
                required
                rows={5}
                name="message"
                value={form.message}
                onChange={handleChange}
                className="bg-transparent border-b border-plum/30 focus:border-wine py-2 text-sm text-plum outline-none transition-colors resize-none"
              />
            </label>
            <button
              type="submit"
              className="self-start bg-plum text-paper text-sm tracking-wide px-8 py-3.5 rounded-pill hover:bg-wine transition-colors duration-300 mt-2"
            >
              Send Message
            </button>
          </form>

          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <Mail size={19} className="text-wine shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm text-plum mb-1">Email</h3>
                <p className="text-sm text-stone">hello@artistryavenue.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MessageCircle size={19} className="text-wine shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm text-plum mb-1">WhatsApp</h3>
                <a
                  href={whatsAppLink("Hello Artistry Avenue! I have a question.")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-stone hover:text-wine link-grow"
                >
                  Chat with the studio
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin size={19} className="text-wine shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm text-plum mb-1">Studio</h3>
                <p className="text-sm text-stone">Faisalabad, Punjab, Pakistan</p>
              </div>
            </div>
            <div className="rounded-soft overflow-hidden aspect-video mt-2">
              <img
                src="https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=1000&q=80"
                alt="Studio desk"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
