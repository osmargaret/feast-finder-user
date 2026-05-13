import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useAuth, useVendorProfile } from "@/store/AppProviders";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Get started — MenuMenu" },
      { name: "description", content: "Create your MenuMenu account in seconds." },
      { property: "og:title", content: "Get started — MenuMenu" },
      { property: "og:description", content: "Create your MenuMenu account in seconds." },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const auth = useAuth();
  const vendor = useVendorProfile();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [stateId, setStateId] = useState(1);

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div className="card-mm w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black">Get started</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Create an account to order from local kitchens.</p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await auth.signUp(name, email, password, "customer", stateId);
              setBusy(false);
              setRegistered(true);
            } catch (err) {
              setBusy(false);
            }
          }}
          className="mt-8 space-y-4"
        >
          {registered ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50">
                <Mail className="h-7 w-7 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black">Check your email</h2>
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                We've sent a verification link to <span className="font-bold text-foreground">{email}</span>.
                Please verify your email to continue.
              </p>
              <div className="mt-8 space-y-3">
                <Link to="/" className="btn-primary w-full">
                  Go to Home
                </Link>
                <button type="button" onClick={() => setRegistered(false)} className="btn-ghost w-full">
                  Back to Sign Up
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="input-mm pl-11" />
              </div>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-mm pl-11" />
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="password" required minLength={8} placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="input-mm pl-11" />
              </div>
              <div className="relative">
                <select 
                  required 
                  value={stateId} 
                  onChange={(e) => setStateId(Number(e.target.value))} 
                  className="input-mm appearance-none bg-white/[0.03] text-sm"
                >
                  <option value={1}>Lagos</option>
                  <option value={2}>Abuja</option>
                  <option value={3}>Rivers</option>
                  <option value={4}>Oyo</option>
                  <option value={5}>Ogun</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▼</div>
              </div>
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy ? "Creating account…" : "Create account"}
              </button>
            </>
          )}
        </form>
        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          Already have an account? <Link to="/signin" className="font-bold text-primary hover:underline">Sign in</Link>
        </p>
        <p className="mt-2 text-center text-sm font-semibold text-muted-foreground">
          Want to sell on MenuMenu? <Link to="/vendor-signup" className="font-bold text-primary hover:underline">Create a vendor account</Link>
        </p>
        <p className="mt-4 text-center text-xs font-semibold text-muted-foreground">
          By signing up you agree to our{" "}
          <Link to="/terms" className="font-bold text-primary hover:underline">Terms</Link>
          {" & "}
          <Link to="/privacy" className="font-bold text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
