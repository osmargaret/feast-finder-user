import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Truck, Star, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";
import { meals, vendors, categories, vendorAreas } from "@/data/mock";
import { MealCard } from "@/components/site/MealCard";
import { KitchenCard } from "@/components/site/KitchenCard";
import { DeliveryAreaPicker } from "@/components/site/DeliveryAreaPicker";
import { useDeliveryArea } from "@/store/AppProviders";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MenuMenu — Marketplace for Food Vendors" },
      { name: "description", content: "Discover and order meals from local food vendors. Verified kitchens, pickup & delivery." },
      { property: "og:title", content: "MenuMenu — Marketplace for Food Vendors" },
      { property: "og:description", content: "Discover and order meals from local food vendors. Verified kitchens, pickup & delivery." },
    ],
  }),
  component: HomePage,
});

const heroCategories = ["Soups", "Swallow", "Pastries", "Confectioneries", "Grills", "Breakfast"];

function HomePage() {
  const { area } = useDeliveryArea();
  const matchesArea = (vendorId: string) =>
    !area || vendorAreas(vendorId, vendors.find((v) => v.id === vendorId)?.deliveryAreas).includes(area);
  const featured = meals.filter((m) => matchesArea(m.vendorId)).slice(0, 6);
  const explore = meals.filter((m) => matchesArea(m.vendorId)).slice(6, 16);
  const trendingVendors = vendors.filter((v) => matchesArea(v.id)).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section
        className="relative isolate overflow-hidden pb-20 pt-32 text-white sm:pt-44"
        style={{
          backgroundImage: `var(--gradient-hero), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-mm text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" /> Find nearby meals from trusted kitchens
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Hungry? <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Discover meals</span> from local food vendors.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold text-white/85 sm:text-lg">
            Order from verified kitchens. Pickup or delivery — all in one place.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-2xl"
          >
            <div className="ml-3 text-muted-foreground"><Search className="h-5 w-5" /></div>
            <input
              type="search"
              placeholder="Search jollof, suya, kitchens…"
              className="flex-1 bg-transparent px-2 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="submit" className="btn-primary"><Search className="h-4 w-4" /> Search</button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {heroCategories.map((c) => (
              <Link key={c} to="/meals" className="pill">{c}</Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="pill"><ShieldCheck className="h-4 w-4" /> Verified kitchens</span>
            <span className="pill"><Truck className="h-4 w-4" /> Pickup & delivery</span>
            <span className="pill"><Star className="h-4 w-4" /> Top rated dishes</span>
          </div>
        </div>
      </section>

      {/* Featured meals */}
      <section className="section">
        <div className="container-mm">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Featured meals</h2>
              <p className="section-sub">Curated picks from kitchens customers love.</p>
            </div>
            <Link to="/meals" className="hidden items-center gap-1 text-sm font-bold text-primary sm:inline-flex">See all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((m) => <MealCard key={m.id} meal={m} />)}
          </div>
        </div>
      </section>

      {/* Explore meals — 5×2 grid */}
      <section className="pb-4">
        <div className="container-mm">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Explore meals</h2>
              <p className="section-sub">Ten more dishes to discover today.</p>
            </div>
            <Link to="/meals" className="hidden items-center gap-1 text-sm font-bold text-primary sm:inline-flex">Browse all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {explore.map((m) => <MealCard key={m.id} meal={m} compact />)}
          </div>
        </div>
      </section>

      {/* Trending kitchens */}
      <section className="section">
        <div className="container-mm">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Trending kitchens</h2>
              <p className="section-sub">Follow kitchens to get notified when new meals drop.</p>
            </div>
            <Link to="/vendors" className="hidden items-center gap-1 text-sm font-bold text-primary sm:inline-flex">Discover <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="scroll-row sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {vendors.slice(0, 4).map((v) => <KitchenCard key={v.id} vendor={v} />)}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container-mm">
          <div className="mb-8">
            <h2 className="section-title">Browse by category</h2>
            <p className="section-sub">Find exactly what you're craving.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((c) => (
              <Link
                key={c.name}
                to="/meals"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl text-2xl" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}>{c.icon}</span>
                <span className="text-sm font-extrabold">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-mm">
          <div className="relative overflow-hidden rounded-3xl p-8 text-white sm:p-14" style={{ background: "var(--gradient-primary)" }}>
            <div className="grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="text-3xl font-black sm:text-4xl">Run a kitchen? Reach hungry customers.</h3>
                <p className="mt-3 max-w-lg text-white/90">Join hundreds of vendors growing their food business with MenuMenu — no setup fees.</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link to="/vendor-signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-foreground hover:-translate-y-0.5 transition">Become a vendor</Link>
                <Link to="/about" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Learn more</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
