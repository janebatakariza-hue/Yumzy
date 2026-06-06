import type { DashboardStats, RevenueDataPoint } from "../types";

export const dashboardStats: DashboardStats = {
  totalClients: 60,
  totalRevenue: 38234000,
  totalOrders: 67569,
  itemsSold: 54567,
  clientsGrowth: 12,
  revenueGrowth: 8.4,
  ordersGrowth: 5,
  itemsGrowth: 2.1,
};

export const revenueData: RevenueDataPoint[] = [
  { date: "08:00", revenue: 38, orders: 12 },
  { date: "09:00", revenue: 42, orders: 18 },
  { date: "10:00", revenue: 35, orders: 14 },
  { date: "11:00", revenue: 50, orders: 22 },
  { date: "12:00", revenue: 48, orders: 30 },
  { date: "13:00", revenue: 38, orders: 25 },
  { date: "14:00", revenue: 44, orders: 20 },
  { date: "15:00", revenue: 52, orders: 28 },
  { date: "16:00", revenue: 46, orders: 24 },
  { date: "17:00", revenue: 58, orders: 35 },
];

export const venueCards = [
  {
    category: "Restaurants",
    sales: [
      { name: "Sale Luna", value: 4600 },
      { name: "Soy", value: 12000 },
    ],
  },
  {
    category: "Hotels",
    sales: [
      { name: "Park Inn", value: 4600 },
      { name: "M Hotel", value: 12000 },
    ],
  },
  {
    category: "Pubs",
    sales: [
      { name: "Sundowner", value: 4600 },
      { name: "GateN10", value: 12000 },
    ],
  },
  {
    category: "Cafes",
    sales: [
      { name: "Arona", value: 4600 },
      { name: "Patisserie Royale", value: 12000 },
    ],
  },
];

export const orderSummary = [
  { label: "Orders", value: "67,569" },
  { label: "Items", value: "54,567" },
  { label: "Orders/hour", value: "4,560" },
  { label: "Clients", value: "60" },
];
