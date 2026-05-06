# MenuMenu — Feast Finder Documentation

**Feast Finder** (MenuMenu) is a food marketplace platform built with **TanStack Start**, **React**, and **Tailwind CSS** that connects local food vendors (kitchens) with customers. It's a full-featured e-commerce/marketplace application for food ordering, vendor management, and community engagement.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Architecture](#2-core-architecture)
3. [Pages — Customer Flow](#3-pages--customer-flow)
4. [Pages — Vendor Flow](#4-pages--vendor-flow)
5. [Pages — Account & Settings](#5-pages--account--settings)
6. [Pages — Supporting Pages](#6-pages--supporting-pages)
7. [State Management](#7-state-management)
8. [Key Components](#8-key-components)

---

## 1. Project Overview

### Tech Stack
- **Framework**: TanStack Start (v1.168.0) — file-based routing, SSR-ready
- **UI Library**: React 19 + Radix UI primitives
- **Styling**: Tailwind CSS 4.x + Custom CSS properties/design tokens
- **Forms**: React Hook Form + Zod validation
- **State**: React Context (client-side stores)
- **Icons**: Lucide React
- **Toasts**: Sonner
- **Data Fetching**: TanStack Query (for async state)

### Key Features
- Marketplace with filtering, search, and pagination
- Shopping cart with multi-vendor support
- Checkout with delivery & payment options
- User accounts: orders, wishlist, messages, notifications, reviews
- Vendor dashboard: menu management, orders, blog, analytics, team, promotions
- Real-time messaging between customers and vendors
- Loyalty points system

---

## 2. Core Architecture

### Data Model
The app uses a frontend-mock data layer (`src/data/mock.ts`) with:
- **Meals**: Food items linked to vendors
- **Vendors**: Kitchen profiles with menus, areas, ratings
- **Orders**: Customer orders with status lifecycle
- **Messages**: Chat threads between users and vendors
- **Blog Posts**: Vendor-authored editorial content + MenuMenu editorial
- **Reviews**: Post-order meal ratings

### State Stores (`src/store/AppProviders.tsx`)
All state is localized to the browser via Context + localStorage:

| Store | Purpose |
|---|---|
| `Cart` | Shopping cart items grouped by vendor |
| `Wishlist` | Saved meals (heart) |
| `Auth` | Mock authentication (sign in/sign up) |
| `VendorProfile` | Current vendor's profile/business info |
| `Orders` | Placed orders with status tracking |
| `Messages` | Customer-vendor conversations |
| `Notifications` | Toast-style in-app alerts |
| `Follow` | Followed kitchen tracking |
| `Coupons` | Promo code validation |
| `Reviews` | Order reviews/ratings |
| `Team` | Vendor staff members |
| `Blog` | Blog post CRUD |
| `Loyalty` | Points for user activity |
| `Support` | Customer support tickets |

### Layout Shell
- **Root Layout** (`src/routes/__root.tsx`): Global `<Header>`, `<Footer>`, `<Outlet />`, and `<Toaster>`
- **404 Handler**: Custom NotFound component

---

## 3. Pages — Customer Flow

### `/` — Home Page (Index)
**File**: `src/routes/index.tsx`

**Features**:
- Hero section with tagline, search box, category pills
- Featured meals grid (6 items, filtered by delivery area)
- Explore meals grid (10 items in 5-column layout)
- Trending vendors marquee (infinite loop)
- Category browse grid (8 categories)
- CTA banner for vendor signup

**Key Logic**:
- Delivery area filtering via `useDeliveryArea()` hook
- Vendor matching based on user's selected area
- Responsive grids with Tailwind breakpoints

---

### `/meals` — Browse All Meals
**File**: `src/routes/meals.tsx`

**Features**:
- Full meals catalog with client-side filtering
- Sidebar filters (sticky on desktop):
  - **Search**: text query
  - **Location**: city dropdown (Lagos, Abuja, etc.)
  - **Category**: from master categories list
  - **Max price**: range slider (₦1k–6k)
  - **Dietary**: Halal, Vegetarian, Spicy
  - **Kitchen Type**: Home Kitchen, Bakery, etc.
- Active filter tags with clear (X)
- Sort dropdown (Most popular, price low/high)
- Paginated results (9 per page)
- Empty state when no matches

**State**: Local component state synced to URL query params (`category`, `sub`) via TanStack Router's `validateSearch`

**Route**: `GET /meals?category=All&sub=undefined`

---

### `/search` — Unified Search
**File**: `src/routes/search.tsx`

**Features**:
- Single search input across meals, vendors, and categories
- Real-time results split into:
  - **Kitchens** section (vendor cards)
  - **Meals** section (meal cards)
- Shows hit count for each section
- Empty state for no results

**Usage**: Hero search redirects here with query param

---

### `/vendors` — Vendor Directory
**File**: `src/routes/vendors.tsx`

**Features**:
- Grid of kitchen cards with filters:
  - Search by vendor name
  - Location dropdown
  - Category dropdown
  - Kitchen type dropdown
  - Price range ($, $$, $$$)
- Active filter tags + Reset button
- Shows vendor count: “Showing X of Y kitchens”
- Empty state with reset link

**Note**: Includes current user's vendor card if logged in as vendor (elevated to top)

---

### `/view-vendor/$vendorId` — Vendor Storefront
**File**: `src/routes/view-vendor.$vendorId.tsx`

**Features**:
- Full-bleed hero with vendor cover image + gradient overlay
- Vendor avatar, name, tagline in bottom-left
- Contact bar: location, phone, open hours (with pulse indicator)
- Action pills: **Order**, **Chat**, **Blog**, **Reviews**, **Follow/Following**
- Sticky filter/search bar above menu
- Meals grid with:
  - Availability badge (“Available Now”, “Available in 30 mins”)
  - Wishlist (heart) toggle
  - Add-to-cart button
- Contact section (collapsible card form) → sends message to vendor
- **Order status modal** is NOT shown here; that's in profile

**Route params**: `vendorId` (loaded via loader)

---

### `/meals?q=` (hero search) & `/search`
Both feed into the same search page with query parameter.

---

### `/cart` — Shopping Cart
**File**: `src/routes/cart.tsx`

**Features**:
- Grouped by vendor (`vendorId`) with summary cards
- Each vendor section:
  - Collapsible (chevron toggle)
  - Avatar + name
  - Item count
  - Subtotal, delivery fee (min from areas), discount
  - Item list with image, qty controls (＋/－), remove button
  - Promo code input (validates via `Coupons` store; fallback `TASTE10` = 10%)
  - Checkout button per vendor
- Shows delivery fee per vendor based on area
- Clear entire cart button
- Empty state: empty cart icon + “Browse meals” link

**Business Logic**:
- Delivery fee = minimum of vendor's delivery area fees
- If no areas set, defaults to ₦500
- Promo applies per-vendor discount

---

### `/checkout?vendorId=` — Checkout
**File**: `src/routes/checkout.tsx`

**Features**:
- Two-column layout: form (left), order summary (right)
- **Delivery address form**:
  - Full name, phone, street, city (dropdown from vendor areas), notes
- **Payment method**:
  - Card (form fields: number, expiry, CVV, name)
  - Transfer (bank details displayed: Wema Bank, account #, copy button)
  - Cash on delivery (info text)
- **Promo code** (same as cart)
- Order summary: items list, subtotal, delivery, discount, total
- Places order → calls `orders.place()` → clears cart → navigates to confirmation

**Route search**: `vendorId` (required)

**Side effect**: Creates `Order` record, pushes notification

---

### `/order-confirmation/$orderId` — Order Confirmed
**File**: `src/routes/order-confirmation.$orderId.tsx`

**Features**:
- Success hero with checkmark badge
- Order tracking timeline (component: `OrderTimeline`)
- Order details accordion:
  - Items list
  - Subtotal/delivery/total breakdown
  - Delivery address card
  - Payment method + status card
- CTA buttons: “View my orders” (Profile), “Continue shopping”

**Route param**: `orderId` (loader validates order exists; 404 otherwise)

**Order Timeline Stages**:
`pending → preparing → out-for-delivery → delivered` (or `cancelled`)

---

## 4. Pages — Vendor Flow

### `/vendor-signup` — Vendor Registration
**File**: `src/routes/vendor-signup.tsx`

**Features**:
- Multi-field form for business profile:
  - Business name, owner name, email, phone
  - CAC (optional)
  - Cuisine categories (multi-select toggle buttons)
  - Physical address (textarea)
  - Delivery areas (multi-select from Lagos areas list)
  - Service toggles: Delivery available, Pickup available
  - Opening/closing times (time inputs)
  - Banner image upload (`ImageUpload` component)
  - Kitchen images (multiple file input with preview grid + remove)
  - About text (textarea)
  - Password field (if user not signed in)
- Auto-sign-up if not authenticated
- On submit: saves vendor profile → redirects to `/vendor-dashboard?tab=launchpad`

**State**: Local form fields → `vendor.save()` on submit

---

### `/vendor-dashboard` — Vendor Portal
**File**: `src/routes/vendor-dashboard.tsx`

**Features** (10 sections):
1. **Command Center** (`dashboard`): KPI cards (active orders, today's sales, rating, messages), revenue SVG chart, live orders feed, quick actions, kitchen tip card
2. **Launchpad** (`launchpad`): Onboarding checklist (progress bar, steps: profile done, add meals, setup bank), CTA to add first meal
3. **Menu** (`menu`): Grid of meal cards with image, name, category, price, blurbs. Edit/Delete per item. “Add menu item” opens `MealEditor` modal. Shows meal count.
4. **Orders** (`orders`): List of orders containing this vendor's items. Each order card: ID, customer info, status dropdown (updateable), items list, subtotal for vendor's items, address. Status transitions: `pending → preparing → out-for-delivery → delivered / cancelled`
5. **Messages** (`messages`): Conversation threads grouped by customer email. Shows last message, unread indicator. Reply input inline. Mark read on open.
6. **Analytics** (`analytics`): Total revenue, completed orders, blog views, unread msgs. Best-sellers bar chart (top 5 meals by quantity)
7. **Income** (`income`): Gross sales, settled net (after 10% commission), platform fee table with order rows showing gross/fee/net
8. **Blog Manager** (`blog`): Vendor posts grid with cover image, stats (views, date). Create/Edit/Delete/Share buttons. Opens `BlogEditor` modal
9. **Promotions** (`promotions`): Coupon creation form (code, % or amount, value). Active coupons list with delete
10. **Team** (`team`): Staff member list table (name, email, role, status). Add member modal. Toggle active/suspended. Delete.

**Sidebar**:
- Vendor switcher (if multiple)
- Kitchen Open/Closed toggle switch
- “View Public Store” link
- Section navigation icons

**Route search**: `tab` (pre-selects section)

---

### `/messages` — Customer Inbox
**File**: `src/routes/messages.tsx`

**Features**:
- Split-pane layout (desktop): thread list (left) + conversation view (right)
- Thread list: vendor avatar, name, last message preview, unread dot
- Conversation view: sticky header (vendor info, back link, call/info/more icons), scrollable message feed, input bar
- Message bubbles: right-aligned (user, primary), left-aligned (vendor, white/gray)
- Auto-scroll to bottom on new messages
- Mark vendor messages as read when thread opened

**Route search**: `vendorId` (optional — pre-selects thread)

---

### `/messages/$vendorId` — Single Chat Room
**File**: `src/routes/messages.$vendorId.tsx`

**Features**:
- Dedicated chat with one vendor
- Header: vendor avatar (online green dot), name, tagline, back to inbox link (mobile), actions (phone, info, more)
- Message feed with timestamps, double-check read indicator (user messages)
- Input field with send button (disabled when empty)
- Shows “Start a conversation” empty state
- Auto-reply mock toast (first message only)

**Route param**: `vendorId` (loader resolves vendor)

---

### `/profile` — User Dashboard
**File**: `src/routes/profile.tsx`

**Features**:
- Tabbed interface (8 tabs):
  1. **Overview**: Stats cards (orders count, total spent, wishlist size, unread alerts, loyalty points), recent activity list
  2. **Orders**: Order history cards. Each: date, ID, status badge, items list, order timeline, address, total. “Rate & Review” button for delivered orders. “Report” button for issues.
  3. **Messages**: Shows thread count; “Open inbox” link (goes to `/messages`)
  4. **Transactions**: Table of all orders with date, order ID, payment method, amount
  5. **Wishlist**: Grid of saved meals (from `useWishlist`), remove per item
  6. **Notifications**: List of notification cards (unread highlighted). Click opens `NotificationModal`.
  7. **Following**: List of followed vendors with avatar, name, tagline, “Visit →” link
  8. **Loyalty**: Gold Member badge, points total, progress bar, points history (earned/spent)

**Modals**:
- `ReviewModal`: 1–5 star rating + comment textarea → posts to Reviews store
- `ReportModal`: Reason dropdown + message → creates Support ticket

**Redirect**: If user email matches vendor profile email → auto-redirect to `/vendor-dashboard`

---

## 5. Pages — Account & Settings

### `/signin` — Sign In
**File**: `src/routes/signin.tsx`

**Features**:
- Email + password fields with icons
- Submit calls `auth.signIn()`
- On success:
  - If vendor profile exists → redirect to `/vendor-dashboard`
  - Else → redirect to home (`/`)
- “Forgot password?” link (dummy)
- Links to sign up, vendor signup
- T&C + Privacy links
- Loading state on submit

---

### `/signup` — Create Account
**File**: `src/routes/signup.tsx`

**Features**:
- Name, email, password (min 6 chars)
- Same post-auth redirect logic as signin
- T&C + Privacy links

---

### `/settings` — Account & Vendor Settings
**File**: `src/routes/settings.tsx`

**Features**:
- **View toggle**: Customer / Vendor (button in top-right)
- When Vendor, shows sidebar with 9 vendor tools (Dashboard, Launchpad, Menu, Orders, Messages, Analytics, Income, Blog, Promotions, Reviews + Settings)
- **Tabs** (per view mode):

**Customer tabs**:
- **Account**: Name, email (save toast)
- **Notifications**: Toggles (order updates, promotions, newsletter)
- **Security**: Change password form

**Vendor tabs**:
- **Store Info**: Business name, tagline, opening/closing times, categories (multi-select toggle + custom), owner name, email, phone, CAC, physical address. Banner upload (`ImageUpload`). Save button.
- **Delivery**: Toggle “We offer delivery”. Delivery area table (add/remove rows with location name + fee min ₦500). Auto-suggest from Lagos areas as user types. Save button.
- **Bank & Payouts**: Bank select (GTB, Zenith, etc.), account number (10-digit pattern), account name. Save button.
- **Security**: Password change form
- **Team**: Add member modal (name, email, role dropdown incl. “Other” → custom). Member table with status badge (active/suspended), toggle status (Lock icon), delete (Trash). Filtered by current vendor.

**Route search** (URL param): `view=vendor` — forces vendor view

---

## 6. Pages — Supporting Pages

### `/profile/wishlist` — Wishlist
**File**: `src/routes/wishlist.tsx`

**Features**:
- Grid of saved meal cards
- Count badge “X saved”
- Clear all button
- Empty state → browse link

---

### `/notifications` — Notification Center
**File**: `src/routes/notifications.tsx`

**Features**:
- Notification cards with:
  - Colored icon badge (type-based: message=blue, review=orange, like=red, order=green, system=primary)
  - Title + snippet
  - “time ago” label
  - Unread highlight (border + background)
  - Dismiss (X) button
- Top bar: unread count, “Mark all read”, “Clear all”
- Click opens `NotificationModal` (expanded view)
- Notification types: `message | review | like | order | system`

---

### `/support` — Help Center
**File**: `src/routes/support.tsx`

**Features**:
- Ticket list (if any) with status badge (`open` or `resolved`)
- Each ticket: subject, order ID, timestamp, message body, status note
- Empty state → directs to orders
- Contact card at bottom: email, WhatsApp, Twitter

**Tickets** are created from `ReportModal` in profile

---

### `/blog` — Blog Hub
**File**: `src/routes/blog.tsx`

**Features**:
- Search bar across all posts
- Two sections:
  1. **From our kitchens**: Vendor-authored posts (from Blog store). Badge “Vendor”
  2. **Editorial**: MenuMenu team posts (static editorial data in `mock.ts`). Badge = category
- Post cards: cover image, title, excerpt, meta (date, views), vendor name
- Empty/no-match state

**Route search**: `vendor` (filter to specific vendor's posts)

---

### `/blog/$slug` — Single Blog Post
**File**: `src/routes/blog.$slug.tsx`

**Features**:
- Dynamic: loads either vendor post (from store) or editorial static post
- Back link
- Cover image (if present)
- Category badge (editorial only)
- Title + author info (vendor avatar/link or editorial author)
- Meta: date/read-time (editorial) or date/views (vendor)
- Like button (counts for vendor posts only; editorial posts show toast explaining)
- Share button (copies link to clipboard / native share)
- Comments section:
  - Sign-in prompt if not authenticated
  - Comment form (textarea + send) — only enabled for vendor posts
  - Comment list (avatar + name + timestamp + body)
- “Continue reading” related posts (other editorial posts)

**Loader**: Fetches static editorial post by slug; falls through to dynamic if not found

---

### `/contact` — Contact Form
**File**: `src/routes/contact.tsx`

**Features**:
- Contact cards: Phone (hours), Email (response time), Address
- Contact form (name, email, subject, message textarea)
- Submit sets local `sent = true` → shows “Sent!” confirmation
- No backend integration (demo only)

---

### `/faq` — FAQ Accordion
**File**: `src/routes/faq.tsx`

**Features**:
- Grouped by: Ordering, Delivery, Account
- Accordion UI (single open at a time)
- Collapsible Q&A pairs
- CTA card at bottom with gradient → `/contact`

---

### `/about` — About Us
**File**: `src/routes/about.tsx`

**Features**:
- PageHero (Our Story / title)
- Stats grid: 500+ Vendors, 10k+ Meals, 50k+ Customers, 20+ Cities
- Two-column section: Our story + Our values (3 cards with icons)
- Team grid: 4 team members with photo, name, role

---

### `/terms` — Terms of Service
**File**: `src/routes/terms.tsx`

**Features**:
- Legal text layout with section headings
- Numbered clauses: Platform, User Accounts, Vendor Obligations, Orders, Prohibited Activities, Limitation of Liability, Changes, Contact
- Notice box (Agreement to Terms)
- Bottom nav: Privacy Policy, Back home

---

### `/privacy` — Privacy Policy
**File**: `src/routes/privacy.tsx`

**Features**:
- Similar layout to Terms
- Sections: Data We Collect, How We Use Your Data, Data Sharing, Retention, Cookies, Your Rights, Contact
- Data subject rights bullet list
- DPO contact email

---

### `/press` — Press Page
**File**: `src/routes/press.tsx`

**Features**:
- Stats row (paid out, cities, rating)
- “As seen in” logo grid (TechCabal, Business Day, etc.)
- Latest coverage list (3 articles with outlet + date)
- Two cards: Press kit download, Media contact email

---

### `/maintenance` — Maintenance Mode
**File**: `src/routes/maintenance.tsx`

**Features**:
- Countdown timer (1h 30m start, ticks down)
- Animated wrench icon
- “We'll be back soon” message

---

## 7. State Management

All state lives in **Context Providers** wrapped by `AppProviders`:

```
AppProviders
├── CartContext          → cart state, add/remove/setQty/clear
├── WishlistContext      → wishlist ids, toggle/remove
├── AuthContext          → user object, signIn/signUp/signOut (mock)
├── VendorProfileContext → current vendor profile, save/toggleStatus
├── OrdersContext        → orders array, place/setStatus
├── MessagesContext      → messages array, send/markRead/reply
├── NotificationsContext → notif array, push/markRead/clear
├── FollowContext        → followed vendor ids, toggle/countFor
├── CouponsContext       → coupons array, validate
├── ReviewsContext       → reviews array, add
├── TeamContext          → team members array, add/remove/toggleStatus
├── BlogContext          → posts array, create/update/remove/like/view/addComment
├── LoyaltyContext       → points balance, history
└── SupportContext       → tickets array, create
```

**Persistence**: `useLocalState()` helper syncs cart, wishlist, auth, orders, messages, notifications, follow, vendor profile to `localStorage`

---

## 8. Key Components

### UI Components (`src/components/ui/`)
ShadCN-style Radix wrappers: Button, Input, Textarea, Checkbox, Card, Badge, Dialog, Dropdown, etc.

### Site Components (`src/components/site/`)
| Component | Purpose |
|---|---|
| `Header` | Top nav bar with logo, nav links, cart count, user menu |
| `Footer` | Site footer with links, newsletter signup |
| `MealCard` | Compact meal preview: image, name, price, rating, dietary tags |
| `KitchenCard` | Vendor card: avatar, name, tagline, rating, price range |
| `PageHero` | Standard page hero with eyebrow, title, subtitle |
| `OrderTimeline` | Vertical stepper showing order status progression |
| `DeliveryAreaPicker` | Multi-select toggle for Lagos areas |
| `ImageUpload` | Image upload with preview (used in vendor signup/settings) |
| `NotificationModal` | Expanded notif view with action button |
| `ContactForm` | Embedded contact form (used on vendor page too) |

### Styling
- **CSS variables** theme in `src/styles.css`: colors, gradients, shadows, radius, typography scale
- **Utility classes**: Custom `btn-primary`, `btn-ghost`, `card-mm`, `input-mm`, `textarea-mm`, `section`, `section-title`, `section-sub`, `pill`, `pill-btn`, `badge-primary`, `badge-orange`
- **Responsive**: Mobile-first Tailwind with breakpoints (sm, md, lg, xl)
- **Animations**: Marquee (vendor cards), hover scale, fade-ins

---

## 📌 Notes

- This is a **frontend demo** — no backend, all state is local (localStorage)
- **Images** are imported from `src/assets/` (photos, avatars, blog images)
- **Internationalisation**: Currency is Nigerian Naira (₦)
- **Vendor onboarding**: 3-step flow (signup → dashboard → add meals → ready)
- **Order lifecycle**: Customer adds → cart → checkout → order placed → vendor updates status → delivered → review requested

---

**Project Structure Recap**:
```
src/
├── routes/           # 36+ page components (TanStack Router file-based)
├── store/            # 15+ context providers
├── data/mock.ts      # Seed data + helpers
├── components/
│   ├── ui/          # Radix-based UI primitives
│   └── site/        # Page-specific composites
└── styles.css       # Global CSS + design tokens
```
