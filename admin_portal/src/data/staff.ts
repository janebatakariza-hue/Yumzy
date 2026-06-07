import type { StaffMember } from "../types";

export const staffMembers: StaffMember[] = [
  { id: "1", name: "Sarah Mukamana", email: "sarah@yumzy.com", phone: "+250 788 111 001", role: "WAITER",   restaurantId: "1", restaurantName: "Soy Restaurant", salary: 150000, shift: "MORNING",   isActive: true,  joinedAt: "2023-01-15" },
  { id: "2", name: "Kim Uwase",      email: "kim@yumzy.com",   phone: "+250 788 111 002", role: "WAITER",   restaurantId: "1", restaurantName: "Soy Restaurant", salary: 150000, shift: "AFTERNOON", isActive: true,  joinedAt: "2023-02-20" },
  { id: "3", name: "Grace Ingabire", email: "grace@yumzy.com", phone: "+250 788 111 003", role: "CHEF",     restaurantId: "2", restaurantName: "M Hotel & Spa",  salary: 250000, shift: "MORNING",   isActive: true,  joinedAt: "2023-03-10" },
  { id: "4", name: "Daniel Nkusi",   email: "daniel@yumzy.com",phone: "+250 788 111 004", role: "MANAGER",  restaurantId: "2", restaurantName: "M Hotel & Spa",  salary: 350000, shift: "AFTERNOON", isActive: true,  joinedAt: "2023-04-05" },
  { id: "5", name: "Alice Mutesi",   email: "alice@yumzy.com", phone: "+250 788 111 005", role: "CASHIER",  restaurantId: "3", restaurantName: "Sundowner",      salary: 180000, shift: "NIGHT",     isActive: false, joinedAt: "2023-05-18" },
  { id: "6", name: "John Habimana",  email: "john@yumzy.com",  phone: "+250 788 111 006", role: "CHEF",     restaurantId: "4", restaurantName: "Aroma Cafe",     salary: 230000, shift: "MORNING",   isActive: true,  joinedAt: "2023-06-22" },
];