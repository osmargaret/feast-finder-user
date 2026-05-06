import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Search, 
  Check, 
  Plus, 
  Heart, 
  Newspaper, 
  ChevronRight,
  Filter
} from "lucide-react";
import { vendors, vendorById, type Meal } from "@/data/mock";
import { 
  useAuth, 
  useFollow, 
  useMessages, 
  useVendorMenu, 
  useReviews, 
  useVendorProfile,
  useCart,
  useWishlist
} from "@/store/AppProviders";
import { toast } from "sonner";
import { formatPrice } from "@/data/mock";

export const Route = createFileRoute("/view-vendor/$vendorId")({
  loader: ({ params }) => {
    return { vendorId: params.vendorId };
  },
  component: ViewVendorPage,
});

// Mock wait times for demonstration
const MEAL_STATUSES = [
  "Available Now",
  "Available in 30 mins",
  "Available in 15 mins",
  "Available Now",
];

function ViewVendorPage() {
  const { vendorId } = Route.useLoaderData();
  const vendorCtx = useVendorProfile();
  const menu = useVendorMenu();
  const cart = useCart();
  const wish = useWishlist();
  const follow = useFollow();
  const auth = useAuth();
  const reviews = useReviews();
  const [q, setQ] = useState("");
  
  // Resolve the vendor
  const vendor = useMemo(() => {
    // If this is our own vendor, prioritize the reactive context profile
    if (vendorCtx.profile && vendorCtx.profile.id === vendorId) {
      return {
        id: vendorCtx.profile.id,
        name: vendorCtx.profile.businessName,
        avatar: vendorCtx.profile.images[0] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100",
        cover: vendorCtx.profile.bannerUrl || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
        followers: "0",
        followerCount: 0,
        rating: 5,
        tagline: vendorCtx.profile.tagline || "New kitchen",
        type: vendorCtx.profile.categories[0] || "Home Kitchen",
        location: vendorCtx.profile.address,
        deliveryAreas: vendorCtx.profile.deliveryAreas || [],
        deliveryAvailable: vendorCtx.profile.deliveryAvailable,
        pickupAvailable: vendorCtx.profile.pickupAvailable,
        openHours: vendorCtx.profile.openHours,
      };
    }

    const mockVendor = vendorById(vendorId);
    return mockVendor || null;
  }, [vendorId, vendorCtx.profile]);

  const vendorMeals = useMemo(() => {
    return menu.meals.filter(m => m.vendorId === vendorId);
  }, [menu.meals, vendorId]);
  
  const filteredMeals = useMemo(() => {
    if (!q) return vendorMeals;
    return vendorMeals.filter(m => 
      m.name.toLowerCase().includes(q.toLowerCase()) || 
      m.category.toLowerCase().includes(q.toLowerCase())
    );
  }, [q, vendorMeals]);

  if (!vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-2xl font-black">Vendor not found</h1>
          <Link to="/vendors" className="btn-primary mt-4 inline-flex">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const isFollowing = follow.has(vendor.id);

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Section - Full Image Background */}
      <section className="relative h-[450px] w-full overflow-hidden">
        <img 
          src={vendor.cover} 
          alt={vendor.name} 
          className="h-full w-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Bottom Overlay Info */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="container-mm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={vendor.avatar} 
                    alt={vendor.name} 
                    className="h-20 w-20 rounded-2xl border-4 border-white/20 object-cover shadow-2xl" 
                  />
                  <div>
                    <h1 className="text-4xl font-black text-white sm:text-5xl">{vendor.name}</h1>
                    <p className="text-lg font-medium text-white/80">{vendor.tagline}</p>
                  </div>
                </div>
                
                {/* Vendor Contact/Hours/Address Bar */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {vendor.location || "Location not set"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    {vendorCtx.profile?.phone || "+234 801 234 5678"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {vendor.openHours ? `${vendor.openHours.start} – ${vendor.openHours.end}` : "10:00 AM – 9:00 PM"}
                  </div>
                </div>
              </div>

              {/* Pill Buttons Action Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar lg:pb-0 lg:flex-nowrap">
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-green-400 border border-green-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  {vendorCtx.profile?.isOpen !== false ? "Open" : "Closed"}
                </span>
                <a href="#menu" className="pill-btn shrink-0 bg-primary text-white shadow-lg shadow-primary/25">
                  Order
                </a>
                <Link 
                  to="/messages/$vendorId" 
                  params={{ vendorId: vendor.id }}
                  className="pill-btn shrink-0 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                >
                  <MessageSquare className="h-3 w-3" /> Chat
                </Link>
                <Link 
                  to="/blog" 
                  search={{ vendor: vendor.id }}
                  className="pill-btn shrink-0 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                >
                  <Newspaper className="h-3 w-3" /> Blog
                </Link>
                <button className="pill-btn shrink-0 bg-white/10 text-white backdrop-blur-md hover:bg-white/20">
                  <Star className="h-3 w-3" /> {reviews.forVendor(vendor.id).length} Reviews
                </button>
                <button 
                  onClick={() => follow.toggle(vendor.id)}
                  className={`pill-btn shrink-0 backdrop-blur-md transition ${isFollowing ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                  {isFollowing ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />} 
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Area */}
      <section id="menu" className="sticky top-20 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container-mm py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${vendor.name}'s menu...`} 
                className="w-full rounded-2xl bg-secondary/50 px-10 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold hover:bg-secondary transition-colors">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
              <div className="h-6 w-px bg-border mx-2" />
              <p className="text-xs font-bold text-muted-foreground">
                Showing {filteredMeals.length} items
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meals Grid */}
      <section className="section pt-10">
        <div className="container-mm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMeals.map((meal, idx) => {
              const inWishlist = wish.has(meal.id);
              const status = MEAL_STATUSES[idx % MEAL_STATUSES.length];
              const isAvailable = status.includes("Now");

              return (
                <div key={meal.id} className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-border transition-all hover:shadow-2xl hover:-translate-y-1">
                  {/* Meal Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={meal.image} 
                      alt={meal.name} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Availability Badge */}
                    <div className={`absolute left-5 top-5 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg ${
                      isAvailable 
                        ? "bg-primary text-white" 
                        : "bg-orange-500 text-white"
                    }`}>
                      {status}
                    </div>
                    
                    <button 
                      onClick={() => {
                        wish.toggle(meal.id);
                        toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
                      }}
                      className={`absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full transition-all ${
                        inWishlist 
                          ? "bg-primary text-white" 
                          : "bg-white/20 text-white backdrop-blur-md hover:bg-white"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${inWishlist ? "fill-white" : ""}`} />
                    </button>
                  </div>

                  {/* Meal Info */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-black leading-tight text-foreground">{meal.name}</h3>
                      <span className="text-xl font-black text-primary">{formatPrice(meal.price)}</span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-muted-foreground line-clamp-2">
                      {meal.blurb || "Delicious freshly cooked meal from our kitchen."}
                    </p>
                    
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        20-30 min
                      </div>
                      <button 
                        onClick={() => {
                          cart.add(meal.id, 1);
                          toast.success(`${meal.name} added to cart`);
                        }}
                        className="btn-primary rounded-2xl px-5 py-2.5 text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                      >
                        <Plus className="mr-1.5 h-4 w-4" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMeals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 rounded-3xl bg-secondary/50 p-8">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-black">No meals found</h3>
              <p className="text-muted-foreground mt-2 font-medium">Try adjusting your search or check another category.</p>
              <button onClick={() => setQ("")} className="mt-6 btn-secondary px-8">Clear Search</button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-secondary/30">
        <div className="container-mm">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[3rem] bg-white shadow-xl ring-1 ring-border lg:flex">
            <div className="bg-primary p-10 text-white lg:w-1/3">
              <h2 className="text-3xl font-black">Contact Us</h2>
              <p className="mt-4 font-medium opacity-80 text-sm">Have a question or a special request? Send us a message and we'll get back to you shortly.</p>
              
              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60">Call us</p>
                    <p className="font-bold text-sm">+234 801 234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60">Visit us</p>
                    <p className="font-bold text-sm">{vendor.location || "Lagos, Nigeria"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-10 lg:flex-1">
               <ContactForm vendorId={vendor.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style>{`
        .pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .pill-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </main>
  );
}

function ContactForm({ vendorId }: { vendorId: string }) {
  const auth = useAuth();
  const { sendMessage } = useApiMessages();
  const [body, setBody] = useState("");
  const [name, setName] = useState(auth.user?.name || "");
  const [email, setEmail] = useState(auth.user?.email || "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return toast.error("Please enter a message");
    
    // If not authenticated, we'd normally redirect to login or handle guest message
    // For now, we assume auth.user.id is available if we want to send a real message
    if (!auth.user) return toast.error("Please sign in to send a message");

    sendMessage.mutate({
      vendor_id: vendorId,
      body: body,
    }, {
      onSuccess: () => {
        setBody("");
        toast.success("Message sent to vendor!");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to send message");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[10px] font-black uppercase text-muted-foreground">Your Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold" 
            placeholder="John Doe"
            disabled={!!auth.user}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-muted-foreground">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold" 
            placeholder="john@example.com"
            disabled={!!auth.user}
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase text-muted-foreground">Message</label>
        <textarea 
          rows={4} 
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="textarea-mm" 
          placeholder="How can we help you?"
          disabled={sendMessage.isPending}
        />
      </div>
      <button 
        type="submit" 
        className="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50"
        disabled={sendMessage.isPending}
      >
        {sendMessage.isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
