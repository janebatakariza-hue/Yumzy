import type { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  { id: "1", name: "Tom Yummy",       description: "Hot & sour soup",        price: 6000,  category: "STARTER",  image: "/dish.png",   restaurantId: "1", isAvailable: true,  isSpecial: true,  createdAt: "2024-01-01" },
  { id: "2", name: "Singapore Sling", description: "Gin, cherry, pineapple", price: 8000,  category: "DRINKS",   image: "/aroma.png",  restaurantId: "1", isAvailable: true,  isSpecial: false, createdAt: "2024-01-01" },
  { id: "3", name: "Beef Steak",      description: "Grilled beef, herbs",    price: 15000, category: "FOOD",     image: "/soy.png",    restaurantId: "2", isAvailable: true,  isSpecial: true,  createdAt: "2024-01-01" },
  { id: "4", name: "Craft Beer",      description: "Local craft beer",       price: 3500,  category: "DRINKS",   image: "/sundowner.png", restaurantId: "3", isAvailable: true,  isSpecial: false, createdAt: "2024-01-01" },
  { id: "5", name: "Cappuccino",      description: "Italian espresso",       price: 2500,  category: "DRINKS",   image: "/aroma.png",  restaurantId: "4", isAvailable: true,  isSpecial: false, createdAt: "2024-01-01" },
  { id: "6", name: "Chocolate Cake",  description: "Rich dark chocolate",    price: 4000,  category: "DESSERT",  image: "/planet.png", restaurantId: "1", isAvailable: false, isSpecial: true,  createdAt: "2024-01-01" },
  { id: "7", name: "Mango Tango",     description: "Fresh mango cocktail",   price: 3500,  category: "DRINKS",   image: "/kigali.png", restaurantId: "1", isAvailable: true,  isSpecial: false, createdAt: "2024-01-01" },
  { id: "8", name: "Pizza Margherita",description: "Classic tomato pizza",   price: 12000, category: "FOOD",     image: "/dish.png",   restaurantId: "2", isAvailable: true,  isSpecial: false, createdAt: "2024-01-01" },
];