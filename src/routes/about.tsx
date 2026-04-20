import { createFileRoute } from "@tanstack/react-router";
import { Heart, Sparkles, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import chef1 from "@/assets/avatar-chef-1.jpg";
import chef2 from "@/assets/avatar-chef-2.jpg";
import chef3 from "@/assets/avatar-chef-3.jpg";
import chef4 from "@/assets/avatar-chef-4.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MenuMenu" },
      { name: "description", content: "MenuMenu is a marketplace built to help local food vendors thrive — and help customers find the meals they love." },
      { property: "og:title", content: "About MenuMenu" },
      { property: "og:description", content: "Built to help local food vendors thrive — and help customers find the meals they love." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { v: "500+", l: "Vendors" },
  { v: "10k+", l: "Meals listed" },
  { v: "50k+", l: "Happy customers" },
  { v: "20+",  l: "Cities" },
];

const values = [
  { icon: Heart,    t: "Vendor-first",     b: "Fair fees and tools that grow real food businesses." },
  { icon: Sparkles, t: "Quality always",   b: "Verified kitchens. Honest reviews. No surprises." },
  { icon: Users,    t: "Community fueled", b: "Built with the cooks and customers we serve." },
];

const team = [
  { n: "Adaeze Okafor", r: "Co-founder & CEO", a: chef1 },
  { n: "Tunde Bello",   r: "Co-founder & CTO", a: chef2 },
  { n: "Kenechi Eze",   r: "Head of Vendors",  a: chef3 },
  { n: "Hauwa Bala",    r: "Head of Design",   a: chef4 },
];

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our Story" title="Built for the people who feed us." subtitle="MenuMenu connects local kitchens with hungry customers — fairly, simply, and with great food at the center." />

      <section className="section">
        <div className="container-mm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="card-mm p-6 text-center">
                <p className="text-3xl font-black sm:text-4xl" style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.v}</p>
                <p className="mt-1 text-sm font-bold text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-mm grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Our story</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">
              MenuMenu started with one question: why is it so hard to order a great home-cooked meal from the kitchens we already love? We talked to vendors who were doing incredible work but losing customers to clunky group chats and unreliable delivery channels.
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">
              So we built a marketplace where small kitchens get a real shopfront, real tools, and a fair shot — and customers get one place to discover, follow, and order from the cooks shaping their city's food scene.
            </p>
          </div>
          <div>
            <h2 className="section-title">Our values</h2>
            <div className="mt-5 grid gap-4">
              {values.map((v) => (
                <div key={v.t} className="card-mm flex gap-4 p-5">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-white" style={{ background: "var(--gradient-primary)" }}><v.icon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-lg font-extrabold">{v.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{v.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-mm">
          <h2 className="section-title">Meet our team</h2>
          <p className="section-sub mb-8">A small team obsessed with great food and good business.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.n} className="card-mm p-5 text-center">
                <img src={m.a} alt={m.n} loading="lazy" className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary/15" />
                <p className="mt-4 text-base font-extrabold">{m.n}</p>
                <p className="text-xs font-semibold text-muted-foreground">{m.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
