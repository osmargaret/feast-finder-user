import React, { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  MoreHorizontal,
  ChevronRight,
  Download,
  Calendar,
  X,
  CheckCircle,
  Plus
} from "lucide-react";
import { cn } from "../lib/utils";

const MOCK_ORDERS = [
  { id: "FF-9281", customer: "John Doe", kitchen: "Mamma's Kitchen", amount: "₦12,500", status: "Delivered", date: "June 14, 2024", area: "Lekki" },
  { id: "FF-9282", customer: "Sarah Smith", kitchen: "Burger Boss", amount: "₦4,200", status: "Preparing", date: "June 14, 2024", area: "Ikeja" },
  { id: "FF-9283", customer: "Mike Ross", kitchen: "The Grill Hub", amount: "₦8,900", status: "Out for Delivery", date: "June 14, 2024", area: "VI" },
  { id: "FF-9284", customer: "Jane Doe", kitchen: "Sushi Spot", amount: "₦15,000", status: "Pending", date: "June 14, 2024", area: "Lekki" },
  { id: "FF-9285", customer: "David Beck", kitchen: "Pasta Place", amount: "₦6,700", status: "Cancelled", date: "June 13, 2024", area: "Surulere" },
];

const Orders = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Global Order Flow</h2>
          <p className="text-muted-foreground mt-1">Monitor all platform transactions and fulfillment statuses.</p>
        </div>
        <button className="h-12 px-8 rounded-2xl bg-muted text-foreground font-black text-sm flex items-center gap-2 border border-border hover:bg-muted/80 transition-all">
          <Download size={18} /> Export CSV
        </button>
      </header>

      {/* Grid Stats for Orders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OrderStatCard title="Daily Orders" value="342" trend="+15" color="text-primary" />
        <OrderStatCard title="Active Fulfillments" value="84" trend="-3" color="text-primary" />
        <OrderStatCard title="Total Volume (24h)" value="₦1.8M" trend="+₦240K" color="text-emerald-500" />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer, or Vendor..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-4">
           <button className="h-[52px] px-6 rounded-2xl bg-card border border-border text-xs font-bold flex items-center gap-2 hover:border-primary transition-all">
              <Calendar size={16} /> Date Range
           </button>
           <button className="h-[52px] px-6 rounded-2xl bg-card border border-border text-xs font-bold flex items-center gap-2 hover:border-primary transition-all">
              <Filter size={16} /> Filters
           </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-border">
                <th className="px-8 py-5">Order Reference</th>
                <th className="px-8 py-5">Customer & Destination</th>
                <th className="px-8 py-5">Vendor Kitchen</th>
                <th className="px-8 py-5">Value</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-black text-white">{order.id}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{order.date}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User size={14} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{order.customer}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {order.area}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-white">
                    {order.kitchen}
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-white">
                    {order.amount}
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                      order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" :
                      order.status === "Preparing" ? "bg-primary/10 text-primary" :
                      order.status === "Out for Delivery" ? "bg-purple-500/10 text-purple-500" :
                      order.status === "Cancelled" ? "bg-destructive/10 text-destructive" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {order.status}
                    </span>
                  </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setViewOrderDetails(order);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 rounded-xl hover:bg-primary/20 text-primary transition-all"
                        >
                          <Search size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditOrder(order);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 rounded-xl hover:bg-primary/20 text-primary transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteOrderId(order.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl hover:bg-destructive/20 text-destructive transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OrderStatCard = ({ title, value, trend, color }: any) => (
  <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className={cn("text-2xl font-black tracking-tight", color)}>{value}</h3>
      <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
    </div>
  </div>
);

export default Orders;
