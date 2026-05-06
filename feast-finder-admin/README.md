# 🍽️ Feast Finder Admin

> **Platform Command Center** — Central dashboard for managing the Feast Finder marketplace.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-blue?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 Overview

Feast Finder Admin is a **standalone administration dashboard** that provides complete oversight and control over the Feast Finder food marketplace. It enables platform operators to:

- Monitor real-time metrics and revenue
- Manage vendors (onboarding, verification, moderation)
- Oversee all platform orders
- Handle customer support tickets
- Configure platform-wide settings
- Access super-admin tools (financials, CMS, audit logs, and more)

Built with **React 18**, **React Router v6**, **Tailwind CSS**, and **Vite**.

---

## ✨ Features

### Admin Dashboard
- Real-time KPIs: revenue, orders, growth, vendor health
- Interactive charts (Recharts) — 7-day revenue trend, best sellers
- Live order feed with status tracking
- Quick stats: completion rate, avg prep time, satisfaction

### Vendor Management
- View all kitchen partners
- Onboard new vendors (modals with forms)
- Verify/flag vendor accounts
- Edit vendor details, menu, operating hours
- Document upload (KYC)

### Order Oversight
- Global order monitoring
- Search by Order ID, customer, kitchen
- Filter by status, date range, location
- Status updates (pending → preparing → out → delivered)
- Export to CSV

### Category & Menu Management
- Create, edit, delete food categories
- Toggle category visibility
- Set popularity ranking
- Icon/emoji assignment

### User Management
- Customer and staff account management
- Role assignment (Customer, Vendor Admin, Support)
- Status control (Active, Suspended)
- Password resets

### Super Admin Suite (Role: `super_admin`)
- **Global Config** — Platform toggles, commission rates, region settings
- **Vendor Verification** — KYC review workflow, document validation
- **Financials** — Treasury, payouts, revenue charts, financial reports
- **Blog CMS** — Content management system for blog posts
- **Live Map** — Geographic order tracking (map view)
- **Support Desk** — Ticket queue, assignment, resolution
- **Reviews** — Content moderation, rating oversight
- **Campaigns** — Marketing promotion creation
- **System Health** — Uptime, error rates, service status
- **Leaderboards** — Top-performing vendors
- **Refunds** — Refund request processing
- **Reports** — Data export (CSV, PDF, Excel)
- **Staff Access** — Admin user management, roles, permissions
- **Audit Logs** — Complete action history, filters, export

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd feast-finder-admin
npm install
```

### Development
```bash
npm run dev
```
Opens at `http://localhost:8083` (auto-increments if busy).

### Build
```bash
npm run build
```
Outputs optimized static files to `dist/`.

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 18.3 |
| **Build Tool** | Vite 5.4 |
| **Routing** | React Router DOM 6.30 |
| **Styling** | Tailwind CSS 3.4 |
| **Icons** | Lucide React 0.462 |
| **Charts** | Recharts 2.15 |
| **Animations** | Framer Motion 11.11 |
| **Data Fetching** | TanStack React Query 5.83 |
| **Language** | TypeScript 5.6 |

---

## 📁 Project Structure

