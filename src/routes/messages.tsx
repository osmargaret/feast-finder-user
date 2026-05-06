import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { useAuth } from "@/store/AppProviders";
import { useApiMessages, ApiMessage } from "@/hooks/useApiMessages";
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
  const { data: apiMessages = [], isLoading, sendMessage, markAsRead } = useApiMessages();
  const { vendorId } = Route.useSearch();
  const [activeOtherId, setActiveOtherId] = useState<number | string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group messages into threads
  const threads = useMemo(() => {
    if (!auth.user || !apiMessages.length) return [];
    const currentUserId = auth.user.id;

    const groups: Record<string, { otherId: number | string; last: ApiMessage; msgs: ApiMessage[]; unread: boolean; vendor?: any }> = {};

    apiMessages.forEach((m) => {
      const otherId = m.sender_id == currentUserId ? m.receiver_id : m.sender_id;
      if (!groups[otherId]) {
        const vendor = vendors.find(v => v.id === m.vendor_id?.toString());
        groups[otherId] = {
          otherId,
          last: m,
          msgs: [],
          unread: false,
          vendor
        };
      }
      groups[otherId].msgs.push(m);
      if (m.receiver_id == currentUserId && !m.is_read) {
        groups[otherId].unread = true;
      }
    });

    return Object.values(groups).sort((a, b) => 
      new Date(b.last.created_at).getTime() - new Date(a.last.created_at).getTime()
    );
  }, [apiMessages, auth.user]);

  const active = threads.find((t) => t.otherId === activeOtherId) ?? threads[0];

  useEffect(() => {
    if (active && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active?.msgs.length, active?.otherId]);

  // mark as read on open
  useEffect(() => {
    if (active && active.unread) {
      markAsRead.mutate(active.otherId);
    }
  }, [active?.otherId, active?.unread]);

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

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
                    <li key={t.otherId}>
                      <button
                        onClick={() => setActiveOtherId(t.otherId)}
                        className={`flex w-full items-start gap-3 border-b border-border p-3 text-left transition hover:bg-secondary ${active?.otherId === t.otherId ? "bg-secondary" : ""}`}
                      >
                        {t.vendor ? (
                          <img src={t.vendor.avatar} alt={t.vendor.name} className="h-10 w-10 rounded-2xl object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {(t.last.sender_id == auth.user?.id ? t.last.receiver.name : t.last.sender.name).charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-extrabold">
                              {t.vendor?.name ?? (t.last.sender_id == auth.user?.id ? t.last.receiver.name : t.last.sender.name)}
                            </p>
                            {t.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {t.last.sender_id == auth.user?.id ? "You: " : ""}{t.last.body}
                          </p>
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
                    {active.vendor ? (
                      <img src={active.vendor.avatar} alt={active.vendor.name} className="h-10 w-10 rounded-2xl object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {(active.last.sender_id == auth.user?.id ? active.last.receiver.name : active.last.sender.name).charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-extrabold">
                        {active.vendor?.name ?? (active.last.sender_id == auth.user?.id ? active.last.receiver.name : active.last.sender.name)}
                      </p>
                      {active.vendor && <p className="text-xs text-muted-foreground">{active.vendor.tagline}</p>}
                    </div>
                    {active.vendor && (
                      <Link to="/vendors/$vendorId" params={{ vendorId: active.vendor.id }} className="text-xs font-bold text-primary hover:underline">View kitchen →</Link>
                    )}
                  </div>
                  <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4">
                    {active.msgs.map((m) => (
                      <div key={m.id} className={`flex ${m.sender_id == auth.user?.id ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${m.sender_id == auth.user?.id ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                          <p className="whitespace-pre-wrap">{m.body}</p>
                          <p className={`mt-1 text-[10px] ${m.sender_id == auth.user?.id ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = draft.trim();
                      if (!text || !auth.user || !active) return;
                      sendMessage.mutate({
                        receiver_id: active.otherId,
                        body: text,
                        vendor_id: active.vendor?.id
                      });
                      setDraft("");
                    }}
                    className="flex items-center gap-2 border-t border-border p-3"
                  >
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Write a message…"
                      className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      disabled={sendMessage.isPending}
                    />
                    <button 
                      type="submit" 
                      className="btn-primary !px-4 disabled:opacity-50" 
                      aria-label="Send"
                      disabled={sendMessage.isPending}
                    >
                      {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
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
