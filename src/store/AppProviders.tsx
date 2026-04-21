import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { meals as seedMeals, vendors as allVendors, type Meal } from "@/data/mock";

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

// ---------- Orders ----------
export type OrderItem = { mealId: string; name: string; price: number; qty: number; vendorId: string };
export type Order = {
  id: string;
  ts: number;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: "pending" | "preparing" | "out-for-delivery" | "delivered" | "cancelled";
  address: { name: string; phone: string; street: string; city: string; notes?: string };
  payment: "card" | "transfer" | "cash";
  userEmail: string | null;
};
type OrdersCtx = {
  items: Order[];
  place: (o: Omit<Order, "id" | "ts" | "status">) => Order;
  setStatus: (id: string, status: Order["status"]) => void;
};
const OrdersContext = createContext<OrdersCtx | null>(null);

// ---------- Messages (chat threads between user ↔ vendor) ----------
export type Message = {
  id: string;
  vendorId: string;
  fromName: string;
  fromEmail: string;       // user email = thread key with vendorId
  body: string;
  ts: number;
  read: boolean;
  from: "user" | "vendor"; // who sent this message
  /** @deprecated kept for backward compat with old single-reply messages */
  reply?: string;
};
type MessagesCtx = {
  items: Message[];
  send: (m: Omit<Message, "id" | "ts" | "read" | "from"> & { from?: "user" | "vendor" }) => void;
  markRead: (id: string) => void;
  /** vendor replies inside a thread */
  reply: (vendorId: string, userEmail: string, text: string, vendorName: string) => void;
  /** user sends a message inside an existing thread */
  sendAsUser: (vendorId: string, text: string, fromName: string, fromEmail: string) => void;
  remove: (id: string) => void;
};
const MessagesContext = createContext<MessagesCtx | null>(null);

// ---------- Vendor profile (mock vendor account info) ----------
export type VendorProfile = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  cac?: string;
  category: string;
  address: string;
  bannerUrl?: string;
  about?: string;
  createdAt: number;
};
type VendorProfileCtx = {
  profile: VendorProfile | null;
  save: (p: Omit<VendorProfile, "createdAt">) => void;
  clear: () => void;
};
const VendorProfileContext = createContext<VendorProfileCtx | null>(null);

// ---------- Vendor menu (CRUD overlay on top of seed meals) ----------
type VendorMenuCtx = {
  meals: Meal[];
  addMeal: (m: Omit<Meal, "id">) => void;
  updateMeal: (id: string, patch: Partial<Meal>) => void;
  removeMeal: (id: string) => void;
};
const VendorMenuContext = createContext<VendorMenuCtx | null>(null);

