import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User as UserIcon, Heart, Bell, ShoppingBag, Receipt, LogOut, MessageSquare } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { OrderTimeline } from "@/components/site/OrderTimeline";
import { useAuth, useNotifications, useOrders, useWishlist, useFollow, useMessages, useVendorMenu } from "@/store/AppProviders";
import { vendors, formatPrice } from "@/data/mock";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — MenuMenu" },
      { name: "description", content: "Your activity, orders, wishlist, and notifications in one place." },
      { property: "og:title", content: "Your Profile — MenuMenu" },
      { property: "og:description", content: "Your activity, orders, wishlist, and notifications in one place." },
    ],
  }),
  component: ProfilePage,
});

const tabs = ["Overview", "Orders", "Messages", "Transactions", "Wishlist", "Notifications", "Following"] as const;
type Tab = (typeof tabs)[number];

function ProfilePage() {
  const auth = useAuth();
  const orders = useOrders();
  const wish = useWishlist();
  const notif = useNotifications();
  const follow = useFollow();
  const msgs = useMessages();
  const { meals: allMeals } = useVendorMenu();
  const [tab, setTab] = useState<Tab>("Overview");

  if (!auth.user) {
    return (
      <>
        <PageHero eyebrow="Profile" title="Sign in to continue" subtitle="Your orders, wishlist, and notifications live here." />
        <section className="section">
          <div className="container-mm">
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <UserIcon className="h-6 w-6" />
              </div>
              <Link to="/signin" className="btn-primary mt-4 inline-flex">Sign in</Link>
              <Link to="/signup" className="btn-ghost ml-2 mt-4 inline-flex">Create account</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const wishItems = allMeals.filter((m) => wish.ids.includes(m.id));
  const followedVendors = vendors.filter((v) => follow.has(v.id));

  return (
    <>
      <PageHero eyebrow="Account" title={`Hi, ${auth.user.name} 👋`} subtitle={auth.user.email} />
      <section className="section">
        <div className="container-mm grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="card-mm h-fit p-3">
            <ul className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
              {tabs.map((t) => (
                <li key={t}>
                  <button onClick={() => setTab(t)} className={`w-full whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-bold transition ${tab === t ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}>
                    {t}
                  </button>
                </li>
              ))}
              <li className="mt-2 border-t border-border pt-2">
                <button onClick={auth.signOut} className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-destructive">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </li>
            </ul>
          </aside>

          <div>
            {tab === "Overview" && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat icon={<ShoppingBag className="h-4 w-4" />} label="Orders" value={orders.items.length} />
                <Stat icon={<Receipt className="h-4 w-4" />} label="Total spent" value={formatPrice(orders.items.reduce((s, o) => s + o.total, 0))} />
                <Stat icon={<Heart className="h-4 w-4" />} label="Wishlist" value={wish.ids.length} />
                <Stat icon={<Bell className="h-4 w-4" />} label="Unread alerts" value={notif.unread} />
                <div className="card-mm p-6 sm:col-span-2 xl:col-span-4">
                  <h3 className="text-base font-extrabold">Recent activity</h3>
                  {orders.items.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">No orders yet. <Link to="/meals" className="font-bold text-primary">Browse meals →</Link></p>
                  ) : (
                    <ul className="mt-4 space-y-3 text-sm">
                      {orders.items.slice(0, 4).map((o) => (
                        <li key={o.id} className="flex items-center justify-between">
                          <span><span className="font-bold">{o.id}</span> · {o.items.length} item(s) · <span className="capitalize text-muted-foreground">{o.status}</span></span>
                          <span className="font-extrabold">{formatPrice(o.total)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {tab === "Orders" && (
              orders.items.length === 0 ? (
                <Empty icon={<ShoppingBag className="h-6 w-6" />} title="No orders yet" cta={<Link to="/meals" className="btn-primary mt-4 inline-flex">Browse meals</Link>} />
              ) : (
                <ul className="space-y-4">
                  {orders.items.map((o) => (
                    <li key={o.id} className="card-mm p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{new Date(o.ts).toLocaleString()}</p>
                          <h4 className="text-base font-extrabold">{o.id}</h4>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-extrabold capitalize ${o.status === "delivered" ? "bg-emerald-100 text-emerald-700" : o.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>{o.status}</span>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm">
                        {o.items.map((i) => (
                          <li key={i.mealId} className="flex justify-between"><span>{i.qty}× {i.name}</span><span className="font-bold">{formatPrice(i.price * i.qty)}</span></li>
                        ))}
                      </ul>
                      <div className="mt-4 border-t border-border pt-4">
                        <OrderTimeline status={o.status} />
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                        <span className="text-muted-foreground">Deliver to {o.address.street}, {o.address.city}</span>
                        <span className="text-base font-black">{formatPrice(o.total)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            )}

            {tab === "Messages" && (() => {
              const myMsgs = msgs.items.filter((m) => m.fromEmail === auth.user!.email);
              const threadVendors = Array.from(new Set(myMsgs.map((m) => m.vendorId)));
              if (threadVendors.length === 0) {
                return <Empty icon={<MessageSquare className="h-6 w-6" />} title="No conversations yet" cta={<Link to="/vendors" className="btn-primary mt-4 inline-flex">Discover kitchens</Link>} />;
              }
              return (
                <div className="card-mm p-6 text-center">
                  <p className="text-sm text-muted-foreground">{threadVendors.length} active conversation(s).</p>
                  <Link to="/messages" className="btn-primary mt-4 inline-flex">Open inbox</Link>
                </div>
              );
            })()}

            {tab === "Transactions" && (
              orders.items.length === 0 ? (
                <Empty icon={<Receipt className="h-6 w-6" />} title="No transactions yet" />
              ) : (
                <div className="card-mm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary text-xs font-bold uppercase text-muted-foreground">
                      <tr><th className="p-3">Date</th><th className="p-3">Order</th><th className="p-3">Method</th><th className="p-3 text-right">Amount</th></tr>
                    </thead>
                    <tbody>
                      {orders.items.map((o) => (
                        <tr key={o.id} className="border-t border-border">
                          <td className="p-3">{new Date(o.ts).toLocaleDateString()}</td>
                          <td className="p-3 font-bold">{o.id}</td>
                          <td className="p-3 capitalize">{o.payment}</td>
                          <td className="p-3 text-right font-extrabold">{formatPrice(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === "Wishlist" && (
              wishItems.length === 0 ? (
                <Empty icon={<Heart className="h-6 w-6" />} title="Wishlist empty" cta={<Link to="/meals" className="btn-primary mt-4 inline-flex">Browse meals</Link>} />
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {wishItems.map((m) => (
                    <li key={m.id} className="card-mm flex gap-3 p-3">
                      <img src={m.image} alt={m.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-extrabold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(m.price)}</p>
                      </div>
                      <button onClick={() => wish.remove(m.id)} className="text-xs font-bold text-muted-foreground hover:text-destructive">Remove</button>
                    </li>
                  ))}
                </ul>
              )
            )}

            {tab === "Notifications" && (
              notif.items.length === 0 ? (
                <Empty icon={<Bell className="h-6 w-6" />} title="No notifications" />
              ) : (
                <ul className="space-y-3">
                  {notif.items.map((n) => (
                    <li key={n.id} className={`card-mm p-4 ${!n.read ? "border-primary/40 bg-primary/5" : ""}`}>
                      <div className="flex items-center justify-between"><p className="font-extrabold">{n.title}</p><span className="text-[11px] font-bold text-muted-foreground">{new Date(n.ts).toLocaleString()}</span></div>
                      <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    </li>
                  ))}
                </ul>
              )
            )}

            {tab === "Following" && (
              followedVendors.length === 0 ? (
                <Empty icon={<UserIcon className="h-6 w-6" />} title="Not following any kitchens yet" cta={<Link to="/vendors" className="btn-primary mt-4 inline-flex">Discover kitchens</Link>} />
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {followedVendors.map((v) => (
                    <li key={v.id} className="card-mm flex items-center gap-3 p-3">
                      <img src={v.avatar} alt={v.name} className="h-12 w-12 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <p className="font-extrabold">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.tagline}</p>
                      </div>
                      <Link to="/vendors/$vendorId" params={{ vendorId: v.id }} className="text-xs font-bold text-primary hover:underline">Visit →</Link>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="card-mm p-5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function Empty({ icon, title, cta }: { icon: React.ReactNode; title: string; cta?: React.ReactNode }) {
  return (
    <div className="card-mm p-10 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">{icon}</div>
      <h3 className="text-lg font-extrabold">{title}</h3>
      {cta}
    </div>
  );
}
