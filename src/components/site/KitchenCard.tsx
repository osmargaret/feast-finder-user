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
    <article className="card-mm flex w-[260px] flex-col p-4 sm:w-auto">
      <Link to="/vendors/$vendorId" params={{ vendorId: vendor.id }} className="block">
        <div className="relative h-24 overflow-hidden rounded-2xl">
          <img src={vendor.cover} alt={vendor.name} loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        </div>
        <div className="-mt-7 flex items-end justify-between px-1">
          <img src={vendor.avatar} alt={vendor.name} loading="lazy" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white" />
          <span className="chip"><Star className="h-3 w-3 fill-primary text-primary" /> {vendor.rating}</span>
        </div>
        <h3 className="mt-3 text-base font-extrabold leading-tight">{vendor.name}</h3>
        <p className="text-xs font-semibold text-muted-foreground">{formatted} followers · {vendor.tagline}</p>
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
