import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, Eye } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { posts, vendorById } from "@/data/mock";
import { useBlog } from "@/store/AppProviders";

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
  const blog = useBlog();
  return (
    <>
      <PageHero eyebrow="Stories" title="The MenuMenu Blog" subtitle="Spotlights, tips, and news from kitchens we love." />
      <section className="section">
        <div className="container-mm">
          {blog.posts.length > 0 && (
            <>
              <h2 className="section-title mb-2">From our kitchens</h2>
              <p className="section-sub mb-8">Latest posts from MenuMenu vendors.</p>
              <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {blog.posts.map((p) => {
                  const vendor = vendorById(p.vendorId);
                  return (
                    <Link
                      key={p.id}
                      to="/blog/$slug"
                      params={{ slug: p.id }}
                      className="card-mm group flex flex-col"
                    >
                      <div className="relative h-44 overflow-hidden">
                        {p.cover ? (
                          <img src={p.cover} alt={p.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-secondary text-3xl">📝</div>
                        )}
                        <span className="badge-orange absolute left-3 top-3">Vendor</span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-extrabold leading-snug">{p.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                        <div className="mt-auto flex items-center gap-3 pt-4 text-xs font-semibold text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(p.ts).toLocaleDateString()}</span>
                          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {p.views}</span>
                          {vendor && <span className="ml-auto font-bold">{vendor.name}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          <h2 className="section-title mb-2">Editorial</h2>
          <p className="section-sub mb-8">Stories from the MenuMenu team.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="card-mm group flex flex-col"
              >
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
