import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { 
  Send, 
  ChevronLeft, 
  MoreVertical, 
  Phone, 
  Info,
  Check,
  CheckCheck,
  Clock,
  MessageSquare
} from "lucide-react";
import { useAuth, useMessages, useVendorProfile } from "@/store/AppProviders";
import { vendors, vendorById } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/messages/$vendorId")({
  loader: ({ params }) => ({ vendorId: params.vendorId }),
  component: ChatPage,
});

function ChatPage() {
  const { vendorId } = Route.useLoaderData();
  const auth = useAuth();
  const messages = useMessages();
  const vendorCtx = useVendorProfile();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Resolve vendor details
  const vendor = useMemo(() => {
    if (vendorCtx.profile && vendorCtx.profile.id === vendorId) {
      return {
        name: vendorCtx.profile.businessName,
        avatar: vendorCtx.profile.images[0] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100",
        tagline: vendorCtx.profile.tagline || "Your Kitchen",
      };
    }
    return vendorById(vendorId);
  }, [vendorId, vendorCtx.profile]);

  // Filter messages for this specific conversation
  const chatMessages = useMemo(() => {
    if (!auth.user) return [];
    return messages.items.filter(m => 
      m.vendorId === vendorId && 
      (m.fromEmail === auth.user?.email || m.from === "vendor")
    ).sort((a, b) => a.ts - b.ts);
  }, [messages.items, vendorId, auth.user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !auth.user) return;

    messages.send(vendorId, auth.user.email, auth.user.name, input);
    setInput("");
    
    // Auto-reply mock (optional, for demo)
    if (chatMessages.length === 0) {
      setTimeout(() => {
        toast.info(`${vendor?.name} is typing...`);
      }, 1000);
    }
  };

  if (!auth.user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-2xl font-black">Please sign in to chat</h1>
          <Link to="/signin" className="btn-primary mt-4 inline-flex">Sign In</Link>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-2xl font-black">Conversation not found</h1>
          <Link to="/vendors" className="btn-primary mt-4 inline-flex">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-[calc(100vh-80px)] flex-col bg-secondary/20 pt-20">
      <div className="container-mm flex flex-1 flex-col overflow-hidden px-0 sm:px-4">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 shadow-sm sm:rounded-t-3xl">
          <div className="flex items-center gap-3">
            <Link to="/view-vendor/$vendorId" params={{ vendorId }} className="icon-btn sm:hidden">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="relative">
              <img src={vendor.avatar} alt={vendor.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/10" />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-black">{vendor.name}</h2>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="icon-btn"><Phone className="h-4 w-4" /></button>
            <button className="icon-btn"><Info className="h-4 w-4" /></button>
            <button className="icon-btn"><MoreVertical className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Message Feed */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-white/50 p-4 space-y-4 scroll-smooth"
        >
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-60">
              <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-black italic">Start a conversation</h3>
              <p className="text-xs font-medium max-w-[240px]">Ask {vendor.name} about their menu, availability, or custom orders.</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <span className="bg-white/80 px-3 py-1 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest shadow-sm">Today</span>
              </div>
              {chatMessages.map((m, idx) => {
                const isMe = m.from === "user";
                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`flex max-w-[80%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`rounded-3xl px-4 py-2.5 text-sm font-medium shadow-sm ${
                        isMe 
                          ? "bg-primary text-white rounded-br-none" 
                          : "bg-white text-foreground rounded-bl-none ring-1 ring-border"
                      }`}>
                        {m.body}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 px-2">
                        <span className="text-[9px] font-bold text-muted-foreground">
                          {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isMe && <CheckCheck className="h-3 w-3 text-primary" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Chat Input */}
        <div className="border-t border-border bg-white p-4 sm:rounded-b-3xl">
          <form 
            onSubmit={handleSend}
            className="relative flex items-center gap-2"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full bg-secondary/50 px-5 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
