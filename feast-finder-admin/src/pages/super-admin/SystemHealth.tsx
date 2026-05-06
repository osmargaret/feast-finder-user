import React from "react";
import { 
  Activity, 
  Server, 
  Database, 
  Globe, 
  CreditCard, 
  Cpu, 
  Zap, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  Terminal,
  Clock
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "../../lib/utils";

const MOCK_LATENCY = [
  { time: "12:00", value: 42 },
  { time: "12:05", value: 45 },
  { time: "12:10", value: 120 },
  { time: "12:15", value: 38 },
  { time: "12:20", value: 41 },
  { time: "12:25", value: 44 },
  { time: "12:30", value: 39 },
];

const SystemHealth = () => {
  return (
    <div className="space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white text-glow flex items-center gap-4">
            <Activity className="text-primary" size={36} />
            System Intelligence
          </h2>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Real-time telemetry and health monitoring for core infrastructure.</p>
        </div>
        <button className="h-12 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/[0.08] transition-all flex items-center gap-2">
           <RefreshCw size={16} className="animate-spin-slow" /> Force Health Sync
        </button>
      </header>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ServiceCard name="API Nodes" status="Operational" latency="42ms" icon={Server} color="text-emerald-500" />
        <ServiceCard name="DB Cluster" status="Operational" latency="12ms" icon={Database} color="text-emerald-500" />
        <ServiceCard name="Auth Service" status="Operational" latency="85ms" icon={Zap} color="text-emerald-500" />
        <ServiceCard name="Payment Gateway" status="Degraded" latency="1.2s" icon={CreditCard} color="text-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Latency Chart */}
        <div className="lg:col-span-2 glass-card glass-card-hover p-10 rounded-[3rem]">
           <div className="flex items-center justify-between mb-10">
              <h3 className="font-black text-lg tracking-tight uppercase text-white flex items-center gap-3">
                 <Terminal size={20} className="text-primary" /> API Latency (Global)
              </h3>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Telemetry</span>
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOCK_LATENCY}>
                    <defs>
                       <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                    <Tooltip 
                       contentStyle={{backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)'}}
                       itemStyle={{color: '#fff', fontSize: '12px', fontWeight: '900'}}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorLatency)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Resources & Load */}
        <div className="glass-card glass-card-hover p-10 rounded-[3rem] space-y-10">
           <h3 className="font-black text-lg tracking-tight uppercase text-white">Cluster Load</h3>
           <div className="space-y-8">
              <LoadItem label="CPU Usage" value={42} color="bg-primary" />
              <LoadItem label="Memory" value={68} color="bg-primary" />
              <LoadItem label="Storage" value={15} color="bg-emerald-500" />
              <LoadItem label="Active WebSocket" value={84} color="bg-purple-500" />
           </div>
           <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                 <AlertCircle size={18} className="text-amber-500" />
                 <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Active Warning</p>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Paystack API is reporting intermittent timeouts.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ name, status, latency, icon: Icon, color }: any) => (
  <div className="glass-card glass-card-hover p-8 rounded-[2.5rem] relative overflow-hidden group">
    <div className="flex items-center justify-between relative z-10">
       <div className={cn("w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5", color)}>
          <Icon size={28} strokeWidth={2.5} />
       </div>
       <div className={cn(
         "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
         status === "Operational" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
       )}>
          {status}
       </div>
    </div>
    <div className="mt-8 relative z-10">
       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{name}</p>
       <div className="flex items-center justify-between mt-2">
          <h4 className="text-2xl font-black text-white tracking-tighter text-glow">{latency}</h4>
          <Activity size={16} className="text-white/20 group-hover:text-primary transition-colors" />
       </div>
    </div>
  </div>
);

const LoadItem = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-black text-white uppercase tracking-wider">{label}</span>
      <span className="text-xs font-black text-white/60">{value}%</span>
    </div>
    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
      <div 
        className={cn("h-full transition-all duration-1000 rounded-full", color)} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);

export default SystemHealth;
