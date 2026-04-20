import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { posts } from "@/data/mock";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — MenuMenu" },
      { name: "description", content: "Vendor spotlights, food tips, and announcements from the MenuMenu team." },
      { property: "og:title", content: "Blog — MenuMenu" },
      { property: "og:description", content: "Vendor spotlights, food tips, and announcements from the MenuMenu team." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Stories" title="The MenuMenu Blog" subtitle="Spotlights, tips, and news from kitchens we love." />
      <section className="section">
        <div className="container-mm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((p) => (
              <Link key={p.slug} to={p.slug === "vendor-spotlight-mama-t" ? "/blog/vendor-spotlight-mama-t" : p.slug === "5-tips-perfect-jollof" ? "/blog/5-tips-perfect-jollof" : "/blog"} className="card-mm group flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                  <span className="badge-orange absolute left-3 top-3">{p.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-extrabold leading-snug">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  <div className="mt-auto flex items-center gap-3 pt-4 text-xs font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
