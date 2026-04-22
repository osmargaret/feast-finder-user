import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { MealCard } from "@/components/site/MealCard";
import { categories } from "@/data/mock";
import { useVendorMenu } from "@/store/AppProviders";

export const Route = createFileRoute("/meals")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
    sub: typeof search.sub === "string" ? search.sub : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Meals — MenuMenu" },
      {
        name: "description",
        content:
          "Browse all meals from local kitchens. Filter by category, price, dietary needs and more.",
      },
      { property: "og:title", content: "Browse Meals — MenuMenu" },
      {
        property: "og:description",
        content:
          "Browse all meals from local kitchens. Filter by category, price, dietary needs and more.",
      },
    ],
  }),
  component: MealsPage,
});

function MealsPage() {
  const navigate = useNavigate();
  const { meals } = useVendorMenu();
  const search = useSearch({ from: "/meals" });
  const urlCat = search.category ?? "";
  const urlSub = search.sub ?? "";

  const [q, setQ] = useState("");
  const [cat, setCat] = useState(urlCat || "All");
  const [sub, setSub] = useState(urlSub);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [diet, setDiet] = useState<string>("Any");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // Sync URL category/sub to local state on mount / URL changes
  useEffect(() => {
    setCat(urlCat || "All");
    setSub(urlSub);
  }, [urlCat, urlSub]);

  const filtered = useMemo(() => {
    return meals.filter((m) => {
      if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "All" && m.category !== cat) return false;
      if (sub && m.name !== sub) return false;
      if (m.price > maxPrice) return false;
      if (diet !== "Any" && !(m.dietary || []).includes(diet)) return false;
      return true;
    });
  }, [q, cat, sub, maxPrice, diet, meals]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const clearCategory = () => {
    setCat("All");
    setSub("");
    navigate({ to: ".", search: { ...search, category: undefined, sub: undefined } });
  };

  const clearSub = () => {
    setSub("");
    navigate({ to: ".", search: { ...search, sub: undefined } });
  };

  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title="Browse all meals"
        subtitle="Fresh from local kitchens. Filter to find exactly what you crave."
      />

      <section className="section">
        <div className="container-mm grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside className="card-mm h-fit p-5 lg:sticky lg:top-28">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider">Filters</h3>
            </div>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Search</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search dish…"
                  className="input-mm pl-9"
                />
              </div>
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Location</span>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select className="input-mm pl-9">
                  <option>All locations</option>
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Port Harcourt</option>
                  <option>Ibadan</option>
                </select>
              </div>
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Category</span>
              <select
                value={cat}
                onChange={(e) => {
                  const newCat = e.target.value;
                  setCat(newCat);
                  setSub("");
                  setPage(1);
                  const newSearch: Record<string, string> = { ...search };
                  if (newCat === "All") {
                    delete newSearch.category;
                  } else {
                    newSearch.category = newCat;
                  }
                  delete newSearch.sub;
                  navigate({ to: ".", search: newSearch });
                }}
                className="input-mm"
              >
                <option>All</option>
                {categories.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </label>

            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Max price</span>
                <span className="text-xs font-extrabold">₦{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={6000}
                step={500}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full accent-[oklch(0.68_0.21_38)]"
              />
            </div>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">Dietary</span>
              <select
                value={diet}
                onChange={(e) => {
                  setDiet(e.target.value);
                  setPage(1);
                }}
                className="input-mm"
              >
                <option>Any</option>
                <option>Halal</option>
                <option>Vegetarian</option>
                <option>Spicy</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-muted-foreground">
                Kitchen Type
              </span>
              <select className="input-mm">
                <option>All</option>
                <option>Home Kitchen</option>
                <option>Bakery</option>
                <option>Restaurant</option>
                <option>Street Food</option>
                <option>Cafe</option>
              </select>
            </label>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">
                Showing <span className="font-extrabold text-foreground">{pageItems.length}</span>{" "}
                of {filtered.length} meals
              </p>
              <select className="input-mm w-auto py-2 text-xs">
                <option>Most popular</option>
                <option>Lowest price</option>
                <option>Highest price</option>
              </select>
            </div>

            {/* Active filter tags */}
            {(cat !== "All" || sub) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Active filters:</span>
                {cat !== "All" && (
                  <button
                    onClick={clearCategory}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
                  >
                    {cat}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {sub && (
                  <button
                    onClick={clearSub}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground hover:bg-primary/10"
                  >
                    {sub}
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {pageItems.length === 0 ? (
              <div className="card-mm p-10 text-center">
                <p className="text-lg font-extrabold">No meals match your filters</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try widening the price range or clearing search.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((m) => (
                  <MealCard key={m.id} meal={m} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-full text-sm font-bold transition ${page === i + 1 ? "btn-primary !px-0" : "border border-border hover:bg-secondary"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
