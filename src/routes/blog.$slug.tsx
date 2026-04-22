import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Calendar, Clock, ArrowLeft, Eye } from "lucide-react";
import { posts, postBySlug, vendorById } from "@/data/mock";
import { useBlog } from "@/store/AppProviders";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    return { staticPost: post ?? null };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.staticPost;
    const title = p?.title ?? "Blog post";
    return {
      meta: [
        { title: `${title} — MenuMenu Blog` },
        { name: "description", content: p?.excerpt ?? "Read this story on MenuMenu." },
        { property: "og:title", content: `${title} — MenuMenu Blog` },
        { property: "og:description", content: p?.excerpt ?? "" },
        ...(p?.image ? [{ property: "og:image", content: p.image }] : []),
        { property: "og:url", content: `/blog/${params.slug}` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center pt-32">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">Post not found</h1>
        <Link to="/blog" className="btn-primary mt-6 inline-flex">Back to blog</Link>
      </div>
    </div>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { staticPost } = Route.useLoaderData();
  const blog = useBlog();
  const dynamic = blog.posts.find((p) => p.id === slug);

  useEffect(() => {
    if (dynamic) blog.view(dynamic.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamic?.id]);

  if (!staticPost && !dynamic) throw notFound();

  if (dynamic) {
    const vendor = vendorById(dynamic.vendorId);
    return (
      <article className="pt-28 pb-20">
        <div className="container-mm max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          {dynamic.cover && (
            <img src={dynamic.cover} alt={dynamic.title} className="mt-6 h-72 w-full rounded-3xl object-cover" />
          )}
          <h1 className="mt-8 text-4xl font-black tracking-tight">{dynamic.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(dynamic.ts).toLocaleDateString()}</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {dynamic.views + 1} views</span>
            {vendor && (
              <Link to="/vendors/$vendorId" params={{ vendorId: vendor.id }} className="inline-flex items-center gap-2 hover:text-primary">
                <img src={vendor.avatar} alt={vendor.name} className="h-6 w-6 rounded-full object-cover" />
                <span className="font-bold">{vendor.name}</span>
              </Link>
            )}
          </div>
          <p className="mt-6 text-lg font-semibold text-muted-foreground">{dynamic.excerpt}</p>
          <div className="prose prose-lg mt-6 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground">
            {dynamic.body}
          </div>
        </div>
      </article>
    );
  }

  const p = staticPost!;
  return (
    <article className="pt-28 pb-20">
      <div className="container-mm max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        <img src={p.image} alt={p.title} className="mt-6 h-72 w-full rounded-3xl object-cover" />
        <span className="badge-orange mt-6 inline-flex">{p.category}</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight">{p.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.date}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.readTime}</span>
          <div className="inline-flex items-center gap-2">
            <img src={p.authorAvatar} alt={p.author} className="h-6 w-6 rounded-full object-cover" />
            <span className="font-bold">{p.author}</span>
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold text-muted-foreground">{p.excerpt}</p>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground">
          <p>
            Welcome to a deeper look behind <strong>{p.title}</strong>. The MenuMenu marketplace is built on the
            stories of real kitchens — from home cooks turning recipes into businesses to bakers shipping
            morning loaves city-wide.
          </p>
          <p>
            We dive into the kitchens, the journey, the recipes, and what comes next. Browse the marketplace
            to find dishes from these stories and many more.
          </p>
          <p>
            Like what you read? <Link to="/vendors" className="font-bold text-primary hover:underline">Discover kitchens →</Link>
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {posts.filter((x) => x.slug !== slug).slice(0, 2).map((rel) => (
            <Link
              key={rel.slug}
              to="/blog/$slug"
              params={{ slug: rel.slug }}
              className="card-mm flex gap-3 p-4"
            >
              <img src={rel.image} alt={rel.title} className="h-20 w-20 rounded-2xl object-cover" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">{rel.category}</p>
                <p className="text-sm font-extrabold leading-snug">{rel.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
