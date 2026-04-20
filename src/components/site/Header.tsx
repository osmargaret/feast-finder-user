import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, Heart, Bell, UtensilsCrossed, X } from "lucide-react";

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
            <button className="icon-btn hidden sm:inline-flex" aria-label="Wishlist"><Heart className="h-4.5 w-4.5" /></button>
            <button className="icon-btn hidden sm:inline-flex" aria-label="Notifications">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
            </button>
            <button className="icon-btn relative" aria-label="Cart">
              <ShoppingBag className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
            </button>
            <Link to="/" className="hidden text-sm font-bold text-foreground/80 hover:text-foreground sm:inline-flex">
              Sign in
            </Link>
            <Link to="/" className="btn-primary hidden sm:inline-flex">Get started</Link>
            <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-background p-6 shadow-2xl">
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
              <Link to="/faq" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">FAQ</Link>
              <Link to="/press" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">Press</Link>
            </nav>
            <div className="mt-6 flex flex-col gap-2">
              <Link to="/" onClick={() => setOpen(false)} className="btn-ghost w-full">Sign in</Link>
              <Link to="/" onClick={() => setOpen(false)} className="btn-primary w-full">Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
