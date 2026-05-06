import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
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
  Settings,
  CreditCard,
  Store,
  Star as StarIcon,
  Tag,
  Gift,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { ImageUpload } from "@/components/site/ImageUpload";
import {
  useAuth,
  useBlog,
  useMessages,
  useOrders,
  useVendorMenu,
  useVendorProfile,
  useCoupons,
  useReviews,
  useTeam,
} from "@/store/AppProviders";
import { vendors, categories, formatPrice, type Meal } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor-dashboard")({
  validateSearch: (search: Record<string, unknown>): { tab?: SectionKey; email?: string } => ({
    tab: search.tab as SectionKey | undefined,
    email: search.email as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Vendor Dashboard — MenuMenu" },
      { name: "description", content: "Manage your menu, orders, blog and analytics." },
      { property: "og:title", content: "Vendor Dashboard — MenuMenu" },
      { property: "og:description", content: "Manage your kitchen end-to-end." },
    ],
  }),
  component: VendorDashboardPage,
});

const sections = [
  { key: "dashboard", label: "Command Center", icon: BarChart3 },
  { key: "launchpad", label: "Launchpad", icon: Store },
  { key: "menu", label: "Menu", icon: LayoutGrid },
  { key: "orders", label: "Orders", icon: Package },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "analytics", label: "Analytics", icon: TrendingUp },
  { key: "income", label: "Income", icon: DollarSign },
  { key: "blog", label: "Blog Manager", icon: Newspaper },
  { key: "promotions", label: "Promotions", icon: Gift },
  { key: "reviews", label: "Reviews", icon: StarIcon },
  { key: "team", label: "Team", icon: Users },
] as const;
type SectionKey = (typeof sections)[number]["key"];

