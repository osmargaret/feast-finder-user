import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2, KeyRound, ShieldCheck, Lock, Hash } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/store/AppProviders";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — MenuMenu" },
      { name: "description", content: "Reset your MenuMenu account password via OTP." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await auth.forgotPassword(email);
      setStep("otp");
      toast.success("OTP sent!", { description: `Check ${email} for your 6-digit code.` });
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setLoading(true);
    try {
      await auth.resetPassword(password, otp);
      setStep("success");
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
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
            style={{ background: step === "success" ? "var(--color-emerald-500)" : "var(--gradient-primary)" }}
          >
            {step === "email" && <KeyRound className="h-7 w-7" />}
            {step === "otp" && <ShieldCheck className="h-7 w-7" />}
            {step === "success" && <CheckCircle2 className="h-7 w-7" />}
          </div>

          {step === "email" && (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-black">Forgot your password?</h1>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  No worries. Enter your email address and we'll send you an OTP to reset it.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
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
                  {loading ? "Sending OTP…" : "Send reset OTP"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-black">Verify OTP</h1>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  Enter the 6-digit code sent to <span className="font-bold text-foreground">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="mb-1.5 block text-xs font-bold text-muted-foreground">
                    One-Time Password (OTP)
                  </label>
                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="otp"
                      required
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="input-mm pl-11 tracking-[0.5em] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold text-muted-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="new-password"
                      required
                      type="password"
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-mm pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold text-muted-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="confirm-password"
                      required
                      type="password"
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-mm pl-11"
                    />
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs font-bold text-red-500">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || password !== confirmPassword}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {loading ? "Resetting…" : "Reset password"}
                </button>

                <p className="text-center text-xs font-semibold text-muted-foreground">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="font-bold text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="py-4 text-center">
              <h2 className="text-2xl font-black text-emerald-600">Password Reset!</h2>
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Your password has been successfully updated. You can now sign in with your new credentials.
              </p>
              <div className="mt-8">
                <Link to="/signin" className="btn-primary w-full">
                  Sign in now
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

