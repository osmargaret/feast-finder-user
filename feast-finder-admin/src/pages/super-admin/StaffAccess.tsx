import React from "react";
import { 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  MoreVertical,
  ShieldAlert,
  Key,
  Mail,
  Activity,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_STAFF = [
  { id: 1, name: "Margaret Samuel", email: "m.samuel@feastfinder.com", role: "Super Admin", level: 4, status: "Active", lastActive: "Just now", permissions: ["all"] },
  { id: 2, name: "Clement Mark", email: "c.mark@feastfinder.com", role: "Platform Manager", level: 3, status: "Active", lastActive: "12 mins ago", permissions: ["vendors", "orders", "users"] },
  { id: 3, name: "Sarah Jenkins", email: "s.jenkins@feastfinder.com", role: "Support Lead", level: 2, status: "Active", lastActive: "2 hours ago", permissions: ["orders", "users"] },
  { id: 4, name: "David Olatunji", email: "d.olatunji@feastfinder.com", role: "Junior Support", level: 1, status: "Suspended", lastActive: "3 days ago", permissions: ["users"] },
];

const StaffAccess = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="text-primary" size={32} />
            Staff & Permissions
          </h2>
          <p className="text-muted-foreground mt-1">Manage administrative access levels and internal team roles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-8 rounded-2xl premium-gradient text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          <UserPlus size={18} /> Add Staff Member
        </button>
      </header>

      {/* Invite Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
           <div className="w-full max-w-xl glass-card rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative z-10">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white">
                       <UserPlus size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter">Invite Staff</h3>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">Provision Admin Access</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
                    <X size={20} />
                 </button>
              </div>

              <form className="p-10 space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
                       <input 
                         type="text" 
                         placeholder="e.g. John Smith"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Admin Email</label>
                       <input 
                         type="email" 
                         placeholder="staff@feastfinder.com"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Role Type</label>
                          <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white appearance-none cursor-pointer">
                             <option className="bg-slate-900">Platform Manager</option>
                             <option className="bg-slate-900">Support Lead</option>
                             <option className="bg-slate-900">Financial Auditor</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Access Level</label>
                          <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white appearance-none cursor-pointer">
                             <option className="bg-slate-900">Level 1 (Read Only)</option>
                             <option className="bg-slate-900">Level 2 (Standard)</option>
                             <option className="bg-slate-900">Level 3 (Senior)</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-14 rounded-2xl bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] h-14 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                       Send Invitation <ShieldCheck size={18} />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Access Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AccessCard title="Total Staff" value="12" desc="Active Admins" icon={ShieldCheck} color="text-primary" />
        <AccessCard title="Pending Verifications" value="0" desc="All staff verified" icon={ShieldAlert} color="text-emerald-500" />
        <AccessCard title="System Integrity" value="High" desc="Last audit 2h ago" icon={Activity} color="text-primary" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or role..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="h-[52px] px-6 rounded-2xl bg-card border border-border text-xs font-bold flex items-center gap-2 hover:border-primary transition-all">
          <Filter size={16} /> Filter Roles
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-border">
                <th className="px-8 py-5">Administrator</th>
                <th className="px-8 py-5">Role & Level</th>
                <th className="px-8 py-5">Permissions</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Last Activity</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_STAFF.map((staff) => (
                <tr key={staff.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-primary">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-none">{staff.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Mail size={10} /> {staff.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-bold text-white">{staff.role}</span>
                       <div className="flex gap-0.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={cn(
                              "w-3 h-1 rounded-full",
                              i <= staff.level ? "bg-primary" : "bg-muted"
                            )} />
                          ))}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1">
                      {staff.permissions.map((perm) => (
                        <span key={perm} className="px-2 py-0.5 rounded bg-muted text-[9px] font-black uppercase text-muted-foreground">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter inline-flex items-center gap-1.5",
                      staff.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                    )}>
                      <div className={cn("w-1 h-1 rounded-full", staff.status === "Active" ? "bg-emerald-500" : "bg-destructive")} />
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-muted-foreground font-medium">
                    {staff.lastActive}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all title='Reset Credentials'">
                          <Key size={16} />
                       </button>
                       <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-destructive transition-all title='Restrict Access'">
                          {staff.status === "Active" ? <Lock size={16} /> : <Unlock size={16} />}
                       </button>
                       <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                          <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AccessCard = ({ title, value, desc, icon: Icon, color }: any) => (
  <div className="bg-card p-6 rounded-[2rem] border border-border flex items-center gap-6 shadow-sm group">
    <div className={cn("w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform", color)}>
      <Icon size={28} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-white leading-none mt-1">{value}</h3>
      <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{desc}</p>
    </div>
  </div>
);

export default StaffAccess;
