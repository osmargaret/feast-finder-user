import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { MealCard } from "@/components/site/MealCard";
import { meals, vendors } from "@/data/mock";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — MenuMenu" },
      { name: "description", content: "Search meals and kitchens on MenuMenu." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const ql = q.trim().toLowerCase();

  const mealHits = useMemo(() => ql ? meals.filter((m) => m.name.toLowerCase().includes(ql) || m.category.toLowerCase().includes(ql)) : [], [ql]);
  const vendorHits = useMemo(() => ql ? vendors.filter((v) => v.name.toLowerCase().includes(ql) || v.tagline.toLowerCase().includes(ql)) : [], [ql]);

  return (
    <>
      <PageHero eyebrow="Search" title="Find your next favourite meal" subtitle="Search across thousands of dishes and kitchens." />
      <section className="section">
        <div className="container-mm">
          <form onSubmit={(e) => e.preventDefault()} className="mx-auto mb-10 flex max-w-2xl items-center gap-2 rounded-full border border-border bg-card p-1.5" style={{ boxShadow: "var(--shadow-md)" }}>
            <div className="ml-3 text-muted-foreground"><Search className="h-5 w-5" /></div>
            <input value={q} onChange={(e) => setQ(e.target.value)} autoFocus placeholder="Try 'jollof', 'suya', 'Mama T'…" className="flex-1 bg-transparent px-2 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none" />
            <button type="submit" className="btn-primary">Search</button>
          </form>

          {!ql ? (
            <div className="card-mm p-10 text-center">
              <p className="text-lg font-extrabold">Start typing to search</p>
              <p className="mt-1 text-sm text-muted-foreground">We search meals, categories and kitchens.</p>
            </div>
          ) : (
            <div className="space-y-12">
              <div>
                <h2 className="mb-4 text-xl font-extrabold">Kitchens ({vendorHits.length})</h2>
                {vendorHits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No kitchens match.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {vendorHits.map((v) => (
                      <Link key={v.id} to="/vendors" className="card-mm flex items-center gap-3 p-4">
                        <img src={v.avatar} alt={v.name} className="h-14 w-14 rounded-2xl object-cover" />
                        <div>
                          <p className="text-sm font-extrabold">{v.name}</p>
                          <p className="text-xs text-muted-foreground">{v.tagline} · {v.followers} followers</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="mb-4 text-xl font-extrabold">Meals ({mealHits.length})</h2>
                {mealHits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No meals match.</p>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {mealHits.map((m) => <MealCard key={m.id} meal={m} />)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
