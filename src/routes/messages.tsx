import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useAuth, useMessages } from "@/store/AppProviders";
import { vendors } from "@/data/mock";

export const Route = createFileRoute("/messages")({
  validateSearch: (search: Record<string, unknown>): { vendorId?: string } => ({
    vendorId: search.vendorId as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your Messages — MenuMenu" },
      { name: "description", content: "Chat with kitchens about your orders, custom requests and more." },
      { property: "og:title", content: "Your Messages — MenuMenu" },
      { property: "og:description", content: "Chat with kitchens about your orders, custom requests and more." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const auth = useAuth();
  const messages = useMessages();
  const { vendorId } = Route.useSearch();
  const [activeVendorId, setActiveVendorId] = useState<string | null>(vendorId || null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Threads for the current user only
  const threads = useMemo(() => {
    if (!auth.user) return [];
    const userEmail = auth.user.email;
    // Collect all vendorIds the user has messaged
    const userMsgVendorIds = new Set(
      messages.items
        .filter(m => m.from === "user" && m.fromEmail === userEmail)
        .map(m => m.vendorId)
    );
    // For each vendor thread, include both user messages and vendor replies
    return Array.from(userMsgVendorIds)
      .map(vendorId => {
        const threadMsgs = messages.items
          .filter(m =>
            m.vendorId === vendorId &&
            (
              (m.from === "user" && m.fromEmail === userEmail) ||
              (m.from === "vendor" && m.fromEmail === userEmail)
            )
          )
          .sort((a, b) => a.ts - b.ts);
        const v = vendors.find(x => x.id === vendorId);
        const last = threadMsgs[threadMsgs.length - 1];
        const unread = threadMsgs.some(m => m.from === "vendor" && !m.read);
        return { vendorId, vendor: v, msgs: threadMsgs, last, unread };
      })
      .filter(t => t.last) // ensure thread has messages
      .sort((a, b) => b.last!.ts - a.last!.ts);
  }, [messages.items, auth.user]);

  const active = threads.find((t) => t.vendorId === activeVendorId) ?? threads[0];

  useEffect(() => {
    if (active && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active?.msgs.length, active?.vendorId]);

  // mark vendor messages as read on open
  useEffect(() => {
    if (!active) return;
    active.msgs.forEach((m) => { if (m.from === "vendor" && !m.read) messages.markRead?.(m.id); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.vendorId]);

  if (!auth.user) {
    return (
      <>
        <PageHero eyebrow="Inbox" title="Sign in to chat" subtitle="Your conversations with kitchens live here." />
        <section className="section">
          <div className="container-mm">
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <Link to="/signin" className="btn-primary mt-4 inline-flex">Sign in</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Inbox" title="Your messages" subtitle="Chat with kitchens about orders, requests and more." />
      <section className="section">
        <div className="container-mm">
          {threads.length === 0 ? (
            <div className="card-mm mx-auto max-w-md p-10 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold">No conversations yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Visit a kitchen and send a message to start a chat.</p>
              <Link to="/vendors" className="btn-primary mt-6 inline-flex">Discover kitchens</Link>
            </div>
          ) : (
            <div className="card-mm grid h-[640px] grid-cols-1 overflow-hidden md:grid-cols-[280px_1fr]">
              {/* Thread list */}
              <aside className="border-b border-border md:border-b-0 md:border-r">
                <ul className="max-h-[640px] overflow-y-auto">
                  {threads.map((t) => (
                    <li key={t.vendorId}>
                      <button
                        onClick={() => setActiveVendorId(t.vendorId)}
                        className={`flex w-full items-start gap-3 border-b border-border p-3 text-left transition hover:bg-secondary ${active?.vendorId === t.vendorId ? "bg-secondary" : ""}`}
                      >
                        {t.vendor && <img src={t.vendor.avatar} alt={t.vendor.name} className="h-10 w-10 rounded-2xl object-cover" />}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-extrabold">{t.vendor?.name ?? "Kitchen"}</p>
                            {t.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{t.last.from === "vendor" ? "" : "You: "}{t.last.body}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Conversation */}
              {active && (
                <div className="flex min-h-0 flex-col">
                  <div className="flex items-center gap-3 border-b border-border p-4">
                    {active.vendor && <img src={active.vendor.avatar} alt={active.vendor.name} className="h-10 w-10 rounded-2xl object-cover" />}
                    <div className="flex-1">
                      <p className="text-sm font-extrabold">{active.vendor?.name ?? "Kitchen"}</p>
                      <p className="text-xs text-muted-foreground">{active.vendor?.tagline}</p>
                    </div>
                    {active.vendor && (
                      <Link to="/vendors/$vendorId" params={{ vendorId: active.vendor.id }} className="text-xs font-bold text-primary hover:underline">View kitchen →</Link>
                    )}
                  </div>
                  <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4">
                    {active.msgs.map((m) => (
                      <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                          <p className="whitespace-pre-wrap">{m.body}</p>
                          <p className={`mt-1 text-[10px] ${m.from === "user" ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                            {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = draft.trim();
                      if (!text || !auth.user) return;
                      messages.send(active.vendorId, auth.user.email, auth.user.name, text);
                      setDraft("");
                    }}
                    className="flex items-center gap-2 border-t border-border p-3"
                  >
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Write a message…"
                      className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button type="submit" className="btn-primary !px-4" aria-label="Send"><Send className="h-4 w-4" /></button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
