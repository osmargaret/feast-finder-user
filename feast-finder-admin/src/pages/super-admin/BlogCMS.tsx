import React from "react";
import { 
  FileEdit, 
  Plus, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Calendar, 
  Eye, 
  MoreVertical,
  CheckCircle,
  Clock,
  Tag,
  ArrowUpRight,
  Megaphone
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_CONTENT = [
  { id: 1, title: "Top 10 Home Kitchens in Lagos for 2024", type: "Blog", status: "Published", author: "Margaret Samuel", date: "June 12", views: "12.4K" },
  { id: 2, title: "Summer Feast: 20% Off All Seafood Orders", type: "Promo", status: "Active", author: "Clement Mark", date: "June 14", views: "45.2K" },
  { id: 3, title: "The Rise of Ghost Kitchens in Surulere", type: "Blog", status: "Draft", author: "Sarah Jenkins", date: "Pending", views: "0" },
  { id: 4, title: "Weekend Brunch Flash Sale", type: "Promo", status: "Scheduled", author: "Admin", date: "June 18", views: "0" },
];

const BlogCMS = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Megaphone className="text-primary" size={32} />
            Global Content & Promos
          </h2>
          <p className="text-muted-foreground mt-1">Manage platform-wide communication, blog posts, and marketing banners.</p>
        </div>
        <div className="flex gap-3">
           <button className="h-12 px-6 rounded-2xl bg-muted text-foreground font-black text-sm flex items-center gap-2 border border-border hover:bg-muted/80 transition-all">
              <Plus size={18} /> New Promo Banner
           </button>
           <button className="h-12 px-8 rounded-2xl premium-gradient text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              <FileEdit size={18} /> Create Blog Post
           </button>
        </div>
      </header>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContentStatCard title="Active Promos" value="4" desc="2 Ending this week" icon={Tag} color="text-primary" />
        <ContentStatCard title="Monthly Views" value="128K" desc="+15% from last month" icon={Eye} color="text-emerald-500" />
        <ContentStatCard title="Scheduled Posts" value="12" desc="Next: June 18, 08:00 AM" icon={Calendar} color="text-primary" />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search content by title, author, or tag..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-4">
           <button className="h-[52px] px-6 rounded-2xl bg-card border border-border text-xs font-bold flex items-center gap-2 hover:border-primary transition-all">
              <Filter size={16} /> Content Type
           </button>
           <button className="h-[52px] px-6 rounded-2xl bg-card border border-border text-xs font-bold flex items-center gap-2 hover:border-primary transition-all">
              <Clock size={16} /> Status
           </button>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-border">
                <th className="px-8 py-5">Content Title</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Author</th>
                <th className="px-8 py-5">Engagement</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_CONTENT.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors overflow-hidden border border-border">
                         <ImageIcon size={20} />
                      </div>
                      <div className="max-w-[300px]">
                        <p className="text-sm font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Calendar size={10} /> {item.date}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                      item.type === "Blog" ? "border-primary/20 text-primary bg-primary/5" : "border-purple-500/20 text-purple-500 bg-purple-500/5"
                    )}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs font-medium text-white/80">
                    {item.author}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-black text-white">{item.views}</span>
                       <ArrowUpRight size={12} className="text-emerald-500" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter inline-flex items-center gap-1.5",
item.status === "Published" || item.status === "Active" ? "bg-emerald-500/10 text-emerald-500" :
                       item.status === "Draft" ? "bg-muted text-muted-foreground" :
                       "bg-primary/10 text-primary"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all">
                          <FileEdit size={16} />
                       </button>
                       <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all">
                          <Eye size={16} />
                       </button>
                       <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                          <MoreVertical size={16} />
                       </button>
                    </div>
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

const ContentStatCard = ({ title, value, desc, icon: Icon, color }: any) => (
  <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm group hover:border-primary/30 transition-all">
    <div className="flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center", color)}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-white">{value}</h3>
      </div>
    </div>
    <p className="text-[10px] text-muted-foreground mt-4 font-medium px-1">{desc}</p>
  </div>
);

export default BlogCMS;
