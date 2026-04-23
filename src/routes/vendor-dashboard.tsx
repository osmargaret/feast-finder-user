import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  MessageSquare,
  X,
  Check,
  BarChart3,
  DollarSign,
  Newspaper,
  Users,
  LayoutGrid,
  Eye,
  Share2,
  TrendingUp,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ImageUpload } from "@/components/site/ImageUpload";
import {
  useAuth,
  useBlog,
  useMessages,
  useOrders,
  useTeam,
  useVendorMenu,
  type TeamMember,
} from "@/store/AppProviders";
import { vendors, categories, formatPrice, type Meal } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor-dashboard")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard — MenuMenu" },
      { name: "description", content: "Manage your menu, orders, blog, team and analytics." },
      { property: "og:title", content: "Vendor Dashboard — MenuMenu" },
      { property: "og:description", content: "Manage your kitchen end-to-end." },
    ],
  }),
  component: VendorDashboardPage,
});

const sections = [
  { key: "menu", label: "Menu", icon: LayoutGrid },
  { key: "orders", label: "Orders", icon: Package },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "income", label: "Income", icon: DollarSign },
  { key: "blog", label: "Blog Manager", icon: Newspaper },
  { key: "team", label: "Team", icon: Users },
] as const;
type SectionKey = (typeof sections)[number]["key"];

