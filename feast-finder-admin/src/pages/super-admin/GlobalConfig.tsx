import React from "react";
import { 
  Settings, 
  Globe, 
  Wallet, 
  ShieldCheck, 
  CheckCircle,
  Save, 
  RefreshCw,
  Bell,
  Cpu
} from "lucide-react";
import { cn } from "../../lib/utils";

const GlobalConfig = () => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "success">("idle");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Settings className="text-primary" size={32} />
            Global Configurations
          </h2>
          <p className="text-muted-foreground mt-1">Control platform-wide business rules, financial parameters, and system behaviors.</p>
        </div>
        <div className="flex gap-3">
           <button className="h-12 px-6 rounded-2xl bg-muted text-muted-foreground font-black text-sm flex items-center gap-2 border border-border hover:bg-muted/80 transition-all">
              <RefreshCw size={18} /> Reset Defaults
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className={cn(
               "h-12 px-8 rounded-2xl text-white font-black text-sm flex items-center gap-2 shadow-xl transition-all",
               saveStatus === "success" ? "bg-emerald-500 shadow-emerald-500/20" : "premium-gradient shadow-primary/20 hover:scale-[1.02]"
             )}
           >
              {isSaving ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : saveStatus === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Saving..." : saveStatus === "success" ? "Changes Applied" : "Save Changes"}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Marketplace Fees */}
        <ConfigSection 
          title="Financial & Commission" 
          icon={Wallet}
          items={[
            { label: "Standard Commission (%)", value: "12.5", type: "number", desc: "Base percentage taken from each order." },
            { label: "Delivery Fee Flat Rate (₦)", value: "850", type: "number", desc: "Standard delivery charge across the platform." },
            { label: "Min. Payout Threshold (₦)", value: "50,000", type: "text", desc: "Minimum balance required for vendor withdrawals." },
          ]}
        />

        {/* System Rules */}
        <ConfigSection 
          title="Platform Behavior" 
          icon={Cpu}
          items={[
            { label: "Auto-Accept Orders", value: "Enabled", type: "toggle", desc: "Automatically transition orders from pending to preparing." },
            { label: "Max Delivery Radius (km)", value: "15", type: "number", desc: "Maximum distance between vendor and customer." },
            { label: "Kitchen Verification", value: "Strict", type: "select", desc: "Level of document verification required for kitchens." },
          ]}
        />

        {/* Global Notifications */}
        <ConfigSection 
          title="System Notifications" 
          icon={Bell}
          items={[
            { label: "Critical System Alerts", value: "Push + Email", type: "text", desc: "Method for notifying admins of system-level issues." },
            { label: "Vendor Daily Summary", value: "08:00 AM", type: "time", desc: "Time to send automated performance reports to kitchens." },
          ]}
        />

        {/* Regional Settings */}
        <ConfigSection 
          title="Regional & Localization" 
          icon={Globe}
          items={[
            { label: "Primary Currency", value: "NGN (₦)", type: "text", desc: "Base currency for all platform transactions." },
            { label: "Timezone", value: "Africa/Lagos (GMT+1)", type: "text", desc: "Standard time for order scheduling and logs." },
          ]}
        />
      </div>
    </div>
  );
};

const ConfigSection = ({ title, icon: Icon, items }: any) => (
  <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm flex flex-col gap-6 group hover:border-primary/30 transition-all">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary">
        <Icon size={20} />
      </div>
      <h3 className="font-black text-sm uppercase tracking-[0.2em] text-white">{title}</h3>
    </div>
    
    <div className="space-y-6">
      {items.map((item: any, i: number) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white/80">{item.label}</label>
            <ConfigInput type={item.type} value={item.value} />
          </div>
          <p className="text-[10px] text-muted-foreground">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const ConfigInput = ({ type, value }: any) => {
  if (type === "toggle") {
    return (
      <button className="w-10 h-5 rounded-full bg-primary relative transition-all">
        <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
      </button>
    );
  }
  return (
    <input 
      type={type === "number" ? "number" : "text"}
      defaultValue={value}
      className="bg-muted border border-border rounded-lg px-3 py-1.5 text-[11px] font-black text-primary text-right outline-none focus:border-primary w-24"
    />
  );
};

export default GlobalConfig;
