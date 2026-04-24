import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MenuMenu" },
      { name: "description", content: "Get in touch with the MenuMenu team. We'd love to hear from you." },
      { property: "og:title", content: "Contact MenuMenu" },
      { property: "og:description", content: "Get in touch with the MenuMenu team. We'd love to hear from you." },
    ],
  }),
  component: ContactPage,
});

const cards = [
  { icon: Phone, t: "Phone",   b: "+234 800 000 0000",        s: "Mon–Sat, 9am–6pm" },
  { icon: Mail,  t: "Email",   b: "hello@menumenu.app",        s: "We reply within 24h" },
  { icon: MapPin,t: "Address", b: "12 Admiralty Way, Lekki",   s: "Lagos, Nigeria" },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="We're listening" title="Get in touch" subtitle="Question, partnership, or feedback — drop us a note." />

      <section className="section">
        <div className="container-mm grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.t} className="card-mm p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: "var(--gradient-primary)" }}><c.icon className="h-5 w-5" /></span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.t}</p>
              <p className="mt-1 text-base font-extrabold">{c.b}</p>
              <p className="text-xs text-muted-foreground">{c.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container-mm max-w-2xl">
          <div className="card-mm p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold">Send a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We typically reply within one business day.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="mt-6 grid gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Name</span>
                  <input required className="input-mm" placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Email</span>
                  <input required type="email" className="input-mm" placeholder="you@example.com" />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Subject</span>
                <input className="input-mm" placeholder="How can we help?" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Message</span>
                <textarea required rows={5} className="textarea-mm" placeholder="Tell us a bit more…" />
              </label>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                {sent ? <><Check className="h-4 w-4" /> Sent!</> : <><Send className="h-4 w-4" /> Send message</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
