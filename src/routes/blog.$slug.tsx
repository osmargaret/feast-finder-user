import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowLeft, Eye, Heart, MessageSquare, Share2, Send, User } from "lucide-react";
import { posts, postBySlug, vendorById } from "@/data/mock";
import { useBlog, useAuth } from "@/store/AppProviders";
import { toast } from "sonner";

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
  const auth = useAuth();
  const dynamic = blog.posts.find((p) => p.id === slug);

  useEffect(() => {
    if (dynamic) blog.view(dynamic.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamic?.id]);

  if (!staticPost && !dynamic) throw notFound();

  const share = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: dynamic?.title || staticPost?.title,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLike = () => {
    if (!dynamic) {
      toast.info("This is an editorial post. You can only like posts from vendors!");
      return;
    }
    blog.like(dynamic.id);
    toast.success("Thanks for the love! ❤️");
  };

  const postData = dynamic ? {
    title: dynamic.title,
    excerpt: dynamic.excerpt,
    body: dynamic.body,
    cover: dynamic.cover,
    ts: dynamic.ts,
    views: dynamic.views,
    likes: dynamic.likes || 0,
    comments: dynamic.comments || [],
    isDynamic: true,
  } : {
    title: staticPost!.title,
    excerpt: staticPost!.excerpt,
    body: null, // static posts have fixed body in JSX
    cover: staticPost!.image,
    ts: new Date(staticPost!.date).getTime(),
    views: 1240, // mock views
    likes: 450, // mock likes
    comments: [], // mock comments
    isDynamic: false,
  };

  return (
    <article className="pt-28 pb-20">
      <div className="container-mm max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        
        {postData.cover && (
          <img src={postData.cover} alt={postData.title} className="mt-6 h-80 w-full rounded-[2rem] object-cover shadow-lg" />
        )}

        {!postData.isDynamic && <span className="badge-orange mt-6 inline-flex">{staticPost!.category}</span>}

        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">{postData.title}</h1>
        
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
             {dynamic ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(postData.ts).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {postData.views + 1} views</span>
                </div>
             ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {staticPost!.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {staticPost!.readTime}</span>
                </div>
             )}

             {dynamic && vendorById(dynamic.vendorId) && (
               <Link to="/view-vendor/$vendorId" params={{ vendorId: dynamic.vendorId }} className="inline-flex items-center gap-2 hover:text-primary">
                 <img src={vendorById(dynamic.vendorId)!.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                 <span className="font-bold">{vendorById(dynamic.vendorId)!.name}</span>
               </Link>
             )}
             {!dynamic && (
               <div className="inline-flex items-center gap-2">
                 <img src={staticPost!.authorAvatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                 <span className="font-bold">{staticPost!.author}</span>
               </div>
             )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-black transition hover:bg-primary/10 hover:text-primary"
            >
              <Heart className={`h-4 w-4 ${postData.likes > 0 ? "fill-primary text-primary" : ""}`} />
              {postData.likes}
            </button>
            <button 
              onClick={share}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition hover:bg-primary/10 hover:text-primary"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-8 text-xl font-medium leading-relaxed text-muted-foreground italic">"{postData.excerpt}"</p>
        
        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground">
          {postData.isDynamic ? postData.body : (
            <div className="space-y-4">
              <p>
                Welcome to a deeper look behind <strong>{postData.title}</strong>. The MenuMenu marketplace is built on the
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
          )}
        </div>

        {/* Comments Section */}
        <section className="mt-16 border-t border-border pt-12">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-black">Comments ({postData.comments.length})</h2>
          </div>

          {auth.user ? (
            <CommentForm postId={slug} isDynamic={postData.isDynamic} />
          ) : (
            <div className="card-mm p-6 bg-secondary/30 text-center mb-8">
              <p className="text-sm font-bold">Please <Link to="/signin" className="text-primary underline">sign in</Link> to join the conversation.</p>
            </div>
          )}

          <div className="space-y-6">
            {postData.comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-10 font-medium">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              postData.comments.map((c) => (
                <div key={c.id} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                    {c.userAvatar ? (
                      <img src={c.userAvatar} alt={c.userName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center"><User className="h-5 w-5 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black">{c.userName}</p>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(c.ts).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{c.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Posts */}
        <div className="mt-20 border-t border-border pt-12">
          <h3 className="text-lg font-black italic mb-6">Continue reading...</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.filter((x) => x.slug !== slug).slice(0, 2).map((rel) => (
              <Link
                key={rel.slug}
                to="/blog/$slug"
                params={{ slug: rel.slug }}
                className="card-mm flex gap-3 p-4 transition hover:bg-secondary/50 group"
              >
                <img src={rel.image} alt={rel.title} className="h-20 w-20 rounded-2xl object-cover transition group-hover:scale-105" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{rel.category}</p>
                  <p className="text-sm font-extrabold leading-snug line-clamp-2">{rel.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function CommentForm({ postId, isDynamic }: { postId: string; isDynamic: boolean }) {
  const auth = useAuth();
  const blog = useBlog();
  const [body, setBody] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    
    if (!isDynamic) {
      toast.info("Comments are currently enabled for vendor-authored posts only. Thanks for your interest!");
      setBody("");
      return;
    }

    blog.addComment(postId, auth.user!.name, body, auth.user!.avatar);
    setBody("");
    toast.success("Comment posted!");
  };

  return (
    <form onSubmit={submit} className="mb-10 space-y-3">
      <div className="relative">
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full rounded-2xl border border-border bg-secondary/30 p-4 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
        <button 
          type="submit"
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          disabled={!body.trim()}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase text-right mr-2">Posting as {auth.user!.name}</p>
    </form>
  );
}

