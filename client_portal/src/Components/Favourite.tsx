import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Overview/Sidebar";
import "./Favourite.css";

const allFavorites = [
  {
    id: 1,
    name: "Soy Restaurant",
    image: "/soy.png",
    location: "Kimihurura, Kigali",
    cuisine: "African · Fusion · International",
    rating: 4.2,
    reviews: 124,
    status: "OPEN",
    type: "RESTAURANT",
  },
  {
    id: 2,
    name: "Aroma Cafe",
    image: "/aroma.png",
    location: "Remera, Kigali",
    cuisine: "Coffee · Pastries · Light Bites",
    rating: 4.1,
    reviews: 98,
    status: "OPEN",
    type: "CAFE",
  },
  {
    id: 3,
    name: "Sundowner",
    image: "/sundowner.png",
    location: "Kacyiru, Kigali",
    cuisine: "Craft Beers · Pub Food",
    rating: 4.0,
    reviews: 88,
    status: "CLOSES 02:00",
    type: "PUB",
  },
  {
    id: 4,
    name: "Choose Kigali",
    image: "/kigali.png",
    location: "Nyamirambo, Kigali",
    cuisine: "Local · Pan African",
    rating: 4.6,
    reviews: 173,
    status: "OPEN",
    type: "RESTAURANT",
  },
  {
    id: 5,
    name: "M Hotel & Spa",
    image: "/hotel.png",
    location: "Kigali City",
    cuisine: "Fine Dining · Continental",
    rating: 4.5,
    reviews: 302,
    status: "OPEN",
    type: "HOTEL",
  },
  {
    id: 6,
    name: "Planet Burger",
    image: "/planet.png",
    location: "Gisimenti, Kigali",
    cuisine: "American · Fast Food",
    rating: 3.8,
    reviews: 91,
    status: "CLOSED",
    type: "RESTAURANT",
  },
];

const filters = ["All", "Restaurant", "Hotel", "Pub", "Cafe"];

const badgeColors: Record<string, string> = {
  RESTAURANT: "#2d5a1b",
  HOTEL: "#1b3a5a",
  PUB: "#5a1b1b",
  CAFE: "#1b3a3a",
};

export default function Favorites() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [hearted, setHearted] = useState<number[]>(allFavorites.map((f) => f.id));

  const filtered = allFavorites.filter(
    (r) => activeFilter === "All" ||
    r.type === activeFilter.toUpperCase()
  );

  const toggleHeart = (id: number) => {
    setHearted((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  return (
    <div className="fav-page">
      <Sidebar />

      <div className="fav-main">
        {/* Topbar */}
        <div className="fav-topbar">
          <div>
            <h1 className="fav-title">Favorites</h1>
            <p className="fav-subtitle">Your saved restaurants and spots</p>
          </div>
          <div className="fav-topbar-right">
            <div className="fav-search">
              <span>🔍</span>
              <input placeholder="Search favorites..." />
            </div>
            <button className="fav-icon-btn">🔔</button>
            <div className="fav-avatar">AM</div>
          </div>
        </div>

        {/* Filters */}
        <div className="fav-filters">
          <div className="fav-filter-tabs">
            {filters.map((f) => (
              <button
                key={f}
                className={`fav-filter-btn ${activeFilter === f ? "active" : ""}`}
                onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="fav-sort">
            <span>Sort by:</span>
            <select>
              <option>Rating ↓</option>
              <option>Name</option>
              <option>Distance</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="fav-grid">
          {filtered.map((r) => {
            const isOpen = r.status !== "CLOSED";
            const isClosingSoon = r.status.startsWith("CLOSES");
            const isHearted = hearted.includes(r.id);
            return (
              <div key={r.id} className="fav-card">
                <div className="fav-card-img-wrap">
                  <img src={r.image} alt={r.name} className="fav-card-img" />
                  {r.type && (
                    <span
                      className="fav-card-badge"
                      style={{ background: badgeColors[r.type] }}
                    >
                      {r.type}
                    </span>
                  )}
                  <button
                    className={`fav-heart-btn ${isHearted ? "hearted" : ""}`}
                    onClick={() => toggleHeart(r.id)}
                  >
                    ♥
                  </button>
                </div>

                <div className="fav-card-body">
                  <h3 className="fav-card-name">{r.name}</h3>
                  <p className="fav-card-location">📍 {r.location}</p>
                  <p className="fav-card-cuisine">{r.cuisine}</p>

                  <div className="fav-card-meta">
                    <span className="fav-stars">
                      {"★".repeat(Math.floor(r.rating))}
                      {"☆".repeat(5 - Math.floor(r.rating))}
                    </span>
                    <span className="fav-rating">{r.rating}</span>
                    <span className="fav-reviews">({r.reviews})</span>
                    <span
                      className="fav-status"
                      style={{
                        background: isOpen && !isClosingSoon ? "#dcfce7" : isClosingSoon ? "#fef3c7" : "#fee2e2",
                        color: isOpen && !isClosingSoon ? "#16a34a" : isClosingSoon ? "#d97706" : "#dc2626",
                      }}
                    >
                      {r.status === "OPEN" ? "● OPEN" : r.status}
                    </span>
                  </div>

                  <button
                    className="fav-view-btn"
                    style={{
                      background: isOpen ? "#d4920a" : "#f0ece4",
                      color: isOpen ? "#1a0f00" : "#aaa",
                      cursor: isOpen ? "pointer" : "not-allowed",
                    }}
                    onClick={() => isOpen && navigate("/menu")}
                  >
                    {isOpen ? "View Menu →" : "Currently Closed"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="fav-pagination">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>‹</button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}>›</button>
        </div>
      </div>
    </div>
  );
}