```
feast-finder-admin/
├── src/
│   ├── App.tsx                  # Route definitions
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Tailwind + theme
│   ├── components/
│   │   ├── AdminLayout.tsx      # Protected layout wrapper
│   │   ├── Sidebar.tsx          # Main navigation
│   │   └── TopBar.tsx           # Header (search, profile, theme)
│   ├── context/
│   │   └── AdminAuthContext.tsx # Auth provider (mock)
│   ├── lib/
│   │   └── utils.ts             # cn() — class merger
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
│       └── super-admin/         # 12 super admin pages
├── public/                      # Static assets (optional)
├── index.html                   # HTML template
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                  # Vercel deployment config
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## 🔐 Authentication

**Current State**: Mock authentication — auto-logs in as Super Admin.

**User Object**:
```typescript
{
  id: "1",
  name: "Admin User",
  role: "super_admin",  // or "admin", "support"
  level: 4              // 1-4 (higher = more access)
}
```

**To Connect Real Auth**:
Replace `AdminAuthContext.tsx` with your auth provider (Clerk, Supabase, NextAuth, etc.). The `useAdminAuth()` hook is used throughout the app.

---

## 🎨 Styling

### Theme
Dark-first design with CSS custom properties:
- Background: `hsl(222 47% 6%)` — deep blue-black
- Primary: `hsl(38 92% 50%)` — vibrant orange (#f97316)
- Muted foreground: `hsl(215 20% 65%)`

### Components
- **Glass Card**: Translucent backgrounds, blur, subtle borders
- **Premium Gradient**: Orange gradient primary buttons
- **Typography**: 'Outfit' font, ultra-bold headings, uppercase tracking

### Utilities
- `cn()` — merges Tailwind classes with `tailwind-merge`
- Custom classes: `.glass-card`, `.premium-gradient`, `.text-glow`

---

## 📦 Deployment to Vercel

### Quick Deploy (CLI)
```bash
cd feast-finder-admin
npm ci
vercel --prod
```

### Via GitHub
1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Vercel auto-detects Vite
4. Set environment variables
5. Deploy

### Environment Variables (Vercel Dashboard)
```
VITE_API_URL=https://api.yourdomain.com
VITE_AUTH_SECRET=your-secret
VITE_APP_URL=https://admin.feastfinder.com
NODE_ENV=production
```

**Note**: Prefix with `VITE_` to expose to client.

### Config
`vercel.json` is pre-configured:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: `vite`
- Region: `iad1` (US East) — change if needed

---

## 🔧 Configuration Files

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite build config (path alias: `@` → `src/`) |
| `tailwind.config.js` | Tailwind + color theme extensions |
| `tsconfig.json` | TypeScript settings (strict mode) |
| `vercel.json` | Vercel deployment config |
| `.env.example` | Environment variable template |

---

## 🐛 Known Issues & TODOs

### Current Bugs
- **Sidebar JSX warning**: Potential tag mismatch (should be fixed; verify in browser)
- **App.tsx import duplication warning**: Old error — should be resolved

### Missing Features
- Real authentication flow (currently mock)
- API integration (all data is in-memory MOCK_* constants)
- Persistent state (no database)
- Role-based access control (only UI-level check)
- Audit logging (placeholder page)
- Live order map (page exists but no map implementation)
- File uploads (placeholders only)
- Export functionality (CSV buttons are UI-only)

---

## 🔐 Role-Based Access

Routes are protected by `AdminLayout`. Role checks are simple:

```tsx
const { user, hasLevel } = useAdminAuth();
const isSuperAdmin = user?.role === "super_admin";

// Super admin routes rendered only if isSuperAdmin
{isSuperAdmin && (
  <Route path="/super-admin/config" element={<GlobalConfig />} />
)}
```

**Permission Levels**:
- Level 4: Super Admin (full access)
- Level 3: Senior Admin
- Level 2: Admin
- Level 1: Support/Viewer

---

## 📊 Data Flow (Current)

```
AdminAuthContext (user state)
    ↓
Page Components (Dashboard, Vendors, Orders...)
    ↓
MOCK_* constants (in-file data)
    ↓
Local useState for UI (modals, filters, forms)
```

No external API calls yet. Ready for integration.

---

## 🤝 Contributing

This is an internal admin panel for Feast Finder. To extend:

1. Add new page in `src/pages/`
2. Add route in `App.tsx` (protected) or `super-admin/` (if super admin)
3. Use `useAdminAuth()` for user/role info
4. Follow existing styling patterns (glass-card, premium-gradient)
5. Add to Sidebar if top-level navigation needed

---

## 📝 License

Proprietary — FeasFinder platform code.

---

## 🏗️ Architecture Notes

- **SPA**: Single-page app with client-side routing
- **State**: No global state management yet (each page manages its own UI state)
- **Charts**: Recharts with static arrays — replace with API data
- **Theme**: Dark-only, but theme toggle present (inactive — requires CSS variable expansion)
- **Build**: Vite with alias `@` for `src/`, ES modules

---

## 🎯 Future Integration Checklist

- [ ] Connect to backend API (REST/GraphQL)
- [ ] Replace AdminAuthContext with real auth (Clerk/Supabase)
- [ ] Add React Query for data fetching + caching
- [ ] Implement real-time updates (WebSocket/Polling)
- [ ] Add error boundaries + better error handling
- [ ] Add form validation (Zod + React Hook Form)
- [ ] Enable export functionality (CSV, PDF)
- [ ] Add confirmation dialogs for destructive actions
- [ ] Write unit tests (Vitest)
- [ ] Add accessible labels (ARIA)
- [ ] Implement actual audit logging
- [ ] Add image upload to cloud (Cloudinary, S3)

---

## 📞 Support

For questions about deployment or extending the admin panel:
- Check Vercel logs: `vercel logs <project>`
- Review `vercel.json` configuration
- Ensure environment variables are set in Vercel dashboard

---

**Status**: ✅ **Ready for Vercel deployment** — just run `vercel`!

Deployed admin panels give you **command center** visibility over your entire marketplace.
