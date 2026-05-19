import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Lock, User, MapPin, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/store/AppProviders";
import { api } from "@/lib/api";

interface StateItem {
  id: number;
  name: string;
}

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
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stateId, setStateId] = useState(0);
  const [states, setStates] = useState<StateItem[]>([]);
  const [statesLoading, setStatesLoading] = useState(true);

  useEffect(() => {
    api.getStates()
      .then((data) => {
        setStates(data ?? []);
        if (data.length > 0) setStateId(data[0].id);
      })
      .catch(() => {})
      .finally(() => setStatesLoading(false));
  }, []);

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div className="card-mm w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black">Get started</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Create an account to order from local kitchens.
          </p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await auth.signUp(name, email, password, "customer", stateId, confirmPassword);
              navigate({ to: "/" });
            } catch {
              setBusy(false);
            }
          }}
          className="mt-8 space-y-4"
        >
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-mm pl-11"
            />
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              placeholder="you@example.com"
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
              minLength={8}
              placeholder="Password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-mm pl-11"
            />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showConfirm ? "text" : "password"}
              required
              minLength={8}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input-mm pl-11 pr-11 ${!passwordsMatch ? "border-destructive focus:border-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="-mt-2 text-xs font-bold text-destructive">
              Passwords do not match.
            </p>
          )}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-2 text-center text-sm font-semibold text-muted-foreground">
          Want to sell on MenuMenu?{" "}
          <Link to="/vendor-signup" className="font-bold text-primary hover:underline">
            Create a vendor account
          </Link>
        </p>
        <p className="mt-4 text-center text-xs font-semibold text-muted-foreground">
          By signing up you agree to our{" "}
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
