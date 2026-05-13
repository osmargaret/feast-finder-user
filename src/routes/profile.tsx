import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/site/PageHero";
import { OrderTimeline } from "@/components/site/OrderTimeline";
import { Star, AlertCircle, X, Settings, HelpCircle, Heart, Bell, ShoppingBag, Receipt, MessageSquare, User as UserIcon, LogOut } from "lucide-react";
import { useAuth, useNotifications, useOrders, useWishlist, useFollow, useMessages, useVendorMenu, useReviews, useSupport, useLoyalty, useVendorProfile } from "@/store/AppProviders";
import { vendors, formatPrice } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile â€” MenuMenu" },
      { name: "description", content: "Your activity, orders, wishlist, and notifications in one place." },
      { property: "og:title", content: "Your Profile â€” MenuMenu" },
      { property: "og:description", content: "Your activity, orders, wishlist, and notifications in one place." },
    ],
  }),
  component: ProfilePage,
});

const tabs = ["Overview", "Orders", "Messages", "Transactions", "Wishlist", "Notifications", "Following", "Loyalty"] as const;
type Tab = (typeof tabs)[number];

function ProfilePage() {
  const auth = useAuth();
  const vendor = useVendorProfile();
  const navigate = useNavigate();
  const orders = useOrders();
  const wish = useWishlist();
  const notif = useNotifications();
  const follow = useFollow();
  const msgs = useMessages();
  const reviews = useReviews();
  const support = useSupport();
  const loyalty = useLoyalty();
  const { meals: allMeals } = useVendorMenu();
  const [tab, setTab] = useState<Tab>("Overview");
  const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
  const [reportingOrderId, setReportingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (auth.user && vendor.profile && vendor.profile.email === auth.user.email) {
      navigate({ to: "/vendor-dashboard" });
    }
  }, [auth.user, vendor.profile, navigate]);

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
                  <button 
                    onClick={() => setTab(t)} 
                    className={`relative w-full overflow-hidden whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-bold transition-all duration-300 ${tab === t ? "bg-primary/10 text-primary shadow-[inset_3px_0_0_var(--color-primary)]" : "text-foreground/75 hover:bg-secondary hover:text-foreground"}`}
                  >
                    {tab === t && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />}
                    <span className="relative z-10">{t}</span>
                  </button>
                </li>
              ))}
              <li className="mt-2 border-t border-border pt-2 space-y-1">
                <Link to="/support" className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-bold text-foreground/75 hover:bg-secondary">
                  <HelpCircle className="h-4 w-4" /> Help & Support
                </Link>
                <Link to="/settings" className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-bold text-foreground/75 hover:bg-secondary">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <button onClick={auth.signOut} className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-destructive">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </li>
            </ul>
          </aside>

          <div>
            {auth.user && !auth.user.emailVerified && (
              <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-amber-50 p-4 border border-amber-200 ring-1 ring-amber-500/10">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-900">Verify your email</h4>
                    <p className="text-xs font-semibold text-amber-700/80">Please verify your email address to unlock all features.</p>
                  </div>
                </div>
                <button 
                  onClick={() => auth.forgotPassword(auth.user!.email)}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-black text-white hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Resend Link
                </button>
              </div>
            )}

            {tab === "Overview" && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat icon={<ShoppingBag className="h-4 w-4" />} label="Orders" value={orders.items.length} />
                <Stat icon={<Receipt className="h-4 w-4" />} label="Total spent" value={formatPrice(orders.items.reduce((s, o) => s + o.total, 0))} />
                <Stat icon={<Heart className="h-4 w-4" />} label="Wishlist" value={wish.ids.length} />
                <Stat icon={<Bell className="h-4 w-4" />} label="Unread alerts" value={notif.unread} />
                <Stat icon={<Star className="h-4 w-4" />} label="Loyalty Points" value={loyalty.points} />
                <div className="card-mm p-6 sm:col-span-2 xl:col-span-4">
                  <h3 className="text-base font-extrabold">Recent activity</h3>
                  {orders.items.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">No orders yet. <Link to="/meals" className="font-bold text-primary">Browse meals â†’</Link></p>
                  ) : (
                    <ul className="mt-4 space-y-3 text-sm">
                      {orders.items.slice(0, 4).map((o) => (
                        <li key={o.id} className="flex items-center justify-between">
                          <span><span className="font-bold">{o.id}</span> Â· {o.items.length} item(s) Â· <span className="capitalize text-muted-foreground">{o.status}</span></span>
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
                  {orders.items.map((o) => {
                    const isReviewed = reviews.items.some((r) => r.orderId === o.id);
                    return (
                      <li key={o.id} className="card-mm p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{new Date(o.ts).toLocaleString()}</p>
                            <h4 className="text-base font-extrabold">{o.id}</h4>
                          </div>
                          <div className="flex gap-2">
                            {o.status === "delivered" && !isReviewed && (
                              <button
                                onClick={() => setReviewingOrderId(o.id)}
                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20"
                              >
                                <Star className="h-3 w-3" /> Rate & Review
                              </button>
                            )}
                            {o.status !== "cancelled" && (
                              <button
                                onClick={() => setReportingOrderId(o.id)}
                                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary"
                              >
                                <AlertCircle className="h-3 w-3" /> Report
                              </button>
                            )}
                            <span className={`rounded-full px-3 py-1 text-xs font-extrabold capitalize ${o.status === "delivered" ? "bg-emerald-100 text-emerald-700" : o.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>{o.status}</span>
                          </div>
                        </div>
                        <ul className="mt-3 space-y-1 text-sm">
                          {o.items.map((i) => (
                            <li key={i.mealId} className="flex justify-between"><span>{i.qty}Ã— {i.name}</span><span className="font-bold">{formatPrice(i.price * i.qty)}</span></li>
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
                    );
                  })}
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
                      <Link to="/vendors/$vendorId" params={{ vendorId: v.id }} className="text-xs font-bold text-primary hover:underline">Visit â†’</Link>
                    </li>
                  ))}
                </ul>
              )
            )}

            {tab === "Loyalty" && (
              <div className="space-y-6">
                <div className="card-mm bg-primary p-8 text-center text-primary-foreground">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/20">
                    <Star className="h-8 w-8 fill-current" />
                  </div>
                  <h3 className="text-3xl font-black">{loyalty.points} points</h3>
                  <p className="mt-1 font-bold opacity-80">You're a MenuMenu Gold Member</p>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full bg-white" style={{ width: "65%" }} />
                  </div>
                  <p className="mt-2 text-xs font-bold opacity-70">350 points until your next free meal</p>
                </div>

                <div className="card-mm p-6">
                  <h3 className="text-lg font-extrabold">Points history</h3>
                  {loyalty.history.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">No points earned yet. Order from any kitchen to earn points!</p>
                  ) : (
                    <ul className="mt-4 divide-y divide-border">
                      {loyalty.history.map((h, i) => (
                        <li key={i} className="flex items-center justify-between py-3 text-sm">
                          <div>
                            <p className="font-extrabold">{h.reason}</p>
                            <p className="text-xs text-muted-foreground">{new Date(h.ts).toLocaleDateString()}</p>
                          </div>
                          <span className={`font-black ${h.amount > 0 ? "text-primary" : "text-destructive"}`}>
                            {h.amount > 0 ? "+" : ""}{h.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {reviewingOrderId && (
        <ReviewModal
          orderId={reviewingOrderId}
          onClose={() => setReviewingOrderId(null)}
          onSuccess={() => {
            setReviewingOrderId(null);
            toast.success("Review submitted!");
          }}
        />
      )}

      {reportingOrderId && (
        <ReportModal
          orderId={reportingOrderId}
          onClose={() => setReportingOrderId(null)}
          onSuccess={() => {
            setReportingOrderId(null);
            toast.success("Problem reported. We'll look into it.");
          }}
        />
      )}
    </>
  );
}

function ReviewModal({ orderId, onClose, onSuccess }: { orderId: string; onClose: () => void; onSuccess: () => void }) {
  const orders = useOrders();
  const reviews = useReviews();
  const auth = useAuth();
  const order = orders.items.find((o) => o.id === orderId)!;
  const vendorId = order.items[0].vendorId; // Assuming all items from same vendor for now, or just picking first

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    reviews.add({
      orderId,
      vendorId,
      userName: auth.user!.name,
      rating,
      body: comment,
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card-mm w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black">Rate your order</h3>
          <button onClick={onClose} className="icon-btn"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)}>
                <Star className={`h-8 w-8 ${s <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <textarea
            required
            placeholder="What did you think of the food and delivery?"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="textarea-mm"
          />
          <button type="submit" className="btn-primary w-full">Submit Review</button>
        </form>
      </div>
    </div>
  );
}

function ReportModal({ orderId, onClose, onSuccess }: { orderId: string; onClose: () => void; onSuccess: () => void }) {
  const support = useSupport();
  const auth = useAuth();
  const [subject, setSubject] = useState("Missing items");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    support.create({
      orderId,
      userEmail: auth.user!.email,
      subject,
      message,
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card-mm w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black">Report a problem</h3>
          <button onClick={onClose} className="icon-btn"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">Reason</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-mm">
              <option>Missing items</option>
              <option>Food was cold</option>
              <option>Wrong order</option>
              <option>Spilled/Damaged</option>
              <option>Other</option>
            </select>
          </div>
          <textarea
            required
            placeholder="Tell us more about what happened..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea-mm"
          />
          <button type="submit" className="btn-primary w-full">Submit Ticket</button>
        </form>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="card-mm group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/15 group-hover:blur-3xl" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-sm ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
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
