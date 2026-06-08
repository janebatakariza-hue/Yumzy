import type {
  Restaurant, Client, MenuItem, Order, Table, StaffMember,
  Payment, Review, Notification,
} from "../types";
import { normalizeDoc } from "./utils";

type BackendDoc = Record<string, unknown>;

export function mapRestaurant(doc: BackendDoc): Restaurant {
  const r = normalizeDoc(doc);
  const owner = r.ownerId as BackendDoc | undefined;
  return {
    id: r.id,
    name: String(r.name || ""),
    category: r.category as Restaurant["category"],
    address: String(r.address || ""),
    phone: String(r.phone || ""),
    email: String(r.email || ""),
    representative: owner ? String(owner.name || "") : String(r.representative || ""),
    image: (r.logo || r.coverImage || r.image) as string | undefined,
    rating: Number(r.rating || 0),
    totalSales: Number(r.totalSales || 0),
    isActive: r.isActive !== false,
    isOpen: Boolean(r.isOpen),
    createdAt: String(r.createdAt || new Date().toISOString()),
  };
}

export function mapClient(doc: BackendDoc): Client {
  const c = normalizeDoc(doc);
  return {
    id: c.id,
    name: String(c.name || ""),
    email: String(c.email || ""),
    phone: String(c.phone || ""),
    address: String(c.address || ""),
    category: (c.category as Client["category"]) || "RESTAURANT",
    representative: String(c.representative || c.name || ""),
    totalSales: Number(c.totalSpent || c.totalSales || 0),
    lastUpdated: String(c.updatedAt || c.lastVisit || c.createdAt || ""),
    createdAt: String(c.createdAt || ""),
    isActive: c.isActive !== false,
  };
}

export function mapMenuItem(doc: BackendDoc): MenuItem {
  const m = normalizeDoc(doc);
  return {
    id: m.id,
    name: String(m.name || ""),
    description: String(m.description || ""),
    price: Number(m.price || 0),
    category: m.category as MenuItem["category"],
    image: m.image as string | undefined,
    restaurantId: String((m.restaurantId as BackendDoc)?._id || m.restaurantId || ""),
    isAvailable: m.isAvailable !== false,
    isSpecial: Boolean(m.isSpecial),
    createdAt: String(m.createdAt || ""),
  };
}

export function mapOrder(doc: BackendDoc): Order {
  const o = normalizeDoc(doc);
  const restaurant = o.restaurantId as BackendDoc | undefined;
  const table = o.tableId as BackendDoc | undefined;
  return {
    id: o.id,
    orderNumber: String(o.orderNumber || ""),
    clientName: String(o.clientName || ""),
    clientPhone: String(o.clientPhone || ""),
    restaurantId: String(restaurant?._id || o.restaurantId || ""),
    restaurantName: String(restaurant?.name || o.restaurantName || ""),
    items: (o.items as Order["items"]) || [],
    tableNumber: String(table?.tableNumber || o.tableNumber || ""),
    totalAmount: Number(o.totalAmount || 0),
    status: o.status as Order["status"],
    paymentStatus: o.paymentStatus as Order["paymentStatus"],
    paymentMethod: o.paymentMethod as Order["paymentMethod"],
    createdAt: String(o.createdAt || ""),
    updatedAt: String(o.updatedAt || ""),
  };
}

export function mapTable(doc: BackendDoc): Table {
  const t = normalizeDoc(doc);
  const waiter = t.waiterId as BackendDoc | undefined;
  return {
    id: t.id,
    tableNumber: String(t.tableNumber || ""),
    capacity: Number(t.capacity || 0),
    status: t.status as Table["status"],
    restaurantId: String((t.restaurantId as BackendDoc)?._id || t.restaurantId || ""),
    waiterId: waiter?._id as string | undefined,
    waiterName: String(waiter?.name || t.waiterName || ""),
    currentBill: t.currentBill as number | undefined,
    reservedFor: t.reservedFor as string | undefined,
    reservedAt: t.reservedAt as string | undefined,
  };
}

export function mapStaff(doc: BackendDoc): StaffMember {
  const s = normalizeDoc(doc);
  const restaurant = s.restaurantId as BackendDoc | undefined;
  return {
    id: s.id,
    name: String(s.name || ""),
    email: String(s.email || ""),
    phone: String(s.phone || ""),
    role: s.role as StaffMember["role"],
    restaurantId: String(restaurant?._id || s.restaurantId || ""),
    restaurantName: String(restaurant?.name || s.restaurantName || ""),
    salary: Number(s.salary || 0),
    shift: s.shift as StaffMember["shift"],
    isActive: s.isActive !== false,
    joinedAt: String(s.joinedAt || s.createdAt || ""),
    avatar: s.avatar as string | undefined,
  };
}

export function mapPayment(doc: BackendDoc): Payment {
  const p = normalizeDoc(doc);
  const order = p.orderId as BackendDoc | undefined;
  return {
    id: p.id,
    orderId: String(order?._id || p.orderId || ""),
    orderNumber: String(order?.orderNumber || p.orderNumber || ""),
    clientName: String(p.clientName || ""),
    restaurantName: String(p.restaurantName || ""),
    amount: Number(p.amount || 0),
    method: p.method as Payment["method"],
    status: p.status as Payment["status"],
    createdAt: String(p.createdAt || ""),
  };
}

export function mapReview(doc: BackendDoc): Review {
  const r = normalizeDoc(doc);
  const restaurant = r.restaurantId as BackendDoc | undefined;
  return {
    id: r.id,
    clientName: String(r.clientName || r.authorName || ""),
    clientAvatar: r.clientAvatar as string | undefined,
    restaurantId: String(restaurant?._id || r.restaurantId || ""),
    restaurantName: String(restaurant?.name || r.restaurantName || ""),
    rating: Number(r.rating || 0),
    comment: String(r.comment || ""),
    status: r.status as Review["status"],
    createdAt: String(r.createdAt || ""),
  };
}

export function mapNotification(doc: BackendDoc): Notification {
  const n = normalizeDoc(doc);
  return {
    id: n.id,
    title: String(n.title || ""),
    message: String(n.message || ""),
    type: n.type as Notification["type"],
    isRead: Boolean(n.isRead),
    createdAt: String(n.createdAt || ""),
  };
}
