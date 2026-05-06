import React from "react";
import { Users as UsersIcon, Shield, Mail, Phone, Calendar, MoreVertical, Search, Filter, Plus, X } from "lucide-react";
import { cn } from "../lib/utils";

const MOCK_USERS = [
  { id: 1, name: "Clement Mark", email: "clement@example.com", phone: "+234 801 234 5678", joined: "Jan 12, 2024", role: "Customer", status: "Active" },
  { id: 2, name: "Alice Brown", email: "alice@example.com", phone: "+234 802 345 6789", joined: "Feb 05, 2024", role: "Customer", status: "Active" },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", phone: "+234 803 456 7890", joined: "Mar 20, 2024", role: "Vendor Admin", status: "Suspended" },
  { id: 4, name: "Eve Online", email: "eve@example.com", phone: "+234 804 567 8901", joined: "Apr 15, 2024", role: "Customer", status: "Active" },
];

const Users = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Registered Users</h2>
          <p className="text-muted-foreground mt-1">Manage all platform participants, including customers and support staff.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-8 rounded-2xl premium-gradient text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={18} /> Add New User
        </button>
      </header>

      {/* New User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
           <div className="w-full max-w-xl glass-card rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative z-10">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white">
                       <UsersIcon size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter">Add New User</h3>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">Register a platform member</p>
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
                         placeholder="e.g. Alice Johnson"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="user@example.com"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="+234..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Initial Role</label>
                       <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white appearance-none cursor-pointer">
                          <option className="bg-slate-900">Customer</option>
                          <option className="bg-slate-900">Vendor Staff</option>
                          <option className="bg-slate-900">Support Agent</option>
                       </select>
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
                       Create User <Shield size={18} />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="h-[52px] px-6 rounded-2xl bg-card border border-border text-xs font-bold flex items-center gap-2 hover:border-primary transition-all">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-border">
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Contact Details</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-white flex items-center gap-2"><Mail size={12} className="text-muted-foreground" /> {user.email}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-2"><Phone size={12} className="text-muted-foreground" /> {user.phone}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-medium text-white flex items-center gap-2"><Calendar size={12} className="text-muted-foreground" /> {user.joined}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                       <Shield size={12} className="text-primary" /> {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                      user.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                      <MoreVertical size={20} />
                    </button>
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

export default Users;
