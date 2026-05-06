import React, { useState } from "react";
import { 
  KeyRound, 
  Mail, 
  ArrowLeft, 
  CheckCircle,
  ShieldCheck,
  Send
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const ForgotPassword = () => {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
       
      <div className="w-full max-w-md glass-card p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-fade-up relative z-10">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Entry
        </Link>

        {isSent ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto shadow-2xl shadow-emerald-500/10">
              <CheckCircle size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase text-glow">Verification Sent</h2>
              <p className="text-sm text-muted-foreground font-medium mt-3 leading-relaxed">
                We've sent a secure recovery link to your registered administrative email.
              </p>
            </div>
            <Link 
              to="/login"
              className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center hover:bg-white/[0.08] transition-all"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center space-y-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-xl shadow-primary/10">
                <KeyRound size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tighter uppercase text-glow">Recover Secret</h1>
                <p className="text-sm text-muted-foreground font-medium mt-2">Enter your identity to receive a recovery link.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Admin Email</label>
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

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Link <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Administrative Verification Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
