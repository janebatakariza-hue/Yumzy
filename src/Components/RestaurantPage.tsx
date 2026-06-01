import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Overview/Sidebar";
import "./RestaurantPage.css";

const allRestaurants = [
  {
    id: 1,
    name: "Aroma Cafe",
    image: "/aroma.png",
    cuisine: "Cafe · Coffee · Bakery",
    rating: 4.8,
    time: "20 min",
    distance: "2 km",
    status: "OPEN",
    type: "Cafe",
  },
  {
    id: 2,
    name: "Savory Grill",
    image: "/soy.png",
    cuisine: "African · BBQ",
    rating: 4.9,
    time: "15 min",
    distance: "15 km",
    status: "OPEN",
    type: "African",
  },
  {
    id: 3,
    name: "Blue Ocean",
    image: "/hotel.png",
    cuisine: "Seafood · Fine Dining",
    rating: 4.7,
    time: "25 min",
    distance: "25 km",
    status: "OPEN",
    type: "Fast Food",
  },
  {
    id: 4,
    name: "Planet Burger",
    image: "/planet.png",
    cuisine: "American · Fast Food",
    rating: 3.8,
    time: "10 min",
    distance: "1 km",
    status: "CLOSED",
    type: "Fast Food",
  },
  {
    id: 5,
    name: "Kigali Bites",
    image: "/kigali.png",
    cuisine: "African · Local",
    rating: 4.5,
    time: "18 min",
    distance: "3 km",
    status: "OPEN",
    type: "African",
  },
  {
    id: 6,
    name: "Sundowner",
    image: "/sundowner.png",
    cuisine: "Pub · Craft Beers",
    rating: 4.0,
    time: "22 min",
    distance: "5 km",
    status: "OPEN",
    type: "Cafe",
  },
];

const filters = ["All", "Cafe", "Fast Food", "African"];

export default function Restaurants() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = allRestaurants.filter(
    (r) => activeFilter === "All" || r.type === activeFilter,
  );

  return (
    <div className="rest-page">
      <Sidebar />

      <div className="rest-main">
        {/* Topbar */}
        <div className="rest-topbar">
          <div>
            <h1 className="rest-title">Restaurants</h1>
            <p className="rest-subtitle">Discover restaurants around you.</p>
          </div>
          <div className="rest-search">
            <span>🔍</span>
            <input placeholder="Search restaurants..." />
          </div>
        </div>

        {/* Promo Banner */}
        <div className="rest-promo">
          <div>
            <h2 className="rest-promo-title">30% OFF THIS WEEK</h2>
            <p className="rest-promo-sub">Order from top-rated restaurants</p>
            <button
              className="rest-promo-btn"
              onClick={() => navigate("/menu")}
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="rest-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`rest-filter-btn ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="rest-grid">
          {filtered.map((r) => {
            const isOpen = r.status === "OPEN";
            return (
              <div key={r.id} className="rest-card">
                <div className="rest-card-img-wrap">
                  <img src={r.image} alt={r.name} className="rest-card-img" />
                </div>
                <div className="rest-card-body">
                  <h3 className="rest-card-name">{r.name}</h3>
                  <p className="rest-card-cuisine">{r.cuisine}</p>
                  <div className="rest-card-meta">
                    <span className="rest-meta-item">⭐ {r.rating}</span>
                    <span className="rest-meta-item">🕐 {r.time}</span>
                    <span className="rest-meta-item">📍 {r.distance}</span>
                  </div>
                  {isOpen && <span className="rest-open-badge">OPEN</span>}
                  <button
                    className="rest-view-btn"
                    style={{
                      background: isOpen ? "#1a3d1a" : "#f0ece4",
                      color: isOpen ? "white" : "#aaa",
                      cursor: isOpen ? "pointer" : "not-allowed",
                    }}
                    onClick={() => isOpen && navigate("/menu")}
                  >
                    View Menu
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
