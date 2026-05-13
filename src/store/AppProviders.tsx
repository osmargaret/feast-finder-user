import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { meals as seedMeals, vendors as allVendors, type Meal } from "@/data/mock";
import api from "@/lib/api";

// ---------- helpers ----------
function useLocalState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {}
    return initial;
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
export type Notif = { 
  id: string; 
  title: string; 
  body: string; 
  ts: number; 
  read: boolean;
  type?: 'message' | 'review' | 'like' | 'order' | 'system';
  link?: string;
  search?: any;
  params?: any;
  data?: any;
};
type NotifCtx = {
  items: Notif[];
  unread: number;
  push: (n: Omit<Notif, "id" | "ts" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
};
const NotifContext = createContext<NotifCtx | null>(null);

// ---------- Auth (mock) ----------
export type User = { id: string | number; name: string; email: string; avatar?: string; emailVerified?: boolean };
type AuthCtx = {
  user: User | null;
  signIn: (email: string, password: string, role?: 'customer' | 'vendor') => Promise<void>;
  signUp: (name: string, email: string, password: string, role?: 'customer' | 'vendor', state_id?: number) => Promise<void>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, otp: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
};
const AuthContext = createContext<AuthCtx | null>(null);

// ---------- Follow ----------
type FollowCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  /** how many followers a vendor has (base + 1 if current user follows) */
  countFor: (vendorId: string, base?: number) => number;
};
const FollowContext = createContext<FollowCtx | null>(null);

// ---------- Orders ----------
export type OrderItem = {
  mealId: string;
  name: string;
  price: number;
  qty: number;
  vendorId: string;
};
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

// ---------- Messages ----------
export type Message = {
  id: string;
  vendorId: string;
  fromName: string;
  fromEmail: string;
  body: string;
  ts: number;
  read: boolean;
  from: "user" | "vendor";
  reply?: string;
};
type MessagesCtx = {
  items: Message[];
  send: (vendorId: string, fromEmail: string, fromName: string, body: string) => void;
  markRead: (id: string) => void;
  reply: (vendorId: string, userEmail: string, text: string, vendorName: string) => void;
  remove: (id: string) => void;
  /** count of vendor → user messages still unread */
  unreadFromVendors: (userEmail: string) => number;
};
const MessagesContext = createContext<MessagesCtx | null>(null);

// ---------- Vendor profile ----------
export type VendorProfile = {
  id: string;
  businessName: string;
  tagline?: string;
  ownerName: string;
  email: string;
  phone: string;
  cac?: string;
  categories: string[];
  address: string;
  images: string[];
  bannerUrl?: string;
  about?: string;
  deliveryAreas?: { name: string; fee: number }[];
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  openHours?: { start: string; end: string };
  bankDetails?: { bankName: string; accountName: string; accountNumber: string };
  isOpen: boolean;
  createdAt: number;
};
type VendorProfileCtx = {
  profile: VendorProfile | null;
  save: (p: Omit<VendorProfile, "id" | "createdAt" | "isOpen">) => void;
  toggleStatus: () => void;
  clear: () => void;
};
const VendorProfileContext = createContext<VendorProfileCtx | null>(null);

// ---------- Vendor menu ----------
type VendorMenuCtx = {
  meals: Meal[];
  addMeal: (m: Omit<Meal, "id">) => void;
  updateMeal: (id: string, patch: Partial<Meal>) => void;
  removeMeal: (id: string) => void;
};
const VendorMenuContext = createContext<VendorMenuCtx | null>(null);

// ---------- Blog (vendor-authored) ----------
export type BlogComment = {
  id: string;
  userName: string;
  userAvatar?: string;
  body: string;
  ts: number;
};

