import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { MealCard } from "@/components/site/MealCard";
import { useWishlist } from "@/store/AppProviders";
import { meals as allMeals } from "@/data/mock";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — MenuMenu" },
      { name: "description", content: "Meals you've saved for later." },
      { property: "og:title", content: "Your Wishlist — MenuMenu" },
      { property: "og:description", content: "Meals you've saved for later." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const wish = useWishlist();
  const items = allMeals.filter((m) => wish.ids.includes(m.id));
  return (
    <>
      <PageHero eyebrow="Saved for later" title="Your Wishlist" subtitle="Keep track of meals you love." />
      <section className="section">
        <div className="container-mm">
          {items.length === 0 ? (
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <Heart className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold">No saved meals yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any meal to save it here.</p>
              <Link to="/meals" className="btn-primary mt-6 inline-flex">Browse meals</Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm font-bold text-muted-foreground">{items.length} saved</p>
                <button onClick={wish.clear} className="text-sm font-bold text-muted-foreground hover:text-destructive">
                  Clear all
                </button>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((m) => <MealCard key={m.id} meal={m} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