function VendorDashboardPage() {
  const auth = useAuth();
  const menu = useVendorMenu();
  const orders = useOrders();
  const messages = useMessages();
  const blog = useBlog();
  const [vendorId, setVendorId] = useState<string>(vendors[0].id);
  const [active, setActive] = useState<SectionKey>("menu");

  const vendor = vendors.find((v) => v.id === vendorId)!;
  const myMeals = useMemo(() => menu.meals.filter((m) => m.vendorId === vendorId), [menu.meals, vendorId]);
  const myOrders = useMemo(
    () => orders.items.filter((o) => o.items.some((i) => i.vendorId === vendorId)),
    [orders.items, vendorId],
  );
  const myMessages = useMemo(
    () => messages.items.filter((m) => m.vendorId === vendorId),
    [messages.items, vendorId],
  );
  const myPosts = useMemo(() => blog.posts.filter((p) => p.vendorId === vendorId), [blog.posts, vendorId]);

  if (!auth.user) {
    return (
      <>
        <PageHero eyebrow="Vendor" title="Sign in as a vendor" subtitle="You need an account to manage a kitchen." />
        <section className="section">
          <div className="container-mm">
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <Link to="/signin" className="btn-primary inline-flex">Sign in</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Vendor portal" title="Kitchen Dashboard" subtitle="Manage every corner of your kitchen." />
      <section className="section">
        <div className="container-mm">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="card-mm h-fit p-4 lg:sticky lg:top-28">
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-secondary p-3">
                <img src={vendor.avatar} alt={vendor.name} className="h-10 w-10 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Acting as</p>
                  <select
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    className="w-full bg-transparent text-sm font-extrabold focus:outline-none"
                  >
                    {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = active === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setActive(s.key)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground/75 hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {s.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main */}
            <div className="min-w-0">
              {active === "menu" && <MenuTab vendorId={vendorId} meals={myMeals} />}
              {active === "orders" && <OrdersTab vendorId={vendorId} orders={myOrders} />}
              {active === "messages" && <MessagesTab messages={myMessages} vendorName={vendor.name} />}
              {active === "analytics" && (
                <AnalyticsTab meals={myMeals} orders={myOrders} posts={myPosts} messages={myMessages} vendorId={vendorId} />
              )}
              {active === "income" && <IncomeTab orders={myOrders} vendorId={vendorId} />}
              {active === "blog" && <BlogTab vendorId={vendorId} authorEmail={auth.user.email} posts={myPosts} />}
              {active === "team" && <TeamTab vendorId={vendorId} />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string | number; hint?: string }) {
  return (
    <div className="card-mm p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
          <p className="truncate text-xl font-black">{value}</p>
          {hint && <p className="text-[11px] font-semibold text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

function MenuTab({ vendorId, meals }: { vendorId: string; meals: Meal[] }) {
  const menu = useVendorMenu();
  const [editing, setEditing] = useState<Meal | "new" | null>(null);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-black">Menu items <span className="text-sm font-bold text-muted-foreground">({meals.length})</span></h2>
        <button onClick={() => setEditing("new")} className="btn-primary inline-flex"><Plus className="h-4 w-4" /> Add menu item</button>
      </div>
      {meals.length === 0 ? (
        <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No menu items yet. Click "Add menu item" to create one.</p></div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((m) => (
            <li key={m.id} className="card-mm overflow-hidden">
              <img src={m.image} alt={m.name} className="h-32 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div><h4 className="font-extrabold">{m.name}</h4><p className="text-xs text-muted-foreground">{m.category} · {formatPrice(m.price)}</p></div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{m.blurb}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditing(m)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary"><Edit2 className="h-3 w-3" /> Edit</button>
                  <button onClick={() => menu.removeMeal(m.id)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5"><Trash2 className="h-3 w-3" /> Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <MealEditor
          vendorId={vendorId}
          meal={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

function MealEditor({ vendorId, meal, onClose }: { vendorId: string; meal: Meal | null; onClose: () => void }) {
  const menu = useVendorMenu();
  const [name, setName] = useState(meal?.name ?? "");
  const [price, setPrice] = useState(meal?.price ?? 1000);
  const [blurb, setBlurb] = useState(meal?.blurb ?? "");
  const [category, setCategory] = useState(meal?.category ?? categories[0].name);
  const [subcategory, setSubcategory] = useState(meal?.subcategory ?? "");
  const [image, setImage] = useState(meal?.image ?? "");

  const subcatOptions = categories.find((c) => c.name === category)?.subcategories ?? [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name required");
    const fallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
    if (meal) {
      menu.updateMeal(meal.id, { name, price: Number(price), blurb, category, subcategory: subcategory || undefined, image: image || meal.image });
    } else {
      menu.addMeal({ name, price: Number(price), blurb, category, subcategory: subcategory || undefined, image: image || fallback, vendorId });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4">
      <form onSubmit={submit} className="card-mm w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold">{meal ? "Edit menu item" : "Add menu item"}</h3>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">Photo — upload from your device</label>
            <ImageUpload value={image} onChange={setImage} label="Click to upload meal photo" />
          </div>
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Price (₦)" type="number" value={String(price)} onChange={(v) => setPrice(Number(v))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-muted-foreground">Category</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory(""); }} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm">
                {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground">Subcategory</label>
              <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm">
                <option value="">— None —</option>
                {subcatOptions.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <Input label="Description" value={blurb} onChange={setBlurb} />
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{meal ? "Save changes" : "Create item"}</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
    </div>
  );
}

function OrdersTab({ vendorId, orders }: { vendorId: string; orders: ReturnType<typeof useOrders>["items"] }) {
  const ordersCtx = useOrders();
  if (orders.length === 0) {
    return <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No incoming orders yet.</p></div>;
  }
  return (
    <ul className="space-y-4">
      {orders.map((o) => {
        const myItems = o.items.filter((i) => i.vendorId === vendorId);
        const myTotal = myItems.reduce((s, i) => s + i.price * i.qty, 0);
        return (
          <li key={o.id} className="card-mm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{new Date(o.ts).toLocaleString()}</p>
                <h4 className="text-base font-extrabold">{o.id}</h4>
                <p className="text-xs text-muted-foreground">{o.address.name} · {o.address.phone}</p>
              </div>
              <select
                value={o.status}
                onChange={(e) => ordersCtx.setStatus(o.id, e.target.value as typeof o.status)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold capitalize"
              >
                <option value="pending">pending</option>
                <option value="preparing">preparing</option>
                <option value="out-for-delivery">out for delivery</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {myItems.map((i) => (
                <li key={i.mealId} className="flex justify-between"><span>{i.qty}× {i.name}</span><span className="font-bold">{formatPrice(i.price * i.qty)}</span></li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">Deliver to {o.address.street}, {o.address.city}</span>
              <span className="text-base font-black">{formatPrice(myTotal)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function MessagesTab({ messages, vendorName }: { messages: ReturnType<typeof useMessages>["items"]; vendorName: string }) {
  const ctx = useMessages();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const threads = useMemo(() => {
    const map = new Map<string, typeof messages>();
    [...messages]
      .sort((a, b) => a.ts - b.ts)
      .forEach((m) => {
        const list = map.get(m.fromEmail) ?? [];
        list.push(m);
        map.set(m.fromEmail, list);
      });
    return Array.from(map.entries()).map(([email, msgs]) => {
      const last = msgs[msgs.length - 1];
      const userMsg = [...msgs].reverse().find((m) => m.from === "user");
      return { email, msgs, last, customerName: userMsg?.fromName ?? "Customer", vendorId: msgs[0].vendorId };
    }).sort((a, b) => b.last.ts - a.last.ts);
  }, [messages]);

  if (threads.length === 0) {
    return <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No customer messages yet.</p></div>;
  }
  return (
    <ul className="space-y-3">
      {threads.map((t) => {
        const unread = t.msgs.some((m) => m.from === "user" && !m.read);
        return (
          <li key={t.email} className={`card-mm p-4 ${unread ? "border-primary/40 bg-primary/5" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold">{t.customerName} <span className="text-xs font-normal text-muted-foreground">· {t.email}</span></p>
                <p className="text-[11px] font-bold text-muted-foreground">{t.msgs.length} message(s) · last {new Date(t.last.ts).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
              {t.msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "vendor" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "vendor" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    <p>{m.body}</p>
                    <p className={`mt-0.5 text-[10px] ${m.from === "vendor" ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={draft[t.email] ?? ""}
                onChange={(e) => setDraft({ ...draft, [t.email]: e.target.value })}
                placeholder="Type a reply…"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const text = (draft[t.email] ?? "").trim();
                    if (text) { ctx.reply(t.vendorId, t.email, text, vendorName); setDraft({ ...draft, [t.email]: "" }); toast.success("Reply sent"); }
                  }
                }}
              />
              <button
                onClick={() => {
                  const text = (draft[t.email] ?? "").trim();
                  if (text) { ctx.reply(t.vendorId, t.email, text, vendorName); setDraft({ ...draft, [t.email]: "" }); toast.success("Reply sent"); }
                }}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              ><Check className="h-3.5 w-3.5" /> Reply</button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function AnalyticsTab({
  meals,
  orders,
  posts,
  messages,
  vendorId,
}: {
  meals: Meal[];
  orders: ReturnType<typeof useOrders>["items"];
  posts: ReturnType<typeof useBlog>["posts"];
  messages: ReturnType<typeof useMessages>["items"];
  vendorId: string;
}) {
  const revenue = orders.reduce(
    (s, o) => s + o.items.filter((i) => i.vendorId === vendorId).reduce((a, i) => a + i.price * i.qty, 0),
    0,
  );
  const blogViews = posts.reduce((s, p) => s + p.views, 0);
  const completed = orders.filter((o) => o.status === "delivered").length;
  const unreadMessages = messages.filter((m) => m.from === "user" && !m.read).length;

  const top = [...meals]
    .map((m) => ({
      meal: m,
      sold: orders.reduce(
        (s, o) => s + o.items.filter((i) => i.mealId === m.id).reduce((a, i) => a + i.qty, 0),
        0,
      ),
    }))
    .filter((x) => x.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <>
      <h2 className="mb-4 text-2xl font-black">Analytics</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="Total revenue" value={formatPrice(revenue)} hint={`${orders.length} order(s)`} />
        <StatCard icon={<Package className="h-4 w-4" />} label="Completed" value={completed} hint="Delivered orders" />
        <StatCard icon={<Eye className="h-4 w-4" />} label="Blog views" value={blogViews} hint={`${posts.length} post(s)`} />
        <StatCard icon={<MessageSquare className="h-4 w-4" />} label="Unread msgs" value={unreadMessages} hint="From customers" />
      </div>
      <div className="card-mm mt-6 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><TrendingUp className="h-4 w-4 text-primary" /> Best sellers</h3>
        {top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sales recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {top.map(({ meal, sold }) => {
              const max = top[0].sold;
              const pct = Math.max(8, (sold / max) * 100);
              return (
                <li key={meal.id} className="flex items-center gap-3">
                  <img src={meal.image} alt={meal.name} className="h-10 w-10 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">{meal.name}</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-black">{sold}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function IncomeTab({ orders, vendorId }: { orders: ReturnType<typeof useOrders>["items"]; vendorId: string }) {
  const rows = orders.map((o) => {
    const sub = o.items.filter((i) => i.vendorId === vendorId).reduce((s, i) => s + i.price * i.qty, 0);
    return { id: o.id, ts: o.ts, status: o.status, sub };
  });
  const total = rows.reduce((s, r) => s + r.sub, 0);
  const paid = rows.filter((r) => r.status === "delivered").reduce((s, r) => s + r.sub, 0);
  const pending = total - paid;

  return (
    <>
      <h2 className="mb-4 text-2xl font-black">Income</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="Gross" value={formatPrice(total)} />
        <StatCard icon={<Check className="h-4 w-4" />} label="Settled" value={formatPrice(paid)} hint="Delivered" />
        <StatCard icon={<Package className="h-4 w-4" />} label="Pending" value={formatPrice(pending)} hint="In progress" />
      </div>
      <div className="card-mm mt-6 overflow-hidden">
        <div className="border-b border-border bg-secondary/40 px-5 py-3 text-xs font-bold uppercase text-muted-foreground">Recent transactions</div>
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No income yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold">{r.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.ts).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${r.status === "delivered" ? "bg-primary/10 text-primary" : "bg-secondary text-foreground/70"}`}>{r.status}</span>
                <span className="text-base font-black">{formatPrice(r.sub)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function BlogTab({ vendorId, authorEmail, posts }: { vendorId: string; authorEmail: string; posts: ReturnType<typeof useBlog>["posts"] }) {
  const blog = useBlog();
  const [editing, setEditing] = useState<typeof posts[number] | "new" | null>(null);

  const share = (id: string, title: string) => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Share link copied", { description: title });
    } else {
      toast(url);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-black">Blog Manager <span className="text-sm font-bold text-muted-foreground">({posts.length})</span></h2>
        <button onClick={() => setEditing("new")} className="btn-primary inline-flex"><Plus className="h-4 w-4" /> New post</button>
      </div>
      {posts.length === 0 ? (
        <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No blog posts yet. Share your story!</p></div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {posts.map((p) => (
            <li key={p.id} className="card-mm overflow-hidden">
              {p.cover && <img src={p.cover} alt={p.title} className="h-32 w-full object-cover" />}
              <div className="p-4">
                <h4 className="font-extrabold">{p.title}</h4>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.excerpt}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views}</span>
                  <span>{new Date(p.ts).toLocaleDateString()}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/blog/$slug" params={{ slug: p.id }} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary">View</Link>
                  <button onClick={() => setEditing(p)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary"><Edit2 className="h-3 w-3" /> Edit</button>
                  <button onClick={() => share(p.id, p.title)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary"><Share2 className="h-3 w-3" /> Share</button>
                  <button onClick={() => { blog.remove(p.id); toast("Post removed"); }} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5"><Trash2 className="h-3 w-3" /> Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <BlogEditor
          vendorId={vendorId}
          authorEmail={authorEmail}
          post={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

function BlogEditor({
  vendorId,
  authorEmail,
  post,
  onClose,
}: {
  vendorId: string;
  authorEmail: string;
  post: ReturnType<typeof useBlog>["posts"][number] | null;
  onClose: () => void;
}) {
  const blog = useBlog();
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [cover, setCover] = useState(post?.cover ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title required");
    if (post) {
      blog.update(post.id, { title, excerpt, body, cover: cover || undefined });
      toast.success("Post updated");
    } else {
      blog.create({ vendorId, title, excerpt, body, cover: cover || undefined, authorEmail });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4">
      <form onSubmit={submit} className="card-mm w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold">{post ? "Edit post" : "New blog post"}</h3>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">Cover image</label>
            <ImageUpload value={cover} onChange={setCover} label="Upload cover image" height="h-48" />
          </div>
          <Input label="Title" value={title} onChange={setTitle} />
          <div>
            <label className="block text-xs font-bold text-muted-foreground">Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{post ? "Save changes" : "Publish post"}</button>
        </div>
      </form>
    </div>
  );
}

function TeamTab({ vendorId }: { vendorId: string }) {
  const team = useTeam();
  const myTeam = team.members.filter((m) => m.vendorId === vendorId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("manager");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return toast.error("Name and email required");
    team.add({ vendorId, name, email, role });
    setName(""); setEmail("");
  };

  return (
    <>
      <h2 className="mb-4 text-2xl font-black">Team & Admins</h2>
      <form onSubmit={submit} className="card-mm mb-6 grid gap-3 p-5 sm:grid-cols-[1fr_1fr_auto_auto]">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
        <select value={role} onChange={(e) => setRole(e.target.value as TeamMember["role"])} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">
          <option value="manager">Manager</option>
          <option value="accountant">Accountant</option>
          <option value="sales">Sales rep</option>
          <option value="blog-admin">Blog admin</option>
        </select>
        <button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> Invite</button>
      </form>

      {myTeam.length === 0 ? (
        <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No team members yet. Invite a manager, accountant, or blog admin.</p></div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {myTeam.map((m) => (
            <li key={m.id} className="card-mm flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-black">{m.name[0]?.toUpperCase()}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-extrabold">{m.name}</p>
                <p className="truncate text-xs text-muted-foreground">{m.email} · <span className="capitalize">{m.role.replace("-", " ")}</span></p>
              </div>
              <button onClick={() => { team.remove(m.id); toast("Removed"); }} className="icon-btn" aria-label="Remove"><Trash2 className="h-4 w-4 text-destructive" /></button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
