import React, { useState } from "react";
import { 
  Headset, 
  Search, 
  Filter, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Clock, 
  Send,
  MoreVertical,
  ChevronRight,
  ShieldAlert,
  Star
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_TICKETS = [
  { id: "TKT-1024", user: "Alice Brown", subject: "Delayed Delivery", category: "Delivery", priority: "High", status: "Open", time: "12 mins ago" },
  { id: "TKT-1025", user: "Bob Wilson", subject: "Wrong Items in Order", category: "Food Quality", priority: "Medium", status: "In Progress", time: "45 mins ago" },
  { id: "TKT-1026", user: "Sarah Smith", subject: "Refund Request", category: "Billing", priority: "Urgent", status: "Open", time: "1 hour ago" },
  { id: "TKT-1027", user: "John Doe", subject: "App Crashing on Checkout", category: "Technical", priority: "Low", status: "Resolved", time: "3 hours ago" },
];

const Support = () => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Headset className="text-primary" size={32} />
            Support Help Desk
          </h2>
          <p className="text-muted-foreground mt-1">Resolve platform disputes, customer inquiries, and technical issues.</p>
        </div>
        <div className="flex gap-4 items-center">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Avg. Response Time</p>
              <p className="text-sm font-bold text-emerald-500">14m 22s</p>
           </div>
           <button className="h-12 px-8 rounded-2xl premium-gradient text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20">
              <MessageCircle size={18} /> Broadcast Update
           </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Ticket List */}
        <div className="flex flex-col gap-6 overflow-hidden">
           {/* Filters */}
           <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Ticket ID or User..."
                  className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button className="w-[52px] h-[52px] rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:border-primary transition-all">
                <Filter size={18} />
              </button>
           </div>

           {/* Inbox */}
           <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {MOCK_TICKETS.map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={cn(
                    "p-5 rounded-[2rem] bg-card border border-border cursor-pointer transition-all hover:border-primary group",
                    selectedTicket?.id === ticket.id && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{ticket.id}</span>
                    <span className="text-[10px] text-muted-foreground font-bold">{ticket.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{ticket.subject}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <User size={12} /> {ticket.user}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                     <span className={cn(
                       "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
ticket.priority === "Urgent" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                        ticket.priority === "High" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        "bg-primary/10 text-primary border border-primary/20"
                     )}>
                       {ticket.priority}
                     </span>
                     <span className={cn(
                       "text-[10px] font-bold",
                       ticket.status === "Open" ? "text-white" : "text-muted-foreground"
                     )}>{ticket.status}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Resolution Workspace */}
        <div className="lg:col-span-2 bg-card rounded-[3rem] border border-border flex flex-col overflow-hidden shadow-sm relative">
           {selectedTicket ? (
             <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
                {/* Workspace Header */}
                <div className="p-8 border-b border-border bg-muted/20 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-primary border border-slate-700">
                         {selectedTicket.user.charAt(0)}
                      </div>
                      <div>
                         <h3 className="font-black text-white leading-none">{selectedTicket.user}</h3>
                         <p className="text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-widest">{selectedTicket.category} Dispute</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="h-10 px-4 rounded-xl bg-muted/50 text-[10px] font-black uppercase text-white hover:bg-muted transition-all border border-border">Escalate</button>
                      <button className="h-10 px-4 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-500/10">Mark Resolved</button>
                   </div>
                </div>

                {/* Interaction Flow (Simulated Chat) */}
                <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                         <User size={14} className="text-muted-foreground" />
                      </div>
                      <div className="bg-muted p-5 rounded-2xl rounded-tl-none max-w-[80%] border border-border">
                         <p className="text-xs font-bold text-white mb-2">Customer Inquiry</p>
                         <p className="text-xs text-muted-foreground leading-relaxed">
                            "Hello support, my order #{selectedTicket.id.split('-')[1]} was supposed to arrive 30 minutes ago. The driver is not responding and I'm very hungry. Can you please help?"
                         </p>
                         <p className="text-[9px] text-muted-foreground/50 mt-4 text-right">Sent 12:42 PM</p>
                      </div>
                   </div>

                   <div className="flex flex-row-reverse gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                         <ShieldAlert size={14} className="text-primary-foreground" />
                      </div>
                      <div className="bg-primary/10 p-5 rounded-2xl rounded-tr-none max-w-[80%] border border-primary/20">
                         <p className="text-xs font-bold text-primary mb-2">Automated Platform Action</p>
                         <p className="text-xs text-muted-foreground leading-relaxed italic">
                            "System detected delay in GPS telemetry for order #{selectedTicket.id.split('-')[1]}. Automated ping sent to courier. Response pending."
                         </p>
                         <p className="text-[9px] text-primary/50 mt-4 text-right">System Log 12:45 PM</p>
                      </div>
                   </div>
                </div>

                {/* Response Input */}
                <div className="p-8 border-t border-border bg-card">
                   <div className="flex gap-4">
                      <div className="flex-1 relative">
                         <textarea 
                           placeholder="Type your official response here..."
                           className="w-full bg-muted/30 border border-border rounded-2xl p-4 text-xs outline-none focus:border-primary resize-none h-24"
                         />
                         <div className="absolute bottom-4 right-4 flex gap-2">
                            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all">
                               <MoreVertical size={16} />
                            </button>
                         </div>
                      </div>
                      <button className="w-24 bg-primary text-primary-foreground rounded-2xl flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                         <Send size={20} />
                         <span className="text-[10px] font-black uppercase">Send</span>
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center p-20 space-y-6">
                <div className="w-24 h-24 rounded-[2rem] bg-muted/30 flex items-center justify-center text-muted-foreground animate-pulse">
                   <Headset size={48} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-white">Select a Ticket to Audit</h3>
                   <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
                      Choose an open dispute from the left panel to begin the resolution process.
                   </p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Support;
