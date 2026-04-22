import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { KitchenCard } from "@/components/site/KitchenCard";
import { vendors, categories } from "@/data/mock";

export const Route = createFileRoute("/vendors")({
  head: () => ({
    meta: [
      { title: "Kitchens & Vendors — MenuMenu" },
      { name: "description", content: "Meet the kitchens behind your favourite meals. Filter by location, cuisine, dietary needs and more." },
      { property: "og:title", content: "Kitchens & Vendors — MenuMenu" },
      { property: "og:description", content: "Meet the kitchens behind your favourite meals. Filter by location, cuisine, dietary needs and more." },
    ],
  }),
  component: VendorsPage,
});

const KITCHEN_TYPES = ["All", "Home Kitchen", "Bakery", "Restaurant", "Street Food", "Cafe"];
const LOCATIONS = ["All locations", "Lagos", "Abuja", "Port Harcourt", "Ibadan"];
const PRICE_RANGES = ["All", "$", "$$", "$$$"];

function VendorsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [loc, setLoc] = useState("All locations");
  const [type, setType] = useState("All");
  const [price, setPrice] = useState("All");

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (q && !v.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (loc !== "All locations" && v.location !== loc) return false;
      if (type !== "All" && v.type !== type) return false;
      if (price !== "All" && v.priceRange !== price) return false;
      if (cat !== "All" && !v.tagline.toLowerCase().includes(cat.toLowerCase()) && v.type !== cat) return false;
      return true;
    });
  }, [q, cat, loc, type, price]);

  const reset = () => { setQ(""); setCat("All"); setLoc("All locations"); setType("All"); setPrice("All"); };
  const activeCount = (q ? 1 : 0) + (cat !== "All" ? 1 : 0) + (loc !== "All locations" ? 1 : 0) + (type !== "All" ? 1 : 0) + (price !== "All" ? 1 : 0);

  return (
    <>
      <PageHero eyebrow="Marketplace" title="Kitchens & Vendors" subtitle="Discover the people cooking your favourite meals." />
      <section className="section">
        <div className="container-mm grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="card-mm h-fit p-5 lg:sticky lg:top-28">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider">Filters</h3>
              </div>
              {activeCount > 0 && (
                <button onClick={reset} className="text-xs font-bold text-primary hover:underline">Reset</button>
              )}
            </div>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Search vendor</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Vendor name…" className="input-mm pl-9" />
              </div>
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Location</span>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select value={loc} onChange={(e) => setLoc(e.target.value)} className="input-mm pl-9">
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Category</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="input-mm">
                <option>All</option>
                {categories.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Kitchen type</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input-mm">
                {KITCHEN_TYPES.map((k) => <option key={k}>{k}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Price range</span>
              <select value={price} onChange={(e) => setPrice(e.target.value)} className="input-mm">
                {PRICE_RANGES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">
                Showing <span className="font-extrabold text-foreground">{filtered.length}</span> of {vendors.length} kitchens
              </p>
            </div>

            {activeCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Active:</span>
                {q && <Tag onClear={() => setQ("")}>{q}</Tag>}
                {cat !== "All" && <Tag onClear={() => setCat("All")}>{cat}</Tag>}
                {loc !== "All locations" && <Tag onClear={() => setLoc("All locations")}>{loc}</Tag>}
                {type !== "All" && <Tag onClear={() => setType("All")}>{type}</Tag>}
                {price !== "All" && <Tag onClear={() => setPrice("All")}>{price}</Tag>}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="card-mm p-10 text-center">
                <p className="text-lg font-extrabold">No kitchens match your filters</p>
                <button onClick={reset} className="btn-primary mt-4 inline-flex">Reset filters</button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((v) => <KitchenCard key={v.id} vendor={v} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Tag({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <button onClick={onClear} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20">
      {children}
      <X className="h-3 w-3" />
    </button>
  );
}
