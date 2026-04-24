import { Link } from "@tanstack/react-router";
import { UtensilsCrossed, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 bg-[oklch(0.16_0.03_265)] text-white/80">
      <div className="container-mm py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-2xl text-white" style={{ background: "var(--gradient-primary)" }}>
                <UtensilsCrossed className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold">MenuMenu</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              The marketplace for local food vendors. Discover, follow, and order from kitchens you love across Nigeria.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:bg-white/10"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter"   className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:bg-white/10"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="Facebook"  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:bg-white/10"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/meals" className="transition hover:text-white">Browse Meals</Link></li>
              <li><Link to="/vendors" className="transition hover:text-white">Kitchens</Link></li>
              <li><Link to="/search" className="transition hover:text-white">Search</Link></li>
              <li><Link to="/blog" className="transition hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Vendors</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/vendor-signup" className="transition hover:text-white">Open a Kitchen</Link></li>
              <li><Link to="/vendor-dashboard" className="transition hover:text-white">Dashboard</Link></li>
              <li><Link to="/about" className="transition hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="transition hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Stay in the loop</h4>
            <p className="mt-3 text-sm text-white/65">New kitchens, fresh menus, weekly highlights.</p>
            <form className="mt-4 flex overflow-hidden rounded-full border border-white/15 bg-white/5">
              <input type="email" placeholder="you@example.com" className="flex-1 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/45 focus:outline-none" />
              <button type="submit" className="px-4 text-sm font-bold text-white transition" style={{ background: "var(--gradient-primary)" }}>Join</button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} MenuMenu. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="transition hover:text-white">FAQ</Link>
            <Link to="/support" className="transition hover:text-white">Support</Link>
            <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
