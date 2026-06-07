import type { Notification } from "../types";

export const notifications: Notification[] = [
  { id: "1",  title: "New Order Received",     message: "Order ORD-001 from Jane Batakariza at Soy Restaurant",    type: "ORDER",   isRead: false, createdAt: "2024-01-10T21:45:00" },
  { id: "2",  title: "Payment Confirmed",      message: "Payment of 5,000 RWF received for ORD-002",               type: "PAYMENT", isRead: false, createdAt: "2024-01-10T21:40:00" },
  { id: "3",  title: "New Review Posted",      message: "Emma Johnson left a 5-star review for Soy Restaurant",    type: "REVIEW",  isRead: false, createdAt: "2024-01-10T20:00:00" },
  { id: "4",  title: "Order Rejected",         message: "Order ORD-004 was rejected at Sundowner",                 type: "ORDER",   isRead: true,  createdAt: "2024-01-10T19:30:00" },
  { id: "5",  title: "Payment Failed",         message: "Payment for ORD-004 failed — CASH method",               type: "PAYMENT", isRead: true,  createdAt: "2024-01-10T19:32:00" },
  { id: "6",  title: "System Update",          message: "Yumzy admin system updated to version 2.0.1",             type: "SYSTEM",  isRead: true,  createdAt: "2024-01-09T10:00:00" },
  { id: "7",  title: "Low Stock Alert",        message: "Beef Steak at M Hotel & Spa is running low",              type: "ALERT",   isRead: false, createdAt: "2024-01-09T08:00:00" },
  { id: "8",  title: "New Client Added",       message: "Patisserie Royale has been added as a new client",        type: "SYSTEM",  isRead: true,  createdAt: "2024-01-08T14:00:00" },
];