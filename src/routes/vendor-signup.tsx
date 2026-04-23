import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  FileText,
  ChefHat,
  Upload,
  X,
} from "lucide-react";
import { useAuth, useVendorProfile } from "@/store/AppProviders";
import { categories, LAGOS_AREAS } from "@/data/mock";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/site/ImageUpload";

export const Route = createFileRoute("/vendor-signup")({
  head: () => ({
    meta: [
      { title: "Become a Vendor — MenuMenu" },
      {
        name: "description",
        content: "Open your kitchen on MenuMenu. Reach hungry customers in minutes.",
      },
      { property: "og:title", content: "Become a Vendor — MenuMenu" },
      {
        property: "og:description",
        content: "Open your kitchen on MenuMenu. Reach hungry customers in minutes.",
      },
    ],
  }),
  component: VendorSignupPage,
});

function VendorSignupPage() {
  const auth = useAuth();
  const vendor = useVendorProfile();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState(auth.user?.name ?? "");
  const [email, setEmail] = useState(auth.user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [cac, setCac] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([categories[0].name]);
  const [address, setAddress] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [bannerUrl, setBannerUrl] = useState("");
  const [about, setAbout] = useState("");
  const [deliveryAreas, setDeliveryAreas] = useState<string[]>([]);
  const [password, setPassword] = useState("");

  const toggleArea = (a: string) =>
    setDeliveryAreas((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName],
    );
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div className="card-mm w-full max-w-2xl p-8">
        <div className="text-center">
          <div
            className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            <ChefHat className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black">Open your kitchen</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Tell us about your business — you'll be cooking up sales in minutes.
          </p>
        </div>

        {/* Hidden file input for images */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!businessName.trim()) return toast.error("Business name required");
            if (selectedCategories.length === 0) return toast.error("Select at least one category");
            setBusy(true);
            if (!auth.user) {
              await auth.signUp(ownerName || businessName, email, password || "vendor123");
            }
            vendor.save({
              businessName,
              ownerName,
              email,
              phone,
              cac: cac || undefined,
              categories: selectedCategories,
              address,
              images: imagePreviews,
              bannerUrl: bannerUrl || undefined,
              about: about || undefined,
            });
            setBusy(false);
            navigate({ to: "/vendor-dashboard" });
          }}
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <Field label="Business name *" icon={<Store className="h-4 w-4" />}>
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Mama T Kitchen"
              className="input-mm pl-11"
            />
          </Field>
          <Field label="Owner name *" icon={<ChefHat className="h-4 w-4" />}>
            <input
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Full name"
              className="input-mm pl-11"
            />
          </Field>
          <Field label="Email *" icon={<Mail className="h-4 w-4" />}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@kitchen.com"
              className="input-mm pl-11"
            />
          </Field>
          <Field label="Phone *" icon={<Phone className="h-4 w-4" />}>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 801 234 5678"
              className="input-mm pl-11"
            />
          </Field>
          <Field label="CAC number (optional)" icon={<FileText className="h-4 w-4" />}>
            <input
              value={cac}
              onChange={(e) => setCac(e.target.value)}
              placeholder="RC / BN number"
              className="input-mm pl-11"
            />
          </Field>
          {/* Categories multi-select */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-bold text-muted-foreground">
              Select categories *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((c) => {
                const checked = selectedCategories.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleCategory(c.name)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors ${
                      checked
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background hover:bg-secondary"
                    }`}
                  >
                    <Checkbox checked={checked} className="h-4 w-4" />
                    <span>
                      {c.icon} {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <Field
            label="Storefront address *"
            icon={<MapPin className="h-4 w-4" />}
            className="sm:col-span-2"
          >
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="12 Allen Avenue, Ikeja, Lagos"
              className="input-mm pl-11"
            />
          </Field>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
              Storefront banner (optional)
            </label>
            <ImageUpload value={bannerUrl} onChange={setBannerUrl} label="Upload storefront banner" height="h-44" />
          </div>
          {/* Kitchen images */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
              Kitchen images (optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-input bg-secondary/30 px-6 py-8 text-center hover:border-primary/50 hover:bg-secondary/50 transition-colors"
            >
              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Click to upload images</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB each</p>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      className="h-20 w-full rounded-lg object-cover border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive text-destructive-foreground p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
              About your kitchen
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={3}
              placeholder="Tell customers what makes your food special…"
              className="input-mm rounded-2xl py-3"
            />
          </div>
          {!auth.user && (
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                Choose a password *
              </label>
              <input
                required
                minLength={6}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="input-mm"
              />
            </div>
          )}
          <button type="submit" disabled={busy} className="btn-primary sm:col-span-2">
            {busy ? "Creating vendor account…" : "Create vendor account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          Just hungry?{" "}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create a customer account
          </Link>
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
  className = "",
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
