import { Plus, Heart, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type Meal, vendorById, formatPrice } from "@/data/mock";
import { useCart, useWishlist } from "@/store/AppProviders";

export function MealCard({ meal, compact = false }: { meal: Meal; compact?: boolean }) {
  const vendor = vendorById(meal.vendorId);
  const cart = useCart();
  const wish = useWishlist();
  const saved = wish.has(meal.id);
  return (
    <article className="card-mm group flex h-full flex-col">
      <div className="relative">
        <img
          src={meal.image}
          alt={meal.name}
          loading="lazy"
          className={`w-full object-cover ${compact ? "h-40" : "h-48"}`}
        />
        {meal.badge && <span className="badge-orange absolute left-3 top-3">{meal.badge}</span>}
        <button
          onClick={() => wish.toggle(meal.id)}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-md transition hover:scale-110 ${saved ? "bg-primary text-primary-foreground" : "bg-white/95 text-foreground"}`}
          aria-label={saved ? "Remove from wishlist" : "Save"}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold leading-snug">{meal.name}</h3>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{meal.blurb}</p>
          </div>
          <div className="text-right text-lg font-black tracking-tight">{formatPrice(meal.price)}</div>
        </div>

        {vendor && (
          <Link
            to="/vendors/$vendorId"
            params={{ vendorId: vendor.id }}
            className="mt-3 flex items-center gap-2.5 rounded-xl p-1 -m-1 transition hover:bg-secondary"
          >
            <img src={vendor.avatar} alt={vendor.name} loading="lazy" className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-extrabold">{vendor.name}</p>
              <p className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" /> {vendor.rating} · {vendor.followers} followers
              </p>
            </div>
          </Link>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => cart.add(meal.id)} className="btn-primary flex-1">
            <Plus className="h-4 w-4" /> Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
