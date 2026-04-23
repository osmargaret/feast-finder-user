# MenuMenu (Feast Finder) Exhaustive Documentation

MenuMenu is a premium, localized food marketplace connecting customers with verified home kitchens, bakeries, restaurants, and street food vendors. This document provides a granular breakdown of every feature, user flow, and management tool available in the ecosystem.

---

## 1. Customer Experience & Discovery

### 🏠 The Landing Page (Home)
- **Dynamic Hero Section**: High-impact visuals with a global search bar for meals and kitchens.
- **Delivery Area Picker**: Users select from predefined Lagos areas (Lekki, Ikeja, Surulere, etc.) or other cities (Abuja, PH, Ibadan). The entire marketplace dynamically filters based on the vendor's delivery radius.
- **Discovery Grids**:
  - **Featured Meals**: Hand-picked dishes from top-rated kitchens.
  - **Explore Grid**: A 5x2 responsive layout for broader discovery.
  - **Trending Kitchens**: Follow-able vendor profiles with live stats.
- **Category Navigation**: 8 primary categories with custom icons (Rice, Soups, Swallow, Pastries, Grills, Breakfast, Seafood, Confectioneries).

### 🛒 The Marketplace (`/meals`)
- **Advanced Filtering**:
  - **Search**: Real-time text search for specific dishes.
  - **Price Slider**: ₦1,000 to ₦7,500+ granularity.
  - **Dietary Badges**: Filter by Halal, Spicy, or Vegetarian requirements.
  - **Sorting**: Most Popular, Lowest Price, Highest Price.
- **Interactive Meal Cards**: Displaying "🔥 Featured", "⭐ Top Rated", or "🌶️ Spicy" badges alongside preparation time blurbs.

### 💳 Checkout & Fulfillment Flow
1. **Shopping Cart**: Slide-over management for quantities and order subtotals.
2. **Delivery Information**: Collection of recipient name, phone, street address, and optional delivery notes (e.g., gate codes).
3. **Multi-Channel Payment**:
  - **Card**: Secure input for card number, expiry, and CVV.
  - **Bank Transfer**: Integrated instructions for transfer to "MenuMenu Marketplace Ltd" (Wema Bank), including a one-click account number copy feature.
  - **Cash on Delivery**: Option for manual settlement upon arrival.
4. **Order Confirmation**: A dedicated `/order-confirmation/$orderId` page with a success state and next steps.

---

## 2. User Personalization & Activity

### 👤 Profile Dashboard (`/profile`)
A 7-tab command center for the customer:
- **Overview**: High-level stats on total orders, total spent (₦), wishlist count, and unread notifications.
- **Orders History**: Detailed list of past and active orders. Includes an **Order Timeline** showing status progression (Pending → Preparing → Out for Delivery → Delivered).
- **Messages**: Real-time inbox for conversations with vendors.
- **Transactions**: A formal ledger showing date, order ID, payment method, and exact amount paid.
- **Wishlist**: A curated collection of "Hearted" meals for quick re-ordering.
- **Following**: A list of subscribed kitchens to stay updated on new menu drops.
- **Notifications**: Real-time alerts for order status changes and promo updates.

---

## 3. Vendor Command Center (`/vendor-dashboard`)

This is the end-to-end management suite for food businesses, organized into 7 functional modules:

### 🍱 Menu Manager
- **CRUD Operations**: Full control over meal listings.
- **Rich Media**: Integrated `ImageUpload` component for high-quality food photography.
- **Categorization**: Ability to map meals to specific categories and subcategories (e.g., Swallow → Pounded Yam).

### 📦 Order Fulfillment
- **Live Queue**: Real-time list of incoming orders with customer contact and delivery address.
- **Status Control**: Vendors manually trigger status updates (Preparing, Ready, etc.) which notify the customer instantly.

### 💬 Customer Engagement
- **Messaging Tab**: Threaded conversations with customers. Vendors can reply directly to inquiries or feedback, building brand loyalty.

### 📈 Analytics & Growth
- **Stat Cards**: Live tracking of Total Revenue, Completed Orders, Blog Views, and Unread Messages.
- **Best Sellers**: A visual bar chart ranking meals by volume sold to help vendors optimize their menu.

### 💰 Financials (Income Tab)
- **Transaction Ledger**: Detailed breakdown of every order's financial contribution.
- **Settlement Tracking**: Distinction between **Gross Income** (total sales), **Settled** (delivered/paid out), and **Pending** (orders in progress).

### ✍️ Blog Manager
- **Content Marketing**: Vendors can write and publish their own stories (e.g., "The Secret to my Egusi Soup").
- **Editor**: Supports Cover Images, Excerpts, and full Body text. Includes social sharing links for external promotion.

### 👥 Team Management
- **Role-Based Access**: Invite staff with specific permissions:
  - **Manager**: Full access to all dashboard features.
  - **Accountant**: Focused on Income and Transactions.
  - **Sales Rep**: Access to Orders and Menu.
  - **Blog Admin**: Permission to manage content only.

---

## 4. Technical Architecture & Brand
- **Routing**: Powered by **TanStack Router** for seamless, state-preserved navigation.
- **State Management**: Centralized `AppProviders` handling Auth, Cart, Orders, Wishlist, and real-time Notifications.
- **Design Language**: 
  - **Visuals**: "Rich Aesthetics" using Vanilla CSS, vibrant gradients, and glassmorphism.
  - **Typography**: Heavy use of "Black" and "Extrabold" weights for a premium, modern feel.
  - **Responsiveness**: Fluid layouts that adapt from mobile "Pill" headers to desktop "Aside" sidebars.
