import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Mail, RefreshCw, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/store/AppProviders";

export const Route = createFileRoute("/verify-otp")({
  head: () => ({
    meta: [
      { title: "Verify Email — MenuMenu" },
      { name: "description", content: "Enter the OTP sent to your email to verify your account." },
      { property: "og:title", content: "Verify Email — MenuMenu" },
    ],
  }),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [busy, setBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendBusy, setResendBusy] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect logic based on auth state
  useEffect(() => {
    if (auth.user) {
      // If already verified, go to home (or vendor dashboard)
      if (auth.user.role === "vendor") {
        navigate({ to: "/vendor-dashboard" });
      } else {
        navigate({ to: "/" });
      }
    } else if (!auth.pendingVerification) {
      // No verification pending and not logged in, go to sign in
      navigate({ to: "/signin" });
    }
  }, [auth.pendingVerification, auth.user, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Dev OTP auto-fill & listener
  useEffect(() => {
    const checkAndFillDevOtp = () => {
      const savedDevOtp = localStorage.getItem("mm:dev_otp");
      if (savedDevOtp && savedDevOtp.length === 6) {
        const newOtp = Array(6).fill("");
        for (let i = 0; i < 6; i++) newOtp[i] = savedDevOtp[i];
        setOtp(newOtp);
        localStorage.removeItem("mm:dev_otp"); // clean up
      }
    };

    // Check immediately on mount
    checkAndFillDevOtp();

    // Listen for custom resend event
    window.addEventListener("mm:dev_otp_received", checkAndFillDevOtp);
    return () => window.removeEventListener("mm:dev_otp_received", checkAndFillDevOtp);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const newOtp = Array(6).fill("");
    for (let i = 0; i < text.length; i++) newOtp[i] = text[i];
    setOtp(newOtp);
    const focusIdx = Math.min(text.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;
    setBusy(true);
    try {
      const user = await auth.verifyOtp(code);
      if (user.role === "vendor") {
        navigate({ to: "/vendor-dashboard" });
      } else {
        navigate({ to: "/" });
      }
    } catch {
      // error already toasted in context
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setResendBusy(true);
    try {
      await auth.resendOtp();
      setResendCooldown(60);
    } catch {
      // error already toasted
    } finally {
      setResendBusy(false);
    }
  };

  const email = auth.pendingVerification?.email ?? "";
  const role = auth.pendingVerification?.role ?? "customer";
  const filledCount = otp.filter(Boolean).length;

  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          to="/signin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div className="card-mm p-8 text-center">
          {/* Icon */}
          <div
            className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-black">Check your inbox</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            We sent a 6-digit verification code to
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-sm font-black text-primary">{email}</span>
          </div>

          {role === "vendor" && (
            <p className="mt-3 text-xs font-semibold text-muted-foreground">
              After verification you'll be taken to your{" "}
              <span className="font-black text-foreground">vendor dashboard</span>.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8">
            {/* 6-box OTP input */}
            <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`h-14 w-11 rounded-2xl border-2 text-center text-xl font-black outline-none transition-all duration-150
                    ${
                      digit
                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        : "border-border bg-secondary/30 text-foreground focus:border-primary focus:bg-primary/5 focus:shadow-md focus:shadow-primary/10"
                    }`}
                />
              ))}
            </div>

            {/* Progress dots */}
            <div className="mt-4 flex justify-center gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-5 rounded-full transition-all duration-200 ${
                    i < filledCount ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={busy || filledCount < 6}
              className="btn-primary mt-6 w-full disabled:opacity-50"
            >
              {busy ? "Verifying…" : "Verify & Continue"}
            </button>
          </form>

          {/* Resend section */}
          <div className="mt-6 border-t border-border pt-6">
            {resendCooldown > 0 ? (
              <p className="text-sm font-semibold text-muted-foreground">
                Resend code in{" "}
                <span className="font-black text-primary tabular-nums">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendBusy}
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${resendBusy ? "animate-spin" : ""}`} />
                {resendBusy ? "Sending…" : "Didn't receive it? Resend code"}
              </button>
            )}
          </div>

          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            Can't find it? Check your spam or junk folder.
          </p>
        </div>
      </div>
    </section>
  );
}
