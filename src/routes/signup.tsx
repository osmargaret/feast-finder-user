import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/store/AppProviders";

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
  const [busy, setBusy] = useState(false);

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
            await auth.signUp(name, email, password);
            setBusy(false);
            navigate({ to: "/" });
          }}
          className="mt-8 space-y-4"
        >
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
            <input type="password" required minLength={6} placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="input-mm pl-11" />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
          Already have an account? <Link to="/signin" className="font-bold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
