import React from "react";
import { 
  Map as MapIcon, 
  Navigation, 
  Search, 
  Layers, 
  Zap, 
  Activity, 
  MapPin, 
  Clock,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_ACTIVE_ORDERS = [
  { id: "ORD-921", from: "Lekki Phase 1", to: "Ikoyi", status: "En Route", eta: "8 mins", progress: 65 },
  { id: "ORD-925", from: "Ikeja GRA", to: "Maryland", status: "Picked Up", eta: "14 mins", progress: 20 },
  { id: "ORD-928", from: "Victoria Island", to: "Lekki 2", status: "Near Destination", eta: "2 mins", progress: 92 },
];

const OrderMap = () => {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Navigation className="text-primary" size={32} />
            Live Operations Map
          </h2>
          <p className="text-muted-foreground mt-1">Real-time geospatial visualization of platform delivery flows.</p>
        </div>
        <div className="flex gap-3">
           <button className="h-12 px-6 rounded-2xl bg-card border border-border text-foreground font-black text-sm flex items-center gap-2 hover:border-primary transition-all">
              <Layers size={18} /> Toggle Heatmap
           </button>
           <button className="h-12 px-6 rounded-2xl premium-gradient text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20">
              <Maximize2 size={18} /> Full Screen
           </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
        {/* Main Map Area */}
        <div className="lg:col-span-3 bg-card rounded-[3rem] border border-border relative overflow-hidden group shadow-2xl shadow-primary/5">
           {/* Abstract Map Background (SVG) */}
           <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100H800M0 200H800M0 300H800M0 400H800M0 500H800" stroke="#1e293b" strokeWidth="1" />
                <path d="M100 0V600M200 0V600M300 0V600M400 0V600M500 0V600M600 0V600M700 0V600" stroke="#1e293b" strokeWidth="1" />
                {/* Stylized Routes */}
                <path d="M150 150 L350 150 L350 450 L550 450" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="10 5" className="animate-[dash_20s_linear_infinite]" />
                <path d="M100 500 L600 100" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.3" />
              </svg>
           </div>

           {/* Active Pulsing Nodes */}
           <MapNode x="150" y="150" type="vendor" label="Mamma's Kitchen" />
           <MapNode x="350" y="450" type="delivery" label="Order #921" pulse />
           <MapNode x="550" y="450" type="customer" label="John D." />
           
           <MapNode x="600" y="150" type="vendor" label="Burger Boss" />
           <MapNode x="200" y="400" type="delivery" label="Order #925" pulse />

           {/* Map Controls */}
           <div className="absolute bottom-8 left-8 flex flex-col gap-2">
              <div className="bg-card/80 backdrop-blur-md border border-border p-4 rounded-2xl flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase text-white">Active Vendors</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    <span className="text-[10px] font-black uppercase text-white">In Transit</span>
                 </div>
              </div>
           </div>

           <div className="absolute top-8 right-8">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2 flex items-center gap-2">
                 <Zap size={14} className="text-primary animate-pulse" />
                 <span className="text-[10px] font-black text-primary uppercase">Live Sync: 0.2ms</span>
              </div>
           </div>
        </div>

        {/* Live Feed Sidebar */}
        <div className="bg-card rounded-[2.5rem] border border-border flex flex-col overflow-hidden shadow-sm">
           <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Telemetry Feed</h3>
              <Activity size={14} className="text-primary" />
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {MOCK_ACTIVE_ORDERS.map((order) => (
                <div key={order.id} className="p-5 rounded-3xl bg-muted/30 border border-border hover:border-primary/30 transition-all group cursor-pointer">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{order.id}</span>
                      <div className="flex items-center gap-1.5">
                         <Clock size={10} className="text-muted-foreground" />
                         <span className="text-[10px] font-bold text-white">{order.eta}</span>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                         <p className="text-xs font-bold text-white/80">{order.from}</p>
                      </div>
                      <div className="h-4 border-l border-dashed border-border ml-[2px]" />
                      <div className="flex items-center gap-3">
                         <MapPin size={12} className="text-primary" />
                         <p className="text-xs font-bold text-white">{order.to}</p>
                      </div>
                   </div>
                   <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground">
                         <span>Progress</span>
                         <span>{order.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${order.progress}%` }} />
                      </div>
                   </div>
                </div>
              ))}
           </div>
           <div className="p-6 border-t border-border">
              <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform">
                 Global Operations View
              </button>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}} />
    </div>
  );
};

const MapNode = ({ x, y, type, label, pulse }: any) => (
  <div 
    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group"
    style={{ left: `${x}px`, top: `${y}px` }}
  >
    <div className="relative">
      {pulse && (
        <div className="absolute inset-0 scale-[2.5] bg-primary/20 rounded-full animate-ping" />
      )}
      <div className={cn(
        "w-4 h-4 rounded-full border-2 border-card shadow-lg relative z-10 transition-transform group-hover:scale-125",
        type === "vendor" ? "bg-white" : type === "customer" ? "bg-primary" : "bg-primary shadow-[0_0_15px_rgba(249,115,22,0.5)]"
      )} />
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 rounded-lg">
      <p className="text-[9px] font-black text-white uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

export default OrderMap;
