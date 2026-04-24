import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Star, Plus, Check, MapPin, Clock, Share2, Mail, Phone, Search,
  Truck, ShieldCheck, Utensils, MessageCircle, Heart,
} from "lucide-react";
import { vendors, vendorById } from "@/data/mock";
import { useAuth, useCart, useFollow, useMessages, useVendorMenu, useWishlist } from "@/store/AppProviders";
import { MealCard } from "@/components/site/MealCard";
import { toast } from "sonner";

export const Route = createFileRoute("/vendors/$vendorId")({
  loader: ({ params }) => {
    const vendor = vendorById(params.vendorId);
    if (!vendor) throw notFound();
    return { vendor };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.vendor.name ?? "Kitchen"} Storefront — MenuMenu` },
      { name: "description", content: loaderData?.vendor ? `Shop ${loaderData.vendor.name} on MenuMenu — ${loaderData.vendor.tagline}.` : "" },
      { property: "og:title", content: `${loaderData?.vendor.name ?? "Kitchen"} Storefront — MenuMenu` },
      { property: "og:description", content: loaderData?.vendor ? `Shop ${loaderData.vendor.name} on MenuMenu — ${loaderData.vendor.tagline}.` : "" },
      ...(loaderData?.vendor ? [{ property: "og:image", content: loaderData.vendor.cover }] : []),
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 pt-32">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">Vendor not found</h1>
        <Link to="/vendors" className="btn-primary mt-6 inline-flex">Back to vendors</Link>
      </div>
    </div>
  ),
  component: VendorPage,
});

const HOURS = [
  { day: "Mon – Fri", hours: "10:00 AM – 9:00 PM" },
  { day: "Saturday",  hours: "11:00 AM – 10:00 PM" },
  { day: "Sunday",    hours: "12:00 PM – 8:00 PM" },
];

const SAMPLE_REVIEWS = [
  { name: "Adaeze O.", rating: 5, body: "Best jollof in Lagos. Period. Always hot, always on time." },
  { name: "Tunde B.",  rating: 4, body: "Generous portions and great packaging. Will reorder." },
  { name: "Chioma N.", rating: 5, body: "Customer service is top-tier. They even followed up after delivery." },
];

function VendorPage() {
  const { vendor } = Route.useLoaderData();
  const follow = useFollow();
  const messages = useMessages();
  const auth = useAuth();
  const cart = useCart();
  const wish = useWishlist();
  const { meals: allMeals } = useVendorMenu();
  const following = follow.has(vendor.id);

  const vendorMeals = useMemo(() => allMeals.filter((m) => m.vendorId === vendor.id), [allMeals, vendor.id]);
  const otherVendors = vendors.filter((v) => v.id !== vendor.id).slice(0, 4);

  // Featured = first meal with badge, else first meal
  const featured = vendorMeals.find((m) => m.badge) ?? vendorMeals[0];

  // Categories from this vendor's menu
  const categories = useMemo(() => {
    const set = new Set<string>();
    vendorMeals.forEach((m) => m.category && set.add(m.category));
    return ["All", ...Array.from(set)];
  }, [vendorMeals]);

  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");

  const filteredMeals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vendorMeals.filter((m) => {
      const matchCat = activeCat === "All" || m.category === activeCat;
      const matchQ = !q || m.name.toLowerCase().includes(q) || m.blurb.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [vendorMeals, activeCat, query]);

  // contact form
  const [form, setForm] = useState({
    name: auth.user?.name ?? "",
    email: auth.user?.email ?? "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const onShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: vendor.name, url: typeof window !== "undefined" ? window.location.href : "" }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Storefront link copied");
    }
  };

  return (
    <>
      {/* ==================== HERO / STOREFRONT BANNER ==================== */}
      <section className="relative isolate overflow-hidden pt-24">
        <div className="container-mm">
          <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80 lg:h-96">
            <img src={vendor.cover} alt={vendor.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Top-right action chips */}
            <div className="absolute right-4 top-4 flex flex-wrap gap-2">
              <button onClick={onShare} className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-foreground backdrop-blur transition hover:bg-white">
                <Share2 className="h-4 w-4" /> Share store
              </button>
            </div>

            {/* Bottom hero copy */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="flex flex-wrap items-end gap-2">
                <span className="chip bg-white/90 text-foreground"><ShieldCheck className="h-3 w-3 text-primary" /> Verified storefront</span>
                <span className="chip bg-white/90 text-foreground"><Star className="h-3 w-3 fill-primary text-primary" /> {vendor.rating}</span>
                <span className="chip bg-white/90 text-foreground"><Utensils className="h-3 w-3 text-primary" /> {vendor.type}</span>
              </div>
              <h1 className="mt-3 text-3xl font-black text-white drop-shadow sm:text-5xl">{vendor.name}</h1>
              <p className="mt-1 max-w-xl text-sm font-semibold text-white/90 sm:text-base">{vendor.tagline}</p>
            </div>
          </div>

          {/* Profile strip */}
          <div className="-mt-10 grid items-end gap-4 px-2 sm:grid-cols-[auto_1fr_auto]">
            <img src={vendor.avatar} alt={vendor.name} className="h-24 w-24 rounded-3xl object-cover ring-4 ring-background sm:h-28 sm:w-28" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-muted-foreground">{vendor.followers} followers · {vendorMeals.length} meals on the menu</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="#contact" className="btn-ghost"><MessageCircle className="h-4 w-4" /> Message</a>
              <button onClick={() => follow.toggle(vendor.id)} className={following ? "btn-ghost" : "btn-primary"}>
                {following ? <><Check className="h-4 w-4" /> Following</> : <><Plus className="h-4 w-4" /> Follow store</>}
              </button>
            </div>
          </div>

          {/* Stats / trust bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Star, label: "Rating", value: `${vendor.rating} / 5` },
              { icon: Truck, label: "Delivery areas", value: `${vendor.deliveryAreas?.length ?? 0} zones` },
              { icon: Utensils, label: "Menu items", value: `${vendorMeals.length}` },
              { icon: ShieldCheck, label: "Followers", value: vendor.followers },
            ].map((s) => (
              <div key={s.label} className="card-mm flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <p className="truncate text-sm font-extrabold">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STOREFRONT BODY ==================== */}
      <section className="section pt-12">
        <div className="container-mm grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            {/* Featured / Today's special */}
            {featured && (
              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold">Today's special</h2>
                    <p className="text-sm font-semibold text-muted-foreground">Hand-picked from {vendor.name}'s kitchen</p>
                  </div>
                </div>
                <div className="card-mm mt-4 grid gap-0 overflow-hidden sm:grid-cols-[280px_1fr]">
                  <div className="relative h-56 sm:h-auto">
                    <img src={featured.image} alt={featured.name} className="h-full w-full object-cover" />
                    {featured.badge && <span className="badge-orange absolute left-3 top-3">{featured.badge}</span>}
                  </div>
                  <div className="flex flex-col justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-xl font-black">{featured.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">{featured.blurb}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-2xl font-black tracking-tight">₦{featured.price.toLocaleString()}</p>
                      <div className="flex gap-2">
                        <button onClick={() => wish.toggle(featured.id)} className="btn-ghost">
                          <Heart className={`h-4 w-4 ${wish.has(featured.id) ? "fill-primary text-primary" : ""}`} />
                        </button>
                        <button onClick={() => { cart.add(featured.id); toast.success(`${featured.name} added to cart`); }} className="btn-primary">
                          <Plus className="h-4 w-4" /> Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About */}
            <div>
              <h2 className="text-2xl font-extrabold">About this store</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground">
                {vendor.name} is a verified MenuMenu storefront serving {vendor.tagline.toLowerCase()}. Every order is freshly cooked,
                carefully packed, and delivered hot across {vendor.deliveryAreas?.slice(0, 3).join(", ") || "Lagos"}
                {vendor.deliveryAreas && vendor.deliveryAreas.length > 3 ? ` and ${vendor.deliveryAreas.length - 3} more areas` : ""}. Follow them to get notified the moment new specials drop.
              </p>
            </div>

            {/* Menu with search + category filters */}
            <div id="menu">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold">Shop the menu</h2>
                  <p className="text-sm font-semibold text-muted-foreground">{filteredMeals.length} of {vendorMeals.length} items</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search meals…"
                    className="input-mm pl-9"
                  />
                </div>
              </div>

              {/* Category pills */}
              {categories.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCat(c)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                        activeCat === c
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {filteredMeals.length > 0 ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredMeals.map((m) => <MealCard key={m.id} meal={m} />)}
                </div>
              ) : (
                <div className="card-mm mt-6 p-10 text-center">
                  <p className="text-sm font-semibold text-muted-foreground">No meals match your search.</p>
                  <button onClick={() => { setQuery(""); setActiveCat("All"); }} className="btn-ghost mt-4">Clear filters</button>
                </div>
              )}
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-2xl font-extrabold">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[vendor.cover, ...vendorMeals.slice(0, 7).map((m) => m.image)].slice(0, 8).map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-2xl">
                    <img src={src} alt="" className="h-full w-full object-cover transition hover:scale-105" />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-extrabold">What customers say</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SAMPLE_REVIEWS.map((r, i) => (
                  <div key={i} className="card-mm p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-extrabold">{r.name}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-3.5 w-3.5 ${j < r.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div id="contact">
              <h2 className="text-2xl font-extrabold">Contact {vendor.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Have a question or a custom order? Send a message — replies appear in your inbox.</p>
              {sent ? (
                <div className="card-mm mt-4 p-6">
                  <p className="font-extrabold text-primary">Message sent ✓</p>
                  <p className="mt-1 text-sm text-muted-foreground">{vendor.name} will get back to you shortly. Check <Link to="/messages" className="font-bold text-primary hover:underline">your messages</Link>.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    messages.send({ vendorId: vendor.id, fromName: form.name, fromEmail: form.email, body: form.message, from: "user" });
                    setSent(true);
                    toast.success(`Message sent to ${vendor.name}`);
                    setForm({ name: form.name, email: form.email, message: "" });
                  }}
                  className="mt-4 grid gap-3"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-mm" />
                    <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-mm" />
                  </div>
                  <textarea required placeholder="Your message…" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-mm rounded-2xl py-3" />
                  <button type="submit" className="btn-primary justify-self-start">Send message</button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="card-mm p-5">
              <h3 className="text-base font-extrabold">Hours</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> {h.day}</span>
                    <span className="font-semibold text-muted-foreground">{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-mm p-5">
              <h3 className="text-base font-extrabold">Delivery zones</h3>
              {vendor.deliveryAreas && vendor.deliveryAreas.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {vendor.deliveryAreas.map((a) => (
                    <span key={a} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold">{a}</span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Delivery info coming soon.</p>
              )}
            </div>

            <div className="card-mm p-5">
              <h3 className="text-base font-extrabold">Location</h3>
              <div className="mt-3 flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="font-semibold text-muted-foreground">12 Allen Avenue, Ikeja, Lagos</p>
              </div>
              <div
                className="mt-3 grid h-32 place-items-center rounded-2xl text-xs font-bold text-muted-foreground"
                style={{ background: "var(--gradient-soft), color-mix(in oklab, var(--primary) 6%, var(--background))" }}
              >
                Map preview
              </div>
            </div>

            <div className="card-mm p-5">
              <h3 className="text-base font-extrabold">Direct contact</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> <a href="tel:+2348012345678" className="font-bold hover:text-primary">+234 801 234 5678</a></li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> <a href={`mailto:hello@${vendor.id}.menumenu.app`} className="font-bold hover:text-primary">hello@{vendor.id}.menumenu.app</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Other kitchens */}
      <section className="section pt-0">
        <div className="container-mm">
          <h2 className="text-2xl font-extrabold">Discover other stores</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {otherVendors.map((v) => (
              <Link key={v.id} to="/vendors/$vendorId" params={{ vendorId: v.id }} className="card-mm flex items-center gap-3 p-4 hover:bg-secondary">
                <img src={v.avatar} alt={v.name} className="h-12 w-12 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{v.name}</p>
                  <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Star className="h-3 w-3 fill-primary text-primary" /> {v.rating} · {v.followers}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
