import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Edit2, Trash2, Package, MessageSquare, ChefHat, X, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useAuth, useMessages, useOrders, useVendorMenu } from "@/store/AppProviders";
import { vendors, categories, formatPrice, type Meal } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor-dashboard")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard — MenuMenu" },
      { name: "description", content: "Manage your menu, orders and customer messages." },
      { property: "og:title", content: "Vendor Dashboard — MenuMenu" },
      { property: "og:description", content: "Manage your menu, orders and customer messages." },
    ],
  }),
  component: VendorDashboardPage,
});

const tabs = ["Menu", "Orders", "Messages"] as const;
type Tab = (typeof tabs)[number];

function VendorDashboardPage() {
  const auth = useAuth();
  const menu = useVendorMenu();
  const orders = useOrders();
  const messages = useMessages();
  const [vendorId, setVendorId] = useState<string>(vendors[0].id);
  const [tab, setTab] = useState<Tab>("Menu");

  const vendor = vendors.find((v) => v.id === vendorId)!;
  const myMeals = useMemo(() => menu.meals.filter((m) => m.vendorId === vendorId), [menu.meals, vendorId]);
  const myOrders = useMemo(
    () => orders.items.filter((o) => o.items.some((i) => i.vendorId === vendorId)),
    [orders.items, vendorId],
  );
  const myMessages = useMemo(() => messages.items.filter((m) => m.vendorId === vendorId), [messages.items, vendorId]);

  if (!auth.user) {
    return (
      <>
        <PageHero eyebrow="Vendor" title="Sign in as a vendor" subtitle="You need an account to manage a kitchen." />
        <section className="section">
          <div className="container-mm">
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <Link to="/signin" className="btn-primary inline-flex">Sign in</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const revenue = myOrders.reduce(
    (s, o) => s + o.items.filter((i) => i.vendorId === vendorId).reduce((a, i) => a + i.price * i.qty, 0),
    0,
  );

  return (
    <>
      <PageHero eyebrow="Vendor portal" title="Kitchen Dashboard" subtitle="Manage menu items, orders and customer messages." />
      <section className="section">
        <div className="container-mm">
          <div className="card-mm mb-6 flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <img src={vendor.avatar} alt={vendor.name} className="h-12 w-12 rounded-2xl object-cover" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">Acting as</p>
                <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="bg-transparent text-base font-extrabold focus:outline-none">
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <Stat icon={<ChefHat className="h-4 w-4" />} label="Menu items" value={myMeals.length} />
              <Stat icon={<Package className="h-4 w-4" />} label="Orders" value={myOrders.length} />
              <Stat icon={<MessageSquare className="h-4 w-4" />} label="Messages" value={myMessages.length} />
              <Stat icon={<ChefHat className="h-4 w-4" />} label="Revenue" value={formatPrice(revenue)} />
            </div>
          </div>

          <div className="mb-6 inline-flex rounded-full border border-border bg-background p-1">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>

          {tab === "Menu" && <MenuTab vendorId={vendorId} meals={myMeals} />}
          {tab === "Orders" && <OrdersTab vendorId={vendorId} orders={myOrders} />}
          {tab === "Messages" && <MessagesTab messages={myMessages} vendorName={vendor.name} />}
        </div>
      </section>
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <div className="leading-tight"><p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p><p className="text-sm font-extrabold">{value}</p></div>
    </div>
  );
}

function MenuTab({ vendorId, meals }: { vendorId: string; meals: Meal[] }) {
  const menu = useVendorMenu();
  const [editing, setEditing] = useState<Meal | "new" | null>(null);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing("new")} className="btn-primary inline-flex"><Plus className="h-4 w-4" /> Add menu item</button>
      </div>
      {meals.length === 0 ? (
        <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No menu items yet. Click "Add menu item" to create one.</p></div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((m) => (
            <li key={m.id} className="card-mm overflow-hidden">
              <img src={m.image} alt={m.name} className="h-32 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div><h4 className="font-extrabold">{m.name}</h4><p className="text-xs text-muted-foreground">{m.category} · {formatPrice(m.price)}</p></div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{m.blurb}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditing(m)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary"><Edit2 className="h-3 w-3" /> Edit</button>
                  <button onClick={() => menu.removeMeal(m.id)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5"><Trash2 className="h-3 w-3" /> Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <MealEditor
          vendorId={vendorId}
          meal={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

function MealEditor({ vendorId, meal, onClose }: { vendorId: string; meal: Meal | null; onClose: () => void }) {
  const menu = useVendorMenu();
  const [name, setName] = useState(meal?.name ?? "");
  const [price, setPrice] = useState(meal?.price ?? 1000);
  const [blurb, setBlurb] = useState(meal?.blurb ?? "");
  const [category, setCategory] = useState(meal?.category ?? categories[0].name);
  const [image, setImage] = useState(meal?.image ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name required");
    if (meal) {
      menu.updateMeal(meal.id, { name, price: Number(price), blurb, category, image: image || meal.image });
    } else {
      menu.addMeal({ name, price: Number(price), blurb, category, image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600", vendorId });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4">
      <form onSubmit={submit} className="card-mm w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold">{meal ? "Edit menu item" : "Add menu item"}</h3>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Price (₦)" type="number" value={String(price)} onChange={(v) => setPrice(Number(v))} />
          <div>
            <label className="block text-xs font-bold text-muted-foreground">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm">
              {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Description" value={blurb} onChange={setBlurb} />
          <Input label="Image URL (optional)" value={image} onChange={setImage} />
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{meal ? "Save changes" : "Create item"}</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
    </div>
  );
}

function OrdersTab({ vendorId, orders }: { vendorId: string; orders: ReturnType<typeof useOrders>["items"] }) {
  const ordersCtx = useOrders();
  if (orders.length === 0) {
    return <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No incoming orders yet.</p></div>;
  }
  return (
    <ul className="space-y-4">
      {orders.map((o) => {
        const myItems = o.items.filter((i) => i.vendorId === vendorId);
        const myTotal = myItems.reduce((s, i) => s + i.price * i.qty, 0);
        return (
          <li key={o.id} className="card-mm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{new Date(o.ts).toLocaleString()}</p>
                <h4 className="text-base font-extrabold">{o.id}</h4>
                <p className="text-xs text-muted-foreground">{o.address.name} · {o.address.phone}</p>
              </div>
              <select value={o.status} onChange={(e) => ordersCtx.setStatus(o.id, e.target.value as typeof o.status)} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold capitalize">
                <option value="pending">pending</option>
                <option value="preparing">preparing</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {myItems.map((i) => (
                <li key={i.mealId} className="flex justify-between"><span>{i.qty}× {i.name}</span><span className="font-bold">{formatPrice(i.price * i.qty)}</span></li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">Deliver to {o.address.street}, {o.address.city}</span>
              <span className="text-base font-black">{formatPrice(myTotal)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function MessagesTab({ messages, vendorName }: { messages: ReturnType<typeof useMessages>["items"]; vendorName: string }) {
  const ctx = useMessages();
  const [draft, setDraft] = useState<Record<string, string>>({});

  // Group messages into threads keyed by user email
  const threads = useMemo(() => {
    const map = new Map<string, typeof messages>();
    [...messages]
      .sort((a, b) => a.ts - b.ts)
      .forEach((m) => {
        const list = map.get(m.fromEmail) ?? [];
        list.push(m);
        map.set(m.fromEmail, list);
      });
    return Array.from(map.entries()).map(([email, msgs]) => {
      const last = msgs[msgs.length - 1];
      const userMsg = [...msgs].reverse().find((m) => m.from === "user");
      return { email, msgs, last, customerName: userMsg?.fromName ?? "Customer", vendorId: msgs[0].vendorId };
    }).sort((a, b) => b.last.ts - a.last.ts);
  }, [messages]);

  if (threads.length === 0) {
    return <div className="card-mm p-10 text-center"><p className="text-sm text-muted-foreground">No customer messages yet.</p></div>;
  }
  return (
    <ul className="space-y-3">
      {threads.map((t) => {
        const unread = t.msgs.some((m) => m.from === "user" && !m.read);
        return (
          <li key={t.email} className={`card-mm p-4 ${unread ? "border-primary/40 bg-primary/5" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold">{t.customerName} <span className="text-xs font-normal text-muted-foreground">· {t.email}</span></p>
                <p className="text-[11px] font-bold text-muted-foreground">{t.msgs.length} message(s) · last {new Date(t.last.ts).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
              {t.msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "vendor" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "vendor" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    <p>{m.body}</p>
                    <p className={`mt-0.5 text-[10px] ${m.from === "vendor" ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={draft[t.email] ?? ""}
                onChange={(e) => setDraft({ ...draft, [t.email]: e.target.value })}
                placeholder="Type a reply…"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const text = (draft[t.email] ?? "").trim();
                    if (text) { ctx.reply(t.vendorId, t.email, text, vendorName); setDraft({ ...draft, [t.email]: "" }); toast.success("Reply sent"); }
                  }
                }}
              />
              <button
                onClick={() => {
                  const text = (draft[t.email] ?? "").trim();
                  if (text) { ctx.reply(t.vendorId, t.email, text, vendorName); setDraft({ ...draft, [t.email]: "" }); toast.success("Reply sent"); }
                }}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              ><Check className="h-3.5 w-3.5" /> Reply</button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
