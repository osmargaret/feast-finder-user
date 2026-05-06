import React from "react";
import { 
   Trophy, 
   TrendingUp, 
   Search, 
   Filter, 
   Timer, 
   Star, 
   ShoppingBag, 
   ArrowUpRight,
   ArrowDownRight,
   Medal,
   Award,
   ChevronRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { cn } from "../../lib/utils";

const MOCK_TOP_VENDORS = [
  { id: 1, name: "The Spice Garden", sales: "₦842K", orders: 124, prepTime: "12m", rating: 4.9, growth: "+12%" },
  { id: 2, name: "Burger Boss", sales: "₦710K", orders: 98, prepTime: "15m", rating: 4.7, growth: "+8%" },
  { id: 3, name: "Mamma's Kitchen", sales: "₦640K", orders: 156, prepTime: "18m", rating: 4.8, growth: "+15%" },
  { id: 4, name: "Coastal Seafood", sales: "₦520K", orders: 42, prepTime: "24m", rating: 4.6, growth: "-2%" },
  { id: 5, name: "Sweet Bites", sales: "₦410K", orders: 86, prepTime: "10m", rating: 4.9, growth: "+22%" },
];

const Leaderboards = () => {
  return (
    <div className="space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white text-glow flex items-center gap-4">
            <Trophy className="text-primary" size={36} />
            Performance Leaderboards
          </h2>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Identify and optimize the platform's top-performing culinary partners.</p>
        </div>
        <div className="flex gap-4">
           <button className="h-12 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/[0.08] transition-all">
              Monthly Review
           </button>
           <button className="h-12 px-8 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
              Download Full Rankings
           </button>
        </div>
      </header>

      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SpotlightCard rank={1} name="The Spice Garden" metric="Top Revenue" value="₦842,000" icon={Award} color="text-primary" />
        <SpotlightCard rank={2} name="Mamma's Kitchen" metric="High Volume" value="156 Orders" icon={ShoppingBag} color="text-primary" />
        <SpotlightCard rank={3} name="Sweet Bites" metric="Fastest Prep" value="10.2 mins" icon={Timer} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sales Volume Distribution */}
        <div className="lg:col-span-2 glass-card glass-card-hover p-10 rounded-[3rem]">
           <h3 className="font-black text-lg tracking-tight uppercase text-white mb-10">Market Share (Top 5)</h3>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={MOCK_TOP_VENDORS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#fff', fontSize: 11, fontWeight: 900}} width={120} />
                    <Tooltip 
                       cursor={{fill: 'rgba(255,255,255,0.02)'}}
                       contentStyle={{backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)'}}
                       itemStyle={{color: '#fff', fontSize: '12px', fontWeight: '900'}}
                    />
                    <Bar dataKey="orders" radius={[0, 8, 8, 0]} barSize={32}>
                       {MOCK_TOP_VENDORS.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.1)'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Global Efficiency Stats */}
        <div className="glass-card glass-card-hover p-10 rounded-[3rem] space-y-10">
           <h3 className="font-black text-lg tracking-tight uppercase text-white">Efficiency Pulse</h3>
           <div className="space-y-8">
              <EfficiencyItem label="Avg. Prep Time" value="16.4m" trend="-2.1m" icon={Timer} color="text-primary" />
              <EfficiencyItem label="Acceptance Rate" value="98.2%" trend="+1.5%" icon={CheckCircle} color="text-emerald-500" />
              <EfficiencyItem label="Order Accuracy" value="94.5%" trend="+0.8%" icon={Star} color="text-primary" />
           </div>
           <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Platform Goal</p>
              <div className="mt-4 flex items-center justify-between">
                 <span className="text-xs font-bold text-white">Sub-15m Prep Time</span>
                 <span className="text-xs font-black text-primary">82% Achieved</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                 <div className="h-full bg-primary" style={{ width: '82%' }} />
              </div>
           </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
           <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Consolidated Performance Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01] text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-white/5">
                <th className="px-8 py-6">Vendor Partner</th>
                <th className="px-8 py-6 text-right">Revenue</th>
                <th className="px-8 py-6 text-right">Orders</th>
                <th className="px-8 py-6 text-right">Prep Time</th>
                <th className="px-8 py-6 text-right">Satisfaction</th>
                <th className="px-8 py-6 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_TOP_VENDORS.map((vendor, i) => (
                <tr key={vendor.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-black text-muted-foreground w-4">{i + 1}</span>
                       <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-primary">
                          <ChefHat size={18} />
                       </div>
                       <p className="text-sm font-black text-white">{vendor.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right text-xs font-black text-white">{vendor.sales}</td>
                  <td className="px-8 py-6 text-right text-xs font-bold text-muted-foreground">{vendor.orders}</td>
                  <td className="px-8 py-6 text-right text-xs font-bold text-white">{vendor.prepTime}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                       <Star size={12} className="text-primary fill-primary" />
                       <span className="text-xs font-black text-white">{vendor.rating}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={cn(
                      "text-[10px] font-black px-2 py-1 rounded-lg",
                      vendor.growth.startsWith('+') ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"
                    )}>{vendor.growth}</span>
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

const SpotlightCard = ({ rank, name, metric, value, icon: Icon, color }: any) => (
  <div className="glass-card glass-card-hover p-10 pt-14 rounded-[3rem] relative overflow-visible group mt-6">
    {/* Large Background Icon */}
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={120} strokeWidth={4} />
    </div>

    {/* Overlapping Icon Box */}
    <div className={cn(
      "absolute -top-6 -left-4 w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-2xl z-20 group-hover:scale-110 transition-transform duration-500",
      color
    )}>
       <Icon size={32} strokeWidth={2.5} />
    </div>

    {/* Floating Rank Badge */}
    <div className="absolute -top-3 right-6 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] shadow-xl z-20 shadow-primary/20">
       Rank #{rank}
    </div>

    <div className="relative z-10 mt-2">
       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{metric}</p>
       <h4 className="text-2xl font-black text-white mt-1 tracking-tighter text-glow">{name}</h4>
       <div className="mt-4 flex items-center gap-2">
          <p className="text-sm font-black text-white">{value}</p>
          <ArrowUpRight size={14} className="text-emerald-500" />
       </div>
    </div>
  </div>
);

const EfficiencyItem = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="flex items-center justify-between group">
     <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center", color)}>
           <Icon size={20} />
        </div>
        <div>
           <p className="text-[11px] font-black text-white uppercase tracking-wider">{label}</p>
           <p className="text-xs font-bold text-muted-foreground mt-0.5">{trend} this month</p>
        </div>
     </div>
     <span className="text-lg font-black text-white text-glow">{value}</span>
  </div>
);

const CheckCircle = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Leaderboards;