export type BlogDraft = {
  id: string;
  vendorId: string;
  title: string;
  excerpt: string;
  body: string;
  cover?: string;
  ts: number;
  views: number;
  authorEmail: string;
  likes: number;
  comments: BlogComment[];
};
type BlogCtx = {
  posts: BlogDraft[];
  create: (p: Omit<BlogDraft, "id" | "ts" | "views" | "likes" | "comments">) => BlogDraft;
  update: (id: string, patch: Partial<BlogDraft>) => void;
  remove: (id: string) => void;
  view: (id: string) => void;
  like: (id: string) => void;
  addComment: (id: string, userName: string, body: string, userAvatar?: string) => void;
};
const BlogContext = createContext<BlogCtx | null>(null);

export type TeamMember = {
  id: string;
  vendorId: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  ts: number;
};

// ---------- Coupons ----------
export type Coupon = {
  id: string;
  vendorId: string;
  code: string;
  discountType: "percent" | "amount";
  discountValue: number;
  minOrder?: number;
  expiry?: number;
  usageCount: number;
  active: boolean;
};
type CouponCtx = {
  items: Coupon[];
  create: (c: Omit<Coupon, "id" | "usageCount" | "active">) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  validate: (code: string, vendorId: string, subtotal: number) => Coupon | null;
};
const CouponContext = createContext<CouponCtx | null>(null);
type TeamCtx = {
  members: TeamMember[];
  add: (m: Omit<TeamMember, "id" | "ts" | "status">) => void;
  remove: (id: string) => void;
  toggleStatus: (id: string) => void;
};
const TeamContext = createContext<TeamCtx | null>(null);

// ---------- Reviews ----------
export type Review = {
  id: string;
  orderId?: string;
  vendorId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  body: string;
  ts: number;
  reply?: string;
};
type ReviewCtx = {
  items: Review[];
  add: (r: Omit<Review, "id" | "ts">) => void;
  reply: (id: string, text: string) => void;
  forVendor: (vid: string) => Review[];
};
const ReviewContext = createContext<ReviewCtx | null>(null);

// ---------- Support Tickets ----------
export type SupportTicket = {
  id: string;
  orderId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "open" | "resolved" | "closed";
  ts: number;
};
type SupportCtx = {
  tickets: SupportTicket[];
  create: (t: Omit<SupportTicket, "id" | "ts" | "status">) => void;
  resolve: (id: string) => void;
};
const SupportContext = createContext<SupportCtx | null>(null);

// ---------- Loyalty ----------
type LoyaltyCtx = {
  points: number;
  history: { ts: number; amount: number; reason: string }[];
  addPoints: (amount: number, reason: string) => void;
  redeemPoints: (amount: number) => boolean;
};
const LoyaltyContext = createContext<LoyaltyCtx | null>(null);

// ---------- Delivery area (customer-side filter) ----------
type DeliveryAreaCtx = {
  area: string | null;
  setArea: (a: string | null) => void;
};
const DeliveryAreaContext = createContext<DeliveryAreaCtx | null>(null);

