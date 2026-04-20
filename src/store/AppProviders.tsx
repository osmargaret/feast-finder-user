import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { meals as allMeals, vendors as allVendors, type Meal } from "@/data/mock";

// ---------- helpers ----------
function useLocalState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

// ---------- Cart ----------
export type CartItem = { mealId: string; qty: number };
type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (mealId: string, qty?: number) => void;
  remove: (mealId: string) => void;
  setQty: (mealId: string, qty: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartCtx | null>(null);

// ---------- Wishlist ----------
type WishCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const WishContext = createContext<WishCtx | null>(null);

// ---------- Notifications ----------
export type Notif = { id: string; title: string; body: string; ts: number; read: boolean };
type NotifCtx = {
  items: Notif[];
  unread: number;
  push: (n: Omit<Notif, "id" | "ts" | "read">) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
};
const NotifContext = createContext<NotifCtx | null>(null);

// ---------- Auth (mock) ----------
export type User = { name: string; email: string };
type AuthCtx = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};
const AuthContext = createContext<AuthCtx | null>(null);

// ---------- Follow ----------
type FollowCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
};
const FollowContext = createContext<FollowCtx | null>(null);

// ---------- Provider ----------
export function AppProviders({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalState<CartItem[]>("mm:cart", []);
  const [wish, setWish] = useLocalState<string[]>("mm:wishlist", []);
  const [notifs, setNotifs] = useLocalState<Notif[]>("mm:notifs", []);
  const [user, setUser] = useLocalState<User | null>("mm:user", null);
  const [follows, setFollows] = useLocalState<string[]>("mm:follows", []);

  // Cart value
  const cartValue = useMemo<CartCtx>(() => {
    const subtotal = cart.reduce((sum, it) => {
      const meal = allMeals.find((m) => m.id === it.mealId);
      return sum + (meal ? meal.price * it.qty : 0);
    }, 0);
    const count = cart.reduce((s, it) => s + it.qty, 0);
    return {
      items: cart,
      count,
      subtotal,
      add: (mealId, qty = 1) => {
        setCart((prev) => {
          const existing = prev.find((p) => p.mealId === mealId);
          if (existing) return prev.map((p) => (p.mealId === mealId ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { mealId, qty }];
        });
        const m = allMeals.find((x) => x.id === mealId);
        toast.success(`Added to cart`, { description: m?.name });
      },
      remove: (mealId) => setCart((prev) => prev.filter((p) => p.mealId !== mealId)),
      setQty: (mealId, qty) =>
        setCart((prev) =>
          qty <= 0 ? prev.filter((p) => p.mealId !== mealId) : prev.map((p) => (p.mealId === mealId ? { ...p, qty } : p)),
        ),
      clear: () => setCart([]),
    };
  }, [cart, setCart]);

  const wishValue = useMemo<WishCtx>(
    () => ({
      ids: wish,
      has: (id) => wish.includes(id),
      toggle: (id) => {
        setWish((prev) => {
          if (prev.includes(id)) {
            toast("Removed from wishlist");
            return prev.filter((x) => x !== id);
          }
          const m = allMeals.find((x) => x.id === id);
          toast.success("Added to wishlist", { description: m?.name });
          return [...prev, id];
        });
      },
      remove: (id) => setWish((prev) => prev.filter((x) => x !== id)),
      clear: () => setWish([]),
    }),
    [wish, setWish],
  );

  const notifValue = useMemo<NotifCtx>(
    () => ({
      items: notifs,
      unread: notifs.filter((n) => !n.read).length,
      push: (n) =>
        setNotifs((prev) => [
          { id: Math.random().toString(36).slice(2), ts: Date.now(), read: false, ...n },
          ...prev,
        ]),
      markAllRead: () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true }))),
      remove: (id) => setNotifs((prev) => prev.filter((n) => n.id !== id)),
      clear: () => setNotifs([]),
    }),
    [notifs, setNotifs],
  );

  const authValue = useMemo<AuthCtx>(
    () => ({
      user,
      signIn: async (email) => {
        await new Promise((r) => setTimeout(r, 400));
        const name = email.split("@")[0] || "Friend";
        setUser({ name, email });
        toast.success(`Welcome back, ${name}`);
      },
      signUp: async (name, email) => {
        await new Promise((r) => setTimeout(r, 400));
        setUser({ name, email });
        toast.success(`Welcome, ${name}!`);
      },
      signOut: () => {
        setUser(null);
        toast("Signed out");
      },
    }),
    [user, setUser],
  );

  const followValue = useMemo<FollowCtx>(
    () => ({
      ids: follows,
      has: (id) => follows.includes(id),
      toggle: (id) => {
        setFollows((prev) => {
          if (prev.includes(id)) {
            toast("Unfollowed");
            return prev.filter((x) => x !== id);
          }
          const v = allVendors.find((x) => x.id === id);
          toast.success(`Following ${v?.name ?? "kitchen"}`);
          return [...prev, id];
        });
      },
    }),
    [follows, setFollows],
  );

  // seed welcome notification once
  useEffect(() => {
    if (notifs.length === 0) {
      setNotifs([
        { id: "welcome", ts: Date.now(), read: false, title: "Welcome to MenuMenu 🎉", body: "Discover top kitchens and order in minutes." },
        { id: "promo", ts: Date.now() - 3600_000, read: false, title: "10% off your first order", body: "Use code TASTE10 at checkout." },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        <WishContext.Provider value={wishValue}>
          <NotifContext.Provider value={notifValue}>
            <FollowContext.Provider value={followValue}>{children}</FollowContext.Provider>
          </NotifContext.Provider>
        </WishContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("CartContext missing");
  return c;
}
export function useWishlist() {
  const c = useContext(WishContext);
  if (!c) throw new Error("WishContext missing");
  return c;
}
export function useNotifications() {
  const c = useContext(NotifContext);
  if (!c) throw new Error("NotifContext missing");
  return c;
}
export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("AuthContext missing");
  return c;
}
export function useFollow() {
  const c = useContext(FollowContext);
  if (!c) throw new Error("FollowContext missing");
  return c;
}

export type { Meal };
