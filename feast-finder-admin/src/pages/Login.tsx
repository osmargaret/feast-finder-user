import React, { useState } from "react";
import { 
   Lock, 
   Mail, 
   ArrowRight, 
   Eye, 
   EyeOff, 
   ShieldCheck,
   AlertCircle,
   ChefHat
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { cn } from "../lib/utils";

const Login = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simulate API Delay
    setTimeout(() => {
      login("admin@feastfinder.com", "password", "super_admin");
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
       
      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="w-full max-w-md glass-card p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-fade-up relative z-10">
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/20">
            <ChefHat size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase text-glow">Admin Gateway</h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">Feast Finder Command</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Identity (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input 
                required
                type="email" 
                placeholder="admin@feastfinder.com"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secret Key</label>
              <Link to="/forgot-password" size={14} className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Recover</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input 
                required
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all text-white"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Authorize <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Secure 256-bit Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
