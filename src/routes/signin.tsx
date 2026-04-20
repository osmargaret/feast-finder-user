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

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div className="card-mm w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Sign in to continue ordering.</p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            await auth.signIn(email, password);
            setBusy(false);
            navigate({ to: "/" });
          }}
          className="mt-8 space-y-4"
        >
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-mm pl-11"
            />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          Don't have an account? <Link to="/signup" className="font-bold text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </section>
  );
}
