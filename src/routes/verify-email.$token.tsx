import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Home, Mail } from "lucide-react";
import { useAuth } from "@/store/AppProviders";

export const Route = createFileRoute("/verify-email/$token")({
  head: () => ({
    meta: [
      { title: "Verify Email — MenuMenu" },
      { name: "description", content: "Verify your email address." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useParams();
  const auth = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        await auth.verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="card-mm w-full max-w-md p-8 text-center">
        {status === "loading" && (
          <div className="py-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h1 className="mt-6 text-2xl font-black">Verifying your email...</h1>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Please wait while we confirm your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="py-4">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black">Email Verified!</h1>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Thank you for verifying your email. Your account is now fully active.
            </p>
            <div className="mt-8 space-y-3">
              <Link to="/" className="btn-primary w-full">
                Go to Home
              </Link>
              <Link to="/profile" className="btn-ghost w-full">
                View Profile
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-4">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-red-50">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black">Verification Failed</h1>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              The verification link is invalid or has expired.
            </p>
            <div className="mt-8 space-y-3">
              <Link to="/signup" className="btn-primary w-full">
                Try Signing Up Again
              </Link>
              <Link to="/" className="btn-ghost w-full">
                <Home className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
