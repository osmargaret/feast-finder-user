import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useCart } from "@/store/AppProviders";
import { meals as allMeals, vendorById, formatPrice } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — MenuMenu" },
      { name: "description", content: "Review the meals in your cart and check out." },
      { property: "og:title", content: "Your Cart — MenuMenu" },
      { property: "og:description", content: "Review the meals in your cart and check out." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const items = cart.items
    .map((it) => ({ it, meal: allMeals.find((m) => m.id === it.mealId) }))
    .filter((x): x is { it: { mealId: string; qty: number }; meal: typeof allMeals[number] } => Boolean(x.meal));

  const delivery = cart.subtotal > 0 ? 800 : 0;
  const total = cart.subtotal + delivery;

  return (
    <>
      <PageHero eyebrow="Your order" title="Shopping Cart" subtitle="Review items, adjust quantities, and check out." />
      <section className="section">
        <div className="container-mm">
          {items.length === 0 ? (
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold">Your cart is empty</h2>
              <p className="mt-2 text-sm text-muted-foreground">Browse meals and add your favourites.</p>
              <Link to="/meals" className="btn-primary mt-6 inline-flex">Browse meals</Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-4">
                {items.map(({ it, meal }) => {
                  const vendor = vendorById(meal.vendorId);
                  return (
                    <div key={meal.id} className="card-mm flex gap-4 p-4">
                      <img src={meal.image} alt={meal.name} className="h-24 w-24 rounded-2xl object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-extrabold">{meal.name}</h3>
                            <p className="text-xs font-semibold text-muted-foreground">{vendor?.name}</p>
                          </div>
                          <div className="text-right text-base font-black">{formatPrice(meal.price * it.qty)}</div>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="inline-flex items-center gap-2 rounded-full border border-border p-1">
                            <button onClick={() => cart.setQty(meal.id, it.qty - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary" aria-label="Decrease">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-6 text-center text-sm font-extrabold">{it.qty}</span>
                            <button onClick={() => cart.setQty(meal.id, it.qty + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary" aria-label="Increase">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button onClick={() => cart.remove(meal.id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-destructive hover:underline">
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button onClick={cart.clear} className="text-sm font-bold text-muted-foreground hover:text-destructive">
                  Clear cart
                </button>
              </div>

              <aside className="card-mm h-fit p-6">
                <h3 className="text-lg font-extrabold">Order summary</h3>
                <dl className="mt-4 space-y-2 text-sm font-semibold">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPrice(delivery)}</dd></div>
                  <div className="my-2 border-t border-border" />
                  <div className="flex justify-between text-base font-black"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
                </dl>
                <button
                  onClick={() => {
                    toast.success("Order placed!", { description: "We've sent a confirmation to your email." });
                    cart.clear();
                  }}
                  className="btn-primary mt-6 w-full"
                >
                  Checkout
                </button>
                <Link to="/meals" className="btn-ghost mt-2 w-full">Continue shopping</Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
