// ── ADMIN USER ──────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "manager" | "waiter";
  avatar?: string;
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

// ── RESTAURANT ───────────────────────────────────────────
export interface Restaurant {
  id: string;
  name: string;
  category: "RESTAURANT" | "HOTEL" | "PUB" | "CAFE";
  address: string;
  phone: string;
  email: string;
  representative: string;
  image?: string;
  rating: number;
  totalSales: number;
  isActive: boolean;
  isOpen: boolean;
  createdAt: string;
}

// ── CLIENT ───────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: "RESTAURANT" | "HOTEL" | "PUB" | "CAFE";
  representative: string;
  totalSales: number;
  lastUpdated: string;
  createdAt: string;
  isActive: boolean;
}

// ── MENU ITEM ────────────────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "DRINKS" | "FOOD" | "DESSERT" | "STARTER";
  image?: string;
  restaurantId: string;
  isAvailable: boolean;
  isSpecial: boolean;
  createdAt: string;
}

// ── ORDER ────────────────────────────────────────────────
export interface OrderItem {
  menuItemId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  tableNumber: string;
  totalAmount: number;
  status: "NEW" | "DELIVERED" | "REJECTED" | "WAITING";
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  paymentMethod: "CASH" | "CARD" | "MOBILE_MONEY";
  createdAt: string;
  updatedAt: string;
}

// ── TABLE ────────────────────────────────────────────────
export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  restaurantId: string;
  waiterId?: string;
  waiterName?: string;
  currentBill?: number;
  reservedFor?: string;
  reservedAt?: string;
}

// ── STAFF ────────────────────────────────────────────────
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "WAITER" | "CHEF" | "MANAGER" | "CASHIER";
  restaurantId: string;
  restaurantName: string;
  salary: number;
  shift: "MORNING" | "AFTERNOON" | "NIGHT";
  isActive: boolean;
  joinedAt: string;
  avatar?: string;
}

// ── PAYMENT ──────────────────────────────────────────────
export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  clientName: string;
  restaurantName: string;
  amount: number;
  method: "CASH" | "CARD" | "MOBILE_MONEY";
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  createdAt: string;
}

// ── REVIEW ───────────────────────────────────────────────
export interface Review {
  id: string;
  clientName: string;
  clientAvatar?: string;
  restaurantId: string;
  restaurantName: string;
  rating: number;
  comment: string;
  status: "PUBLISHED" | "PENDING" | "REMOVED";
  createdAt: string;
}

// ── NOTIFICATION ─────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "ORDER" | "REVIEW" | "PAYMENT" | "SYSTEM" | "ALERT";
  isRead: boolean;
  createdAt: string;
}

// ── ANALYTICS ────────────────────────────────────────────
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  totalClients: number;
  totalRevenue: number;
  totalOrders: number;
  itemsSold: number;
  clientsGrowth: number;
  revenueGrowth: number;
  ordersGrowth: number;
  itemsGrowth: number;
}
