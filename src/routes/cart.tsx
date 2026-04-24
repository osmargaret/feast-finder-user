import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ChevronDown } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useCart } from "@/store/AppProviders";
import { meals as allMeals, vendorById, formatPrice } from "@/data/mock";


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

  const vendorGroups = items.reduce((acc, curr) => {
    const vid = curr.meal.vendorId;
    if (!acc[vid]) acc[vid] = [];
    acc[vid].push(curr);
    return acc;
  }, {} as Record<string, typeof items>);

  const vendorIds = Object.keys(vendorGroups);

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
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Your Orders ({vendorIds.length} Kitchen{vendorIds.length > 1 ? "s" : ""})</h2>
                <button onClick={cart.clear} className="text-sm font-bold text-muted-foreground hover:text-destructive">Clear entire cart</button>
              </div>
              {vendorIds.map((vid) => (
                <VendorCartSection key={vid} vid={vid} groupItems={vendorGroups[vid]} cart={cart} />
              ))}
              <div className="flex justify-center pt-8">
                <Link to="/meals" className="btn-ghost">Continue shopping</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function VendorCartSection({ vid, groupItems, cart }: { vid: string, groupItems: any[], cart: any }) {
  const vendor = vendorById(vid);
  const vendorSubtotal = groupItems.reduce((sum, { meal, it }) => sum + meal.price * it.qty, 0);
  const vendorDelivery = 800;
  const vendorTotal = vendorSubtotal + vendorDelivery;
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card-mm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-6 hover:bg-secondary/50 transition text-left"
      >
        <div className="flex items-center gap-3">
          {vendor?.avatar && <img src={vendor.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />}
          <div>
            <h3 className="font-extrabold text-lg">{vendor?.name}</h3>
            <p className="text-sm text-muted-foreground">{groupItems.length} item{groupItems.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-muted-foreground">Total</p>
            <p className="font-black text-lg text-primary">{formatPrice(vendorTotal)}</p>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-border p-6 bg-secondary/5">
          <div className="space-y-4">
            {groupItems.map(({ it, meal }) => (
              <div key={meal.id} className="flex gap-4 bg-background p-4 rounded-2xl border border-border">
                <img src={meal.image} alt={meal.name} className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-extrabold">{meal.name}</h4>
                    <div className="text-right text-sm font-black">{formatPrice(meal.price * it.qty)}</div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border p-1">
                      <button onClick={() => cart.setQty(meal.id, it.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                      <span className="min-w-6 text-center text-xs font-extrabold">{it.qty}</span>
                      <button onClick={() => cart.setQty(meal.id, it.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary" aria-label="Increase"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => cart.remove(meal.id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-destructive hover:underline">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="max-w-xs ml-auto">
              <dl className="space-y-2 text-sm font-semibold mb-6">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(vendorSubtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPrice(vendorDelivery)}</dd></div>
                <div className="my-2 border-t border-border" />
                <div className="flex justify-between text-base font-black"><dt>Total</dt><dd>{formatPrice(vendorTotal)}</dd></div>
              </dl>
              <Link to="/checkout" search={{ vendorId: vid }} className="btn-primary w-full justify-center">
                Checkout {vendor?.name}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
