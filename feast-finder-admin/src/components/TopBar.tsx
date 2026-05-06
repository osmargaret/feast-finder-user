import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Settings, 
  Lock, 
  Mail, 
  LogOut, 
  ChevronDown,
  Shield,
  Bell,
  Search,
  Command,
  X,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAdminAuth } from "../context/AdminAuthContext";

const MOCK_RESULTS = [
  { type: "Vendor", name: "The Spice Garden", link: "/vendors" },
  { type: "Order", name: "ORD-821 (Alice Brown)", link: "/orders" },
  { type: "Page", name: "System Intelligence", link: "/super-admin/health" },
  { type: "Customer", name: "John Doe", link: "/users" },
];

const TopBar = () => {
  const { user, logout } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-24 px-10 flex items-center justify-between relative z-40">
      {/* Global Command Search */}
      <div className="flex-1 max-w-xl">
         <div 
           onClick={() => setIsSearchOpen(true)}
           className="relative group cursor-pointer"
         >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" size={18} />
            <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-muted-foreground flex items-center justify-between group-hover:border-primary/30 group-hover:bg-white/[0.05] transition-all">
               <span>Search anything...</span>
               <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase">
                  <Command size={10} /> K
               </div>
            </div>
         </div>
      </div>

      {/* Spotlight Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
           <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsSearchOpen(false)} />
           <div className="w-full max-w-2xl glass-card rounded-[2.5rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative z-10">
              <div className="p-6 border-b border-white/5 flex items-center gap-4">
                 <Search className="text-primary" size={24} />
                 <input 
                   autoFocus
                   type="text" 
                   placeholder="Type to search orders, vendors, or pages..."
                   className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-white placeholder:text-muted-foreground"
                 />
                 <button onClick={() => setIsSearchOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground"><X size={20} /></button>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                 <div className="px-4 py-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Results</p>
                 </div>
                 <div className="space-y-1">
                    {MOCK_RESULTS.map((res, i) => (
                      <Link 
                        key={i}
                        to={res.link}
                        onClick={() => setIsSearchOpen(false)}
                        className="w-full flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-white/5 group transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                               <FileText size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-white">{res.name}</p>
                               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{res.type}</p>
                            </div>
                         </div>
                         <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                 </div>
              </div>
              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-muted-foreground">
                       <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">ESC</div> Close
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-muted-foreground">
                       <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">ENTER</div> Select
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Profile Actions */}
      <div className="flex items-center gap-6">
         <button className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
         </button>

         <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all border",
                isOpen ? "bg-white/[0.08] border-white/10" : "bg-white/[0.03] border-white/5 hover:bg-white/5"
              )}
            >
               <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/10">
                  {user?.name?.charAt(0) || "A"}
               </div>
               <div className="text-left hidden md:block">
                  <p className="text-[11px] font-black text-white uppercase tracking-wider">{user?.name || "Admin"}</p>
                  <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">{user?.role || "Manager"}</p>
               </div>
               <ChevronDown size={14} className={cn("text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-4 w-72 glass-card rounded-[2rem] border border-white/10 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-white/5 mb-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Account Info</p>
                    <p className="text-xs font-bold text-white truncate">{user?.email || "admin@feastfinder.com"}</p>
                 </div>

                 <div className="space-y-1">
                    <Link 
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-muted-foreground hover:bg-white/5 hover:text-white transition-all group"
                    >
                       <User size={16} className="group-hover:text-primary" /> Edit Profile
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-muted-foreground hover:bg-white/5 hover:text-white transition-all group">
                       <Lock size={16} className="group-hover:text-primary" /> Security Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-muted-foreground hover:bg-white/5 hover:text-white transition-all group">
                       <Settings size={16} className="group-hover:text-primary" /> Preferences
                    </button>
                    <button 
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-muted-foreground hover:bg-white/5 hover:text-white transition-all group"
                    >
                       <div className="flex items-center gap-3">
                          {isDark ? <Sun size={16} className="group-hover:text-primary" /> : <Moon size={16} className="group-hover:text-primary" />}
                          {isDark ? "Light Mode" : "Dark Mode"}
                       </div>
                       <div className={cn(
                         "w-8 h-4 rounded-full relative transition-colors duration-300",
                         isDark ? "bg-primary/20" : "bg-muted"
                       )}>
                          <div className={cn(
                            "absolute top-1 w-2 h-2 rounded-full bg-white transition-all duration-300",
                            isDark ? "right-1" : "left-1"
                          )} />
                       </div>
                    </button>
                 </div>

                 <div className="mt-4 pt-2 border-t border-white/5">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-xs font-black uppercase text-destructive hover:bg-destructive/10 transition-all"
                    >
                       <LogOut size={16} /> Log Out
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>
    </header>
  );
};

export default TopBar;
