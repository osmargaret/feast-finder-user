import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { postBySlug, posts } from "@/data/mock";

export const Route = createFileRoute("/blog/vendor-spotlight-mama-t")({
  head: () => {
    const p = postBySlug("vendor-spotlight-mama-t");
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
    const p = postBySlug("vendor-spotlight-mama-t");
    if (!p) throw notFound();
    return p;
  },
  component: PostPage,
});

function PostPage() {
  const p = Route.useLoaderData();
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);

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

      <div className="container-mm mt-12 grid max-w-4xl gap-4 text-base leading-relaxed text-foreground/85">
        <p>It started in a single-burner kitchen in Ikeja. Today, Mama T's pots feed hundreds across Lagos every week — and her secret isn't a secret at all. It's care, consistency, and a refusal to cut corners.</p>
        <h2 className="mt-6 text-2xl font-extrabold">Built on family recipes</h2>
        <p>Every recipe at Mama T Kitchen comes from family. The egusi is her grandmother's; the jollof is her mother's; the pepper soup is hers. "If I can't serve it to my own kids," she says, "I won't serve it to you."</p>
        <h2 className="mt-6 text-2xl font-extrabold">Why customers keep coming back</h2>
        <ul className="ml-5 list-disc space-y-2">
          <li>Generous portions cooked fresh every morning</li>
          <li>Local sourcing — produce from the same market for 12 years</li>
          <li>Honest prices, no surge pricing during peak hours</li>
        </ul>
        <p className="mt-4">When we asked what's next, she smiled. "More kitchens. More cooks. Same food."</p>
      </div>

      {/* Author */}
      <div className="container-mm mt-12 max-w-4xl">
        <div className="card-mm flex items-center gap-4 p-5">
          <img src={p.authorAvatar} alt={p.author} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Written by</p>
            <p className="text-base font-extrabold">{p.author}</p>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="container-mm mt-12 max-w-5xl">
        <h3 className="text-2xl font-extrabold">Keep reading</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to="/blog" className="card-mm group flex flex-col">
              <img src={r.image} alt={r.title} loading="lazy" className="h-32 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-bold text-primary">{r.category}</p>
                <p className="mt-1 text-sm font-extrabold leading-snug">{r.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-16" />
    </article>
  );
}
