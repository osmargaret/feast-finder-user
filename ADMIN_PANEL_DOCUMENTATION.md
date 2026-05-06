# Feast Finder Admin Panel — Documentation

**Feast Finder Admin** (`feast-finder-admin`) is a standalone **platform administration dashboard** built with React, React Router, and Tailwind CSS. It provides **super-admin** and **admin** users with centralized control over the entire MenuMenu marketplace — from vendor management and order oversight to financial tracking, content management, and system monitoring.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Pages — Admin Flow](#4-pages--admin-flow)
5. [Pages — Super Admin Flow](#5-pages--super-admin-flow)
6. [Components](#6-components)
7. [State & Data](#7-state--data)
8. [Styling System](#8-styling-system)

---

## 1. Project Overview

### Purpose
The admin panel is the **command center** for platform operators. It sits alongside the main `feast-finder` customer/vendor app but is a completely separate codebase with its own routing, authentication, and data views.

### Key Capabilities
- **Dashboard**: Real-time metrics, revenue charts, recent orders, system health
- **Vendor Management**: Onboard, verify, moderate, and manage all kitchen partners
- **Order Oversight**: View all platform orders, filter by status, track deliveries
- **User Management**: Manage customers, support staff, and admin accounts
- **Category Management**: Create, edit, hide/show food categories
- **Super Admin Tools**: Deep system access (financials, CMS, audit logs, verification, reports, etc.)

### Target Users
- **Super Admin**: Full system access (role: `super_admin`, level: 4)
- **Admin**: Regional/platform operator with limited access (role: `admin`, level: 2–3)
- **Support Staff**: May have restricted access (role-based)

---

## 2. Tech Stack & Architecture

### Stack
- **Framework**: React 18 (Vite-powered, no SSR)
- **Routing**: React Router DOM v6.30.1
- **Data Fetching**: TanStack React Query v5.83.0
- **UI Components**: Custom + Lucide React icons
- **Styling**: Tailwind CSS 3.4.15 + CSS custom properties (dark theme)
- **Animations**: Framer Motion 11.11.17
- **Charts**: Recharts 2.15.4
- **Build Tool**: Vite 5.4.11

### Architecture

```
feast-finder-admin/
├── src/
│   ├── App.tsx                  # Router + layout wiring
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Global styles + Tailwind
│   ├── components/
│   │   ├── AdminLayout.tsx      # Protected layout wrapper
│   │   ├── Sidebar.tsx          # Main navigation
│   │   └── TopBar.tsx           # Header with search, profile, theme toggle
│   ├── context/
│   │   └── AdminAuthContext.tsx # Auth state (mock)
│   ├── lib/
│   │   └── utils.ts             # cn() helper
│   └── pages/
│       ├── Login.tsx            # Auth gate
│       ├── ForgotPassword.tsx   # Password recovery
│       ├── Dashboard.tsx        # Main metrics
│       ├── Profile.tsx          # Admin profile
│       ├── Categories.tsx       # Food category CRUD
│       ├── Vendors.tsx          # Vendor listing + onboarding
│       ├── Orders.tsx           # Order monitoring
│       ├── Users.tsx            # User management
│       ├── Settings.tsx         # Platform preferences
│       └── super-admin/         # 12 super-admin tools
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Routing Structure

```
Public Routes:
  /login
  /forgot-password

Protected Admin Routes (wrapped in AdminLayout):
  /dashboard
  /profile
  /categories
  /vendors
  /orders
  /users
  /settings

Super Admin Routes (require super_admin role):
  /super-admin/config          → GlobalConfig
  /super-admin/verify          → VendorVerification
  /super-admin/financials      → Financials
  /super-admin/cms             → BlogCMS
  /super-admin/map             → OrderMap (live map)
  /super-admin/support         → Support
  /super-admin/reviews         → Reviews moderation
  /super-admin/campaigns       → Campaigns/Promotions
  /super-admin/health         → SystemHealth
  /super-admin/leaderboards   → Leaderboards
  /super-admin/refunds        → Refunds
  /super-admin/reports        → Reports (data export)
  /super-admin/staff          → StaffAccess
  /super-admin/logs           → AuditLogs
```

**Route Protection**: All routes except `/login` and `/forgot-password` are wrapped in `AdminLayout`, which checks `useAdminAuth()` and redirects to `/login` if no user.

---

## 3. Authentication & Authorization

### AdminAuthContext (`src/context/AdminAuthContext.tsx`)

**User Object Shape**:
```typescript
interface AdminUser {
  id: string;
  name: string;
  role: string;      // "super_admin" | "admin" | "support"
  level: number;     // 1–4 (higher = more privileged)
}
```

**Current State**: Mocked — auto-logs in as Super Admin on load (user pre-set in `useState`):
```tsx
const [user, setUser] = useState<AdminUser>({
  id: "1",
  name: "Admin User",
  role: "super_admin",
  level: 4
});
```

**Exports**:
- `useAdminAuth()`: Consume auth context
- `login(credentials)`: Mock login (logs to console)
- `logout()`: Clears user
- `hasLevel(level)`: Permission check (user.level >= level)

**Authorization Pattern**:
```tsx
const { user, hasLevel } = useAdminAuth();
const isSuperAdmin = user?.role === "super_admin";

// Example gating:
if (!hasLevel(4)) return <Unauthorized />;
```

### Role Levels
| Role | Level | Access |
|---|---|---|
| Super Admin | 4 | All routes + Super Command |
| Admin | 2-3 | Platform routes only (no Super Admin) |
| Support | 1 | Limited (not fully implemented) |

---

## 4. Pages — Admin Flow

### `/login` — Admin Gateway
**File**: `src/pages/Login.tsx`

**Features**:
- Premium dark UI with gradient branding
- Email + password fields
- Show/hide password toggle
- Loading state
- Forgot password link
- Simulated login → sets user → navigates to `/dashboard`
- 256-bit encryption badge (decorative)

**Note**: No real auth — accepts any input and proceeds.

---

### `/forgot-password` — Password Recovery
**File**: `src/pages/ForgotPassword.tsx`

**Features**:
- Email input
- "Send reset link" button (mock)
- Back to login link
- Glass-morphism card design

---

### `/dashboard` — Command Center
**File**: `src/pages/Dashboard.tsx`

**Features**:

**Header**:
- Title: "Global Command" (Super Admin) or "Regional Command" (Admin)
- Role badge (Super Admin / Admin)
- Description based on role
- Current date/time display

**Primary Stats Grid** (4 cards):
1. Total Revenue (₦, trend %)
2. Active Orders (count, trend %)
3. Platform Growth (visitors, trend %)
4. Vendor Health (avg rating, active count)

**Secondary Charts**:
- **Revenue Area Chart** (7-day trend using Recharts)
- **Best Sellers Bar Chart** (top 5 meals)
- **Live Order Feed** (latest 4 orders with status)
- **Quick Stats Row**: Completion rate, avg prep time, customer satisfaction

**Role-Based Content**: Super Admin sees global metrics; Admin sees regional slice.

---

### `/profile` — Admin Profile
**File**: `src/pages/Profile.tsx`

**Features**:
- User info card (name, email, role)
- Profile edit form (name, email, avatar upload placeholder)
- Password change section
- Session info
- Logout button

---

### `/categories` — Food Category Management
**File**: `src/pages/Categories.tsx`

**Features**:
- Summary stats (total categories, total food items, most popular)
- **Categories Table**:
  - Columns: Name, Dish Count, Status (Visible/Hidden), Popularity (Low/Med/High/Ver y High), Icon, Actions
  - Row actions: Edit, Toggle visibility (eye icon), Delete
- **Add/Edit Modal**:
  - Category name
  - Icon emoji picker
  - Popularity dropdown
  - Status toggle (active/hidden)
  - Save/cancel

**State**: Local `useState` for categories array; in-memory only (no persistence).

---

### `/vendors` — Vendor Management
**File**: `src/pages/Vendors.tsx`

**Features**:
- Header: title + "Add New Partner" button (opens modal)
- **Vendors Table/Grid**:
  - Columns: ID, Name, Owner, Location, Rating, Status (Verified/Pending/Flagged), Type, Sales, Actions
  - Status badges color-coded:
    - Verified = green
    - Pending = orange
    - Flagged = red
  - Actions: View details, Edit, Verify/Reject
- **Add Vendor Modal** (partial implementation in file):
  - Business name, owner, email, phone
  - Category selection
  - Location/address
  - Bank details form
  - Submit creates new vendor entry (mock)

**Note**: Uses mock data only (`MOCK_VENDORS` constant).

---

### `/orders` — Global Order Monitoring
**File**: `src/pages/Orders.tsx`

**Features**:
- Header with "Export CSV" button
- **Stats Row** (3 cards):
  - Daily Orders (count)
  - Active Fulfillments (count)
  - Total Volume (₦)
- **Search & Filter Bar**:
  - Search input (Order ID, customer, vendor)
  - Date range picker (button)
  - Filters button (dropdown mock)
- **Orders Table**:
  - Columns: ID, Customer, Kitchen, Amount, Status, Date, Area, Actions
  - Status badges: Pending, Preparing, Out for Delivery, Delivered, Cancelled
  - Each row has MoreActions (three-dot) menu
- Pagination controls (mock)

**Interactions**: Click row → expands details (not fully implemented).

---

### `/users` — User Management
**File**: `src/pages/Users.tsx`

**Features**:
- Header + "Add New User" button
- **Users Table**:
  - Columns: Name, Email, Phone, Role (Customer/Vendor Admin), Status (Active/Suspended), Joined Date, Actions
- **Add User Modal**:
  - Form fields: Name, Email, Phone, Role dropdown, Status toggle
  - Password field (with show/hide)
  - Submit adds to table (in-memory)
- Action buttons per row: Edit, Suspend/Activate, Delete

---

### `/settings` — Platform Preferences
**File**: `src/pages/Settings.tsx`

**Features**:
- Tabs layout:
  1. **General**: Platform name, contact email, support number
  2. **Payment**: Payment provider settings (API keys, webhooks — mock fields)
  3. **Delivery**: Default delivery fees, radius limits
  4. **Notifications**: Email/SMS toggle switches
  5. **Security**: 2FA settings, session timeout
- Save button with toast feedback (mock)
- Dark/light theme toggle (also in TopBar)

---

## 5. Pages — Super Admin Flow

These routes are nested under `/super-admin/*` and require `role === "super_admin"`.

### `/super-admin/config` — Global Configuration
**File**: `src/pages/super-admin/GlobalConfig.tsx`

**Features**:
- Platform-wide toggles:
  - Maintenance mode (on/off)
  - New vendor approvals (auto/manual)
  - Guest checkout (enabled/disabled)
  - Commission rates (%)
- Regional settings:
  - Supported cities list
  - Currency display
  - Tax configuration
- API keys section (placeholder)

---

### `/super-admin/verify` — Vendor Verification
**File**: `src/pages/super-admin/VendorVerification.tsx`

**Features**:
- **Pending Vendors Count** badge
- Two-column layout:
  - Left: Vendor list (pending → reviewing → verified)
  - Right: Selected vendor detail panel
- **Vendor Card**:
  - Business name, owner, type, applied date, risk level (Low/Med/High)
  - Document checklist (ID, Health Cert, Utility Bill, CofO) with checkmarks
  - Actions: Approve, Reject, Request More Info
- Audit trail: shows verification history
- Filter by status (All, Pending, Verified, Rejected)

---

### `/super-admin/financials` — Treasury & Payouts
**File**: `src/pages/super-admin/Financials.tsx`

**Features**:
- **Revenue Chart** (Bar chart: daily revenue for 7 days)
- **Payouts Section**:
  - Table of pending/processing/completed payouts
  - Columns: ID, Vendor, Amount, Status, Date, Method
  - Actions: Approve payout, View details
- **Financial KPIs**:
  - Total platform revenue (MTD, YTD)
  - Net earnings after commission
  - Pending withdrawals sum
- Export buttons (CSV, PDF)

---

### `/super-admin/cms` — Blog & Content Management
**File**: `src/pages/super-admin/BlogCMS.tsx`

**Features**:
- Blog post listing (all vendor + editorial posts)
- Create new post button
- Post cards with:
  - Cover image preview
  - Title, excerpt, author, date, views
  - Status (Published/Draft/Archived)
- Actions: Edit, Delete, Preview, View analytics
- **Editor Modal**:
  - Title, excerpt, body (rich text mock)
  - Cover image upload
  - Author selector
  - Publish date scheduling
  - Category tags

---

### `/super-admin/map` — Live Order Map
**File**: `src/pages/super-admin/OrderMap.tsx`

**Features** (conceptual based on filename):
- Map view (likely Leaflet/MapLibre integration)
- Live order pins with status color coding
- Driver/rider location tracking (if implemented)
- Heatmap of order density
- Filter by city/area

**Note**: Implementation specifics not visible in current file reads.

---

### `/super-admin/support` — Support Desk
**File**: `src/pages/super-admin/Support.tsx`

**Features**:
- Ticket queue (all user-reported issues)
- Ticket cards:
  - Order ID reference
  - Subject, description
  - Reporter email
  - Status (Open, In Progress, Resolved)
  - Priority (Low/Med/High/Urgent)
- Assignment: assign ticket to support agent
- Internal notes field
- Resolve/Close button

---

### `/super-admin/reviews` — Review Moderation
**File**: `src/pages/super-admin/Reviews.tsx`

**Features**:
- All customer reviews across platform
- Filter by rating (1–5 stars)
- Flagged/inappropriate reviews queue
- Review detail panel:
  - Order context (what was ordered)
  - Vendor response capability
  - Hide/delete review (admin action)
- Vendor rating impact indicator

---

### `/super-admin/campaigns` — Marketing & Promotions
**File**: `src/pages/super-admin/Campaigns.tsx`

**Features**:
- Campaign list (active, scheduled, ended)
- Create campaign button → opens modal:
  - Campaign type (Discount, Free Delivery, BOGO)
  - Applicable vendors or platform-wide
  - Date range
  - Usage limits
  - Coupon code generator
- Performance metrics: impressions, conversions, redemption rate

---

### `/super-admin/health` — System Health
**File**: `src/pages/super-admin/SystemHealth.tsx`

**Features**:
- System status overview:
  - Uptime (99.9%)
  - Response time (ms)
  - Error rate (0.01%)
- Service health cards:
  - Database (Postgres/Supabase)
  - Payment gateway (Paystack/Stripe)
  - SMS/Email provider
  - Storage (S3/Cloudinary)
- Recent error log entries
- Incident history (past 30 days)
- Manual health check button

---

### `/super-admin/leaderboards` — Top Sellers
**File**: `src/pages/super-admin/Leaderboards.tsx`

**Features**:
- Leaderboard table:
  - Vendor name, total sales, order count, avg rating
  - Rank (1st, 2nd, 3rd with medals/icons)
  - Growth % vs last period
- Time filter: Daily, Weekly, Monthly, All-time
- Export rankings (CSV)
- "Spotlight" section: featured vendor of the month

---

### `/super-admin/refunds` — Refund Center
**File**: `src/pages/super-admin/Refunds.tsx`

**Features**:
- Refund requests table:
  - Order ID, customer, vendor, amount, reason, date
  - Status: Requested, Approved, Denied, Processed
- Refund approval workflow:
  - View order details
  - Approve/deny with reason
  - Process refund via payment provider (mock)
- Refund analytics (total refunded, rate, common reasons)

---

### `/super-admin/reports` — Data Export
**File**: `src/pages/super-admin/Reports.tsx`

**Features**:
- Report type selector:
  - Sales Summary
  - Vendor Performance
  - Customer Activity
  - Financial Statements
- Date range picker
- Format options: CSV, PDF, Excel
- Generate button → downloads mock file
- Recent exports list (download again)

---

### `/super-admin/staff` — Staff Access
**File**: `src/pages/super-admin/StaffAccess.tsx`

**Features**:
- Staff member list (admin users):
  - Name, email, role, status (Active/On Leave/Suspended)
  - Last login timestamp
- Invite new staff member:
  - Email invite
  - Role assignment (Admin, Support, Analyst)
  - Permission set selection
- Role management:
  - Create/edit roles
  - Permission checkboxes (read/write per section)
- Session management: view active sessions, revoke

---

### `/super-admin/logs` — Audit Logs
**File**: `src/pages/super-admin/AuditLogs.tsx`

**Features**:
- Log table with columns:
  - Timestamp
  - User (who performed action)
  - Action type (e.g., "vendor.verified", "order.status_update")
  - Target (e.g., vendor ID, order ID)
  - IP address, User Agent
- Filters:
  - By user
  - By action type
  - Date range
- Export logs (JSON/CSV)
- Real-time log feed toggle (live updates)

---

## 6. Components

### `AdminLayout` (`src/components/AdminLayout.tsx`)
**Wrapper** for all protected pages.

**Features**:
- Auth guard (redirects to `/login` if no user)
- Loading spinner during auth check (1s simulated delay)
- Two-column layout:
  - Left: Fixed `<Sidebar />` (width: 288px / w-72)
  - Right: `<main>` with scrollable content area
- Top bar inside main content area (`<TopBar />`)
- Content container max-width: 1600px, padded

---

### `Sidebar` (`src/components/Sidebar.tsx`)
**Main navigation** with role-based visibility.

**Structure**:
```
Logo + Brand (FEAST COMMAND) at top

Group: "Platform"
  - Dashboard
  - Food Categories
  - Vendors
  - Orders
  - User Base

Group: "Super Command" (visible to super_admin only)
  - System Setup
  - Review Requests
  - Treasury & Payouts
  - Blog & CMS
  - Live Map
  - Support Desk
  - Customer Reviews
  - Marketing
  - System Health
  - Top Sellers
  - Refund Center
  - Download Data
  - Staff Access
  - Audit Logs

Separator → "Preferences"
  - Settings
```

**Styling**:
- Dark glass-morphism card (blur, border, semi-transparent)
- Active route highlight: primary color background + glow + text-glow
- Icons with `strokeWidth` and `size={18}`
- Custom scrollbar in nav area

**Auth Check**: `useAdminAuth()` to get user role; filters Super Command section if not `super_admin`.

---

### `TopBar` (`src/components/TopBar.tsx`)
**Header** with global actions.

**Features**:
- **Global Search** (Cmd+K / Ctrl+K hotkey):
  - Spotlight-style modal with backdrop blur
  - MOCK_RESULTS list (vendors, orders, pages, customers)
  - Keyboard nav hints (ESC, ENTER)
- **Profile Dropdown**:
  - Avatar (gradient circle with initial)
  - Name + role display
  - Dropdown items:
    - Edit Profile
    - Security Settings
    - Preferences
    - Theme toggle (Dark/Light)
  - Log Out button (destructive style)
- **Notifications Bell** icon with red dot indicator (static)
- **Current Time** display (updates via browser)

**Theme Toggle**:
- Persists to `localStorage.theme`
- Toggles `dark` class on `<html>`
- Icon switches between Sun/Moon

**Search Modal**:
- Fixed inset overlay with blur
- Auto-focus on input
- Rendered conditionally with `isSearchOpen` state

---

## 7. State & Data

### Current State Management
**All state is local (in-memory)** — no real backend or data persistence.

**Auth**: `AdminAuthContext` holds `user` object; auto-set to Super Admin on mount.

**Page Data**: Each page defines its own `MOCK_*` constants:
- `MOCK_VENDORS` ( Vendors.tsx)
- `MOCK_ORDERS` (Orders.tsx)
- `MOCK_USERS` (Users.tsx)
- `MOCK_CATEGORIES` (Categories.tsx)
- `MOCK_PENDING_VENDORS` (VendorVerification.tsx)
- `MOCK_REVENUE_DATA` (Financials.tsx)
- etc.

**Local UI State**:
- Modal open/close (`isModalOpen`)
- Form field values (controlled inputs)
- Table filters (search query, status filter)
- Theme toggle (dark mode)

**No React Query usage yet** — data fetching not implemented; charts use static arrays.

---

## 8. Styling System

### Theme
**Dark-first design** with CSS custom properties defined in `index.css`.

**Color Tokens** (Tailwind `hsl()` variables):
```css
--background: 222.2 84% 4.9%   /* Deep blue-black */
--foreground: 210 40% 98%
--primary: 24 100% 50%          /* #f97316 (orange) */
--primary-foreground: 0 0% 100%
--secondary: 217.2 32.6% 17.5%  /* Muted blue-gray */
--muted: 217.2 32.6% 17.5%
--muted-foreground: 215 20.2% 65%
--card: 222.2 84% 4.9%
--border: 217.2 32.6% 17.5%
```

### Glass Card (Glassmorphism)
**Custom CSS class**: `.glass-card`
```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
```

### Premium Gradient
**Custom CSS**: `.premium-gradient`
```css
background: linear-gradient(135deg, var(--color-primary) 0%, #ff6b00 100%);
```
Used for branding (logo icon, primary buttons).

### Animations
Tailwind `animate-*` classes + custom `@keyframes` in CSS:
- `fade-in`: opacity 0 → 1
- `fade-up`: translateY + opacity
- `zoom-in-95`: scale 0.95 → 1
- Duration 200–1000ms, easing `ease-out`

Framer Motion used for complex transitions (Dashboard charts, modal enters).

### Typography
- **Font**: 'Outfit' (Google Font) — loaded in `index.html`
- **Weights**: 100–900 (variable)
- **Tracking**: Uppercase elements use `tracking-[0.2em]` or `tracking-wider`
- **Font-black** for headings and labels

### Shadows & Glows
- **Glow effect**: `drop-shadow`, `text-glow` on active nav
- **Card shadows**: `shadow-xl`, `shadow-2xl` with primary color spread (`shadow-primary/20`)

---

## 🎯 Key Observations

### Duplicate Import Error
**Current dev server error** in `App.tsx`:
```
Identifier 'StaffAccess' has already been declared.
```
Likely cause: `StaffAccess` imported twice (once on line 15, potentially again inline). **Fix**: Check for duplicate import statements — ensure each component is imported only once.

**JSX Error in Sidebar.tsx**:
```
Expected corresponding JSX closing tag for <div>. (97:14)
```
Line 97 shows `</NavLink>` but the opening tag structure may be mismatched. Verify the JSX structure around the nav items map — likely a missing closing tag on a wrapper element.

### Missing Implements
- **Authentication**: Mock only — needs real backend integration
- **Data Persistence**: All data is local; changes lost on refresh
- **Real-time Updates**: No WebSocket/polling; static
- **Export Functions**: CSV/PDF buttons are UI-only

### Design Language
- **Dark mode** only (obsidian/dark slate base)
- **Accent color**: Orange (`#f97316`)
- **Rounded corners**: Extreme (`rounded-2xl`, `rounded-[3rem]`)
- **Glassmorphism**: Heavy use of blur, transparency, borders
- **Typography**: Bold, uppercase tracking for labels

---

## 📦 Dependencies Summary

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI rendering (v18.3) |
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Data fetching (not yet used) |
| `lucide-react` | Icon library |
| `recharts` | Revenue/analytics charts |
| `framer-motion` | Animations & transitions |
| `tailwindcss` | Utility CSS |
| `clsx` + `tailwind-merge` | Conditional classnames (`cn()` helper) |
| `vite` | Build tool |
| `typescript` | Type safety |

---

## 🚀 Getting Started

### Install & Run
```bash
cd feast-finder-admin
npm install
npm run dev
```
Runs at `http://localhost:8083` (auto-switches if port busy).

### Build
```bash
npm run build
```
Outputs to `dist/` folder.

### Lint
```bash
npm run lint
```

---

## 🔐 Future Integration Points

1. **API Connection**: Replace mock data with REST/GraphQL endpoints
2. **Auth**: Connect to real admin auth (e.g., Supabase Auth, Clerk)
3. **RBAC**: Implement role-based permission checks (not just `role === "super_admin"`)
4. **Real-time**: WebSocket for live orders, notifications
5. **File Uploads**: Cloud storage for vendor documents, blog images
6. **Email**: Transactional emails (verification, payout notices)
7. **Audit Logging**: Actual audit trail, not just placeholder

---

## 📂 File Structure Reference

```
feast-finder-admin/
├── src/
│   ├── App.tsx                 # Route definitions
│   ├── main.tsx                # React entry
│   ├── index.css               # Theme + Tailwind imports
│   ├── components/
│   │   ├── AdminLayout.tsx     # Protected layout
│   │   ├── Sidebar.tsx         # Navigation
│   │   └── TopBar.tsx          # Header
│   ├── context/
│   │   └── AdminAuthContext.tsx# Auth provider
│   ├── lib/
│   │   └── utils.ts            # cn() helper
│   └── pages/
│       ├── Login.tsx
│       ├── ForgotPassword.tsx
│       ├── Dashboard.tsx
│       ├── Profile.tsx
│       ├── Categories.tsx
│       ├── Vendors.tsx
│       ├── Orders.tsx
│       ├── Users.tsx
│       ├── Settings.tsx
│       └── super-admin/        # 12 super admin pages
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

**Note**: This admin panel is a **work-in-progress** with mock data and simulated auth. It's designed for platform operators to monitor and manage the MenuMenu marketplace but requires backend integration to become production-ready.
