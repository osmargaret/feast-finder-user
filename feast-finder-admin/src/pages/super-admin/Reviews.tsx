import React from "react";
import { 
  Star, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  User,
  Store,
  ChevronRight,
  ShieldCheck,
  ThumbsUp,
  Flag
} from "lucide-react";
import { cn } from "../../lib/utils";

const MOCK_REVIEWS = [
  { id: 1, customer: "John Doe", vendor: "Mamma's Kitchen", rating: 5, comment: "Absolutely amazing Jollof rice! The spice level was perfect.", status: "Approved", date: "2h ago", flagged: false },
  { id: 2, customer: "Alice Brown", vendor: "Burger Boss", rating: 1, comment: "Worst experience ever. The food was cold and arrived 2 hours late.", status: "Flagged", date: "5h ago", flagged: true },
  { id: 3, customer: "Bob Wilson", vendor: "The Grill Hub", rating: 4, comment: "Great taste, but portion size could be better.", status: "Pending", date: "12h ago", flagged: false },
  { id: 4, customer: "Sarah Smith", vendor: "Sweet Bites", rating: 5, comment: "Best cupcakes in Lagos! Will order again.", status: "Approved", date: "1 day ago", flagged: false },
  { id: 5, customer: "Mike Ross", vendor: "Spice Route", rating: 2, comment: "Too salty and oily. Not worth the price.", status: "Reviewing", date: "1 day ago", flagged: false },
];

const Reviews = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Star className="text-primary fill-primary" size={32} />
            Review Moderation
          </h2>
          <p className="text-muted-foreground mt-1">Audit, moderate, and respond to platform-wide customer feedback.</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right hidden md:block px-6 py-2 bg-muted/30 rounded-2xl border border-border">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Global Rating</p>
              <div className="flex items-center gap-1 mt-1">
                 <Star size={14} className="text-primary fill-primary" />
                 <p className="text-sm font-black text-white">4.8 / 5.0</p>
              </div>
           </div>
        </div>
      </header>

      {/* Moderation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModerationStatCard title="Pending Review" value="24" desc="12 Urgent (1-star)" icon={Clock} color="text-amber-500" />
        <ModerationStatCard title="Flagged Content" value="5" desc="Possible spam detected" icon={Flag} color="text-destructive" />
        <ModerationStatCard title="Approval Rate" value="94%" desc="+2% from last week" icon={ThumbsUp} color="text-emerald-500" />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search reviews by keyword, customer, or vendor..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm appearance-none outline-none focus:ring-1 focus:ring-primary cursor-pointer">
            <option>All Ratings</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>3 Stars & Below</option>
          </select>
        </div>
        <div className="relative">
          <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm appearance-none outline-none focus:ring-1 focus:ring-primary cursor-pointer">
            <option>All Status</option>
            <option>Flagged Only</option>
            <option>Pending Only</option>
            <option>Approved</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className={cn(
            "bg-card rounded-[2.5rem] border border-border p-8 hover:border-primary/30 transition-all group",
            review.flagged && "border-destructive/30 bg-destructive/5"
          )}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Metadata */}
              <div className="lg:w-1/4 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-xs text-primary border border-slate-700">
                      {review.customer.charAt(0)}
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white">{review.customer}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">{review.date}</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                      <Store size={14} className="text-muted-foreground" />
                      {review.vendor}
                   </div>
                   <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={cn(
                          s <= review.rating ? "text-primary fill-primary" : "text-muted border-none"
                        )} />
                      ))}
                   </div>
                </div>
              </div>

              {/* Middle: Content */}
              <div className="flex-1 space-y-4">
                 <div className="p-6 rounded-3xl bg-muted/20 border border-border italic text-sm text-white/90 leading-relaxed relative">
                    {review.flagged && <AlertTriangle size={20} className="absolute -top-3 -left-3 text-destructive" />}
                    "{review.comment}"
                 </div>
                 <div className="flex items-center gap-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter inline-flex items-center gap-1.5",
                      review.status === "Approved" ? "bg-emerald-500/10 text-emerald-500" :
                      review.status === "Flagged" ? "bg-destructive/10 text-destructive" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {review.status}
                    </span>
                    {review.flagged && (
                      <span className="text-[9px] font-black text-destructive uppercase tracking-widest flex items-center gap-1">
                        <Flag size={10} /> Suspicious Pattern Detected
                      </span>
                    )}
                 </div>
              </div>

              {/* Right: Actions */}
              <div className="lg:w-1/5 flex flex-col justify-between gap-4">
                 <div className="flex gap-2">
                    <button className="flex-1 h-12 rounded-2xl bg-muted text-foreground font-black text-xs uppercase tracking-widest hover:bg-muted/80 transition-all border border-border">
                       Hide
                    </button>
                    <button className="h-12 w-12 rounded-2xl bg-muted text-foreground flex items-center justify-center hover:text-primary transition-all border border-border">
                       <MessageSquare size={18} />
                    </button>
                 </div>
                 <button className={cn(
                   "w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                   review.status === "Approved" ? "bg-muted text-muted-foreground" : "premium-gradient text-white shadow-lg shadow-primary/20"
                 )}>
                   {review.status === "Approved" ? "Withdraw" : "Approve"}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModerationStatCard = ({ title, value, desc, icon: Icon, color }: any) => (
  <div className="bg-card p-6 rounded-[2.5rem] border border-border flex items-center gap-6 shadow-sm">
    <div className={cn("w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center", color)}>
      <Icon size={28} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-white leading-none mt-1">{value}</h3>
      <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{desc}</p>
    </div>
  </div>
);

const Clock = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Reviews;
