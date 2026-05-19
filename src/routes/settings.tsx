import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
import {
  User as UserIcon,
  Bell,
  MapPin,
  Truck,
  Lock,
  Save,
  X,
  Store,
  CreditCard,
  LayoutGrid,
  Package,
  MessageSquare,
  BarChart3,
  DollarSign,
  TrendingUp,
  Newspaper,
  Users,
  Settings as SettingsIcon,
  Check,
  Gift,
  Star as StarIcon,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  ShoppingBag,
} from "lucide-react";
import { ImageUpload } from "@/components/site/ImageUpload";
import { categories as allCategories } from "@/data/mock";
import { PageHero } from "@/components/site/PageHero";
import { useAuth, useVendorProfile, useTeam } from "@/store/AppProviders";
import { vendors } from "@/data/mock";
import { NIGERIAN_STATES, getStateAreas } from "@/data/nigeria";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MenuMenu" },
      { name: "description", content: "Manage your account, notification, and delivery settings." },
      { property: "og:title", content: "Settings — MenuMenu" },
      {
        property: "og:description",
        content: "Manage your account, notification, and delivery settings.",
      },
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

  const [viewMode, setViewMode] = useState<"user" | "vendor">(
    forceVendor || !!vendor.profile ? "vendor" : "user",
  );
  const isVendor = viewMode === "vendor";

  const tabs = isVendor
    ? (["Store Info", "Notifications", "Delivery", "Bank & Payouts", "Security", "Team"] as const)
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
    { key: "blog", label: "Blog Manager", icon: Newspaper },
    { key: "promotions", label: "Promotions", icon: Gift },
    { key: "reviews", label: "Reviews", icon: StarIcon },
  ] as const;

  if (!auth.user) {
    return (
      <>
        <PageHero eyebrow="Settings" title="Sign in" subtitle="Manage your preferences" />
        <section className="section">
          <div className="container-mm">
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <Link to="/signin" className="btn-primary inline-flex">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Preferences"
        title="Settings"
        subtitle="Tweak how MenuMenu works for you."
      />
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
                  <img
                    src={vendorMock.avatar}
                    alt={vendorMock.name}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Acting as
                    </p>
                    <select
                      value={vendorId}
                      onChange={(e) => setVendorId(e.target.value)}
                      className="w-full bg-transparent text-sm font-extrabold focus:outline-none"
                    >
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
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
                    <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold bg-primary text-primary-foreground shadow-md transition">
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
                    t === "Account"
                      ? UserIcon
                      : t === "Store Info"
                        ? Store
                        : t === "Notifications"
                          ? Bell
                          : t === "Delivery"
                            ? Truck
                            : t === "Bank & Payouts"
                              ? CreditCard
                              : t === "Team"
                                ? Users
                                : Lock;
                  const active = tab === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                        active
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-foreground/70 hover:bg-secondary"
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
              {tab === "Team" && isVendor && <TeamTab />}
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
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Account updated");
      }}
      className="card-mm grid gap-4 p-6 sm:grid-cols-2"
    >
      <Field label="Full name">
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-mm" />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-mm"
        />
      </Field>
      <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit">
        <Save className="h-4 w-4" /> Save changes
      </button>
    </form>
  );
}

function NotificationsTab() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promos, setPromos] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const items = [
    {
      label: "Order status updates",
      desc: "Get notified when your order status changes.",
      value: orderUpdates,
      set: setOrderUpdates,
    },
    {
      label: "Promotions & deals",
      desc: "Discounts and special offers from kitchens.",
      value: promos,
      set: setPromos,
    },
    {
      label: "Weekly newsletter",
      desc: "The best of MenuMenu, every Friday.",
      value: newsletter,
      set: setNewsletter,
    },
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
            onChange={(e) => {
              it.set(e.target.checked);
              toast(e.target.checked ? "Enabled" : "Disabled");
            }}
            className="mt-1 h-5 w-5 accent-primary"
          />
        </label>
      ))}
    </div>
  );
}

