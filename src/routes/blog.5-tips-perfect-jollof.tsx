import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { postBySlug } from "@/data/mock";

export const Route = createFileRoute("/blog/5-tips-perfect-jollof")({
  head: () => {
    const p = postBySlug("5-tips-perfect-jollof");
    return {
      meta: [
        { title: `${p?.title} — MenuMenu Blog` },
        { name: "description", content: p?.excerpt ?? "" },
        { property: "og:title", content: p?.title ?? "" },
        { property: "og:description", content: p?.excerpt ?? "" },
        { property: "og:image", content: p?.image ?? "" },
      ],
    };
  },
  loader: () => {
    const p = postBySlug("5-tips-perfect-jollof");
    if (!p) throw notFound();
    return p;
  },
  component: PostPage,
});

const tips = [
  { t: "Toast the tomato base", b: "Cook the blended tomato, pepper and onion until the water is gone and oil floats. This is the foundation of smoky jollof." },
  { t: "Use parboiled rice", b: "It absorbs sauce without going mushy — perfect grain-by-grain texture every time." },
  { t: "Stock matters", b: "A rich chicken or beef stock turns good jollof into great jollof. Never use plain water." },
  { t: "Low and slow at the end", b: "Cover with foil, finish on the lowest heat, and let the bottom catch lightly for that party-jollof aroma." },
  { t: "Rest before serving", b: "Let the pot sit covered for 5 minutes off the heat. The grains finish steaming and flavours settle." },
];

function PostPage() {
  const p = Route.useLoaderData();
  return (
    <article className="pt-28">
      <div className="container-mm max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-bold text-primary"><ArrowLeft className="h-4 w-4" /> Back to blog</Link>
      </div>

      <div className="container-mm mt-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
          <span className="badge-orange">{p.category}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.date}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.readTime}</span>
        </div>
        <h1 className="mt-4 text-4xl font-black leading-[1.1] sm:text-5xl">{p.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{p.excerpt}</p>
      </div>

      <div className="container-mm mt-8 max-w-5xl">
        <img src={p.image} alt={p.title} className="aspect-[16/9] w-full rounded-3xl object-cover" style={{ boxShadow: "var(--shadow-lg)" }} />
      </div>

      <div className="container-mm mt-12 max-w-4xl space-y-5">
        {tips.map((tip, i) => (
          <div key={tip.t} className="card-mm flex gap-4 p-5">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full text-sm font-black text-white" style={{ background: "var(--gradient-primary)" }}>{i + 1}</span>
            <div>
              <p className="text-lg font-extrabold">{tip.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tip.b}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container-mm mt-12 max-w-4xl">
        <div className="card-mm flex items-center gap-4 p-5">
          <img src={p.authorAvatar} alt={p.author} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Written by</p>
            <p className="text-base font-extrabold">{p.author}</p>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </article>
  );
}
