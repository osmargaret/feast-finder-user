import React, { useState } from "react";
import { 
   Store, 
   Search, 
   Plus, 
   Filter, 
   Star, 
   CheckCircle, 
   XCircle,
   MoreHorizontal,
   ChevronRight,
   Globe,
   X,
   ChefHat
} from "lucide-react";
import { cn } from "../lib/utils";

const MOCK_VENDORS = [
  { id: 1, name: "Mamma's Kitchen", owner: "Fatima Yusuf", location: "Lekki, Lagos", rating: 4.8, status: "Verified", type: "Home Kitchen", sales: "₦840K" },
  { id: 2, name: "Burger Boss", owner: "David Chen", location: "Ikeja, Lagos", rating: 4.5, status: "Verified", type: "Restaurant", sales: "₦1.2M" },
  { id: 3, name: "The Grill Hub", owner: "Sarah Ahmed", location: "Victoria Island, Lagos", rating: 4.2, status: "Pending", type: "Food Truck", sales: "₦0" },
  { id: 4, name: "Sweet Bites", owner: "Ngozi Obi", location: "Surulere, Lagos", rating: 4.9, status: "Verified", type: "Bakery", sales: "₦520K" },
  { id: 5, name: "Spice Route", owner: "Raj Patel", location: "Yaba, Lagos", rating: 3.8, status: "Flagged", type: "Ghost Kitchen", sales: "₦210K" },
];

const Vendors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Vendor Management</h2>
          <p className="text-muted-foreground mt-1">Onboard, verify, and moderate food businesses on the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-8 rounded-2xl premium-gradient text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={18} /> Add New Partner
        </button>
      </header>

      {/* New Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
           <div className="w-full max-w-xl glass-card rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative z-10">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white">
                       <Store size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter">Onboard Partner</h3>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">Register a new food business</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
                    <X size={20} />
                 </button>
              </div>

              <form className="p-10 space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Business Name</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Lagos Pepper House"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Owner Name</label>
                          <input 
                            type="text" 
                            placeholder="Full Name"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Business Type</label>
                          <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white appearance-none cursor-pointer">
                             <option className="bg-slate-900">Home Kitchen</option>
                             <option className="bg-slate-900">Restaurant</option>
                             <option className="bg-slate-900">Food Truck</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Primary Location</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Lekki, Lagos"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-14 rounded-2xl bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] h-14 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                       Onboard Partner <CheckCircle size={18} />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, owner, or location..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm appearance-none outline-none focus:ring-1 focus:ring-primary cursor-pointer">
            <option>All Status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Flagged</option>
          </select>
        </div>
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm appearance-none outline-none focus:ring-1 focus:ring-primary cursor-pointer">
            <option>All Locations</option>
            <option>Lekki</option>
            <option>Ikeja</option>
            <option>Surulere</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-border">
                <th className="px-8 py-5">Business Name</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5">Performance</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Total Revenue</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_VENDORS.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary border border-border">
                        <ChefHat size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-none">{vendor.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5">{vendor.type} • {vendor.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-medium text-white">{vendor.location}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5">
                      <Star size={12} className="text-primary fill-primary" />
                      <span className="text-xs font-black">{vendor.rating}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">Avg Rating</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                      vendor.status === "Verified" ? "bg-emerald-500/10 text-emerald-500" :
                      vendor.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                      "bg-destructive/10 text-destructive"
                    )}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-white">
                    {vendor.sales}
                  </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => alert(`Viewing vendor details for ${vendor.name}`)}
                          className="p-2 rounded-xl hover:bg-primary/20 text-primary transition-all"
                        >
                          <Search size={18} />
                        </button>
                        <button 
                          onClick={() => alert(`Editing vendor ${vendor.name}`)}
                          className="p-2 rounded-xl hover:bg-primary/20 text-primary transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
                              alert(`${vendor.name} has been deleted`);
                            }
                          }}
                          className="p-2 rounded-xl hover:bg-destructive/20 text-destructive transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">Showing 5 of 128 registered vendors</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground">Previous</button>
            <button className="px-4 py-2 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground">Next</button>
          </div>
        </div>
       </div>
     </div>
   );
};

export default Vendors;
