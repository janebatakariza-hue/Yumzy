import { useState } from "react";
import Sidebar from "../Overview/Sidebar";
import "./MenuPage.css";

const categories = ["Drinks", "Starter", "Appetizer", "Dessert", "Main"];

const menuItems = [
  {
    id: 1,
    name: "Tom Yummy",
    description: "Hot & sour soup, lemongrass, mushrooms, lime, chili",
    price: 6000,
    category: "Starter",
    tag: "POPULAR",
    image: "/dish.png",
  },
  {
    id: 2,
    name: "Singapore Sling",
    description: "Gin, cherry liqueur, Cointreau, pineapple, lime",
    price: 8000,
    category: "Drinks",
    tag: null,
    image: "/aroma.png",
  },
  {
    id: 3,
    name: "Mango Tango",
    description: "Fresh mango, coconut, lime, chili salt rim",
    price: 3500,
    category: "Drinks",
    tag: null,
    image: "/burger.png",
  },
  {
    id: 4,
    name: "Kigali Sunrise",
    description: "Orange, grenadine, local gin, sparkling water",
    price: 4500,
    category: "Drinks",
    tag: null,
    image: "/planet.png",
  },
  {
    id: 5,
    name: "Hibiscus Cooler",
    description: "Hibiscus tea, ginger, honey, mint, sparkling",
    price: 2800,
    category: "Drinks",
    tag: null,
    image: "/kigali.png",
  },
  {
    id: 6,
    name: "Rwandan Arabica",
    description: "Single origin cold brew, oat milk, vanilla",
    price: 3200,
    category: "Drinks",
    tag: null,
    image: "/soy.png",
  },
];

type CartItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  qty: number;
};

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Drinks");
  const [cart, setCart] = useState<CartItem[]>([
    { ...menuItems[0], qty: 2 },
    { ...menuItems[1], qty: 1 },
  ]);
  const [note, setNote] = useState("");

  const filtered = menuItems.filter((m) => m.category === activeCategory);

  const addToCart = (item: (typeof menuItems)[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const service = Math.round(subtotal * 0.05);
  const total = subtotal + service;
  const fmt = (n: number) => `Frw ${n.toLocaleString()}`;

  return (
    <div className="menu-page">
      <Sidebar />

      <div className="menu-main">
        {/* Hero Banner */}
        <div className="menu-hero">
          <img src="/soy.png" alt="Soy Restaurant" className="menu-hero-img" />
          <div className="menu-hero-overlay" />
          <div className="menu-hero-content">
            <div className="menu-hero-top">
              <button className="hero-back-btn">←</button>
              <div className="hero-actions">
                <button className="hero-icon-btn">🔔</button>
                <div className="hero-avatar">AM</div>
              </div>
            </div>
            <div className="menu-hero-info">
              <h1 className="menu-hero-title">Soy Restaurant</h1>
              <p className="menu-hero-sub">
                Kiyovu, Kigali · Starter · Fusion · International
              </p>
              <div className="menu-hero-meta">
                <span className="hero-badge-open">● OPEN</span>
                <span className="hero-meta-text">14:00 – 23:00</span>
                <span className="hero-stars">★★★★☆</span>
                <span className="hero-meta-text">4.2 (124 reviews)</span>
              </div>
            </div>
            <div className="hero-right-actions">
              <button className="hero-share-btn">⬆ Share</button>
            </div>
          </div>
        </div>

        {/* Category Tabs + Search */}
        <div className="menu-tabs-bar">
          <div className="menu-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`menu-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="menu-search">
            <span className="menu-search-icon">🔍</span>
            <input type="text" placeholder="Search that item..." />
          </div>
        </div>

        {/* Menu Body */}
        <div className="menu-body">
          <div className="menu-grid-wrap">
            <p className="menu-count">DRINKS · {filtered.length} items</p>
            <div className="menu-grid">
              {filtered.map((item) => (
                <div key={item.id} className="menu-card">
                  <div className="menu-card-img-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="menu-card-img"
                    />
                    {item.tag && (
                      <span className="menu-card-tag">{item.tag}</span>
                    )}
                  </div>
                  <div className="menu-card-body">
                    <h3 className="menu-card-name">{item.name}</h3>
                    <p className="menu-card-desc">{item.description}</p>
                    <div className="menu-card-footer">
                      <span className="menu-card-price">{fmt(item.price)}</span>
                      <button
                        className="menu-card-add"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="see-all-btn">See all 14 drinks</button>
          </div>

          {/* Cart */}
          <div className="cart-panel">
            <div className="cart-header">
              <span className="cart-title">Your Order</span>
              <span className="cart-count">
                {cart.reduce((s, c) => s + c.qty, 0)} items
              </span>
            </div>
            <p className="cart-restaurant">
              Soy Restaurant · Table 4{" "}
              <span className="cart-change">Change</span>
            </p>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-desc">
                      {item.description.slice(0, 28)}...
                    </p>
                    <p className="cart-item-price">{fmt(item.price)}</p>
                  </div>
                  <div className="cart-qty">
                    <button onClick={() => updateQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <input
              className="cart-note"
              placeholder="Add a note for the kitchen..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="cart-totals">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="cart-total-row muted">
                <span>Service (5%)</span>
                <span>{fmt(service)}</span>
              </div>
              <div className="cart-total-row bold">
                <span>Total</span>
                <span className="cart-grand-total">{fmt(total)}</span>
              </div>
            </div>
            <button className="cart-proceed-btn">Proceed to Order →</button>
            <button className="cart-clear-btn" onClick={() => setCart([])}>
              Clear Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuPage;
