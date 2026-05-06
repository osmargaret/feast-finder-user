import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import Vendors from "./pages/Vendors";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import StaffAccess from "./pages/super-admin/StaffAccess";
import AuditLogs from "./pages/super-admin/AuditLogs";
import VendorVerification from "./pages/super-admin/VendorVerification";
import Financials from "./pages/super-admin/Financials";
import BlogCMS from "./pages/super-admin/BlogCMS";
import OrderMap from "./pages/super-admin/OrderMap";
import Support from "./pages/super-admin/Support";
import Reviews from "./pages/super-admin/Reviews";
import Campaigns from "./pages/super-admin/Campaigns";
import SystemHealth from "./pages/super-admin/SystemHealth";
import Leaderboards from "./pages/super-admin/Leaderboards";
import Refunds from "./pages/super-admin/Refunds";
import Reports from "./pages/super-admin/Reports";
import GlobalConfig from "./pages/super-admin/GlobalConfig";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Super Admin Routes */}
              <Route path="/super-admin/config" element={<GlobalConfig />} />
              <Route path="/super-admin/verify" element={<VendorVerification />} />
              <Route path="/super-admin/financials" element={<Financials />} />
              <Route path="/super-admin/cms" element={<BlogCMS />} />
              <Route path="/super-admin/map" element={<OrderMap />} />
              <Route path="/super-admin/support" element={<Support />} />
              <Route path="/super-admin/reviews" element={<Reviews />} />
              <Route path="/super-admin/campaigns" element={<Campaigns />} />
              <Route path="/super-admin/health" element={<SystemHealth />} />
              <Route path="/super-admin/leaderboards" element={<Leaderboards />} />
              <Route path="/super-admin/refunds" element={<Refunds />} />
              <Route path="/super-admin/reports" element={<Reports />} />
              <Route path="/super-admin/staff" element={<StaffAccess />} />
              <Route path="/super-admin/logs" element={<AuditLogs />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