function DeliveryTab() {
  const vendor = useVendorProfile();
  const [areas, setAreas] = useState<{ name: string; fee: number }[]>(
    (vendor.profile?.deliveryAreas || []).map((a) =>
      typeof a === "string" ? { name: a, fee: 800 } : a,
    ),
  );
  const [locInput, setLocInput] = useState("");
  const [feeInput, setFeeInput] = useState<number>(500);
  const [delivers, setDelivers] = useState(vendor.profile?.deliveryAvailable ?? false);
  const [pickup, setPickup] = useState(vendor.profile?.pickupAvailable ?? true);

  // Use the vendor's state areas; fall back to Lagos if not set
  const stateAreas = useMemo(
    () => getStateAreas(vendor.profile?.stateId ?? 1),
    [vendor.profile?.stateId],
  );

  const suggestions = stateAreas
    .filter(
      (a) => a.toLowerCase().includes(locInput.toLowerCase()) && !areas.some((x) => x.name === a),
    )
    .slice(0, 6);

  const addArea = (name: string, fee: number) => {
    const v = name.trim();
    if (!v) return;
    if (!areas.some((x) => x.name === v))
      setAreas([...areas, { name: v, fee: Math.max(500, fee) }]);
    setLocInput("");
    setFeeInput(500);
  };

  const removeArea = (name: string) => setAreas(areas.filter((x) => x.name !== name));

  const save = () => {
    if (!delivers && !pickup) return toast.error("At least one service option must be enabled.");
    if (!vendor.profile) return;
    vendor.save({ 
      ...vendor.profile, 
      deliveryAvailable: delivers,
      pickupAvailable: pickup,
      deliveryAreas: delivers ? areas : [] 
    });
    toast.success("Delivery settings saved");
  };

  return (
    <div className="space-y-6">
      <div className="card-mm p-6 grid gap-6 sm:grid-cols-2">
        {/* Delivery Toggle */}
        <label className={`flex items-start gap-4 rounded-2xl border-2 p-4 cursor-pointer transition-all ${
          delivers ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/30"
        }`}>
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
            delivers ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
          }`}>
            <Truck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black">Delivery</p>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              We deliver to customers
            </p>
          </div>
          <input
            type="checkbox"
            checked={delivers}
            onChange={(e) => setDelivers(e.target.checked)}
            className="mt-2 h-5 w-5 accent-primary"
          />
        </label>

        {/* Pickup Toggle */}
        <label className={`flex items-start gap-4 rounded-2xl border-2 p-4 cursor-pointer transition-all ${
          pickup ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/30"
        }`}>
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
            pickup ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
          }`}>
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black">Pickup</p>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              Customers collect in-store
            </p>
          </div>
          <input
            type="checkbox"
            checked={pickup}
            onChange={(e) => setPickup(e.target.checked)}
            className="mt-2 h-5 w-5 accent-primary"
          />
        </label>
      </div>

      {(!delivers && !pickup) && (
        <p className="text-sm font-bold text-destructive px-2">
          At least one service option must be enabled.
        </p>
      )}

      {delivers && (
        <div className="card-mm p-6 overflow-visible">
          <h3 className="flex items-center gap-2 text-lg font-extrabold">
            <MapPin className="h-4 w-4 text-primary" /> Delivery Areas & Fees
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add locations and set delivery fees for each. Minimum fee is ₦500.
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-3 relative z-10">
            <div className="flex-1 min-w-[200px] relative">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1.5 ml-1">
                Location
              </label>
              <input
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArea(locInput, feeInput);
                  }
                }}
                placeholder="e.g. Lekki Phase 1"
                className="input-mm w-full"
              />
              {locInput && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-20">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setLocInput(s);
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-secondary transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-32">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1.5 ml-1">
                Fee (₦)
              </label>
              <input
                type="number"
                min="500"
                value={feeInput}
                onChange={(e) => setFeeInput(Math.max(500, Number(e.target.value)))}
                className="input-mm w-full"
              />
            </div>

            <button
              type="button"
              onClick={() => addArea(locInput, feeInput)}
              className="btn-ghost h-[46px] px-6"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {areas.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-muted-foreground text-left text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Fee</th>
                    <th className="px-4 py-3 w-16 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-bold">
                  {areas.map((a) => (
                    <tr key={a.name} className="hover:bg-secondary/30 transition">
                      <td className="px-4 py-3">{a.name}</td>
                      <td className="px-4 py-3 text-primary">₦{a.fee.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => removeArea(a.name)}
                          aria-label="Remove"
                          className="text-destructive hover:underline p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <button onClick={save} className="btn-primary">
        <Save className="h-4 w-4" /> Save delivery settings
      </button>
    </div>
  );
}

function SecurityTab() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Password updated");
      }}
      className="card-mm grid gap-4 p-6 sm:grid-cols-2"
    >
      <Field label="Current password">
        <input type="password" className="input-mm" />
      </Field>
      <Field label="New password">
        <input type="password" className="input-mm" />
      </Field>
      <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit">
        <Save className="h-4 w-4" /> Update password
      </button>
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
  const [stateId, setStateId] = useState(p?.stateId ?? 1);
  const [openStart, setOpenStart] = useState(p?.openHours?.start ?? "09:00");
  const [openEnd, setOpenEnd] = useState(p?.openHours?.end ?? "21:00");

  // ── Brand & Media ──────────────────────────────────────────────────────────
  const [logoUrl, setLogoUrl] = useState(p?.logoUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(p?.bannerUrl ?? "");
  const [about, setAbout] = useState(p?.about ?? "");
  const [kitchenImages, setKitchenImages] = useState<string[]>(p?.images ?? []);
  const kitchenInputRef = useRef<HTMLInputElement>(null);

  const handleKitchenImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setKitchenImages((prev) => [...prev, url]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeKitchenImage = (idx: number) =>
    setKitchenImages((prev) => prev.filter((_, i) => i !== idx));



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
      stateId,
      openHours: { start: openStart, end: openEnd },
      categories: p?.categories ?? [],
      logoUrl: logoUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      about: about || undefined,
      images: kitchenImages,
    } as any);
    toast.success("Store info updated");
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="card-mm grid gap-4 p-6 sm:grid-cols-2">
        <h3 className="col-span-full text-lg font-extrabold">Public Profile</h3>
        <Field label="Business Name">
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="input-mm"
            required
          />
        </Field>
        <Field label="Tagline">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Best Jollof in Lagos"
            className="input-mm"
          />
        </Field>
        <div className="col-span-full grid gap-4 sm:grid-cols-2">
          <Field label="Opening Time">
            <input
              type="time"
              value={openStart}
              onChange={(e) => setOpenStart(e.target.value)}
              className="input-mm"
              required
            />
          </Field>
          <Field label="Closing Time">
            <input
              type="time"
              value={openEnd}
              onChange={(e) => setOpenEnd(e.target.value)}
              className="input-mm"
              required
            />
          </Field>
        </div>

      </div>

      <div className="card-mm grid gap-4 p-6 sm:grid-cols-2">
        <h3 className="col-span-full text-lg font-extrabold">Contact & Legal</h3>
        <Field label="Owner Name">
          <input
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="input-mm"
            required
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-mm"
            required
          />
        </Field>
        <Field label="Phone Number">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-mm"
            required
          />
        </Field>
        <Field label="CAC Registration No.">
          <input
            value={cac}
            onChange={(e) => setCac(e.target.value)}
            placeholder="RC-123456"
            className="input-mm"
          />
        </Field>
        <Field label="State">
          <select
            value={stateId}
            onChange={(e) => setStateId(Number(e.target.value))}
            className="input-mm appearance-none pr-10"
          >
            {NIGERIAN_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </Field>
        <div className="col-span-full">
          <Field label="Physical Address">
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="textarea-mm"
              required
            />
          </Field>
        </div>
      </div>

      {/* ── Brand & Media ─────────────────────────────────────────────── */}
      <div className="card-mm p-6 space-y-6">
        <h3 className="text-lg font-extrabold">Brand &amp; Media</h3>

        {/* Logo + Banner side by side */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
              Business Logo
            </label>
            <ImageUpload
              value={logoUrl}
              onChange={setLogoUrl}
              label="Upload your logo"
              height="h-40"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Square image recommended (PNG / JPG)
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
              Storefront Banner
            </label>
            <ImageUpload
              value={bannerUrl}
              onChange={setBannerUrl}
              label="Upload banner image"
              height="h-40"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Wide landscape image (16:9 recommended)
            </p>
          </div>
        </div>

        {/* About */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
            About your kitchen
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            placeholder="Tell customers what makes your food special — your story, your specialties, what sets you apart…"
            className="textarea-mm"
          />
        </div>

        {/* Kitchen photos */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
            Kitchen photos
          </label>
          <input
            ref={kitchenInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleKitchenImages}
            className="hidden"
          />

          {kitchenImages.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {kitchenImages.map((src, idx) => (
                <div key={idx} className="group relative">
                  <img
                    src={src}
                    alt={`Kitchen photo ${idx + 1}`}
                    className="h-24 w-full rounded-xl object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeKitchenImage(idx)}
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 shadow-md"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {/* Add more tile */}
              <button
                type="button"
                onClick={() => kitchenInputRef.current?.click()}
                className="flex h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-input bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:bg-secondary/50 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="text-[10px] font-bold">Add more</span>
              </button>
            </div>
          )}

          {kitchenImages.length === 0 && (
            <button
              type="button"
              onClick={() => kitchenInputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-secondary/30 px-6 py-10 text-center hover:border-primary/50 hover:bg-secondary/50 transition-colors"
            >
              <Upload className="h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-semibold">Click to upload kitchen photos</p>
              <p className="text-xs text-muted-foreground">PNG / JPG up to 5MB each</p>
            </button>
          )}
        </div>
      </div>

      <button type="submit" className="btn-primary">
        <Save className="h-4 w-4" /> Save store info
      </button>
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
      bankDetails: { bankName, accountName, accountNumber },
    } as any);
    toast.success("Bank details updated");
  };

  return (
    <form onSubmit={save} className="card-mm grid gap-4 p-6 sm:grid-cols-2">
      <div className="col-span-full mb-2">
        <h3 className="text-lg font-extrabold">Payout Information</h3>
        <p className="text-sm text-muted-foreground">
          This account will be used to process your weekly settlements.
        </p>
      </div>
      <Field label="Bank Name">
        <select
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="input-mm"
          required
        >
          <option value="" disabled>
            Select a bank
          </option>
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
      <Field label="Account Number">
        <input
          type="text"
          pattern="[0-9]{10}"
          title="10 digit account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="input-mm"
          required
        />
      </Field>
      <div className="col-span-full">
        <Field label="Account Name">
          <input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="input-mm"
            required
          />
        </Field>
      </div>
      <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit">
        <Save className="h-4 w-4" /> Save bank details
      </button>
    </form>
  );
}

function TeamTab() {
  const team = useTeam();
  const vendor = useVendorProfile();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("General Manager");
  const [customRole, setCustomRole] = useState("");

  const roles = [
    "General Manager",
    "Accountant",
    "Blog Manager",
    "Delivery Manager",
    "Sales Manager",
    "Other",
  ];

  const filteredMembers = team.members.filter((m) => m.vendorId === vendor.profile?.id);

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor.profile) return;
    const finalRole = role === "Other" ? customRole : role;
    if (!finalRole) return;
    team.add({
      vendorId: vendor.profile.id,
      name,
      email,
      role: finalRole,
    });
    setName("");
    setEmail("");
    setRole("General Manager");
    setCustomRole("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold italic">Team Members</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Manage your kitchen staff and their roles.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`btn-primary flex items-center gap-2 w-full sm:w-fit ${showAdd ? "bg-secondary text-foreground" : ""}`}
        >
          {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAdd ? "Cancel" : "Add Member"}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={addMember}
          className="card-mm p-6 bg-secondary/30 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-mm"
                required
                placeholder="John Doe"
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-mm"
                required
                placeholder="john@example.com"
              />
            </Field>
            <Field label="Role">
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input-mm">
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            {role === "Other" && (
              <Field label="Custom Role">
                <input
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="input-mm"
                  required
                  placeholder="e.g. Executive Chef"
                />
              </Field>
            )}
            <div className="sm:col-span-2 pt-2">
              <button type="submit" className="btn-primary w-full">
                Confirm Addition
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="card-mm overflow-x-auto overflow-y-hidden">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMembers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-sm font-medium text-muted-foreground"
                >
                  No team members added yet. Add your first staff member to get started!
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.id} className="group transition hover:bg-secondary/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase">
                        {m.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black truncate">{m.name}</p>
                        <p className="text-[11px] font-medium text-muted-foreground truncate">
                          {m.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-foreground bg-secondary px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        m.status === "active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${m.status === "active" ? "bg-green-500" : "bg-orange-500"}`}
                      />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => team.toggleStatus(m.id)}
                        className={`btn-ghost h-8 w-8 p-0 rounded-full flex items-center justify-center transition ${m.status === "active" ? "hover:text-orange-500 hover:bg-orange-500/10" : "hover:text-green-500 hover:bg-green-500/10"}`}
                        title={m.status === "active" ? "Suspend member" : "Activate member"}
                      >
                        <Lock className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => team.remove(m.id)}
                        className="btn-ghost h-8 w-8 p-0 rounded-full flex items-center justify-center hover:text-red-500 hover:bg-red-500/10 transition"
                        title="Delete member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
