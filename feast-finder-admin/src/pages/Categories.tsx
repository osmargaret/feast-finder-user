import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  X,
  Image as ImageIcon,
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";

const MOCK_CATEGORIES = [
  { id: 1, name: "Traditional Nigerian", dishCount: 45, status: "Visible", popularity: "High", icon: "🍲" },
  { id: 2, name: "Coastal Seafood", dishCount: 28, status: "Visible", popularity: "Medium", icon: "🦐" },
  { id: 3, name: "Quick Bites & Pastries", dishCount: 62, status: "Visible", popularity: "Very High", icon: "🥐" },
  { id: 4, name: "Health & Vegan", dishCount: 15, status: "Hidden", popularity: "Low", icon: "🥗" },
  { id: 5, name: "Continental Classics", dishCount: 34, status: "Visible", popularity: "High", icon: "🍝" },
];

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);

  return (
    <div className="space-y-10 animate-fade-up relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white text-glow flex items-center gap-4">
            <LayoutGrid className="text-primary" size={36} />
            Food Categories
          </h2>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Manage the different types of food available on the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-10 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={18} /> Add New Category
        </button>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CategoryStat title="Total Categories" value={categories.length} desc="Active on platform" color="text-primary" />
        <CategoryStat title="Total Food Items" value="184" desc="Across all categories" color="text-primary" />
        <CategoryStat title="Most Popular" value="Quick Bites" desc="By order volume" color="text-emerald-500" />
      </div>

      {/* Categories Table */}
      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
           <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Menu Type Registry</h3>
           <div className="flex gap-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                 <input type="text" placeholder="Search categories..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-primary w-64 text-white font-medium" />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01] text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-white/5">
                <th className="px-10 py-6">Category Info</th>
                <th className="px-10 py-6">Dish Count</th>
                <th className="px-10 py-6">Popularity</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                          {cat.icon}
                       </div>
                       <div>
                          <p className="text-sm font-black text-white">{cat.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold mt-0.5 uppercase tracking-widest">ID: FF-CAT-{cat.id}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-white">{cat.dishCount}</span>
                       <span className="text-[10px] text-muted-foreground font-bold uppercase">Dishes</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={cn(
                      "text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter",
                      cat.popularity === "Very High" ? "bg-primary/10 text-primary border border-primary/20" :
                      cat.popularity === "High" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                      "bg-white/5 text-muted-foreground border border-white/10"
                    )}>
                      {cat.popularity}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       {cat.status === "Visible" ? (
                         <>
                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">On App</span>
                         </>
                       ) : (
                         <>
                           <div className="w-2 h-2 rounded-full bg-white/20" />
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hidden</span>
                         </>
                       )}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all"><Edit3 size={16} /></button>
                       <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-destructive transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="fixed inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
           <div className="w-full max-w-xl glass-card rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative z-10">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white">
                       <Plus size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter">Add New Category</h3>
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">Create a new food type</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
                    <X size={20} />
                 </button>
              </div>

              <form className="p-10 space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Category Name</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Seafood Delights"
                         className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Display Icon</label>
                          <div className="relative group">
                             <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                             <input 
                               type="text" 
                               placeholder="e.g. 🦐"
                               className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white"
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Initial Status</label>
                          <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary/30 transition-all text-white appearance-none cursor-pointer">
                             <option className="bg-slate-900">Show on App</option>
                             <option className="bg-slate-900">Keep Hidden</option>
                          </select>
                       </div>
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
                      className="flex-[2] h-14 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                       Create Category
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const CategoryStat = ({ title, value, desc, color }: any) => (
  <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6 group hover:-translate-y-1 transition-all duration-500">
    <div className={cn("w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-2xl", color)}>
       <CheckCircle size={28} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-2xl font-black text-white mt-1 tracking-tighter">{value}</h3>
      <p className="text-[10px] text-muted-foreground font-medium mt-1">{desc}</p>
    </div>
  </div>
);

export default Categories;
