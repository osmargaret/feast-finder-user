import React, { useState } from "react";
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  MessageSquare,
  ChevronRight,
  Clock,
  Shield
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_PENDING_VENDORS = [
  { 
    id: "KYC-001", 
    name: "The Spice Garden", 
    owner: "Ahmed Musa", 
    type: "Restaurant", 
    appliedDate: "2h ago", 
    risk: "Low",
    docs: ["Identity", "Health Certificate", "Utility Bill"],
    status: "Reviewing"
  },
  { 
    id: "KYC-002", 
    name: "Aunty B's Jollof", 
    owner: "Blessing Okoro", 
    type: "Home Kitchen", 
    appliedDate: "5h ago", 
    risk: "Medium",
    docs: ["Identity", "Health Certificate"],
    status: "Pending Documents"
  },
  { 
    id: "KYC-003", 
    name: "Steak House VI", 
    owner: "John Wick", 
    type: "Restaurant", 
    appliedDate: "1 day ago", 
    risk: "Low",
    docs: ["Identity", "Health Certificate", "Utility Bill", "CofO"],
    status: "Urgent Review"
  },
];

const VendorVerification = () => {
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <ClipboardCheck className="text-primary" size={32} />
            Compliance & Verification
          </h2>
          <p className="text-muted-foreground mt-1">Audit and verify vendor credentials before platform onboarding.</p>
        </div>
        <div className="flex gap-3 bg-muted/30 px-6 py-3 rounded-2xl border border-border">
          <Clock size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">SLA Status</p>
            <p className="text-xs font-bold text-white">98.2% Reviewed within 24h</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side: Pending List */}
        <div className="xl:col-span-2 space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Search by business name or ID..."
                className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="h-[52px] px-6 rounded-2xl bg-card border border-border text-xs font-bold flex items-center gap-2 hover:border-primary transition-all">
              <Filter size={16} /> All Risks
            </button>
          </div>

          {/* Pending List Cards */}
          <div className="space-y-4">
            {MOCK_PENDING_VENDORS.map((vendor) => (
              <div 
                key={vendor.id}
                onClick={() => setSelectedVendor(vendor)}
                className={cn(
                  "bg-card p-6 rounded-[2rem] border border-border flex items-center justify-between hover:border-primary/50 cursor-pointer transition-all group",
                  selectedVendor?.id === vendor.id && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border",
                    vendor.risk === "Low" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                  )}>
                    <Shield size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{vendor.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1.5 uppercase font-bold tracking-widest">
                      {vendor.id} • {vendor.owner}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                    <p className="text-xs font-bold text-white mt-0.5">{vendor.status}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Documents</p>
                    <p className="text-xs font-bold text-primary mt-0.5">{vendor.docs.length} Provided</p>
                  </div>
                  <ChevronRight className={cn(
                    "text-muted-foreground group-hover:text-primary transition-all",
                    selectedVendor?.id === vendor.id && "rotate-90 text-primary"
                  )} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Verification Panel */}
        <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm h-fit sticky top-8">
          {selectedVendor ? (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-lg tracking-tight uppercase">Audit Panel</h3>
                <span className="px-2 py-1 rounded bg-primary/10 text-[9px] font-black text-primary uppercase">Step 2 of 3</span>
              </div>

              {/* Vendor Info Header */}
              <div className="p-6 rounded-3xl bg-muted/30 border border-border">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Business Identity</p>
                <h4 className="text-xl font-black text-white">{selectedVendor.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{selectedVendor.type} • Since 2024</p>
              </div>

              {/* Document Checklist */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Required Documents</p>
                {selectedVendor.docs.map((doc: string, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border group hover:bg-muted/40 transition-all">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-muted-foreground" />
                      <span className="text-xs font-bold text-white">{doc}</span>
                    </div>
                    <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Decision */}
              <div className="pt-6 space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Final Decision</p>
                <div className="grid grid-cols-2 gap-3">
                   <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">
                      <CheckCircle size={16} /> Approve
                   </button>
                   <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-destructive text-white font-black text-xs hover:bg-destructive/60 transition-all shadow-lg shadow-destructive/10">
                      <XCircle size={16} /> Reject
                   </button>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-muted text-foreground font-black text-xs hover:bg-muted/80 transition-all border border-border">
                   <MessageSquare size={16} /> Request Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground">
                <AlertTriangle size={40} />
              </div>
              <div>
                <p className="text-sm font-black text-white">No Vendor Selected</p>
                <p className="text-xs text-muted-foreground max-w-[200px] mt-2">Select a pending vendor from the list to start the compliance audit.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorVerification;
