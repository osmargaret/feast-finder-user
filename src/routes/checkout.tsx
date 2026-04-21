import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Wallet, Banknote, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useCart, useOrders, useAuth, useNotifications } from "@/store/AppProviders";
import { meals as allMeals, formatPrice } from "@/data/mock";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MenuMenu" },
      { name: "description", content: "Complete your order with delivery and payment details." },
      { property: "og:title", content: "Checkout — MenuMenu" },
      { property: "og:description", content: "Complete your order with delivery and payment details." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const cart = useCart();
  const orders = useOrders();
  const auth = useAuth();
  const notif = useNotifications();
  const navigate = useNavigate();

  const items = cart.items
    .map((it) => ({ it, meal: allMeals.find((m) => m.id === it.mealId) }))
    .filter((x): x is { it: { mealId: string; qty: number }; meal: typeof allMeals[number] } => Boolean(x.meal));

  const delivery = cart.subtotal > 0 ? 800 : 0;
  const total = cart.subtotal + delivery;

  const [name, setName] = useState(auth.user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Lagos");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"card" | "transfer" | "cash">("card");
  const [submitting, setSubmitting] = useState(false);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const order = orders.place({
      items: items.map(({ it, meal }) => ({ mealId: meal.id, name: meal.name, price: meal.price, qty: it.qty, vendorId: meal.vendorId })),
      subtotal: cart.subtotal,
      delivery,
      total,
      address: { name, phone, street, city, notes },
      payment,
      userEmail: auth.user?.email ?? null,
    });
    notif.push({ title: `Order ${order.id} placed`, body: `${formatPrice(order.total)} • ${items.length} item(s)` });
    cart.clear();
    navigate({ to: "/order-confirmation/$orderId", params: { orderId: order.id } });
  };

  if (items.length === 0) {
    return (
      <>
        <PageHero eyebrow="Checkout" title="Nothing to check out" subtitle="Add meals to your cart first." />
        <section className="section">
          <div className="container-mm">
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <Link to="/meals" className="btn-primary mt-4 inline-flex">Browse meals</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Almost there" title="Checkout" subtitle="Tell us where to deliver and how you'll pay." />
      <section className="section">
        <div className="container-mm">
          <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <div className="card-mm p-6">
                <h2 className="text-lg font-extrabold">Delivery address</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" value={name} onChange={setName} required />
                  <Field label="Phone" value={phone} onChange={setPhone} required type="tel" />
                  <div className="sm:col-span-2">
                    <Field label="Street address" value={street} onChange={setStreet} required />
                  </div>
                  <Field label="City" value={city} onChange={setCity} required />
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-muted-foreground">Delivery notes (optional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" placeholder="Gate code, landmark, etc." />
                  </div>
                </div>
              </div>

              <div className="card-mm p-6">
                <h2 className="text-lg font-extrabold">Payment method</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <PayOption icon={<CreditCard className="h-4 w-4" />} label="Card" value="card" current={payment} onSelect={setPayment} />
                  <PayOption icon={<Wallet className="h-4 w-4" />} label="Transfer" value="transfer" current={payment} onSelect={setPayment} />
                  <PayOption icon={<Banknote className="h-4 w-4" />} label="Cash on delivery" value="cash" current={payment} onSelect={setPayment} />
                </div>
              </div>
            </div>

            <aside className="card-mm h-fit p-6">
              <h3 className="text-lg font-extrabold">Order summary</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {items.map(({ it, meal }) => (
                  <li key={meal.id} className="flex items-center gap-3">
                    <img src={meal.image} alt={meal.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-bold">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {it.qty}</p>
                    </div>
                    <span className="font-extrabold">{formatPrice(meal.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm font-semibold">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPrice(delivery)}</dd></div>
                <div className="flex justify-between text-base font-black"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
              <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-60">
                {submitting ? "Placing order…" : `Place order • ${formatPrice(total)}`}
              </button>
              <Link to="/cart" className="btn-ghost mt-2 w-full">Back to cart</Link>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
    </div>
  );
}

function PayOption<T extends string>({ icon, label, value, current, onSelect }: { icon: React.ReactNode; label: string; value: T; current: T; onSelect: (v: T) => void }) {
  const active = current === value;
  return (
    <button type="button" onClick={() => onSelect(value)} className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${active ? "border-primary bg-primary/5 text-foreground" : "border-border hover:bg-secondary"}`}>
      {icon} {label}
    </button>
  );
}
