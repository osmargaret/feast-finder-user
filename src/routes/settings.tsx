import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User as UserIcon, Bell, MapPin, Truck, Lock, Save, X, Store, CreditCard, LayoutGrid, Package, MessageSquare, BarChart3, DollarSign, TrendingUp, Newspaper, Users, Settings as SettingsIcon, Check, Gift, Star as StarIcon } from "lucide-react";
import { categories as allCategories } from "@/data/mock";
import { PageHero } from "@/components/site/PageHero";
import { useAuth, useVendorProfile } from "@/store/AppProviders";
import { LAGOS_AREAS, vendors } from "@/data/mock";
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
  const search = typeof window !== "undefined" ? window.location.search : "";
  const urlParams = new URLSearchParams(search);
  const forceVendor = urlParams.get("view") === "vendor";
  
  const [viewMode, setViewMode] = useState<"user" | "vendor">(forceVendor || !!vendor.profile ? "vendor" : "user");
  const isVendor = viewMode === "vendor";

  const tabs = isVendor
    ? (["Store Info", "Notifications", "Delivery", "Bank & Payouts", "Security"] as const)
    : (["Account", "Notifications", "Security"] as const);
  
  // Only reset tab if it's invalid for the new viewMode
  const [tab, setTab] = useState<(typeof tabs)[number]>(isVendor ? "Store Info" : "Account");
  
  const [vendorId, setVendorId] = useState<string>(vendors[0].id);
  const vendorMock = vendors.find((v) => v.id === vendorId)!;

  const vendorSections = [
    { key: "dashboard", label: "Command Center", icon: BarChart3 },
    { key: "launchpad", label: "Launchpad", icon: Store },
    { key: "menu", label: "Menu", icon: LayoutGrid },
    { key: "orders", label: "Orders", icon: Package },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "analytics", label: "Analytics", icon: TrendingUp },
    { key: "income", label: "Income", icon: DollarSign },
    { key: "wallet", label: "Wallet & Payout", icon: CreditCard },
    { key: "blog", label: "Blog Manager", icon: Newspaper },
    { key: "promotions", label: "Promotions", icon: Gift },
    { key: "reviews", label: "Reviews", icon: StarIcon },
    { key: "team", label: "Team", icon: Users },
  ] as const;

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
          <div className="mb-4 flex justify-end">
            <button 
              onClick={() => {
                const next = viewMode === "user" ? "vendor" : "user";
                setViewMode(next);
                setTab(next === "vendor" ? "Store Info" : "Account");
              }} 
              className="btn-ghost text-xs font-bold"
            >
              Switch to {viewMode === "user" ? "Vendor" : "Customer"} View
            </button>
          </div>
          <div className={isVendor ? "grid gap-6 lg:grid-cols-[260px_1fr]" : ""}>
            {isVendor && (
              <aside className="card-mm h-fit p-4 lg:sticky lg:top-28 mb-6 lg:mb-0">
                <div className="mb-3 flex items-center gap-3 rounded-2xl bg-secondary p-3">
                  <img src={vendorMock.avatar} alt={vendorMock.name} className="h-10 w-10 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Acting as</p>
                    <select
                      value={vendorId}
                      onChange={(e) => setVendorId(e.target.value)}
                      className="w-full bg-transparent text-sm font-extrabold focus:outline-none"
                    >
                      {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  {vendorSections.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Link
                        key={s.key}
                        to="/vendor-dashboard"
                        search={{ tab: s.key }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition text-foreground/75 hover:bg-secondary"
                      >
                        <Icon className="h-4 w-4" /> {s.label}
                      </Link>
                    );
                  })}
                  <div className="mt-2 border-t border-border pt-2">
                    <button
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold bg-primary text-primary-foreground shadow-md transition"
                    >
                      <SettingsIcon className="h-4 w-4" /> Settings
                    </button>
                  </div>
                </nav>
              </aside>
            )}

            <div className="min-w-0">
              {/* Top tab bar */}
              <div className="card-mm mb-6 flex flex-wrap gap-1 p-2">
                {tabs.map((t) => {
                  const Icon = 
                    t === "Account" ? UserIcon : 
                    t === "Store Info" ? Store :
                    t === "Notifications" ? Bell : 
                    t === "Delivery" ? Truck : 
                    t === "Bank & Payouts" ? CreditCard : Lock;
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
              {tab === "Store Info" && isVendor && <StoreInfoTab />}
              {tab === "Notifications" && <NotificationsTab />}
              {tab === "Delivery" && isVendor && <DeliveryTab />}
              {tab === "Bank & Payouts" && isVendor && <BankPayoutsTab />}
              {tab === "Security" && <SecurityTab />}
            </div>
          </div>
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

function StoreInfoTab() {
  const categories = allCategories; // Local alias
  const vendor = useVendorProfile();
  const auth = useAuth();
  const p = vendor.profile;

  const [businessName, setBusinessName] = useState(p?.businessName ?? "");
  const [tagline, setTagline] = useState(p?.tagline ?? "");
  const [ownerName, setOwnerName] = useState(p?.ownerName ?? auth.user?.name ?? "");
  const [email, setEmail] = useState(p?.email ?? auth.user?.email ?? "");
  const [phone, setPhone] = useState(p?.phone ?? "");
  const [address, setAddress] = useState(p?.address ?? "");
  const [cac, setCac] = useState(p?.cac ?? "");
  const [openStart, setOpenStart] = useState(p?.openHours?.start ?? "09:00");
  const [openEnd, setOpenEnd] = useState(p?.openHours?.end ?? "21:00");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(p?.categories ?? []);

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName],
    );
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    vendor.save({
      ...p,
      businessName,
      tagline,
      ownerName,
      email,
      phone,
      address,
      cac,
      openHours: { start: openStart, end: openEnd },
      categories: selectedCategories,
      images: p?.images ?? [],
    } as any);
    toast.success("Store info updated");
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="card-mm grid gap-4 p-6 sm:grid-cols-2">
        <h3 className="col-span-full text-lg font-extrabold">Public Profile</h3>
        <Field label="Business Name"><input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="input-mm" required /></Field>
        <Field label="Tagline"><input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Best Jollof in Lagos" className="input-mm" /></Field>
        <div className="col-span-full grid gap-4 sm:grid-cols-2">
           <Field label="Opening Time"><input type="time" value={openStart} onChange={(e) => setOpenStart(e.target.value)} className="input-mm" required /></Field>
           <Field label="Closing Time"><input type="time" value={openEnd} onChange={(e) => setOpenEnd(e.target.value)} className="input-mm" required /></Field>
        </div>

        {/* Categories Section */}
        <div className="col-span-full mt-4">
          <label className="mb-3 block text-xs font-black uppercase tracking-wider text-muted-foreground">
            Cuisine Categories (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const checked = selectedCategories.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleCategory(c.name)}
                  className={`group flex items-center gap-2.5 rounded-2xl border-2 px-4 py-2 text-sm font-black transition-all ${
                    checked
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                      : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-125 ${checked ? "scale-110" : ""}`}>
                    {c.icon}
                  </span>
                  <span>{c.name}</span>
                  {checked && <Check className="h-3.5 w-3.5 animate-in zoom-in duration-300" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card-mm grid gap-4 p-6 sm:grid-cols-2">
        <h3 className="col-span-full text-lg font-extrabold">Contact & Legal</h3>
        <Field label="Owner Name"><input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="input-mm" required /></Field>
        <Field label="Email Address"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-mm" required /></Field>
        <Field label="Phone Number"><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-mm" required /></Field>
        <Field label="CAC Registration No."><input value={cac} onChange={(e) => setCac(e.target.value)} placeholder="RC-123456" className="input-mm" /></Field>
        <div className="col-span-full">
          <Field label="Physical Address"><textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="textarea-mm" required /></Field>
        </div>
      </div>

      <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> Save store info</button>
    </form>
  );
}

function BankPayoutsTab() {
  const vendor = useVendorProfile();
  const p = vendor.profile;

  const [bankName, setBankName] = useState(p?.bankDetails?.bankName ?? "");
  const [accountName, setAccountName] = useState(p?.bankDetails?.accountName ?? "");
  const [accountNumber, setAccountNumber] = useState(p?.bankDetails?.accountNumber ?? "");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p) return;
    vendor.save({
      ...p,
      bankDetails: { bankName, accountName, accountNumber }
    } as any);
    toast.success("Bank details updated");
  };

  return (
    <form onSubmit={save} className="card-mm grid gap-4 p-6 sm:grid-cols-2">
      <div className="col-span-full mb-2">
        <h3 className="text-lg font-extrabold">Payout Information</h3>
        <p className="text-sm text-muted-foreground">This account will be used to process your weekly settlements.</p>
      </div>
      <Field label="Bank Name">
        <select value={bankName} onChange={(e) => setBankName(e.target.value)} className="input-mm" required>
          <option value="" disabled>Select a bank</option>
          <option>GTBank</option>
          <option>Zenith Bank</option>
          <option>Access Bank</option>
          <option>UBA</option>
          <option>First Bank</option>
          <option>Kuda Bank</option>
          <option>Moniepoint</option>
          <option>Opay</option>
        </select>
      </Field>
      <Field label="Account Number"><input type="text" pattern="[0-9]{10}" title="10 digit account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="input-mm" required /></Field>
      <div className="col-span-full">
        <Field label="Account Name"><input value={accountName} onChange={(e) => setAccountName(e.target.value)} className="input-mm" required /></Field>
      </div>
      <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit"><Save className="h-4 w-4" /> Save bank details</button>
    </form>
  );
}
