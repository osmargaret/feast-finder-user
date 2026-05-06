import React from "react";
import { 
  RotateCcw, 
  Search, 
  Filter, 
  ArrowDownLeft, 
  CreditCard, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  DollarSign
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_REFUNDS = [
  { id: "REF-9021", orderId: "ORD-821", customer: "Alice Brown", amount: "₦8,400", reason: "Order Not Received", status: "Processed", date: "2h ago" },
  { id: "REF-9022", orderId: "ORD-825", customer: "Bob Wilson", amount: "₦12,500", reason: "Food Quality Issue", status: "Pending Approval", date: "5h ago" },
  { id: "REF-9023", orderId: "ORD-828", customer: "John Doe", amount: "₦4,200", reason: "Driver Cancellation", status: "Under Review", date: "1 day ago" },
  { id: "REF-9024", orderId: "ORD-830", customer: "Sarah Smith", amount: "₦6,800", reason: "Duplicate Charge", status: "Processed", date: "2 days ago" },
];

const Refunds = () => {
  return (
    <div className="space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white text-glow flex items-center gap-4">
            <RotateCcw className="text-primary" size={36} />
            Refund & Reversal Ledger
          </h2>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Manage and audit all platform financial reversals and customer credits.</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right hidden md:block px-6 py-2 bg-white/[0.03] rounded-2xl border border-white/5">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">MTD Reversals</p>
              <p className="text-sm font-black text-white mt-1">₦142,500</p>
           </div>
        </div>
      </header>

      {/* Refund Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20">
              <ArrowDownLeft size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pending Approvals</p>
              <h3 className="text-2xl font-black text-white">₦12,500</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">1 Request requires action</p>
           </div>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <CheckCircle size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Processed (24h)</p>
              <h3 className="text-2xl font-black text-white">₦42,800</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">8 Reversals completed</p>
           </div>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Clock size={32} />
           </div>
           <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avg. Cycle Time</p>
              <h3 className="text-2xl font-black text-white">4.2h</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">Request to completion</p>
           </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
           <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Transaction Reversal Audit</h3>
           <div className="flex gap-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                 <input type="text" placeholder="Search Ref ID..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-primary w-48 text-white" />
              </div>
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all"><Filter size={16} /></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01] text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-white/5">
                <th className="px-8 py-6">Refund ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Reason</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_REFUNDS.map((ref) => (
                <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-white">{ref.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center text-[10px] font-black text-primary border border-white/5">
                          {ref.customer.charAt(0)}
                       </div>
                       <span className="text-xs font-bold text-white/80">{ref.customer}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-muted-foreground">{ref.orderId}</td>
                  <td className="px-8 py-6 text-xs font-black text-primary">{ref.amount}</td>
                  <td className="px-8 py-6">
                    <span className="text-xs text-muted-foreground italic">"{ref.reason}"</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter inline-flex items-center gap-1.5",
                      ref.status === "Processed" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                      ref.status === "Pending Approval" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-primary/10 text-primary border border-primary/20"
                    )}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="h-10 px-4 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase text-primary transition-all">
                       View Receipt
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

export default Refunds;
