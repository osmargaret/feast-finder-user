import React from "react";
import { 
  History, 
  Search, 
  Filter, 
  Clock, 
  User, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  Download,
  Calendar,
  ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_LOGS = [
  { id: 1, action: "Role Changed", user: "Margaret Samuel", target: "Clement Mark", desc: "Elevated role from Level 2 to Level 3", time: "10 mins ago", severity: "medium" },
  { id: 2, action: "Vendor Verified", user: "Clement Mark", target: "Mamma's Kitchen", desc: "Approved verification documents after audit", time: "45 mins ago", severity: "low" },
  { id: 3, action: "System Config", user: "Margaret Samuel", target: "API Settings", desc: "Updated production webhook endpoints", time: "2 hours ago", severity: "high" },
  { id: 4, action: "Access Denied", user: "System", target: "Anonymous", desc: "Blocked multiple login attempts from unknown IP", time: "5 hours ago", severity: "high" },
  { id: 5, action: "Password Reset", user: "Sarah Jenkins", target: "David Olatunji", desc: "Initiated forced password reset for staff", time: "1 day ago", severity: "medium" },
];

const ShieldAlert = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const AuditLogs = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <History className="text-primary" size={32} />
            System Audit Logs
          </h2>
          <p className="text-muted-foreground mt-1">Traceable history of all administrative and system-level actions.</p>
        </div>
        <button className="h-12 px-8 rounded-2xl bg-muted text-foreground font-black text-sm flex items-center gap-2 border border-border hover:bg-muted/80 transition-all shadow-sm">
          <Download size={18} /> Download Full Archive
        </button>
      </header>

      {/* Real-time Monitor Bar */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-bold text-primary tracking-tight">Live Audit Stream Active</p>
        </div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Last system sync: Just Now</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search logs by user, action, or description..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm appearance-none outline-none focus:ring-1 focus:ring-primary cursor-pointer">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>All Time</option>
          </select>
        </div>
        <div className="relative">
          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm appearance-none outline-none focus:ring-1 focus:ring-primary cursor-pointer">
            <option>All Severities</option>
            <option>High Severity</option>
            <option>Medium Severity</option>
            <option>Low Severity</option>
          </select>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden">
        <div className="p-8 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Activity Timeline</h3>
          <span className="text-[10px] font-bold text-primary">5 Entries Today</span>
        </div>
        <div className="divide-y divide-border">
          {MOCK_LOGS.map((log) => (
            <div key={log.id} className="p-8 hover:bg-muted/10 transition-colors flex flex-col md:flex-row md:items-center gap-6 group">
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                  log.severity === "high" ? "bg-destructive/10 border-destructive/20 text-destructive" :
                  log.severity === "medium" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                )}>
                  {log.severity === "high" ? <ShieldAlert size={20} /> : <FileText size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-white">{log.action}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{log.time}</span>
                   </div>
                   <p className="text-xs text-muted-foreground line-clamp-1">
                      <span className="font-bold text-white/80">{log.user}</span> modified <span className="font-bold text-white/80">{log.target}</span>: {log.desc}
                   </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                 <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Severity</p>
                    <p className={cn(
                      "text-xs font-bold capitalize",
                      log.severity === "high" ? "text-destructive" :
                      log.severity === "medium" ? "text-amber-500" :
                      "text-emerald-500"
                    )}>{log.severity}</p>
                 </div>
                 <button className="w-10 h-10 rounded-xl hover:bg-muted text-muted-foreground group-hover:text-primary transition-all flex items-center justify-center">
                    <ChevronRight size={20} />
                 </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 border-t border-border bg-muted/10 text-center">
           <button className="text-xs font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
              Load Older Activity
           </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
