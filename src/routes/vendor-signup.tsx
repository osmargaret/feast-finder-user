import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Store, Mail, Phone, MapPin, FileText, Image as ImageIcon, ChefHat } from "lucide-react";
import { useAuth, useVendorProfile } from "@/store/AppProviders";
import { categories } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor-signup")({
  head: () => ({
    meta: [
      { title: "Become a Vendor — MenuMenu" },
      { name: "description", content: "Open your kitchen on MenuMenu. Reach hungry customers in minutes." },
      { property: "og:title", content: "Become a Vendor — MenuMenu" },
      { property: "og:description", content: "Open your kitchen on MenuMenu. Reach hungry customers in minutes." },
    ],
  }),
  component: VendorSignupPage,
});

function VendorSignupPage() {
  const auth = useAuth();
  const vendor = useVendorProfile();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState(auth.user?.name ?? "");
  const [email, setEmail] = useState(auth.user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [cac, setCac] = useState("");
  const [category, setCategory] = useState(categories[0].name);
  const [address, setAddress] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div className="card-mm w-full max-w-2xl p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: "var(--gradient-primary)" }}>
            <ChefHat className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black">Open your kitchen</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Tell us about your business — you'll be cooking up sales in minutes.
          </p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!businessName.trim()) return toast.error("Business name required");
            setBusy(true);
            // create user account if not signed in
            if (!auth.user) {
              await auth.signUp(ownerName || businessName, email, password || "vendor123");
            }
            vendor.save({
              businessName,
              ownerName,
              email,
              phone,
              cac: cac || undefined,
              category,
              address,
              bannerUrl: bannerUrl || undefined,
              about: about || undefined,
            });
            setBusy(false);
            navigate({ to: "/vendor-dashboard" });
          }}
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <Field label="Business name *" icon={<Store className="h-4 w-4" />}>
            <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Mama T Kitchen" className="input-mm pl-11" />
          </Field>
          <Field label="Owner name *" icon={<ChefHat className="h-4 w-4" />}>
            <input required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Full name" className="input-mm pl-11" />
          </Field>
          <Field label="Email *" icon={<Mail className="h-4 w-4" />}>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@kitchen.com" className="input-mm pl-11" />
          </Field>
          <Field label="Phone *" icon={<Phone className="h-4 w-4" />}>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 801 234 5678" className="input-mm pl-11" />
          </Field>
          <Field label="CAC number (optional)" icon={<FileText className="h-4 w-4" />}>
            <input value={cac} onChange={(e) => setCac(e.target.value)} placeholder="RC / BN number" className="input-mm pl-11" />
          </Field>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">Primary category *</label>
            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="input-mm">
              {categories.map((c) => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <Field label="Storefront address *" icon={<MapPin className="h-4 w-4" />} className="sm:col-span-2">
            <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="12 Allen Avenue, Ikeja, Lagos" className="input-mm pl-11" />
          </Field>
          <Field label="Storefront banner / image URL (optional)" icon={<ImageIcon className="h-4 w-4" />} className="sm:col-span-2">
            <input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://…" className="input-mm pl-11" />
          </Field>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">About your kitchen</label>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={3} placeholder="Tell customers what makes your food special…" className="input-mm rounded-2xl py-3" />
          </div>
          {!auth.user && (
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-muted-foreground">Choose a password *</label>
              <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-mm" />
            </div>
          )}
          <button type="submit" disabled={busy} className="btn-primary sm:col-span-2">
            {busy ? "Creating vendor account…" : "Create vendor account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          Just hungry? <Link to="/signup" className="font-bold text-primary hover:underline">Create a customer account</Link>
        </p>
      </div>
    </section>
  );
}

function Field({ label, icon, children, className = "" }: { label: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        {children}
      </div>
    </div>
  );
}
