import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Package } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { OrderTimeline } from "@/components/site/OrderTimeline";
import { useOrders } from "@/store/AppProviders";
import { formatPrice } from "@/data/mock";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — MenuMenu" },
      { name: "description", content: "Your order has been placed successfully." },
    ],
  }),
  component: ConfirmationPage,
  notFoundComponent: () => (
    <div className="section container-mm text-center">
      <h1 className="text-2xl font-extrabold">Order not found</h1>
      <Link to="/" className="btn-primary mt-4 inline-flex">Go home</Link>
    </div>
  ),
});

function ConfirmationPage() {
  const { orderId } = Route.useParams();
  const orders = useOrders();
  const order = orders.items.find((o) => o.id === orderId);
  if (!order) throw notFound();

  return (
    <>
      <PageHero eyebrow="Order placed" title="Thank you! 🎉" subtitle={`Confirmation #${order.id}`} />
      <section className="section">
        <div className="container-mm max-w-2xl">
          <div className="card-mm p-8 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold">Your order is on its way</h2>
            <p className="mt-2 text-sm text-muted-foreground">We've notified the kitchen{order.address.name ? `, ${order.address.name}` : ""}. Track your order in your profile.</p>
          </div>

          <div className="card-mm mt-6 p-6">
            <h3 className="text-base font-extrabold">Order tracking</h3>
            <div className="mt-5"><OrderTimeline status={order.status} /></div>
          </div>

          <div className="card-mm mt-6 p-6">
            <h3 className="flex items-center gap-2 text-base font-extrabold"><Package className="h-4 w-4" /> Order details</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {order.items.map((it) => (
                <li key={it.mealId} className="flex justify-between">
                  <span><span className="font-bold">{it.qty}×</span> {it.name}</span>
                  <span className="font-bold">{formatPrice(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm font-semibold">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPrice(order.delivery)}</dd></div>
              <div className="flex justify-between text-base font-black"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-secondary p-3"><p className="text-xs font-bold text-muted-foreground">Deliver to</p><p className="font-bold">{order.address.name}</p><p className="text-xs">{order.address.street}, {order.address.city}</p><p className="text-xs">{order.address.phone}</p></div>
              <div className="rounded-2xl bg-secondary p-3"><p className="text-xs font-bold text-muted-foreground">Payment</p><p className="font-bold capitalize">{order.payment}</p><p className="text-xs">Status: <span className="capitalize">{order.status}</span></p></div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/profile" className="btn-primary">View my orders</Link>
            <Link to="/meals" className="btn-ghost">Continue shopping</Link>
          </div>
        </div>
      </section>
    </>
  );
}