// ---------- Provider ----------
export function AppProviders({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalState<CartItem[]>("mm:cart", []);
  const [wish, setWish] = useLocalState<string[]>("mm:wishlist", []);
  const [notifs, setNotifs] = useLocalState<Notif[]>("mm:notifs", []);
  const [user, setUser] = useLocalState<User | null>("mm:user", null);
  const [follows, setFollows] = useLocalState<string[]>("mm:follows", []);
  const [orders, setOrders] = useLocalState<Order[]>("mm:orders", []);
  const [messages, setMessages] = useLocalState<Message[]>("mm:messages", []);
  const [vendorProfile, setVendorProfile] = useLocalState<VendorProfile | null>("mm:vendor-profile", null);
  const [extraMeals, setExtraMeals] = useLocalState<Meal[]>("mm:extra-meals", []);
  const [mealPatches, setMealPatches] = useLocalState<Record<string, Partial<Meal>>>("mm:meal-patches", {});
  const [removedMealIds, setRemovedMealIds] = useLocalState<string[]>("mm:meal-removed", []);

  // Effective meal list = (seed - removed, with patches) + extra
  const allMeals = useMemo<Meal[]>(() => {
    const base = seedMeals
      .filter((m) => !removedMealIds.includes(m.id))
      .map((m) => ({ ...m, ...(mealPatches[m.id] ?? {}) }));
    return [...base, ...extraMeals];
  }, [extraMeals, mealPatches, removedMealIds]);

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
  }, [cart, setCart, allMeals]);

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
    [wish, setWish, allMeals],
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

  const ordersValue = useMemo<OrdersCtx>(
    () => ({
      items: orders,
      place: (o) => {
        const order: Order = {
          ...o,
          id: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          ts: Date.now(),
          status: "pending",
        };
        setOrders((prev) => [order, ...prev]);
        return order;
      },
      setStatus: (id, status) =>
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
    }),
    [orders, setOrders],
  );

  const messagesValue = useMemo<MessagesCtx>(
    () => ({
      items: messages,
      send: (m) =>
        setMessages((prev) => [
          {
            id: Math.random().toString(36).slice(2),
            ts: Date.now(),
            read: false,
            from: m.from ?? "user",
            vendorId: m.vendorId,
            fromName: m.fromName,
            fromEmail: m.fromEmail,
            body: m.body,
          },
          ...prev,
        ]),
      markRead: (id) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m))),
      reply: (vendorId, userEmail, text, vendorName) =>
        setMessages((prev) => [
          {
            id: Math.random().toString(36).slice(2),
            ts: Date.now(),
            read: false,
            from: "vendor",
            vendorId,
            fromName: vendorName,
            fromEmail: userEmail, // thread key
            body: text,
          },
          ...prev.map((m) =>
            m.vendorId === vendorId && m.fromEmail === userEmail && m.from === "user" ? { ...m, read: true } : m,
          ),
        ]),
      sendAsUser: (vendorId, text, fromName, fromEmail) =>
        setMessages((prev) => [
          {
            id: Math.random().toString(36).slice(2),
            ts: Date.now(),
            read: false,
            from: "user",
            vendorId,
            fromName,
            fromEmail,
            body: text,
          },
          ...prev,
        ]),
      remove: (id) => setMessages((prev) => prev.filter((m) => m.id !== id)),
    }),
    [messages, setMessages],
  );

  const vendorProfileValue = useMemo<VendorProfileCtx>(
    () => ({
      profile: vendorProfile,
      save: (p) => {
        setVendorProfile({ ...p, createdAt: vendorProfile?.createdAt ?? Date.now() });
        toast.success("Vendor account ready");
      },
      clear: () => setVendorProfile(null),
    }),
    [vendorProfile, setVendorProfile],
  );

  const vendorMenuValue = useMemo<VendorMenuCtx>(
    () => ({
      meals: allMeals,
      addMeal: (m) => {
        const id = "m-" + Math.random().toString(36).slice(2, 8);
        setExtraMeals((prev) => [...prev, { ...m, id }]);
        toast.success("Menu item added");
      },
      updateMeal: (id, patch) => {
        const isExtra = extraMeals.some((m) => m.id === id);
        if (isExtra) {
          setExtraMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
        } else {
          setMealPatches((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...patch } }));
        }
        toast.success("Menu item updated");
      },
      removeMeal: (id) => {
        const isExtra = extraMeals.some((m) => m.id === id);
        if (isExtra) {
          setExtraMeals((prev) => prev.filter((m) => m.id !== id));
        } else {
          setRemovedMealIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        }
        toast("Menu item removed");
      },
    }),
    [allMeals, extraMeals, setExtraMeals, setMealPatches, setRemovedMealIds],
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
            <FollowContext.Provider value={followValue}>
              <OrdersContext.Provider value={ordersValue}>
                <MessagesContext.Provider value={messagesValue}>
                  <VendorProfileContext.Provider value={vendorProfileValue}>
                    <VendorMenuContext.Provider value={vendorMenuValue}>{children}</VendorMenuContext.Provider>
                  </VendorProfileContext.Provider>
                </MessagesContext.Provider>
              </OrdersContext.Provider>
            </FollowContext.Provider>
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
export function useOrders() {
  const c = useContext(OrdersContext);
  if (!c) throw new Error("OrdersContext missing");
  return c;
}
export function useMessages() {
  const c = useContext(MessagesContext);
  if (!c) throw new Error("MessagesContext missing");
  return c;
}
export function useVendorMenu() {
  const c = useContext(VendorMenuContext);
  if (!c) throw new Error("VendorMenuContext missing");
  return c;
}
export function useVendorProfile() {
  const c = useContext(VendorProfileContext);
  if (!c) throw new Error("VendorProfileContext missing");
  return c;
}

export type { Meal };

export type { Meal };
