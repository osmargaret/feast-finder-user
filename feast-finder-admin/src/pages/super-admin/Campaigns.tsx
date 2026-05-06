import React, { useState } from "react";
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Users,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowUpRight,
  X,
  Trash2,
  PauseCircle,
  Edit
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_CAMPAIGNS = [
  { id: "CMP-001", name: "Weekend Seafood Special", channel: "Push", audience: "All Customers", status: "Active", sent: "45,200", conversion: "12.4%", date: "Live" },
  { id: "CMP-002", name: "Vendor Onboarding Promo", channel: "Email", audience: "Lagos Vendors", status: "Scheduled", sent: "0", conversion: "0%", date: "June 20" },
  { id: "CMP-003", name: "App Anniversary Flash Sale", channel: "SMS", audience: "Dormant Users", status: "Completed", sent: "12,000", conversion: "8.2%", date: "June 12" },
  { id: "CMP-004", name: "Lunch Break Push", channel: "Push", audience: "Ikeja District", status: "Draft", sent: "0", conversion: "0%", date: "Pending" },
];

const Campaigns = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white text-glow flex items-center gap-4">
            <Megaphone className="text-primary" size={36} />
            Marketing Campaigns
          </h2>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Design, target, and monitor platform-wide growth initiatives.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-10 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-3"
        >
          <Plus size={18} /> New Campaign
        </button>
      </header>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CampaignStat title="Total Reach (30d)" value="124.5K" trend="+15%" icon={Users} color="text-primary" />
        <CampaignStat title="Avg. Conversion" value="9.2%" trend="+1.4%" icon={BarChart3} color="text-emerald-500" />
        <CampaignStat title="Active Nodes" value="4" trend="Stable" icon={CheckCircle} color="text-primary" />
      </div>

      {/* Campaign List */}
      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
           <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Campaign Registry</h3>
           <div className="flex gap-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                 <input type="text" placeholder="Search campaigns..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-primary w-64 text-white" />
              </div>
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all"><Filter size={16} /></button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01] text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-white/5">
                <th className="px-8 py-6">Campaign Info</th>
                <th className="px-8 py-6">Channel</th>
                <th className="px-8 py-6">Target Audience</th>
                <th className="px-8 py-6">Performance</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_CAMPAIGNS.map((camp) => (
                <tr key={camp.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-black text-white group-hover:text-primary transition-colors">{camp.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">{camp.id} • {camp.date}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
{camp.channel === "Push" ? <Smartphone size={14} className="text-primary" /> : 
                         camp.channel === "Email" ? <Mail size={14} className="text-primary" /> : 
                         <MessageSquare size={14} className="text-primary" />}
                       <span className="text-xs font-bold text-white/80">{camp.channel}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-muted-foreground">
                    {camp.audience}
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                       <div className="flex items-center justify-between text-[9px] font-black uppercase text-muted-foreground">
                          <span>Reach: {camp.sent}</span>
                          <span className="text-emerald-500">{camp.conversion}</span>
                       </div>
                       <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: camp.conversion }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter inline-flex items-center gap-1.5",
                      camp.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                      camp.status === "Scheduled" ? "bg-primary/10 text-primary border border-primary/20" :
                      camp.status === "Completed" ? "bg-white/10 text-white border border-white/20" :
                      "bg-white/5 text-muted-foreground border border-white/10"
                    )}>
                      {camp.status}
                    </span>
                  </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => alert(`Viewing campaign details for ${camp.name}`)}
                          className="p-2 rounded-xl hover:bg-primary/20 text-primary transition-all"
                        >
                          <Search size={18} />
                        </button>
                        <button 
                          onClick={() => alert(`Editing campaign ${camp.name}`)}
                          className="p-2 rounded-xl hover:bg-primary/20 text-primary transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${camp.name}?`)) {
                              alert(`${camp.name} has been deleted`);
                            }
                          }}
                          className="p-2 rounded-xl hover:bg-destructive/20 text-destructive transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
           <div className="w-full max-w-2xl glass-card rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative z-10">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white">
                       <Megaphone size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter">New Campaign</h3>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">Target your platform audience</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
                    <X size={20} />
                 </button>
              </div>

              <form className="p-10 space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Campaign Name</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Black Friday Flash Sale"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Channel</label>
                          <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white appearance-none cursor-pointer">
                             <option className="bg-slate-900">Push Notification</option>
                             <option className="bg-slate-900">SMS Message</option>
                             <option className="bg-slate-900">Email Campaign</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Target Audience</label>
                          <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white appearance-none cursor-pointer">
                             <option className="bg-slate-900">All Customers</option>
                             <option className="bg-slate-900">Top Vendors Only</option>
                             <option className="bg-slate-900">Inactive Users</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Message Content</label>
                       <textarea 
                         rows={3}
                         placeholder="Type your message here..."
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white resize-none"
                       />
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-14 rounded-2xl bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                       Discard
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] h-14 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                       Launch Campaign <Send size={18} />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const CampaignStat = ({ title, value, trend, icon: Icon, color }: any) => (
  <div className="glass-card glass-card-hover p-8 rounded-[2.5rem] flex items-center gap-6">
    <div className={cn("w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5", color)}>
      <Icon size={32} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-3xl font-black text-white mt-1 tracking-tighter">{value}</h3>
      <p className={cn("text-[10px] font-black mt-1.5", trend.startsWith('+') ? "text-emerald-500" : "text-muted-foreground")}>
        {trend} vs last cycle
      </p>
    </div>
  </div>
);

export default Campaigns;
