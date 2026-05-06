import React from "react";
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Search, 
  Filter, 
  CreditCard, 
  CheckCircle, 
  Clock,
  DollarSign,
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
  LineChart,
  Line
} from "recharts";
import { cn } from "../../lib/utils";

const MOCK_REVENUE_DATA = [
  { name: "Mon", revenue: 120000 },
  { name: "Tue", revenue: 145000 },
  { name: "Wed", revenue: 130000 },
  { name: "Thu", revenue: 170000 },
  { name: "Fri", revenue: 210000 },
  { name: "Sat", revenue: 250000 },
  { name: "Sun", revenue: 230000 },
];

const MOCK_PAYOUTS = [
  { id: "PAY-001", vendor: "Mamma's Kitchen", amount: "₦84,200", status: "Pending", date: "Today", method: "Bank Transfer" },
  { id: "PAY-002", vendor: "Burger Boss", amount: "₦120,000", status: "Processing", date: "Today", method: "Paystack" },
  { id: "PAY-003", vendor: "The Grill Hub", amount: "₦45,000", status: "Completed", date: "Yesterday", method: "Bank Transfer" },
  { id: "PAY-004", vendor: "Sweet Bites", amount: "₦32,500", status: "Completed", date: "Yesterday", method: "Bank Transfer" },
];

const Financials = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Wallet className="text-primary" size={32} />
            Treasury & Payouts
          </h2>
          <p className="text-muted-foreground mt-1">Manage global platform revenue, commissions, and vendor settlements.</p>
        </div>
        <div className="flex gap-3">
           <button className="h-12 px-6 rounded-2xl bg-muted text-foreground font-black text-sm flex items-center gap-2 border border-border hover:bg-muted/80 transition-all">
              <Download size={18} /> Financial Report
           </button>
           <button className="h-12 px-8 rounded-2xl premium-gradient text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              <CheckCircle size={18} /> Bulk Approve Payouts
           </button>
        </div>
      </header>

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceCard title="Gross Volume (24h)" value="₦1.24M" trend="+12%" isUp={true} />
        <FinanceCard title="Platform Earnings" value="₦155K" trend="+8%" isUp={true} />
        <FinanceCard title="Pending Payouts" value="₦420K" trend="-5%" isUp={false} />
        <FinanceCard title="Avg. Order Value" value="₦8.4K" trend="+2%" isUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-lg tracking-tight uppercase">Platform Yield</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Daily</button>
              <button className="px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground text-xs font-bold hover:text-foreground">Weekly</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}}
                  itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--primary))" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Payout Actions */}
        <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm flex flex-col">
          <h3 className="font-black text-lg tracking-tight uppercase mb-6">Vendor Balances</h3>
          <div className="space-y-6 flex-1">
             <VendorBalanceItem name="Mamma's Kitchen" balance="₦42,000" threshold={0.8} />
             <VendorBalanceItem name="Burger Boss" balance="₦12,500" threshold={0.2} />
             <VendorBalanceItem name="The Grill Hub" balance="₦65,000" threshold={1.0} />
             <VendorBalanceItem name="Sweet Bites" balance="₦28,900" threshold={0.5} />
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-muted text-xs font-black uppercase tracking-widest hover:bg-muted/80 transition-all">
            Process All Due Payouts
          </button>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden">
        <div className="p-8 border-b border-border flex items-center justify-between">
           <h3 className="font-black text-sm uppercase tracking-[0.2em] text-white">Settlement Ledger</h3>
           <div className="flex gap-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                 <input type="text" placeholder="Search payout ID..." className="bg-muted border border-border rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-primary w-48" />
              </div>
              <button className="p-2 rounded-xl bg-muted border border-border text-muted-foreground"><Filter size={16} /></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-muted/30 font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="px-8 py-4">Payout ID</th>
                <th className="px-8 py-4">Vendor Partner</th>
                <th className="px-8 py-4">Settlement Amount</th>
                <th className="px-8 py-4">Payment Method</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_PAYOUTS.map((payout) => (
                <tr key={payout.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-8 py-5 font-bold text-white">{payout.id}</td>
                  <td className="px-8 py-5 font-bold text-white/80">{payout.vendor}</td>
                  <td className="px-8 py-5 font-black text-primary">{payout.amount}</td>
                  <td className="px-8 py-5 text-muted-foreground flex items-center gap-2">
                    <CreditCard size={14} /> {payout.method}
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter inline-flex items-center gap-1.5",
                      payout.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" :
                      payout.status === "Processing" ? "bg-primary/10 text-primary" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                      <ChevronRight size={16} />
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

const FinanceCard = ({ title, value, trend, isUp }: any) => (
  <div className="bg-card p-8 rounded-[2.5rem] border border-border group hover:border-primary/50 transition-all">
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{title}</p>
    <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
    <div className="mt-4 flex items-center gap-2">
      <div className={cn(
        "px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1",
        isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
      )}>
        {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">vs last 24h</span>
    </div>
  </div>
);

const VendorBalanceItem = ({ name, balance, threshold }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-white">{name}</span>
      <span className="text-xs font-black text-primary">{balance}</span>
    </div>
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <div 
        className={cn(
          "h-full transition-all duration-1000",
          threshold >= 1.0 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-primary"
        )} 
        style={{ width: `${threshold * 100}%` }} 
      />
    </div>
    {threshold >= 1.0 && (
       <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Payout Due</p>
    )}
  </div>
);

export default Financials;
