import { useState } from "react";
import { Search, Star, CheckCircle, XCircle, Clock } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { reviews as allReviews } from "../../data/reviews";
import type { Review } from "../../types";
import "./Reviews.css";

const statusConfig = {
  PUBLISHED: { bg: "#e8f5e9", color: "#2e7d32", icon: CheckCircle },
  PENDING:   { bg: "#fff8e1", color: "#f57f17", icon: Clock       },
  REMOVED:   { bg: "#ffebee", color: "#c62828", icon: XCircle     },
};

export default function Reviews() {
  const [data, setData]     = useState<Review[]>(allReviews);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = data.filter((r) => {
    const matchSearch =
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.restaurantName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id: string, status: Review["status"]) => {
    setData((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const stats = [
    { label: "Total Reviews", value: data.length,                                      color: "#1a1a1a" },
    { label: "Published",     value: data.filter((r) => r.status === "PUBLISHED").length, color: "#2e7d32" },
    { label: "Pending",       value: data.filter((r) => r.status === "PENDING").length,   color: "#f57f17" },
    { label: "Avg Rating",    value: (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1) + " ★", color: "#d4920a" },
  ];

  return (
    <AdminLayout
      title="Reviews"
      subtitle="Manage customer reviews and ratings"
    >
      {/* Stats */}
      <div className="tables-stats">
        {stats.map((s) => (
          <div key={s.label} className="tables-stat-card">
            <div className="tables-stat-icon" style={{ background: s.color + "20" }}>
              <Star size={18} color={s.color} />
            </div>
            <div>
              <p className="tables-stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="tables-stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rest-toolbar">
        <div className="clients-search">
          <Search size={14} color="#aaa" />
          <input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rest-filter-tabs">
          {["ALL", "PUBLISHED", "PENDING", "REMOVED"].map((s) => (
            <button
              key={s}
              className={`clients-cat-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {filtered.map((r) => {
          const sc = statusConfig[r.status];
          return (
            <div key={r.id} className="review-card">
              <div className="review-card-left">
                <div className="review-avatar">
                  {r.clientName.charAt(0)}
                </div>
                <div>
                  <p className="review-client">{r.clientName}</p>
                  <p className="review-restaurant">{r.restaurantName}</p>
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < r.rating ? "#d4920a" : "none"}
                        color={i < r.rating ? "#d4920a" : "#ddd"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-comment">{r.comment}</p>
              <div className="review-card-right">
                <span className="client-category-badge" style={{ background: sc.bg, color: sc.color }}>
                  <sc.icon size={11} /> {r.status}
                </span>
                <p className="client-meta">
                  {new Date(r.createdAt).toLocaleDateString("en-GB")}
                </p>
                <div className="review-actions">
                  {r.status === "PENDING" && (
                    <>
                      <button className="rest-action-btn edit" onClick={() => updateStatus(r.id, "PUBLISHED")}>
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button className="rest-action-btn delete" onClick={() => updateStatus(r.id, "REMOVED")}>
                        <XCircle size={12} /> Remove
                      </button>
                    </>
                  )}
                  {r.status === "PUBLISHED" && (
                    <button className="rest-action-btn delete" onClick={() => updateStatus(r.id, "REMOVED")}>
                      <XCircle size={12} /> Remove
                    </button>
                  )}
                  {r.status === "REMOVED" && (
                    <button className="rest-action-btn edit" onClick={() => updateStatus(r.id, "PUBLISHED")}>
                      <CheckCircle size={12} /> Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="clients-empty">No reviews found.</div>
        )}
      </div>
    </AdminLayout>
  );
}