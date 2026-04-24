import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — MenuMenu" },
      { name: "description", content: "Reset your MenuMenu account password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate async call (would hit real API in production)
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
    toast.success("Reset link sent!", { description: `Check ${email} for instructions.` });
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          to="/signin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div className="card-mm p-8">
          {/* Icon */}
          <div
            className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            <KeyRound className="h-7 w-7" />
          </div>

          {!submitted ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-black">Forgot your password?</h1>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  No worries. Enter your email address and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="mb-1.5 block text-xs font-bold text-muted-foreground">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="reset-email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="input-mm pl-11"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {loading ? "Sending link…" : "Send reset link"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
                Remembered it?{" "}
                <Link to="/signin" className="font-bold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            /* Success state */
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black">Check your email</h2>
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                We've sent a password reset link to
              </p>
              <p className="mt-1 font-black text-foreground">{email}</p>
              <p className="mt-4 text-xs font-semibold text-muted-foreground">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-bold text-primary hover:underline"
                >
                  try again
                </button>
                .
              </p>
              <div className="mt-8 space-y-3">
                <Link to="/signin" className="btn-primary w-full">
                  Back to sign in
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Legal footer */}
        <p className="mt-6 text-center text-xs font-semibold text-muted-foreground">
          By using MenuMenu you agree to our{" "}
          <Link to="/terms" className="font-bold text-primary hover:underline">Terms</Link>
          {" & "}
          <Link to="/privacy" className="font-bold text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
