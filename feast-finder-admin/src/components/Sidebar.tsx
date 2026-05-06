import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  LayoutGrid,
  Store, 
  ShoppingBag, 
  Users, 
  Settings, 
  ChefHat,
  LogOut,
  Globe,
  ShieldCheck,
  History,
  ClipboardCheck,
  Wallet,
  Megaphone,
  Navigation,
  Headset,
  Star,
  Activity,
  Trophy,
  RotateCcw,
  FileText
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAdminAuth } from "../context/AdminAuthContext";

const NAV_ITEMS = [
  { group: "Platform", items: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Food Categories", icon: LayoutGrid, path: "/categories" },
    { label: "Vendors", icon: Store, path: "/vendors" },
    { label: "Orders", icon: ShoppingBag, path: "/orders" },
    { label: "User Base", icon: Users, path: "/users" },
  ]},
  { group: "Super Command", items: [
    { label: "System Setup", icon: Globe, path: "/super-admin/config" },
    { label: "Review Requests", icon: ClipboardCheck, path: "/super-admin/verify" },
    { label: "Treasury & Payouts", icon: Wallet, path: "/super-admin/financials" },
    { label: "Blog & CMS", icon: Megaphone, path: "/super-admin/cms" },
    { label: "Live Map", icon: Navigation, path: "/super-admin/map" },
    { label: "Support Desk", icon: Headset, path: "/super-admin/support" },
    { label: "Customer Reviews", icon: Star, path: "/super-admin/reviews" },
    { label: "Marketing", icon: Megaphone, path: "/super-admin/campaigns" },
    { label: "System Health", icon: Activity, path: "/super-admin/health" },
    { label: "Top Sellers", icon: Trophy, path: "/super-admin/leaderboards" },
    { label: "Refund Center", icon: RotateCcw, path: "/super-admin/refunds" },
    { label: "Download Data", icon: FileText, path: "/super-admin/reports" },
    { label: "Staff Access", icon: ShieldCheck, path: "/super-admin/staff" },
    { label: "Audit Logs", icon: History, path: "/super-admin/logs" },
  ]},
];

const Sidebar = () => {
  const { user, logout } = useAdminAuth();
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <aside className="w-72 glass-card border-r border-white/5 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-xl shadow-primary/20">
          <ChefHat size={28} />
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tighter leading-none text-white text-glow">FEAST</h1>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Command</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto">
        {NAV_ITEMS.filter((group) => group.group !== "Super Command" || isSuperAdmin).map((group) => (
          <div key={group.group} className="space-y-3">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-6 py-3.5 rounded-2xl text-[11px] font-black tracking-wide uppercase transition-all duration-500",
                    isActive 
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(249,115,22,0.15)] text-glow" 
                      : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
                  )}
                >
                  <item.icon size={18} strokeWidth={2.5} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Preferences</p>
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-6 py-3.5 rounded-2xl text-[11px] font-black tracking-wide uppercase transition-all duration-500",
              isActive 
                ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(249,115,22,0.15)] text-glow" 
                : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
            )}
          >
            <Settings size={18} strokeWidth={2.5} /> Settings
          </NavLink>
        </div>
      </nav>

    </aside>
  );
};

export default Sidebar;
