import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Plus, Check, MapPin, Clock, Share2, Mail, Phone } from "lucide-react";
import { vendors, vendorById, meals as allMeals } from "@/data/mock";
import { useFollow } from "@/store/AppProviders";
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
      { title: `${loaderData?.vendor.name ?? "Kitchen"} — MenuMenu` },
      { name: "description", content: loaderData?.vendor ? `${loaderData.vendor.name} on MenuMenu — ${loaderData.vendor.tagline}.` : "" },
      { property: "og:title", content: `${loaderData?.vendor.name ?? "Kitchen"} — MenuMenu` },
      { property: "og:description", content: loaderData?.vendor ? `${loaderData.vendor.name} on MenuMenu — ${loaderData.vendor.tagline}.` : "" },
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
  const following = follow.has(vendor.id);
  const vendorMeals = allMeals.filter((m) => m.vendorId === vendor.id);
  const otherVendors = vendors.filter((v) => v.id !== vendor.id).slice(0, 4);

  // contact form
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <>
      {/* Cover */}
      <section className="relative isolate overflow-hidden pt-24">
        <div className="container-mm">
          <div className="relative h-56 overflow-hidden rounded-3xl sm:h-72 lg:h-80">
            <img src={vendor.cover} alt={vendor.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({ title: vendor.name, url: typeof window !== "undefined" ? window.location.href : "" }).catch(() => {});
                } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied");
                }
              }}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-foreground backdrop-blur transition hover:bg-white"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          <div className="-mt-12 grid items-end gap-6 px-2 sm:grid-cols-[auto_1fr_auto]">
            <img src={vendor.avatar} alt={vendor.name} className="h-24 w-24 rounded-3xl object-cover ring-4 ring-background sm:h-28 sm:w-28" />
            <div>
              <span className="chip"><Star className="h-3 w-3 fill-primary text-primary" /> {vendor.rating} · {vendor.followers} followers</span>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">{vendor.name}</h1>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{vendor.type} · {vendor.tagline}</p>
            </div>
            <button onClick={() => follow.toggle(vendor.id)} className={following ? "btn-ghost" : "btn-primary"}>
              {following ? <><Check className="h-4 w-4" /> Following</> : <><Plus className="h-4 w-4" /> Follow</>}
            </button>
          </div>
        </div>
      </section>

      <section className="section pt-12">
        <div className="container-mm grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            {/* About */}
            <div>
              <h2 className="text-2xl font-extrabold">About this kitchen</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground">
                {vendor.name} is a verified MenuMenu kitchen serving {vendor.tagline.toLowerCase()}. Every order is freshly cooked,
                carefully packed, and delivered hot. Follow them to get notified the moment new specials drop.
              </p>
            </div>

            {/* Menu */}
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold">Menu</h2>
                  <p className="text-sm font-semibold text-muted-foreground">{vendorMeals.length} items available</p>
                </div>
              </div>
              {vendorMeals.length > 0 ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {vendorMeals.map((m) => <MealCard key={m.id} meal={m} />)}
                </div>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">No meals yet. Check back soon.</p>
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
              <h2 className="text-2xl font-extrabold">Reviews</h2>
              <div className="mt-4 space-y-3">
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
              <p className="mt-1 text-sm text-muted-foreground">Have a question or a custom order? Send a message.</p>
              {sent ? (
                <div className="card-mm mt-4 p-6">
                  <p className="font-extrabold text-primary">Message sent ✓</p>
                  <p className="mt-1 text-sm text-muted-foreground">{vendor.name} will get back to you shortly.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                    toast.success(`Message sent to ${vendor.name}`);
                    setForm({ name: "", email: "", message: "" });
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
          <h2 className="text-2xl font-extrabold">Discover other kitchens</h2>
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
