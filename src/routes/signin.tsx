import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/store/AppProviders";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — MenuMenu" },
      { name: "description", content: "Sign in to your MenuMenu account." },
      { property: "og:title", content: "Sign in — MenuMenu" },
      { property: "og:description", content: "Sign in to your MenuMenu account." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div className="card-mm w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Sign in to continue.</p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-2xl bg-secondary/50 p-1 mb-6">
          <button
            type="button"
            onClick={() => setIsVendor(false)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
              !isVendor
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setIsVendor(true)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
              isVendor
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Vendor
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const user = await auth.signIn(email, password, isVendor ? "vendor" : "customer");
              // If email not verified, go to OTP page first
              if (!user.emailVerified) {
                navigate({ to: "/verify-otp" });
              } else if (user.role === "vendor" || isVendor) {
                navigate({ to: "/vendor-dashboard" });
              } else {
                navigate({ to: "/" });
              }
            } catch {
              // error already toasted in AuthContext
            } finally {
              setBusy(false);
            }
          }}
          className="space-y-4"
        >
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              placeholder={isVendor ? "vendor@kitchen.com" : "you@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-mm pl-11"
            />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-mm pl-11"
            />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Signing in…" : `Sign in as ${isVendor ? "Vendor" : "Customer"}`}
          </button>
          <Link
            to="/forgot-password"
            className="block text-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot your password?
          </Link>
        </form>

        {!isVendor ? (
          <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-primary hover:underline">
              Create one
            </Link>
          </p>
        ) : (
          <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
            Want to sell on MenuMenu?{" "}
            <Link to="/vendor-signup" className="font-bold text-primary hover:underline">
              Create a vendor account
            </Link>
          </p>
        )}
        <p className="mt-4 text-center text-xs font-semibold text-muted-foreground">
          By continuing you agree to our{" "}
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
