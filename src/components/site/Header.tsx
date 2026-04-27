import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  UtensilsCrossed,
  X,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Store,
  Search,
  Heart,
  Bell,
  ShoppingBag,
} from "lucide-react";
import { useAuth, useCart, useNotifications, useVendorProfile, useWishlist } from "@/store/AppProviders";
import { categories, type Category } from "@/data/mock";
import { DeliveryAreaPicker } from "@/components/site/DeliveryAreaPicker";

const nav = [
  { to: "/" as const, label: "Home" },
  { to: "/meals" as const, label: "Meals" },
  { to: "/vendors" as const, label: "Vendors" },
];

export function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string>("");
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);
  const [mounted, setMounted] = useState(false);
  const cart = useCart();
  const wish = useWishlist();
  const notif = useNotifications();
  const auth = useAuth();
  const vendor = useVendorProfile();
  const role: "vendor" | "user" | null = mounted ? (vendor.profile && auth.user && vendor.profile.email === auth.user.email ? "vendor" : auth.user ? "user" : null) : null;
  const routerState = useRouterState();
  const isVendorView = routerState.location.pathname.startsWith('/vendor-dashboard') || routerState.location.pathname.startsWith('/settings');

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        stuck ? "py-2" : "py-4"
      }`}
    >
      <div className="container-mm">
        <div
          className={`glass-nav flex items-center justify-between gap-3 px-3 py-2.5 transition-all ${
            stuck ? "rounded-2xl" : "rounded-3xl"
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 font-extrabold tracking-tight text-foreground"
          >
            <span
              className="grid h-10 w-10 place-items-center rounded-2xl text-white"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            <span className="text-lg">MenuMenu</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            {/* Categories mega menu – hover dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDesktopCategoriesOpen(true)}
              onMouseLeave={() => {
                setDesktopCategoriesOpen(false);
                setHoveredCat(null);
              }}
            >
              <button className="rounded-full px-3.5 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground flex items-center gap-1">
                Categories
                <ChevronDown className="h-3 w-3" />
              </button>
              {desktopCategoriesOpen && (
                <div className="absolute left-1/2 top-full z-50 pt-2 w-[680px] -translate-x-1/2">
                  <div className="rounded-3xl border border-border bg-background p-5 shadow-2xl ring-1 ring-black/5">
                    <div className="grid grid-cols-[200px_1fr] gap-5">
                      {/* Column 1: Category list */}
                      <div className="space-y-1 border-r border-border pr-4">
                        <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Browse</p>
                        {categories.map((cat) => {
                          const active = hoveredCat?.name === cat.name;
                          return (
                            <button
                              key={cat.name}
                              onMouseEnter={() => setHoveredCat(cat)}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all ${
                                active
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-foreground/80 hover:bg-secondary"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-base">{cat.icon}</span>
                                {cat.name}
                              </span>
                              <ChevronDown className={`h-3 w-3 -rotate-90 ${active ? "opacity-100" : "opacity-40"}`} />
                            </button>
                          );
                        })}
                      </div>
                      {/* Column 2: Subcategories */}
                      <div className="min-h-[280px]">
                        {hoveredCat ? (
                          <>
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-sm font-extrabold">
                                <span className="mr-1.5">{hoveredCat.icon}</span>
                                {hoveredCat.name}
                              </p>
                              <Link
                                to="/meals"
                                search={{ category: hoveredCat.name, sub: undefined }}
                                className="text-xs font-bold text-primary hover:underline"
                              >
                                View all →
                              </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                              {hoveredCat.subcategories.map((sub) => (
                                <div key={sub.name}>
                                  <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                    {sub.name}
                                  </p>
                                  <ul className="space-y-0.5">
                                    {sub.items.map((item) => (
                                      <li key={item}>
                                        <Link
                                          to="/meals"
                                          search={{ category: hoveredCat.name, sub: item }}
                                          className="block rounded-lg px-2 py-1 text-sm text-foreground/75 hover:bg-secondary hover:text-primary transition-colors"
                                        >
                                          {item}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center rounded-2xl bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
                            Hover a category to see what's inside
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Blog nav item */}
            <Link
              to="/blog"
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: false }}
            >
              Blog
            </Link>

          </nav>

          <div className="flex items-center gap-2">
            {mounted && role !== "vendor" && auth.user && (
              <Link to="/wishlist" className="icon-btn hidden sm:inline-flex" aria-label="Wishlist">
                <Heart className="h-4 w-4" />
                {wish.ids.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground ring-2 ring-white">
                    {wish.ids.length}
                  </span>
                )}
              </Link>
            )}
            <Link
              to="/notifications"
              className="icon-btn hidden sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {mounted && notif.unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground ring-2 ring-white">
                  {notif.unread}
                </span>
              )}
            </Link>

            {mounted && role !== "vendor" && (
              <Link to="/cart" className="icon-btn relative" aria-label="Cart">
                <ShoppingBag className="h-4 w-4" />
                {cart.count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground ring-2 ring-white">
                    {cart.count}
                  </span>
                )}
              </Link>
            )}
            {mounted && auth.user ? (
              <div className="flex items-center gap-2">
                {role === "vendor" && (
                  <Link
                    to="/view-vendor/$vendorId"
                    params={{ vendorId: vendor.profile?.id || "" }}
                    className="hidden items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white sm:inline-flex hover:bg-primary/90"
                  >
                    <Store className="h-3 w-3" /> My Store
                  </Link>
                )}
                <Link
                  to={role === "vendor" ? "/vendor-dashboard" : "/profile"}
                  className={`hidden items-center gap-1.5 rounded-full bg-secondary ${role === "vendor" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"} font-bold sm:inline-flex hover:bg-primary/10`}
                >
                  <UserIcon className={role === "vendor" ? "h-3 w-3" : "h-3.5 w-3.5"} /> {auth.user.name}
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${role === "vendor" ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-foreground"}`}>
                    {role === "vendor" ? "Vendor" : "User"}
                  </span>
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="hidden text-sm font-bold text-foreground/80 hover:text-foreground sm:inline-flex"
                >
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary hidden sm:inline-flex">
                  Get started
                </Link>
              </>
            )}
            <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-background p-6 shadow-2xl overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-extrabold">Menu</span>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
                >
                  {n.label}
                </Link>
              ))}
              {/* Categories mobile accordion */}
              <div className="space-y-1">
                <p className="px-4 py-2 text-xs font-bold text-muted-foreground">Categories</p>
                {categories.map((cat) => {
                  const isOpen = mobileExpandedCategory === cat.name;
                  return (
                    <div key={cat.name} className="rounded-xl border border-border overflow-hidden">
                      <button
                        onClick={() => setMobileExpandedCategory(isOpen ? "" : cat.name)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{cat.icon}</span>
                          {cat.name}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-border bg-secondary/20 px-4 py-2 space-y-1">
                          <Link
                            to="/meals"
                            search={{ category: cat.name, sub: undefined }}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-secondary"
                          >
                            View all {cat.name}
                          </Link>
                          {cat.subcategories.map((sub) => (
                            <div key={sub.name}>
                              <p className="px-3 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                                {sub.name}
                              </p>
                              {sub.items.map((item) => (
                                <Link
                                  key={item}
                                  to="/meals"
                                  search={{ category: cat.name, sub: item }}
                                  onClick={() => setOpen(false)}
                                  className="block rounded-lg px-3 py-1.5 text-sm text-foreground/75 hover:bg-secondary hover:text-foreground"
                                >
                                  {item}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Blog mobile link */}
              <Link
                to="/blog"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
              >
                Blog
              </Link>
              {role !== "vendor" && (
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
                >
                  Cart ({cart.count})
                </Link>
              )}
              {role !== "vendor" && auth.user && (
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
                >
                  Wishlist ({wish.ids.length})
                </Link>
              )}
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
              >
                Notifications ({notif.unread})
              </Link>

              {auth.user && role !== "vendor" && (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
                >
                  My Profile
                </Link>
              )}
              {role === "vendor" && (
                <Link
                  to="/vendor-dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
                >
                  Vendor Dashboard
                </Link>
              )}
              <Link
                to="/vendor-signup"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-primary hover:bg-secondary"
              >
                Become a vendor
              </Link>
              <Link
                to="/faq"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
              >
                FAQ
              </Link>
              <Link
                to="/press"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
              >
                Press
              </Link>
            </nav>
            <div className="mt-6 flex flex-col gap-2">
              {!auth.user && (
                <>
                  <Link to="/signin" onClick={() => setOpen(false)} className="btn-ghost w-full">
                    Sign in
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary w-full">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
