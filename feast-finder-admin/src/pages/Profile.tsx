import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Camera, 
  Save, 
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { cn } from "../lib/utils";

const Profile = () => {
  const { user } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-up">
      <header>
        <h2 className="text-4xl font-black tracking-tighter text-white text-glow">Account Settings</h2>
        <p className="text-muted-foreground mt-2 text-sm font-medium">Manage your administrative identity and security preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Avatar & Role */}
        <div className="space-y-6">
           <div className="glass-card p-10 rounded-[3rem] text-center space-y-6 relative overflow-hidden">
              <div className="relative inline-block group">
                 <div className="w-32 h-32 rounded-[2.5rem] premium-gradient p-[2px] shadow-2xl shadow-primary/20">
                    <div className="w-full h-full rounded-[2.4rem] bg-card flex items-center justify-center font-black text-4xl text-white">
                       {user?.name?.charAt(0) || "A"}
                    </div>
                 </div>
                 <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Camera size={18} />
                 </button>
              </div>
              <div>
                 <h3 className="text-xl font-black text-white">{user?.name || "Admin User"}</h3>
                 <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-1">{user?.role || "Staff"}</p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-2">
                 <ShieldCheck size={16} className="text-emerald-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Identity</span>
              </div>
           </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-8">
           <form onSubmit={handleSave} className="glass-card p-10 rounded-[3rem] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                       <input 
                         type="text" 
                         defaultValue={user?.name}
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                       <input 
                         type="email" 
                         defaultValue={user?.email}
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                 <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Security Update</h4>
                    <span className="text-[10px] text-muted-foreground font-bold italic">Last changed 3 months ago</span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Current Password</label>
                       <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                          >
                             {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">New Password</label>
                       <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                          <input 
                            type="password" 
                            placeholder="Enter new password"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 flex justify-end">
                 <button 
                   type="submit"
                   className={cn(
                     "h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                     isSaved ? "bg-emerald-500 text-white" : "premium-gradient text-white shadow-2xl shadow-primary/20 hover:scale-[1.02]"
                   )}
                 >
                    {isSaved ? (
                      <>
                        <CheckCircle size={18} /> Settings Updated
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
