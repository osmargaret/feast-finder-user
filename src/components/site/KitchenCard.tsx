import { Star, Plus, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type Vendor } from "@/data/mock";
import { useFollow } from "@/store/AppProviders";

export function KitchenCard({ vendor, showFollow = true }: { vendor: Vendor; showFollow?: boolean }) {
  const follow = useFollow();
  const following = follow.has(vendor.id);
  const liveCount = follow.countFor(vendor.id, vendor.followerCount);
  const formatted = liveCount >= 1000 ? `${(liveCount / 1000).toFixed(1)}k` : String(liveCount);
  return (
    <article className="card-mm group flex w-[260px] shrink-0 flex-col p-4 transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-visible">
      <Link to="/view-vendor/$vendorId" params={{ vendorId: vendor.id }} className="block">
        <div className="relative h-28 overflow-hidden rounded-[1.5rem]">
          <img src={vendor.cover} alt={vendor.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Floating Rating Chip Overlay */}
          <div className="absolute -top-2 -right-2 h-10 px-3 rounded-xl bg-white shadow-xl flex items-center gap-1.5 z-20 border border-slate-100 animate-in fade-in zoom-in-50">
             <Star className="h-4 w-4 fill-primary text-primary" /> 
             <span className="text-sm font-black text-slate-900">{vendor.rating}</span>
          </div>
        </div>

        {/* Overlapping Avatar */}
        <div className="-mt-10 flex items-end px-2 relative z-10">
          <div className="relative">
             <img 
               src={vendor.avatar} 
               alt={vendor.name} 
               loading="lazy" 
               className="h-16 w-16 rounded-[1.2rem] object-cover ring-[5px] ring-white shadow-2xl" 
             />
             <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] ring-white ring-2 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
             </div>
          </div>
        </div>

        <div className="px-2 mt-4">
           <h3 className="text-lg font-black leading-tight text-slate-900 tracking-tight">{vendor.name}</h3>
           <p className="mt-1 text-xs font-bold text-muted-foreground line-clamp-1">
             <span className="text-primary">{formatted} followers</span> • {vendor.tagline}
           </p>
        </div>
      </Link>
      {showFollow && (
        <button
          onClick={(e) => { e.preventDefault(); follow.toggle(vendor.id); }}
          className={following ? "btn-ghost mt-4 w-full" : "btn-primary mt-4 w-full"}
        >
          {following ? <><Check className="h-4 w-4" /> Following</> : <><Plus className="h-4 w-4" /> Follow</>}
        </button>
      )}
    </article>
  );
}