function VendorDashboardPage() {
  const auth = useAuth();
  const menu = useVendorMenu();
  const orders = useOrders();
  const messages = useMessages();
  const blog = useBlog();
  const vendorCtx = useVendorProfile();
  const coupons = useCoupons();
  const reviews = useReviews();
  const team = useTeam();

  const allAvailableVendors = useMemo(() => {
    const list = [...vendors];
    if (vendorCtx.profile) {
      // Add or update our own vendor in the list
      const idx = list.findIndex(v => v.id === vendorCtx.profile?.id);
      const myVendor = {
        id: vendorCtx.profile.id,
        name: vendorCtx.profile.businessName,
        avatar: vendorCtx.profile.images[0] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100",
        cover: vendorCtx.profile.bannerUrl || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
        followers: "0",
        followerCount: 0,
        rating: 5,
        tagline: vendorCtx.profile.tagline || "New kitchen",
        type: vendorCtx.profile.categories[0] || "Home Kitchen",
        deliveryAreas: vendorCtx.profile.deliveryAreas || [],
      };
      if (idx >= 0) list[idx] = myVendor;
      else list.unshift(myVendor);
    }
    return list;
  }, [vendorCtx.profile]);

  const [vendorId, setVendorId] = useState<string>(() => {
    if (vendorCtx.profile) return vendorCtx.profile.id;
    return vendors[0].id;
  });
  const { tab, email: selectedEmail } = Route.useSearch();
  const [active, setActive] = useState<SectionKey>(() => {
    if (tab && sections.some(s => s.key === tab)) return tab;
    return "dashboard";
  });
  const vendorProfile = useVendorProfile();

  const vendor = allAvailableVendors.find((v) => v.id === vendorId)!;
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

  useEffect(() => {
    if (myMeals.length > 0 && active === "launchpad") {
      setActive("menu");
    }
  }, [myMeals.length]);

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
             <aside className="card-mm h-fit p-4 lg:sticky lg:top-28 bg-background/90 backdrop-blur-md border border-border/50">
              <div className="mb-4 flex flex-col gap-4">
                {/* Profile Switcher */}
                <div className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-3 ring-1 ring-border">
                  <img src={vendor.avatar} alt={vendor.name} className="h-10 w-10 rounded-xl object-cover shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Kitchen</p>
                    <select
                      value={vendorId}
                      onChange={(e) => setVendorId(e.target.value)}
                      className="w-full bg-transparent text-sm font-black focus:outline-none"
                    >
                      {allAvailableVendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Kitchen Status Toggle */}
                <button 
                  onClick={() => vendorProfile.toggleStatus()}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                    vendorProfile.profile?.isOpen 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "bg-secondary text-muted-foreground border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${vendorProfile.profile?.isOpen ? "bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]" : "bg-muted-foreground"}`} />
                    {vendorProfile.profile?.isOpen ? "Kitchen Open" : "Kitchen Closed"}
                  </div>
                  <div className={`relative h-5 w-10 rounded-full transition-colors ${vendorProfile.profile?.isOpen ? "bg-primary" : "bg-muted-foreground/30"}`}>
                    <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${vendorProfile.profile?.isOpen ? "right-1" : "left-1"}`} />
                  </div>
                </button>

                {/* View Store Link */}
                <Link
                  to="/view-vendor/$vendorId"
                  params={{ vendorId }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-2.5 text-[11px] font-black uppercase tracking-widest text-foreground/70 transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <Eye className="h-3.5 w-3.5" /> View Public Store
                </Link>
              </div>
              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = active === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setActive(s.key)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-foreground/75 hover:bg-secondary/80"
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {s.label}
                    </button>
                  );
                })}
                <div className="mt-2 border-t border-border pt-2">
                  <Link
                    to="/settings"
                    search={{ view: "vendor" }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground/75 transition hover:bg-secondary"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </div>
              </nav>
            </aside>

            {/* Main */}
            <div className="min-w-0">
              {active === "dashboard" && (
                <DashboardTab 
                  vendor={vendor} 
                  meals={myMeals} 
                  orders={myOrders} 
                  messages={myMessages} 
                  onAction={(tab) => setActive(tab)} 
                />
              )}
              {active === "launchpad" && <LaunchpadTab vendor={vendor} meals={myMeals} onAction={(tab) => setActive(tab)} />}
              {active === "menu" && <MenuTab vendorId={vendorId} meals={myMeals} />}
              {active === "orders" && <OrdersTab vendorId={vendorId} orders={myOrders} />}
              {active === "messages" && <MessagesTab messages={myMessages} vendorName={vendor.name} selectedEmail={selectedEmail} />}
              {active === "analytics" && (
                <AnalyticsTab meals={myMeals} orders={myOrders} posts={myPosts} messages={myMessages} vendorId={vendorId} />
              )}
              {active === "income" && <IncomeTab orders={myOrders} vendorId={vendorId} />}
              {active === "blog" && <BlogTab vendorId={vendorId} authorEmail={auth.user.email} posts={myPosts} />}
              {active === "promotions" && <PromotionsTab vendorId={vendorId} />}
              {active === "reviews" && <ReviewsTab vendorId={vendorId} />}
              {active === "team" && <TeamTab vendorId={vendorId} />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function TeamTab({ vendorId }: { vendorId: string }) {
  const team = useTeam();
  const filtered = team.members.filter((m) => m.vendorId === vendorId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic">Team Management</h2>
        <span className="badge-primary">{filtered.length} Staff</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <div key={m.id} className="card-mm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center font-black">
                {m.name[0]}
              </div>
              <div>
                <p className="font-extrabold text-sm">{m.name}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{m.role}</p>
              </div>
            </div>
            <button onClick={() => team.remove(m.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button className="card-mm p-5 border-dashed border-2 flex flex-col items-center justify-center gap-2 hover:bg-secondary/40 transition-colors">
           <Plus className="h-5 w-5 text-primary" />
           <span className="text-xs font-black uppercase tracking-widest">Add Member</span>
        </button>
      </div>
    </div>
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

function OrdersTab({ vendorId, orders }: { vendorId: string; orders: any[] }) {
  const ordersCtx = useOrders();
  if (orders.length === 0) {
    return <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No incoming orders yet.</p></div>;
  }
  return (
    <ul className="space-y-4">
      {orders.map((o) => {
        const myItems = o.items.filter((i: any) => i.vendorId === vendorId);
        const myTotal = myItems.reduce((s: number, i: any) => s + i.price * i.qty, 0);
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
                onChange={(e) => ordersCtx.setStatus(o.id, e.target.value as any)}
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
              {myItems.map((i: any) => (
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

function MessagesTab({ messages, vendorName, selectedEmail }: { messages: any[]; vendorName: string; selectedEmail?: string }) {
  const ctx = useMessages();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const threads = useMemo(() => {
    const map = new Map<string, any[]>();
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
          <li key={t.email} id={`thread-${t.email}`} className={`card-mm p-4 ${unread ? "border-primary/40 bg-primary/5" : ""} ${selectedEmail === t.email ? "ring-2 ring-primary ring-offset-2" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold">{t.customerName} <span className="text-xs font-normal text-muted-foreground">· {t.email}</span></p>
                <p className="text-[11px] font-bold text-muted-foreground">{t.msgs.length} message(s) · last {new Date(t.last.ts).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
              {t.msgs.map((m: any) => (
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
  orders: any[];
  posts: any[];
  messages: any[];
  vendorId: string;
}) {
  const revenue = orders.reduce(
    (s, o) => s + o.items.filter((i: any) => i.vendorId === vendorId).reduce((a: number, i: any) => a + i.price * i.qty, 0),
    0,
  );
  const blogViews = posts.reduce((s, p) => s + p.views, 0);
  const completed = orders.filter((o) => o.status === "delivered").length;
  const unreadMessages = messages.filter((m) => m.from === "user" && !m.read).length;

  const top = [...meals]
    .map((m) => ({
      meal: m,
      sold: orders.reduce(
        (s, o) => s + o.items.filter((i: any) => i.mealId === m.id).reduce((a: number, i: any) => a + i.qty, 0),
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

function IncomeTab({ orders, vendorId }: { orders: any[]; vendorId: string }) {
  const rows = orders.map((o) => {
    const sub = o.items.filter((i: any) => i.vendorId === vendorId).reduce((s: number, i: any) => s + i.price * i.qty, 0);
    const commission = Math.floor(sub * 0.1);
    const net = sub - commission;
    return { id: o.id, ts: o.ts, status: o.status, sub, commission, net };
  });
  const total = rows.reduce((s, r) => s + r.sub, 0);
  const paid = rows.filter((r) => r.status === "delivered").reduce((s, r) => s + r.sub, 0);
  const commissionTotal = rows.filter((r) => r.status === "delivered").reduce((s, r) => s + r.commission, 0);
  const netTotal = paid - commissionTotal;

  return (
    <>
      <h2 className="mb-4 text-2xl font-black">Income</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="Gross Sales" value={formatPrice(total)} />
        <StatCard icon={<Check className="h-4 w-4" />} label="Settled (Net)" value={formatPrice(netTotal)} hint={`After 10% commission`} />
        <StatCard icon={<Package className="h-4 w-4" />} label="Platform Fee" value={formatPrice(commissionTotal)} hint="10% commission" />
      </div>
      <div className="card-mm mt-6 overflow-hidden">
        <div className="border-b border-border bg-secondary/40 px-5 py-3 text-xs font-bold uppercase text-muted-foreground">Recent transactions</div>
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No income yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/20 text-[10px] font-bold uppercase text-muted-foreground">
                <tr><th className="p-3">Order</th><th className="p-3">Gross</th><th className="p-3">Fee (10%)</th><th className="p-3">Net</th><th className="p-3 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3">
                      <p className="font-extrabold">{r.id}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(r.ts).toLocaleDateString()}</p>
                    </td>
                    <td className="p-3 font-bold">{formatPrice(r.sub)}</td>
                    <td className="p-3 text-destructive font-bold">-{formatPrice(r.commission)}</td>
                    <td className="p-3 font-black text-primary">{formatPrice(r.net)}</td>
                    <td className="p-3 text-right"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${r.status === "delivered" ? "bg-primary/10 text-primary" : "bg-secondary text-foreground/70"}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function BlogTab({ vendorId, authorEmail, posts }: { vendorId: string; authorEmail: string; posts: any[] }) {
  const blog = useBlog();
  const [editing, setEditing] = useState<any | "new" | null>(null);

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
  post: any | null;
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
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="textarea-mm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="textarea-mm" />
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

function DashboardTab({
  vendor,
  meals,
  orders,
  messages,
  onAction,
}: {
  vendor: any;
  meals: Meal[];
  orders: any[];
  messages: any[];
  onAction: (tab: SectionKey) => void;
}) {
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing");
  const unreadMessages = messages.filter((m) => m.from === "user" && !m.read);
  const revenue = orders.reduce((s, o) => s + (o.status !== "cancelled" ? (o.subtotal || 0) : 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={<Package className="h-4 w-4" />} 
          label="Active Orders" 
          value={pendingOrders.length} 
          hint="Pending or Preparing" 
        />
        <StatCard 
          icon={<DollarSign className="h-4 w-4" />} 
          label="Today's Sales" 
          value={formatPrice(revenue)} 
          hint={`${orders.length} orders total`} 
        />
        <StatCard 
          icon={<StarIcon className="h-4 w-4" />} 
          label="Average Rating" 
          value="4.9" 
          hint="From 24 reviews" 
        />
        <StatCard 
          icon={<MessageSquare className="h-4 w-4" />} 
          label="New Messages" 
          value={unreadMessages.length} 
          hint="Requires reply" 
        />
      </div>

      <div className="card-mm p-6 bg-white/40">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black italic">Revenue Trend</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Last 7 Days</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-black text-primary"><TrendingUp className="h-3 w-3" /> +12%</span>
          </div>
        </div>
        
        <div className="relative w-full group pb-2">
          <svg className="h-48 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="0" x2="400" y2="0" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="var(--color-border)" strokeWidth="0.5" />
            
            <path d="M0,80 L66.6,60 L133.3,75 L200,40 L266.6,55 L333.3,20 L400,35 V100 H0 Z" fill="url(#grad)" className="transition-all duration-1000 group-hover:opacity-60" />
            
            <path 
              d="M0,80 L66.6,60 L133.3,75 L200,40 L266.6,55 L333.3,20 L400,35"
              fill="none" 
              stroke="var(--color-primary)" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="drop-shadow-[0_0_8px_var(--color-primary)]"
            />
            
            {[80, 60, 75, 40, 55, 20, 35].map((y, i) => (
              <circle key={i} cx={i * (400 / 6)} cy={y} r="4" fill="white" stroke="var(--color-primary)" strokeWidth="2" className="transition-transform hover:scale-150 cursor-pointer" />
            ))}
          </svg>
          
          <div className="mt-4 flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="card-mm p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black italic">Live Orders Feed</h3>
              <button onClick={() => onAction("orders")} className="text-xs font-bold text-primary hover:underline">View all</button>
            </div>
            {pendingOrders.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
                <p className="text-sm text-muted-foreground">No active orders right now.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {pendingOrders.slice(0, 3).map((o) => (
                  <li key={o.id} className="flex items-center justify-between rounded-2xl bg-secondary/30 p-4 ring-1 ring-border">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-black text-xs">
                        {o.id.slice(-3)}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold">{o.address.name}</p>
                        <p className="text-[11px] text-muted-foreground">{o.items.length} items · {formatPrice(o.subtotal)}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${o.status === "pending" ? "bg-orange-500/10 text-orange-600 animate-pulse" : "bg-primary/10 text-primary"}`}>
                      {o.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button 
              onClick={() => onAction("menu")}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-secondary/40 p-6 text-center transition-all hover:bg-primary/5 hover:ring-2 hover:ring-primary/20"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-110">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-black">Add New Meal</p>
                <p className="text-xs text-muted-foreground">Update your menu</p>
              </div>
            </button>
            <button 
              onClick={() => onAction("blog")}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-secondary/40 p-6 text-center transition-all hover:bg-primary/5 hover:ring-2 hover:ring-primary/20"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-110">
                <Newspaper className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-black">Post Update</p>
                <p className="text-xs text-muted-foreground">Tell your customers</p>
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-mm p-6 h-fit">
            <h3 className="mb-4 text-lg font-black italic">Recent Chats</h3>
            {unreadMessages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">Inbox is clear!</p>
            ) : (
              <ul className="space-y-3">
                {unreadMessages.slice(0, 3).map((m) => (
                  <li key={m.id} className="flex gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-secondary grid place-items-center text-xs font-black">
                      {m.fromName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black truncate">{m.fromName}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{m.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => onAction("messages")} className="btn-ghost w-full mt-4 text-xs">Open Messages</button>
          </div>

          <div className="card-mm p-6 bg-gradient-to-br from-primary/5 to-secondary/50 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-wider">Kitchen Tip</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adding photos to your menu items increases order conversion by up to <span className="text-primary font-bold">40%</span>. 
            </p>
            <button onClick={() => onAction("menu")} className="mt-4 text-[10px] font-black text-primary uppercase hover:underline">Optimize Menu →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaunchpadTab({ vendor, meals, onAction }: { vendor: any; meals: Meal[]; onAction: (tab: SectionKey) => void }) {
  const hasMeals = meals.length > 0;
  const hasBankDetails = false; 
  const hasDeliveryAreas = vendor.deliveryAreas && vendor.deliveryAreas.length > 0;

  const steps = [
    { label: "Business Profile Created", done: true },
    { label: "Add your first menu items", done: hasMeals, action: () => onAction("menu") },
    { label: "Setup Payout Account", done: hasBankDetails, action: () => onAction("income") },
  ];

  const progress = Math.round((steps.filter((s) => s.done).length / steps.length) * 100);

  return (
    <div className="space-y-6">
      <div className="card-mm overflow-hidden bg-primary p-8 text-primary-foreground shadow-xl relative isolate">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl -z-10" />
        <h2 className="text-3xl font-black italic tracking-tight">Welcome to Feast Finder, {vendor.name}! 🎉</h2>
        <p className="mt-2 text-primary-foreground/80 font-medium">
          You're just a few steps away from receiving your first order. Let's get your kitchen set up for success.
        </p>
      </div>

      <div className="card-mm p-6 bg-white/40 backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-extrabold italic">Setup Guide</h3>
          <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{progress}% Complete</span>
        </div>
        
        <div className="mb-8 h-3 overflow-hidden rounded-full bg-secondary/50">
          <div className="h-full rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)] transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>

        <ul className="space-y-4">
          {steps.map((step, idx) => (
            <li key={idx} className={`flex items-center justify-between rounded-2xl border-2 p-5 transition-all ${step.done ? "border-primary/20 bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <div className="flex items-center gap-5">
                <div className={`grid h-10 w-10 place-items-center rounded-xl transition-all ${step.done ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-2 border-dashed border-muted-foreground/30 text-muted-foreground"}`}>
                  {step.done ? <Check className="h-5 w-5" /> : <span className="font-black">{idx + 1}</span>}
                </div>
                <div>
                  <span className={`block font-black text-lg ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                  <span className="text-xs text-muted-foreground font-medium">{step.done ? "Completed" : "Action required"}</span>
                </div>
              </div>
              {!step.done && step.action && (
                <button onClick={step.action} className="btn-primary px-6 py-2.5 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                  Start Now
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {!hasMeals && (
        <div className="card-mm flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-secondary/20 border-primary/20">
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-xl text-primary ring-1 ring-border">
            <LayoutGrid className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-black italic">Ready to serve?</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm font-medium">
            Customers can't order if there's nothing on the menu. Add your best dishes now to start selling on Feast Finder.
          </p>
          <button onClick={() => onAction("menu")} className="btn-primary mt-8 px-10 py-4 text-base shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
            <Plus className="mr-2 h-5 w-5" /> Add My First Meal
          </button>
        </div>
      )}
    </div>
  );
}

function PromotionsTab({ vendorId }: { vendorId: string }) {
  const coupons = useCoupons();
  const myCoupons = coupons.items.filter((c) => c.vendorId === vendorId);
  const [code, setCode] = useState("");
  const [val, setVal] = useState(10);
  const [type, setType] = useState<"percent" | "amount">("percent");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    coupons.create({ vendorId, code: code.toUpperCase(), discountType: type, discountValue: val });
    setCode("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Promotions & Coupons</h2>
        <span className="badge-orange">{myCoupons.length} Active</span>
      </div>

      <div className="card-mm p-6 bg-gradient-to-br from-primary/5 to-transparent">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-muted-foreground">Create New Offer</h3>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <label className="block text-[10px] font-black uppercase text-muted-foreground mb-1.5 ml-1">Promo Code</label>
            <input 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="e.g. WELCOME20" 
              className="input-mm" 
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-[10px] font-black uppercase text-muted-foreground mb-1.5 ml-1">Value</label>
            <input 
              type="number"
              value={val} 
              onChange={(e) => setVal(Number(e.target.value))} 
              className="input-mm" 
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-[10px] font-black uppercase text-muted-foreground mb-1.5 ml-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="input-mm">
              <option value="percent">Percent (%)</option>
              <option value="amount">Fixed Amount (₦)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full h-[46px]"><Gift className="h-4 w-4" /> Create Coupon</button>
          </div>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myCoupons.map((c) => (
          <div key={c.id} className={`card-mm p-5 border-2 ${c.active ? "border-primary/20 bg-primary/5" : "border-border opacity-60"}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-lg font-black tracking-tighter">{c.code}</span>
              </div>
              <button 
                onClick={() => coupons.toggle(c.id)}
                className={`h-6 w-11 rounded-full transition-colors relative ${c.active ? "bg-primary" : "bg-muted-foreground/30"}`}
              >
                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${c.active ? "right-1" : "left-1"}`} />
              </button>
            </div>
            <p className="text-2xl font-black">{c.discountType === "percent" ? `${c.discountValue}%` : formatPrice(c.discountValue)} OFF</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground">Used {c.usageCount} times</p>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
               <button onClick={() => coupons.remove(c.id)} className="text-[10px] font-black uppercase text-destructive hover:underline">Delete</button>
               <span className="text-[10px] font-black uppercase text-muted-foreground">No Expiry</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsTab({ vendorId }: { vendorId: string }) {
  const reviewsCtx = useReviews();
  const reviews = reviewsCtx.forVendor(vendorId);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const submitReply = (id: string) => {
    if (!replyText.trim()) return;
    reviewsCtx.reply(id, replyText);
    setReplyId(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic">Customer Feedback</h2>
        <div className="flex items-center gap-2">
          <StarIcon className="h-5 w-5 text-orange-400 fill-orange-400" />
          <span className="text-xl font-black">4.9</span>
          <span className="text-sm font-bold text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="card-mm p-12 text-center text-muted-foreground">No reviews yet. Your customers' feedback will appear here.</div>
        ) : (
          reviews.map((r: any) => (
            <div key={r.id} className="card-mm p-6 bg-white/60">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center font-black">
                    {r.userName[0]}
                  </div>
                  <div>
                    <p className="font-extrabold">{r.userName}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`h-3 w-3 ${i < r.rating ? "text-orange-400 fill-orange-400" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-muted-foreground">{new Date(r.ts).toLocaleDateString()}</span>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed italic">"{r.body}"</p>
              
              {r.reply ? (
                <div className="mt-4 bg-primary/5 rounded-2xl p-4 border-l-4 border-primary">
                  <p className="text-[10px] font-black uppercase text-primary mb-1">Your Response</p>
                  <p className="text-xs font-semibold leading-relaxed">{r.reply}</p>
                </div>
              ) : (
                <div className="mt-4">
                  {replyId === r.id ? (
                    <div className="space-y-2">
                      <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a professional response..."
                        className="textarea-mm"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setReplyId(null)} className="btn-ghost !py-1.5 !px-3 text-xs">Cancel</button>
                        <button onClick={() => submitReply(r.id)} className="btn-primary !py-1.5 !px-4 text-xs">Post Reply</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReplyId(r.id)} className="text-xs font-black text-primary uppercase hover:underline">Reply to review</button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
