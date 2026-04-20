import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Check, X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useNotifications } from "@/store/AppProviders";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — MenuMenu" },
      { name: "description", content: "Updates from your favourite kitchens and orders." },
      { property: "og:title", content: "Notifications — MenuMenu" },
      { property: "og:description", content: "Updates from your favourite kitchens and orders." },
    ],
  }),
  component: NotificationsPage,
});

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function NotificationsPage() {
  const notif = useNotifications();
  return (
    <>
      <PageHero eyebrow="Stay in the loop" title="Notifications" subtitle="New drops, order updates, and offers from kitchens you follow." />
      <section className="section">
        <div className="container-mm max-w-2xl">
          {notif.items.length === 0 ? (
            <div className="card-mm p-10 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <Bell className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold">No notifications yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Follow kitchens to get notified when new meals drop.</p>
              <Link to="/vendors" className="btn-primary mt-6 inline-flex">Discover kitchens</Link>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-muted-foreground">{notif.unread} unread</p>
                <div className="flex gap-2">
                  <button onClick={notif.markAllRead} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary">
                    <Check className="h-3.5 w-3.5" /> Mark all read
                  </button>
                  <button onClick={notif.clear} className="text-xs font-bold text-muted-foreground hover:text-destructive">
                    Clear all
                  </button>
                </div>
              </div>
              <ul className="space-y-3">
                {notif.items.map((n) => (
                  <li key={n.id} className={`card-mm flex items-start gap-3 p-4 ${!n.read ? "border-primary/40 bg-primary/5" : ""}`}>
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-extrabold">{n.title}</h3>
                        <span className="text-[11px] font-bold text-muted-foreground">{timeAgo(n.ts)}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    </div>
                    <button onClick={() => notif.remove(n.id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary" aria-label="Dismiss">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
