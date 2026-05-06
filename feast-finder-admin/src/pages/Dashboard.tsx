import React from "react";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  Clock,
  MoreVertical,
  ChevronRight,
  Globe,
  ShieldCheck
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import { cn } from "../lib/utils";
import { useAdminAuth } from "../context/AdminAuthContext";

const MOCK_CHART_DATA = [
  { name: "Mon", revenue: 4500, orders: 120 },
  { name: "Tue", revenue: 5200, orders: 145 },
  { name: "Wed", revenue: 4800, orders: 130 },
  { name: "Thu", revenue: 6100, orders: 170 },
  { name: "Fri", revenue: 7500, orders: 210 },
  { name: "Sat", revenue: 8200, orders: 250 },
  { name: "Sun", revenue: 7800, orders: 230 },
];

const RECENT_ORDERS = [
  { id: "ORD-9281", customer: "John Doe", kitchen: "Mamma's Kitchen", amount: "₦12,500", status: "Delivered", time: "2 mins ago" },
  { id: "ORD-9282", customer: "Sarah Smith", kitchen: "Burger Boss", amount: "₦4,200", status: "Preparing", time: "5 mins ago" },
  { id: "ORD-9283", customer: "Mike Ross", kitchen: "The Grill Hub", amount: "₦8,900", status: "On the way", time: "12 mins ago" },
  { id: "ORD-9284", customer: "Jane Doe", kitchen: "Sushi Spot", amount: "₦15,000", status: "Pending", time: "15 mins ago" },
];

const Dashboard = () => {
  const { user } = useAdminAuth();
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-black tracking-tight text-white">
              {isSuperAdmin ? "Global Command" : "Regional Command"}
            </h2>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              isSuperAdmin ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </div>
          <p className="text-muted-foreground">
            {isSuperAdmin 
              ? "Global platform health, cross-regional financials, and system-wide security monitoring." 
              : "Real-time health and performance metrics for your assigned region."}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-2xl border border-border">
          <Clock size={16} className="text-primary" />
          <span className="text-xs font-bold tabular-nums">June 14, 2024 • 12:45 PM</span>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₦4.2M" trend="+12.5%" icon={DollarSign} color="text-emerald-500" />
        <StatCard title="Active Orders" value="1,240" trend="+8.2%" icon={ShoppingBag} color="text-primary" />
        <StatCard title="New Customers" value="452" trend="+15.1%" icon={Users} color="text-primary" />
        <StatCard title="Success Rate" value="98.4%" trend="+0.5%" icon={TrendingUp} color="text-purple-500" />
      </div>

      {/* Super Admin Metrics */}
      {isSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card/50 p-6 rounded-3xl border border-primary/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Regions</p>
              <h4 className="text-xl font-black">12 Countries</h4>
            </div>
          </div>
          <div className="bg-card/50 p-6 rounded-3xl border border-primary/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Health</p>
              <h4 className="text-xl font-black text-emerald-500">Optimum</h4>
            </div>
          </div>
          <div className="bg-card/50 p-6 rounded-3xl border border-primary/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg. Commission</p>
              <h4 className="text-xl font-black">14.2%</h4>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-lg tracking-tight uppercase">Revenue Performance</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold">7 Days</button>
              <button className="px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground text-xs font-bold hover:text-foreground">30 Days</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}}
                  itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm flex flex-col">
          <h3 className="font-black text-lg tracking-tight uppercase mb-6 flex items-center justify-between">
            Live Feed
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h3>
          <div className="space-y-6 flex-1">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <ShoppingBag size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white truncate">{order.customer}</p>
                    <span className="text-[10px] font-medium text-muted-foreground">{order.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.kitchen} • {order.amount}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter",
                      order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" :
                      order.status === "Preparing" ? "bg-primary/10 text-primary" :
                      order.status === "On the way" ? "bg-purple-500/10 text-purple-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-2xl bg-muted hover:bg-muted/80 text-xs font-bold transition-all">
            View All Activity <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, icon: Icon, delay }: any) => (
  <div className={cn(
    "glass-card glass-card-hover p-10 pt-14 rounded-[2.5rem] flex flex-col gap-4 relative overflow-visible group opacity-0 animate-fade-up mt-6",
    delay
  )}>
    {/* Overlapping Icon Box */}
    <div className="absolute -top-6 -left-4 w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-primary border border-white/10 shadow-2xl z-20 group-hover:scale-110 transition-transform duration-500">
      <Icon size={32} strokeWidth={2.5} />
    </div>

    {/* Floating Trend Badge */}
    <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-tighter border border-emerald-500/20 shadow-lg z-20 backdrop-blur-md">
      {trend}
    </div>

    <div className="relative z-10">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-3xl font-black text-white mt-2 tracking-tighter text-glow">{value}</h3>
    </div>
    
    {/* Decorative Glow */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
  </div>
);

export default Dashboard;
