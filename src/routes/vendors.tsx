import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { KitchenCard } from "@/components/site/KitchenCard";
import { vendors } from "@/data/mock";

export const Route = createFileRoute("/vendors")({
  head: () => ({
    meta: [
      { title: "Kitchens & Vendors — MenuMenu" },
      { name: "description", content: "Meet the kitchens behind your favourite meals. Follow vendors and never miss a new drop." },
      { property: "og:title", content: "Kitchens & Vendors — MenuMenu" },
      { property: "og:description", content: "Meet the kitchens behind your favourite meals. Follow vendors and never miss a new drop." },
    ],
  }),
  component: VendorsPage,
});

// Demo: pretend the user is not logged in so follow buttons hide
const isLoggedIn = false;

function VendorsPage() {
  return (
    <>
      <PageHero eyebrow="Marketplace" title="Kitchens & Vendors" subtitle="Discover the people cooking your favourite meals." />
      <section className="section">
        <div className="container-mm">
          <h2 className="section-title mb-2">Featured kitchens</h2>
          <p className="section-sub mb-8">Verified vendors across all major categories.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {vendors.map((v) => <KitchenCard key={v.id} vendor={v} showFollow={isLoggedIn} />)}
          </div>
        </div>
      </section>
    </>
  );
}
