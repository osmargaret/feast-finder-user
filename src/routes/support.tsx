import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { useAuth, useSupport } from "@/store/AppProviders";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Help Center — MenuMenu" },
      { name: "description", content: "Track your support tickets and get help with your orders." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const auth = useAuth();
  const support = useSupport();

  if (!auth.user) {
    return (
      <>
        <PageHero eyebrow="Help" title="Sign in" subtitle="Manage your support tickets." />
        <section className="section text-center">
           <Link to="/signin" className="btn-primary inline-flex">Sign in</Link>
        </section>
      </>
    );
  }

  const myTickets = support.tickets.filter((t) => t.userEmail === auth.user!.email);

  return (
    <>
      <PageHero eyebrow="Customer Support" title="Help Center" subtitle="Track your inquiries and report issues." />
      <section className="section">
        <div className="container-mm max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black">Your Tickets <span className="text-sm font-bold text-muted-foreground">({myTickets.length})</span></h2>
            <Link to="/profile" className="text-sm font-bold text-primary hover:underline">← Back to profile</Link>
          </div>

          {myTickets.length === 0 ? (
            <div className="card-mm p-12 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-extrabold">No active tickets</h3>
              <p className="mt-1 text-sm text-muted-foreground">Go to your orders to report a problem with a specific meal.</p>
              <Link to="/profile" className="btn-primary mt-6 inline-flex">Go to orders</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myTickets.map((t) => (
                <div key={t.id} className="card-mm p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                          t.status === "open" ? "bg-primary/10 text-primary" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-black">{t.subject}</h3>
                      <p className="text-xs font-bold text-muted-foreground">Order: {t.orderId} · {new Date(t.ts).toLocaleString()}</p>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                      {t.status === "open" ? <Clock className="h-5 w-5 text-primary" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-secondary/40 p-4">
                    <p className="text-sm italic text-foreground/80">"{t.message}"</p>
                  </div>
                  {t.status === "open" && (
                    <p className="mt-4 text-xs font-bold text-muted-foreground">
                      👩‍💻 Support agents are reviewing this. Expect a reply in your email within 24 hours.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="card-mm mt-12 bg-secondary/30 p-8 text-center">
            <h3 className="font-extrabold">Other ways to get help</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
               <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Email</p>
                  <a href="mailto:support@menumenu.app" className="text-sm font-black hover:text-primary">support@menumenu.app</a>
               </div>
               <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">WhatsApp</p>
                  <a href="#" className="text-sm font-black hover:text-primary">+234 800 MENU HELP</a>
               </div>
               <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Twitter</p>
                  <a href="#" className="text-sm font-black hover:text-primary">@MenuMenuHelp</a>
               </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
