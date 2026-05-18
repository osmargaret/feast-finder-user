import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  ChefHat,
  Lock,
  Eye,
  EyeOff,
  Truck,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import { useAuth, useVendorProfile } from "@/store/AppProviders";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/site/ImageUpload";
import { api } from "@/lib/api";

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

  // ── Business details ──────────────────────────────────────────────────────
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState(auth.user?.name ?? "");
  const [email, setEmail] = useState(auth.user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stateId, setStateId] = useState(0);
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [statesLoading, setStatesLoading] = useState(true);

  // ── Service options ───────────────────────────────────────────────────────
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [pickupAvailable, setPickupAvailable] = useState(true);

  // ── Visuals ───────────────────────────────────────────────────────────────
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // ── Account security ──────────────────────────────────────────────────────
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  useEffect(() => {
    api.getStates()
      .then((data) => {
        setStates(data ?? []);
        if (data.length > 0) setStateId(data[0].id);
      })
      .catch(() => {})
      .finally(() => setStatesLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) return toast.error("Business name is required");
    if (!address.trim()) return toast.error("Business address is required");
    if (!deliveryAvailable && !pickupAvailable)
      return toast.error("Select at least one service option");

    if (!auth.user) {
      if (password.length < 8) return toast.error("Password must be at least 8 characters");
      if (password !== confirmPassword) return toast.error("Passwords do not match");
    }

    setBusy(true);
    try {
      const profileData = {
        businessName,
        ownerName,
        email,
        phone,
        address,
        stateId,
        logoUrl: logoUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        deliveryAvailable,
        pickupAvailable,
        // Fields managed in Settings after onboarding
        categories: [],
        images: [],
      };

      if (!auth.user) {
        // New vendor — register → save profile → verify email via OTP
        await auth.signUp(ownerName || businessName, email, password, "vendor", stateId, confirmPassword);
        vendor.save(profileData);
        navigate({ to: "/verify-otp" });
      } else {
        // Existing signed-in user upgrading to vendor — skip OTP
        vendor.save(profileData);
        navigate({ to: "/vendor-dashboard", search: { tab: "launchpad" } });
      }
    } catch {
      // errors already toasted by auth context
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div className="card-mm w-full max-w-2xl p-8">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            <ChefHat className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black">Open your kitchen</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Set up your storefront in minutes — you can add more details from your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Section 1: Business details ────────────────────────────── */}
          <div>
            <SectionLabel>Business details</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
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

              <Field label="Email address *" icon={<Mail className="h-4 w-4" />}>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@kitchen.com"
                  className="input-mm pl-11"
                />
              </Field>

              <Field label="Phone number *" icon={<Phone className="h-4 w-4" />}>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 801 234 5678"
                  className="input-mm pl-11"
                />
              </Field>

              <Field label="State *" icon={<MapPin className="h-4 w-4" />}>
                {(() => {
                  const selectEl = (
                    <select
                      required
                      value={stateId}
                      onChange={(e) => setStateId(Number(e.target.value))}
                      disabled={statesLoading}
                      className="input-mm appearance-none pl-11 pr-10"
                    >
                      {statesLoading ? (
                        <option value={0}>Loading states…</option>
                      ) : (
                        <>
                          <option value={0} disabled>
                            Select your state
                          </option>
                          {states.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  );
                  return (
                    <div className="relative">
                      {selectEl}
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  );
                })()}
              </Field>

              <div className="sm:col-span-2">
                <Field
                  label="Storefront / business address *"
                  icon={<MapPin className="h-4 w-4" />}
                >
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="12 Allen Avenue, Ikeja, Lagos"
                    className="input-mm pl-11"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Section 2: Visuals ─────────────────────────────────────── */}
          <div>
            <SectionLabel>Brand visuals</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                  Business logo
                </label>
                <ImageUpload
                  value={logoUrl}
                  onChange={setLogoUrl}
                  label="Upload your logo"
                  height="h-40"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Square image works best (PNG / JPG)
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                  Storefront banner
                </label>
                <ImageUpload
                  value={bannerUrl}
                  onChange={setBannerUrl}
                  label="Upload storefront banner"
                  height="h-40"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Wide landscape image (16:9 recommended)
                </p>
              </div>
            </div>
          </div>

          {/* ── Section 3: Service options ─────────────────────────────── */}
          <div>
            <SectionLabel>Service options *</SectionLabel>
            <p className="mb-3 text-xs font-semibold text-muted-foreground">
              How will customers receive their orders?
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Delivery card */}
              <button
                type="button"
                onClick={() => setDeliveryAvailable((v) => !v)}
                className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  deliveryAvailable
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border hover:border-primary/30 hover:bg-secondary/40"
                }`}
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
                    deliveryAvailable
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Truck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black">Delivery</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    We deliver to customers
                  </p>
                </div>
                <Checkbox
                  checked={deliveryAvailable}
                  onCheckedChange={(c) => setDeliveryAvailable(!!c)}
                  className="pointer-events-none"
                />
              </button>

              {/* Pickup card */}
              <button
                type="button"
                onClick={() => setPickupAvailable((v) => !v)}
                className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  pickupAvailable
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border hover:border-primary/30 hover:bg-secondary/40"
                }`}
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
                    pickupAvailable ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black">Pickup</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Customers collect in-store
                  </p>
                </div>
                <Checkbox
                  checked={pickupAvailable}
                  onCheckedChange={(c) => setPickupAvailable(!!c)}
                  className="pointer-events-none"
                />
              </button>
            </div>
            {!deliveryAvailable && !pickupAvailable && (
              <p className="mt-2 text-xs font-bold text-destructive">
                At least one service option must be selected.
              </p>
            )}
          </div>

          {/* ── Section 4: Account security (only for new users) ───────── */}
          {!auth.user && (
            <div>
              <SectionLabel>Account security</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Password *" icon={<Lock className="h-4 w-4" />}>
                  <input
                    required
                    minLength={8}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="input-mm pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </Field>

                <Field label="Confirm password *" icon={<Lock className="h-4 w-4" />}>
                  <input
                    required
                    minLength={8}
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`input-mm pl-11 pr-11 ${
                      !passwordsMatch ? "border-destructive focus:border-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </Field>

                {!passwordsMatch && (
                  <p className="sm:col-span-2 -mt-2 text-xs font-bold text-destructive">
                    Passwords do not match.
                  </p>
                )}

                {password.length > 0 && (
                  <div className="sm:col-span-2 -mt-2">
                    <PasswordStrength password={password} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Submit ─────────────────────────────────────────────────── */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={busy || (!passwordsMatch && !auth.user)}
              className="btn-primary w-full disabled:opacity-50"
            >
              {busy ? "Creating vendor account…" : "Create vendor account"}
            </button>
            <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
              Categories, opening hours, delivery areas & more can be configured in{" "}
              <span className="font-black text-foreground">Settings</span> after sign-up.
            </p>
          </div>
        </form>

        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          Just hungry?{" "}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create a customer account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm font-semibold text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-4 text-center text-xs font-semibold text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link to="/terms" className="font-bold text-primary hover:underline">
            Terms
          </Link>
          {" & "}
          <Link to="/privacy" className="font-bold text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
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

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score];
  const strengthColor = ["", "bg-destructive", "bg-orange-400", "bg-yellow-400", "bg-emerald-500"][
    score
  ];
  const textColor = [
    "",
    "text-destructive",
    "text-orange-500",
    "text-yellow-600",
    "text-emerald-600",
  ][score];

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted-foreground">Password strength</span>
        {score > 0 && (
          <span className={`text-[11px] font-black ${textColor}`}>{strengthLabel}</span>
        )}
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? strengthColor : "bg-border"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-[11px] font-semibold transition-colors ${
              c.pass ? "text-emerald-600" : "text-muted-foreground"
            }`}
          >
            {c.pass ? "✓" : "·"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
