import React from "react";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Globe, 
  Palette, 
  Database,
  Lock,
  ChevronRight
} from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-4xl">
      <header>
        <h2 className="text-3xl font-black tracking-tight text-white">System Settings</h2>
        <p className="text-muted-foreground mt-1">Configure platform-wide parameters, security protocols, and visual themes.</p>
      </header>

      <div className="space-y-4">
        <SettingGroup 
          title="Platform Configuration"
          items={[
            { icon: Globe, label: "Regional Settings", desc: "Manage delivery areas and currency support.", status: "8 Areas Active" },
            { icon: Database, label: "API & Webhooks", desc: "Configure endpoints for external service integrations.", status: "Operational" },
          ]}
        />
        <SettingGroup 
          title="Security & Access"
          items={[
            { icon: Lock, label: "Admin Permissions", desc: "Define role-based access control levels.", status: "Level 4 Active" },
            { icon: Shield, label: "KYC Protocols", desc: "Adjust vendor verification requirements.", status: "Strict Mode" },
          ]}
        />
        <SettingGroup 
          title="Notifications & Alerts"
          items={[
            { icon: Bell, label: "System Notifications", desc: "Configure global alert channels and triggers.", status: "Email/Push Enabled" },
          ]}
        />
        <SettingGroup 
          title="Appearance"
          items={[
            { icon: Palette, label: "Brand Identity", desc: "Update logos, primary colors, and dashboard themes.", status: "Feast Gold" },
          ]}
        />
      </div>
    </div>
  );
};

const SettingGroup = ({ title, items }: any) => (
  <div className="space-y-3">
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-6">{title}</p>
    <div className="bg-card rounded-[2rem] border border-border overflow-hidden">
      {items.map((item: any, i: number) => (
        <button 
          key={i} 
          className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-all border-b border-border last:border-0 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <item.icon size={22} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.status}</span>
             <ChevronRight size={18} className="text-muted-foreground" />
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default Settings;
