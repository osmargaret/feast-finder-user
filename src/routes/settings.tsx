import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User as UserIcon, Bell, MapPin, Truck, Lock, Save, X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useAuth, useVendorProfile } from "@/store/AppProviders";
import { LAGOS_AREAS } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MenuMenu" },
      { name: "description", content: "Manage your account, notification, and delivery settings." },
      { property: "og:title", content: "Settings — MenuMenu" },
      { property: "og:description", content: "Manage your account, notification, and delivery settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const auth = useAuth();
  const vendor = useVendorProfile();
  const isVendor = !!vendor.profile;

  const tabs = isVendor
    ? (["Account", "Notifications", "Delivery", "Security"] as const)
    : (["Account", "Notifications", "Security"] as const);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Account");

  if (!auth.user) {
    return (
      <>
        <PageHero eyebrow="Settings" title="Sign in" subtitle="Manage your preferences" />
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

  return (
    <>
      <PageHero eyebrow="Preferences" title="Settings" subtitle="Tweak how MenuMenu works for you." />
      <section className="section">
        <div className="container-mm">
          {/* Top tab bar */}
          <div className="card-mm mb-6 flex flex-wrap gap-1 p-2">
            {tabs.map((t) => {
              const Icon = t === "Account" ? UserIcon : t === "Notifications" ? Bell : t === "Delivery" ? Truck : Lock;
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    active ? "bg-primary text-primary-foreground shadow" : "text-foreground/70 hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {t}
                </button>
              );
            })}
          </div>

          {tab === "Account" && <AccountTab />}
          {tab === "Notifications" && <NotificationsTab />}
          {tab === "Delivery" && isVendor && <DeliveryTab />}
          {tab === "Security" && <SecurityTab />}
        </div>
      </section>
    </>
  );
}

function AccountTab() {
  const auth = useAuth();
  const [name, setName] = useState(auth.user?.name ?? "");
  const [email, setEmail] = useState(auth.user?.email ?? "");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); toast.success("Account updated"); }}
      className="card-mm grid gap-4 p-6 sm:grid-cols-2"
    >
      <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="input-mm" /></Field>
      <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-mm" /></Field>
      <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit"><Save className="h-4 w-4" /> Save changes</button>
    </form>
  );
}

function NotificationsTab() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promos, setPromos] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const items = [
    { label: "Order status updates", desc: "Get notified when your order status changes.", value: orderUpdates, set: setOrderUpdates },
    { label: "Promotions & deals", desc: "Discounts and special offers from kitchens.", value: promos, set: setPromos },
    { label: "Weekly newsletter", desc: "The best of MenuMenu, every Friday.", value: newsletter, set: setNewsletter },
  ];
  return (
    <div className="card-mm divide-y divide-border">
      {items.map((it) => (
        <label key={it.label} className="flex cursor-pointer items-start justify-between gap-4 p-5">
          <div>
            <p className="font-extrabold">{it.label}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{it.desc}</p>
          </div>
          <input
            type="checkbox"
            checked={it.value}
            onChange={(e) => { it.set(e.target.checked); toast(e.target.checked ? "Enabled" : "Disabled"); }}
            className="mt-1 h-5 w-5 accent-primary"
          />
        </label>
      ))}
    </div>
  );
}

function DeliveryTab() {
  const vendor = useVendorProfile();
  const [areas, setAreas] = useState<string[]>(vendor.profile?.deliveryAreas ?? []);
  const [custom, setCustom] = useState("");
  const [delivers, setDelivers] = useState(true);

  const toggle = (a: string) => setAreas((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);
  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    if (!areas.includes(v)) setAreas([...areas, v]);
    setCustom("");
  };

  const save = () => {
    if (!vendor.profile) return;
    vendor.save({ ...vendor.profile, deliveryAreas: delivers ? areas : [] });
    toast.success("Delivery settings saved");
  };

  return (
    <div className="space-y-6">
      <div className="card-mm p-6">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={delivers} onChange={(e) => setDelivers(e.target.checked)} className="h-5 w-5 accent-primary" />
          <div>
            <p className="font-extrabold">We offer delivery</p>
            <p className="text-sm text-muted-foreground">Turn this off if customers must pick up.</p>
          </div>
        </label>
      </div>

      {delivers && (
        <div className="card-mm p-6">
          <h3 className="flex items-center gap-2 text-lg font-extrabold"><MapPin className="h-4 w-4 text-primary" /> Areas you deliver to</h3>
          <p className="mt-1 text-sm text-muted-foreground">Pick areas within your state. Add custom ones below.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {LAGOS_AREAS.map((a) => {
              const on = areas.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggle(a)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${on ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}
                >
                  {a}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
              placeholder="Add a custom area (e.g. Ojodu)"
              className="input-mm max-w-xs flex-1"
            />
            <button type="button" onClick={addCustom} className="btn-ghost">Add</button>
          </div>

          {areas.length > 0 && (
            <div className="mt-5 rounded-2xl bg-secondary/40 p-4">
              <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Selected ({areas.length})</p>
              <div className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-bold">
                    {a}
                    <button onClick={() => toggle(a)} aria-label="Remove"><X className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button onClick={save} className="btn-primary"><Save className="h-4 w-4" /> Save delivery settings</button>
    </div>
  );
}

function SecurityTab() {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}
      className="card-mm grid gap-4 p-6 sm:grid-cols-2"
    >
      <Field label="Current password"><input type="password" className="input-mm" /></Field>
      <Field label="New password"><input type="password" className="input-mm" /></Field>
      <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit"><Save className="h-4 w-4" /> Update password</button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
