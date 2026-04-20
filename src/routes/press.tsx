import { createFileRoute } from "@tanstack/react-router";
import { Download, Mail } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press — MenuMenu" },
      { name: "description", content: "MenuMenu in the press. Latest coverage, brand assets and media contact." },
      { property: "og:title", content: "MenuMenu Press" },
      { property: "og:description", content: "Latest coverage, brand assets and media contact." },
    ],
  }),
  component: PressPage,
});

const stats = [
  { v: "$5M+",  l: "Paid out to vendors" },
  { v: "20+",   l: "Cities" },
  { v: "4.7★",  l: "Avg vendor rating" },
];
const logos = ["TechCabal", "Business Day", "Pulse", "Guardian NG", "TechCrunch", "Nairametrics"];
const coverage = [
  { t: "How MenuMenu is rewriting last-mile food delivery", o: "TechCabal", d: "Apr 2026" },
  { t: "The marketplace bringing home kitchens online",     o: "Business Day", d: "Mar 2026" },
  { t: "Why food vendors are flocking to MenuMenu",          o: "Pulse",        d: "Feb 2026" },
];

function PressPage() {
  return (
    <>
      <PageHero eyebrow="Newsroom" title="MenuMenu in the press" subtitle="Coverage, milestones, and resources for journalists." />

      <section className="section">
        <div className="container-mm">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.l} className="card-mm p-6 text-center">
                <p className="text-3xl font-black" style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.v}</p>
                <p className="mt-1 text-sm font-bold text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-mm">
          <h2 className="section-title">As seen in</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((l) => (
              <div key={l} className="card-mm flex items-center justify-center px-4 py-6 text-center">
                <span className="text-sm font-extrabold tracking-tight text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-mm">
          <h2 className="section-title">Latest coverage</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {coverage.map((c) => (
              <a key={c.t} href="#" className="card-mm flex flex-col p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{c.o}</span>
                <p className="mt-2 text-base font-extrabold leading-snug">{c.t}</p>
                <span className="mt-auto pt-4 text-xs text-muted-foreground">{c.d}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-mm grid gap-4 sm:grid-cols-2">
          <div className="card-mm p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Press kit</p>
            <p className="mt-1 text-lg font-extrabold">Logos, screenshots & brand guidelines</p>
            <button className="btn-primary mt-4"><Download className="h-4 w-4" /> Download press kit</button>
          </div>
          <div className="card-mm p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Media contact</p>
            <p className="mt-1 text-lg font-extrabold">press@menumenu.app</p>
            <a href="mailto:press@menumenu.app" className="btn-ghost mt-4"><Mail className="h-4 w-4" /> Email us</a>
          </div>
        </div>
      </section>
    </>
  );
}
