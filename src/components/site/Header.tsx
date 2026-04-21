import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, Heart, Bell, UtensilsCrossed, X, LogOut, User as UserIcon, MessageSquare } from "lucide-react";
import { useAuth, useCart, useNotifications, useWishlist } from "@/store/AppProviders";

const nav = [
  { to: "/" as const, label: "Home" },
  { to: "/meals" as const, label: "Meals" },
  { to: "/vendors" as const, label: "Vendors" },
  { to: "/blog" as const, label: "Blog" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
];

export function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const wish = useWishlist();
  const notif = useNotifications();
  const auth = useAuth();

  useEffect(() => {
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
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-foreground">
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
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/wishlist" className="icon-btn hidden sm:inline-flex" aria-label="Wishlist">
              <Heart className="h-4 w-4" />
              {wish.ids.length > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground ring-2 ring-white">
                  {wish.ids.length}
                </span>
              )}
            </Link>
            <Link to="/notifications" className="icon-btn hidden sm:inline-flex" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {notif.unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground ring-2 ring-white">
                  {notif.unread}
                </span>
              )}
            </Link>
            {auth.user && (
              <Link to="/messages" className="icon-btn hidden sm:inline-flex" aria-label="Messages">
                <MessageSquare className="h-4 w-4" />
              </Link>
            )}
            <Link to="/cart" className="icon-btn relative" aria-label="Cart">
              <ShoppingBag className="h-4 w-4" />
              {cart.count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground ring-2 ring-white">
                  {cart.count}
                </span>
              )}
            </Link>
            {auth.user ? (
              <>
                <Link to="/profile" className="hidden items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold sm:inline-flex hover:bg-primary/10">
                  <UserIcon className="h-3.5 w-3.5" /> {auth.user.name}
                </Link>
                <button onClick={auth.signOut} className="icon-btn hidden sm:inline-flex" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="hidden text-sm font-bold text-foreground/80 hover:text-foreground sm:inline-flex">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary hidden sm:inline-flex">Get started</Link>
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
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
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
              <Link to="/cart" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">Cart ({cart.count})</Link>
              <Link to="/wishlist" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">Wishlist ({wish.ids.length})</Link>
              <Link to="/notifications" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">Notifications ({notif.unread})</Link>
              {auth.user && <Link to="/messages" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">Messages</Link>}
              <Link to="/profile" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">My Profile</Link>
              <Link to="/vendor-dashboard" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">Vendor Dashboard</Link>
              <Link to="/vendor-signup" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-primary hover:bg-secondary">Become a vendor</Link>
              <Link to="/faq" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">FAQ</Link>
              <Link to="/press" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">Press</Link>
            </nav>
            <div className="mt-6 flex flex-col gap-2">
              {auth.user ? (
                <button onClick={() => { auth.signOut(); setOpen(false); }} className="btn-ghost w-full">Sign out</button>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setOpen(false)} className="btn-ghost w-full">Sign in</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary w-full">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
