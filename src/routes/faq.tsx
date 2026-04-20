import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — MenuMenu" },
      { name: "description", content: "Answers to common questions about ordering, delivery, and your MenuMenu account." },
      { property: "og:title", content: "MenuMenu FAQ" },
      { property: "og:description", content: "Answers to common questions about ordering, delivery, and your MenuMenu account." },
    ],
  }),
  component: FAQPage,
});

const groups = [
  {
    name: "Ordering",
    items: [
      { q: "How do I place an order?", a: "Browse meals, tap Add to cart, then check out. You'll get an order confirmation by email and SMS." },
      { q: "Can I order from multiple kitchens at once?", a: "Yes — each kitchen prepares its own order. We bundle the experience and keep you updated for each." },
      { q: "What payment methods are supported?", a: "Debit cards, bank transfers, and select wallets at checkout." },
    ],
  },
  {
    name: "Delivery",
    items: [
      { q: "Do you deliver everywhere?", a: "We deliver in 20+ cities and growing. Pickup is available for every kitchen." },
      { q: "How long does delivery take?", a: "Most meals arrive within 30–60 minutes depending on distance and prep time." },
      { q: "Can I schedule a delivery?", a: "Yes — pick a future time at checkout for select kitchens." },
    ],
  },
  {
    name: "Account",
    items: [
      { q: "How do I reset my password?", a: "Use the 'Forgot password' link on the sign-in page. We'll email you a reset link." },
      { q: "Can I follow a kitchen?", a: "Yes — sign in and tap Follow on any kitchen page to get notified about new meals." },
      { q: "How do I become a vendor?", a: "Reach out from our Contact page — we'll walk you through onboarding." },
    ],
  },
];

function FAQPage() {
  const [open, setOpen] = useState<string | null>("0-0");
  return (
    <>
      <PageHero eyebrow="Help center" title="Frequently asked questions" subtitle="Quick answers to keep things moving." />
      <section className="section">
        <div className="container-mm max-w-3xl space-y-10">
          {groups.map((g, gi) => (
            <div key={g.name}>
              <h2 className="mb-3 text-xl font-extrabold">{g.name}</h2>
              <div className="card-mm divide-y divide-border">
                {g.items.map((it, i) => {
                  const id = `${gi}-${i}`;
                  const isOpen = open === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setOpen(isOpen ? null : id)}
                      className="block w-full p-5 text-left transition hover:bg-secondary/50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-extrabold sm:text-base">{it.q}</span>
                        <ChevronDown className={`h-5 w-5 flex-none text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                      {isOpen && <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="card-mm p-6 text-center" style={{ background: "var(--gradient-primary)", color: "white" }}>
            <p className="text-lg font-extrabold">Still need help?</p>
            <p className="mt-1 text-sm text-white/85">Our team replies within 24 hours.</p>
            <Link to="/contact" className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-foreground">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