// ---------- Provider ----------
export function AppProviders({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalState<CartItem[]>("mm:cart", []);
  const [wish, setWish] = useLocalState<string[]>("mm:wishlist", []);
  const [notifs, setNotifs] = useLocalState<Notif[]>("mm:notifs", []);
  const [user, setUser] = useLocalState<User | null>("mm:user", null);
  const [follows, setFollows] = useLocalState<string[]>("mm:follows", []);
  const [coupons, setCoupons] = useLocalState<Coupon[]>("mm:coupons", [
    { id: "cp-1", vendorId: "mama-t", code: "WELCOME10", discountType: "percent", discountValue: 10, usageCount: 5, active: true },
    { id: "cp-2", vendorId: "oven-fresh", code: "FRESH20", discountType: "percent", discountValue: 20, usageCount: 2, active: true },
    { id: "cp-3", vendorId: "suya-republic", code: "HOT500", discountType: "amount", discountValue: 500, usageCount: 12, active: true },
  ]);
  const [orders, setOrders] = useLocalState<Order[]>("mm:orders", []);
  const [messages, setMessages] = useLocalState<Message[]>("mm:messages", [
    {
      id: "msg-1",
      vendorId: "v-1",
      from: "user",
      fromName: "Toyin",
      fromEmail: "toyin@example.com",
      body: "Hello Mama T! Do you have fresh jollof rice ready for pickup?",
      ts: Date.now() - 3600000 * 2,
      read: true,
    },
    {
      id: "msg-2",
      vendorId: "v-1",
      from: "vendor",
      fromName: "Mama T's Kitchen",
      fromEmail: "toyin@example.com",
      body: "Yes Toyin! Just finished a fresh batch. It's hot and spicy just the way you like it.",
      ts: Date.now() - 3600000 * 1.5,
      read: true,
    },
    {
      id: "msg-3",
      vendorId: "v-1",
      from: "user",
      fromName: "Toyin",
      fromEmail: "toyin@example.com",
      body: "Perfect! I'll be there in 15 minutes. Please pack two portions.",
      ts: Date.now() - 3600000 * 1.2,
      read: true,
    },
    {
      id: "msg-4",
      vendorId: "v-2",
      from: "user",
      fromName: "Toyin",
      fromEmail: "toyin@example.com",
      body: "Is your delivery still active for Ikeja area?",
      ts: Date.now() - 3600000 * 5,
      read: true,
    },
    {
      id: "msg-5",
      vendorId: "v-2",
      from: "vendor",
      fromName: "Burger King",
      fromEmail: "toyin@example.com",
      body: "Yes, we are delivering to Ikeja! Delivery time is currently 45 minutes.",
      ts: Date.now() - 3600000 * 4.8,
      read: true,
    }
  ]);
  const [vendorProfile, setVendorProfile] = useLocalState<VendorProfile | null>(
    "mm:vendor-profile",
    null,
  );
  const [extraMeals, setExtraMeals] = useLocalState<Meal[]>("mm:extra-meals", []);
  const [mealPatches, setMealPatches] = useLocalState<Record<string, Partial<Meal>>>(
    "mm:meal-patches",
    {},
  );
  const [removedMealIds, setRemovedMealIds] = useLocalState<string[]>("mm:meal-removed", []);
  const [blogPosts, setBlogPosts] = useLocalState<BlogDraft[]>("mm:blog-posts", []);
  const [team, setTeam] = useLocalState<TeamMember[]>("mm:team", []);
  const [deliveryArea, setDeliveryAreaState] = useLocalState<string | null>("mm:delivery-area", null);
  const [reviews, setReviews] = useLocalState<Review[]>("mm:reviews", [
    {
      id: "rev-1",
      vendorId: "mama-t",
      userName: "Clement",
      rating: 5,
      body: "The jollof rice was incredibly fresh and spicy! Best I've had in a while.",
      ts: Date.now() - 3600000 * 48,
    },
    {
      id: "rev-2",
      vendorId: "mama-t",
      userName: "Sarah M.",
      rating: 4,
      body: "Good food, but delivery took a bit longer than expected.",
      ts: Date.now() - 3600000 * 24,
      reply: "Hi Sarah, sorry about the delay! We'll make sure it's faster next time.",
    },
    {
      id: "rev-3",
      vendorId: "v-1",
      userName: "David O.",
      rating: 5,
      body: "Amazing customer service and the portions are huge!",
      ts: Date.now() - 3600000 * 12,
    }
  ]);
  const [tickets, setTickets] = useLocalState<SupportTicket[]>("mm:tickets", []);
  const [loyalty, setLoyalty] = useLocalState<{ points: number; history: { ts: number; amount: number; reason: string }[] }>("mm:loyalty", { points: 0, history: [] });
  const [lastVendorMsgId, setLastVendorMsgId] = useState<string | null>(null);

  const allMeals = useMemo<Meal[]>(() => {
    const base = seedMeals
      .filter((m) => !removedMealIds.includes(m.id))
      .map((m) => ({ ...m, ...(mealPatches[m.id] ?? {}) }));
    return [...base, ...extraMeals];
  }, [extraMeals, mealPatches, removedMealIds]);

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
          if (existing)
            return prev.map((p) => (p.mealId === mealId ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { mealId, qty }];
        });
        const m = allMeals.find((x) => x.id === mealId);
        toast.success(`Added to cart`, { description: m?.name });
      },
      remove: (mealId) => setCart((prev) => prev.filter((p) => p.mealId !== mealId)),
      setQty: (mealId, qty) =>
        setCart((prev) =>
          qty <= 0
            ? prev.filter((p) => p.mealId !== mealId)
            : prev.map((p) => (p.mealId === mealId ? { ...p, qty } : p)),
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
      markRead: (id) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
      markAllRead: () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true }))),
      remove: (id) => setNotifs((prev) => prev.filter((n) => n.id !== id)),
      clear: () => setNotifs([]),
    }),
    [notifs, setNotifs],
  );

  const authValue = useMemo<AuthCtx>(
    () => ({
      user,
      signIn: async (email, password, role = 'customer') => {
        try {
          const endpoint = role === 'vendor' ? "/vendor-login" : "/customer-login";
          const res = await api.post<{ user: User; token: string }>(endpoint, { email, password });
          localStorage.setItem("mm:token", res.token);
          setUser(res.user);
          toast.success(`Welcome back, ${res.user.name}`);
        } catch (err: any) {
          toast.error(err.message || "Login failed");
          throw err;
        }
      },
      signUp: async (name, email, password, role = 'customer', state_id = 1) => {
        try {
          const endpoint = role === 'vendor' ? "/vendor-register" : "/customer-register";
          console.log(`[Frontend] Sending to ${endpoint} with payload:`, { name, email, password, state_id });
          const res = await api.post<{ user: User; token: string }>(endpoint, { name, email, password, state_id });
          localStorage.setItem("mm:token", res.token);
          setUser(res.user);
          toast.success(`Welcome, ${res.user.name}!`);
        } catch (err: any) {
          toast.error(err.message || "Registration failed");
          throw err;
        }
      },
      signOut: () => {
        localStorage.removeItem("mm:token");
        setUser(null);
        toast("Signed out");
      },
      forgotPassword: async (email) => {
        try {
          await api.post("/forgot-password", { email });
          toast.success("Reset link sent!", { description: `Check ${email} for instructions.` });
        } catch (err: any) {
          toast.error(err.message || "Request failed");
          throw err;
        }
      },
      resetPassword: async (password, otp) => {
        try {
          await api.post("/reset-password", { password, otp });
          toast.success("Password reset successful!", { description: "You can now sign in with your new password." });
        } catch (err: any) {
          toast.error(err.message || "Reset failed");
          throw err;
        }
      },
      verifyEmail: async (token) => {
        try {
          const res = await api.post<{ user: User }>("/verify-email", { token });
          setUser(res.user);
          toast.success("Email verified!", { description: "Your account is now fully active." });
        } catch (err: any) {
          toast.error(err.message || "Verification failed");
          throw err;
        }
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
      countFor: (id, base = 0) => base + (follows.includes(id) ? 1 : 0),
    }),
    [follows, setFollows],
  );

  const ordersValue = useMemo<OrdersCtx>(
    () => ({
      items: orders,
      place: (o) => {
        const order: Order = {
          ...o,
          id: "ord-" + Math.random().toString(36).slice(2, 8),
          ts: Date.now(),
          status: "pending",
        };
        setOrders((prev) => [order, ...prev]);
        setCart([]);
        toast.success("Order placed successfully!");
        
        // Push notification for user
        setNotifs((prev) => [
          {
            id: "notif-" + Date.now(),
            ts: Date.now(),
            read: false,
            type: 'order',
            title: "Order Placed 🚀",
            body: `Your order from ${o.items[0]?.name || 'Kitchen'} has been placed.`,
            link: "/profile"
          },
          ...prev,
        ]);

        // Notify vendor
        const vId = o.items[0]?.vendorId;
        if (vId) {
          setNotifs((prev) => [
            {
              id: "notif-v-" + Date.now(),
              ts: Date.now(),
              read: false,
              type: 'order',
              title: "New Order! 🥡",
              body: `${o.address.name} placed a new order of ₦${o.total.toLocaleString()}`,
              link: "/vendor-dashboard",
              search: { tab: 'orders' }
            },
            ...prev,
          ]);
        }
        
        return order;
      },
      setStatus: (id, status) => {
        setOrders((prev) => {
          const target = prev.find((o) => o.id === id);
          if (target && target.status !== status) {
            const labels: Record<Order["status"], string> = {
              pending: "is pending",
              preparing: "is being prepared 👩‍🍳",
              "out-for-delivery": "is out for delivery 🛵",
              delivered: "has been delivered ✅",
              cancelled: "was cancelled",
            };
            const title = `Order ${target.id} ${labels[status]}`;
            const body = `${target.items.length} item(s) · ₦${target.total.toLocaleString()}`;
            setNotifs((p) => [
              { 
                id: Math.random().toString(36).slice(2), 
                ts: Date.now(), 
                read: false, 
                type: 'order',
                title, 
                body,
                link: "/profile"
              },
              ...p,
            ]);
            // Live toast for the customer
            if (status === "delivered") toast.success(title, { description: body });
            else if (status === "cancelled") toast.error(title, { description: body });
            else toast(title, { description: body });
          }
          return prev.map((o) => (o.id === id ? { ...o, status } : o));
        });
      },
    }),
    [orders, setOrders, setNotifs, setCart],
  );

  const messagesValue = useMemo<MessagesCtx>(
    () => ({
      items: messages,
      send: (vendorId, fromEmail, fromName, body) => {
        const msg = {
          id: "msg-" + Date.now(),
          vendorId,
          from: "user",
          fromEmail,
          fromName,
          body,
          ts: Date.now(),
          read: false,
        };
        setMessages((prev) => [msg as any, ...prev]);
        
        // Push notification to vendor
        setNotifs((prev) => [
          {
            id: "notif-" + Date.now(),
            ts: Date.now(),
            read: false,
            type: 'message',
            title: `Message from ${fromName}`,
            body: body.length > 60 ? body.slice(0, 57) + "..." : body,
            link: "/vendor-dashboard",
            search: { tab: 'messages' },
            data: { fromEmail, fromName }
          },
          ...prev,
        ]);
      },
      markRead: (id) =>
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m))),
      reply: (vendorId, userEmail, text, vendorName) => {
        setMessages((prev) => [
          {
            id: Math.random().toString(36).slice(2),
            ts: Date.now(),
            read: false,
            from: "vendor",
            vendorId,
            fromName: vendorName,
            fromEmail: userEmail,
            body: text,
          },
          ...prev.map((m) =>
            m.vendorId === vendorId && m.fromEmail === userEmail && m.from === "user"
              ? { ...m, read: true }
              : m,
          ),
        ]);
        // Notify the customer about the reply
        setNotifs((p) => [
          {
            id: Math.random().toString(36).slice(2),
            ts: Date.now(),
            read: false,
            type: 'message',
            title: `${vendorName} replied`,
            body: text.length > 80 ? text.slice(0, 77) + "…" : text,
            link: "/messages"
          },
          ...p,
        ]);
      },
      remove: (id) => setMessages((prev) => prev.filter((m) => m.id !== id)),
      unreadFromVendors: (userEmail) =>
        messages.filter((m) => m.from === "vendor" && !m.read && m.fromEmail === userEmail).length,
    }),
    [messages, setMessages, setNotifs],
  );

  const couponValue = useMemo<CouponCtx>(
    () => ({
      items: coupons,
      create: (c) => {
        setCoupons((prev) => [
          { ...c, id: "cp-" + Math.random().toString(36).slice(2, 8), usageCount: 0, active: true },
          ...prev,
        ]);
        toast.success(`Coupon ${c.code} created!`);
      },
      toggle: (id) => setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c)),
      remove: (id) => setCoupons((prev) => prev.filter((c) => c.id !== id)),
      validate: (code, vendorId, subtotal) => {
        const c = coupons.find((x) => x.code.toUpperCase() === code.toUpperCase() && x.vendorId === vendorId && x.active);
        if (!c) return null;
        if (c.minOrder && subtotal < c.minOrder) return null;
        if (c.expiry && Date.now() > c.expiry) return null;
        return c;
      }
    }),
    [coupons, setCoupons]
  );

  const vendorProfileValue = useMemo<VendorProfileCtx>(
    () => ({
      profile: vendorProfile ? {
        ...vendorProfile,
        deliveryAreas: (vendorProfile.deliveryAreas || []).map(a => 
          typeof a === 'string' ? { name: a, fee: 800 } : a
        )
      } : null,
      save: (data) => {
        if (vendorProfile) {
          setVendorProfile({ ...vendorProfile, ...data });
        } else {
          setVendorProfile({
            id: "v-" + Math.random().toString(36).slice(2, 8),
            ...data,
            isOpen: true,
            createdAt: Date.now(),
          });
        }
        toast.success("Vendor account ready");
      },
      toggleStatus: () => {
        if (!vendorProfile) return;
        const next = !vendorProfile.isOpen;
        setVendorProfile({ ...vendorProfile, isOpen: next });
        toast.success(next ? "Kitchen is now open!" : "Kitchen is now closed");
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

  const blogValue = useMemo<BlogCtx>(
    () => ({
      posts: blogPosts,
      create: (p) => {
        const post: BlogDraft = {
          ...p,
          id: "bp-" + Math.random().toString(36).slice(2, 8),
          ts: Date.now(),
          views: 0,
          likes: 0,
          comments: [],
        };
        setBlogPosts((prev) => [post, ...prev]);
        toast.success("Blog post published");
        return post;
      },
      update: (id, patch) =>
        setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      remove: (id) => setBlogPosts((prev) => prev.filter((p) => p.id !== id)),
      view: (id) =>
        setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p))),
      like: (id) => {
        setBlogPosts((prev) => {
          const p = prev.find((x) => x.id === id);
          if (p) {
            setNotifs((nPrev) => [
              {
                id: "notif-" + Date.now(),
                ts: Date.now(),
                read: false,
                type: 'like',
                title: "New Like! ❤️",
                body: `Someone liked your post "${p.title}"`,
                link: "/blog/$slug",
                params: { slug: id },
                data: { postId: id }
              },
              ...nPrev,
            ]);
          }
          return prev.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
        });
      },
      addComment: (id, userName, body, userAvatar) =>
        setBlogPosts((prev) => {
          const p = prev.find((x) => x.id === id);
          if (p) {
            setNotifs((nPrev) => [
              {
                id: "notif-c-" + Date.now(),
                ts: Date.now(),
                read: false,
                type: 'message',
                title: `New Comment from ${userName}`,
                body: body.length > 60 ? body.slice(0, 57) + "..." : body,
                link: "/blog/$slug",
                params: { slug: id },
              },
              ...nPrev,
            ]);
          }
          return prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  comments: [
                    ...(p.comments || []),
                    {
                      id: "bc-" + Date.now(),
                      userName,
                      body,
                      userAvatar,
                      ts: Date.now(),
                    },
                  ],
                }
              : p
          );
        }),
    }),
    [blogPosts, setBlogPosts],
  );

  const teamValue = useMemo<TeamCtx>(
    () => ({
      members: team,
      add: (m) => {
        setTeam((prev) => [
          { ...m, id: "tm-" + Math.random().toString(36).slice(2, 8), ts: Date.now(), status: "active" },
          ...prev,
        ]);
        toast.success(`${m.name} added to team`);
      },
      remove: (id) => setTeam((prev) => prev.filter((m) => m.id !== id)),
      toggleStatus: (id) =>
        setTeam((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m))
        ),
    }),
    [team, setTeam]
  );

  const deliveryAreaValue = useMemo<DeliveryAreaCtx>(
    () => ({
      area: deliveryArea,
      setArea: (a) => {
        setDeliveryAreaState(a);
        if (a) toast.success(`Showing kitchens that deliver to ${a}`);
        else toast("Delivery-area filter cleared");
      },
    }),
    [deliveryArea, setDeliveryAreaState],
  );

  const reviewValue = useMemo<ReviewCtx>(
    () => ({
      items: reviews,
      add: (r) => {
        const id = "rev-" + Math.random().toString(36).slice(2, 8);
        setReviews((prev) => [{ ...r, id, ts: Date.now() }, ...prev]);
        toast.success("Review submitted! Thank you.");
        
        // Notify vendor
        setNotifs((prev) => [
          {
            id: "notif-" + Date.now(),
            ts: Date.now(),
            read: false,
            type: 'review',
            title: `New Review for ${r.userName}`,
            body: `Rated ${r.rating} stars: "${r.body.slice(0, 40)}${r.body.length > 40 ? "..." : ""}"`,
            link: "/vendor-dashboard",
            search: { tab: 'reviews' }
          },
          ...prev,
        ]);
      },
      reply: (id, text) => {
        setReviews((prev) => prev.map((r) => r.id === id ? { ...r, reply: text } : r));
        toast.success("Response posted");
      },
      forVendor: (vid) => reviews.filter((r) => r.vendorId === vid),
    }),
    [reviews, setReviews],
  );

  const supportValue = useMemo<SupportCtx>(
    () => ({
      tickets,
      create: (t) => {
        setTickets((prev) => [{ ...t, id: "tk-" + Math.random().toString(36).slice(2, 8), ts: Date.now(), status: "open" }, ...prev]);
        toast.success("Ticket created. Support will review shortly.");
      },
      resolve: (id) => setTickets((prev) => prev.map((tk) => tk.id === id ? { ...tk, status: "resolved" } : tk)),
    }),
    [tickets, setTickets],
  );

  const loyaltyValue = useMemo<LoyaltyCtx>(
    () => ({
      points: loyalty.points,
      history: loyalty.history,
      addPoints: (amount, reason) => {
        setLoyalty((prev) => ({
          points: prev.points + amount,
          history: [{ ts: Date.now(), amount, reason }, ...prev.history],
        }));
        toast.success(`You earned ${amount} points!`, { description: reason });
      },
      redeemPoints: (amount) => {
        if (loyalty.points < amount) return false;
        setLoyalty((prev) => ({
          points: prev.points - amount,
          history: [{ ts: Date.now(), amount: -amount, reason: "Points redemption" }, ...prev.history],
        }));
        return true;
      },
    }),
    [loyalty, setLoyalty],
  );

  // seed welcome notification once
  useEffect(() => {
    if (notifs.length === 0) {
      setNotifs([
        {
          id: "welcome",
          ts: Date.now(),
          read: false,
          title: "Welcome to MenuMenu 🎉",
          body: "Discover top kitchens and order in minutes.",
        },
        {
          id: "promo",
          ts: Date.now() - 3600_000,
          read: false,
          title: "10% off your first order",
          body: "Use code TASTE10 at checkout.",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // seed demo messages for the logged-in vendor if they have none
  useEffect(() => {
    if (!vendorProfile) return;
    setMessages((prev) => {
      if (prev.some((m) => m.vendorId === vendorProfile.id)) return prev;
      return [
        ...prev,
        {
          id: `demo-msg-1-${vendorProfile.id}`,
          vendorId: vendorProfile.id,
          from: "user",
          fromName: "Sarah M.",
          fromEmail: "sarah.m@example.com",
          body: "Hi there! Do you cater for small events? I have a birthday party coming up next week.",
          ts: Date.now() - 3600000 * 24,
          read: false,
        },
        {
          id: `demo-msg-2-${vendorProfile.id}`,
          vendorId: vendorProfile.id,
          from: "user",
          fromName: "David O.",
          fromEmail: "david@example.com",
          body: "Just wanted to say the food yesterday was amazing. My kids loved it!",
          ts: Date.now() - 3600000 * 5,
          read: true,
        },
        {
          id: `demo-msg-3-${vendorProfile.id}`,
          vendorId: vendorProfile.id,
          from: "user",
          fromName: "Grace T.",
          fromEmail: "grace@example.com",
          body: "Is the spicy chicken wings meal available for pickup today by 4pm?",
          ts: Date.now() - 3600000 * 1,
          read: false,
        }
      ];
    });
  }, [vendorProfile?.id, setMessages]);

  // Browser push notifications when a vendor reply arrives for the current user
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (!user) return;
    const newest = messages.find((m) => m.from === "vendor" && m.fromEmail === user.email);
    if (!newest || newest.id === lastVendorMsgId) return;
    setLastVendorMsgId(newest.id);
    if (Notification.permission === "granted") {
      try {
        const v = allVendors.find((x) => x.id === newest.vendorId);
        new Notification(`${v?.name ?? "Kitchen"} replied`, {
          body: newest.body.length > 100 ? newest.body.slice(0, 97) + "…" : newest.body,
          icon: v?.avatar,
          tag: `mm-msg-${newest.vendorId}`,
        });
      } catch {}
    }
  }, [messages, user, lastVendorMsgId]);

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        <WishContext.Provider value={wishValue}>
          <NotifContext.Provider value={notifValue}>
            <FollowContext.Provider value={followValue}>
              <OrdersContext.Provider value={ordersValue}>
                <MessagesContext.Provider value={messagesValue}>
                  <CouponContext.Provider value={couponValue}>
                    <TeamContext.Provider value={teamValue}>
                      <ReviewContext.Provider value={reviewValue}>
                        <SupportContext.Provider value={supportValue}>
                          <VendorProfileContext.Provider value={vendorProfileValue}>
                            <VendorMenuContext.Provider value={vendorMenuValue}>
                              <BlogContext.Provider value={blogValue}>
                                <LoyaltyContext.Provider value={loyaltyValue}>
                                  <DeliveryAreaContext.Provider value={deliveryAreaValue}>
                                    {children}
                                  </DeliveryAreaContext.Provider>
                                </LoyaltyContext.Provider>
                              </BlogContext.Provider>
                            </VendorMenuContext.Provider>
                          </VendorProfileContext.Provider>
                        </SupportContext.Provider>
                      </ReviewContext.Provider>
                    </TeamContext.Provider>
                  </CouponContext.Provider>
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
export function useBlog() {
  const c = useContext(BlogContext);
  if (!c) throw new Error("BlogContext missing");
  return c;
}
export function useCoupons() {
  const c = useContext(CouponContext);
  if (!c) throw new Error("CouponContext missing");
  return c;
}
export function useTeam() {
  const c = useContext(TeamContext);
  if (!c) throw new Error("TeamContext missing");
  return c;
}
export function useReviews() {
  const c = useContext(ReviewContext);
  if (!c) throw new Error("ReviewContext missing");
  return c;
}
export function useDeliveryArea() {
  const c = useContext(DeliveryAreaContext);
  if (!c) throw new Error("DeliveryAreaContext missing");
  return c;
}
export function useSupport() {
  const c = useContext(SupportContext);
  if (!c) throw new Error("SupportContext missing");
  return c;
}
export function useLoyalty() {
  const c = useContext(LoyaltyContext);
  if (!c) throw new Error("LoyaltyContext missing");
  return c;
}

export type { Meal };
