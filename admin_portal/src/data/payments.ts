import type { Payment } from "../types";

export const payments: Payment[] = [
  { id: "1", orderId: "1", orderNumber: "ORD-001", clientName: "Jane Batakariza", restaurantName: "Soy Restaurant", amount: 5000,  method: "CASH",         status: "PENDING",  createdAt: "2022-05-25T21:45:00" },
  { id: "2", orderId: "2", orderNumber: "ORD-002", clientName: "Jane Batakariza", restaurantName: "Soy Restaurant", amount: 5000,  method: "MOBILE_MONEY", status: "PAID",     createdAt: "2022-05-25T21:40:00" },
  { id: "3", orderId: "3", orderNumber: "ORD-003", clientName: "John Mutesi",     restaurantName: "M Hotel & Spa",  amount: 5000,  method: "CARD",         status: "PENDING",  createdAt: "2022-05-25T21:35:00" },
  { id: "4", orderId: "4", orderNumber: "ORD-004", clientName: "Alice Uwase",     restaurantName: "Sundowner",      amount: 5000,  method: "CASH",         status: "FAILED",   createdAt: "2022-05-25T21:30:00" },
  { id: "5", orderId: "5", orderNumber: "ORD-005", clientName: "Peter Nkusi",     restaurantName: "Aroma Cafe",     amount: 5000,  method: "MOBILE_MONEY", status: "PAID",     createdAt: "2022-05-25T21:00:00" },
  { id: "6", orderId: "6", orderNumber: "ORD-006", clientName: "Grace Ingabire",  restaurantName: "Soy Restaurant", amount: 12000, method: "CARD",         status: "PAID",     createdAt: "2022-05-24T18:00:00" },
  { id: "7", orderId: "7", orderNumber: "ORD-007", clientName: "David Mugisha",   restaurantName: "Planet Burger",  amount: 8500,  method: "MOBILE_MONEY", status: "REFUNDED", createdAt: "2022-05-24T17:00:00" },
];