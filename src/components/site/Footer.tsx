import { Link } from "@tanstack/react-router";
import { UtensilsCrossed, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 bg-[oklch(0.16_0.03_265)] text-white/80">
      <div className="container-mm py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-2xl text-white" style={{ background: "var(--gradient-primary)" }}>
                <UtensilsCrossed className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold">MenuMenu</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              The marketplace for local food vendors. Discover, follow, and order from kitchens you love.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-white/10"><Instagram className="h-4.5 w-4.5" /></a>
              <a href="#" aria-label="Twitter"   className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-white/10"><Twitter className="h-4.5 w-4.5" /></a>
              <a href="#" aria-label="Facebook"  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-white/10"><Facebook className="h-4.5 w-4.5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/meals" className="hover:text-white">Meals</Link></li>
              <li><Link to="/vendors" className="hover:text-white">Vendors</Link></li>
              <li><Link to="/search" className="hover:text-white">Search</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/press" className="hover:text-white">Press</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Stay in the loop</h4>
            <p className="mt-3 text-sm text-white/65">New kitchens, fresh menus, weekly highlights.</p>
            <form className="mt-4 flex overflow-hidden rounded-full border border-white/15 bg-white/5">
              <input type="email" placeholder="you@example.com" className="flex-1 bg-transparent px-4 py-2.5 text-sm placeholder:text-white/45 focus:outline-none" />
              <button type="submit" className="px-4 text-sm font-bold text-white" style={{ background: "var(--gradient-primary)" }}>Join</button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} MenuMenu. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="hover:text-white">FAQ</Link>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
