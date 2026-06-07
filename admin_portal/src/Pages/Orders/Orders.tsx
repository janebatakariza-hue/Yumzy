import { useState } from "react";
import {
  Search, CheckCircle, Clock, XCircle,
  List, Plus, Phone, Utensils,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { orders as allOrders } from "../../data/orders";
import type { Order } from "../../types";
import "./Orders.css";

const statusConfig = {
  NEW:       { label: "New",       color: "#1565c0", bg: "#e3f2fd", icon: Plus        },
  DELIVERED: { label: "Delivered", color: "#2e7d32", bg: "#e8f5e9", icon: CheckCircle },
  WAITING:   { label: "Waiting",   color: "#f57f17", bg: "#fff8e1", icon: Clock       },
  REJECTED:  { label: "Rejected",  color: "#c62828", bg: "#ffebee", icon: XCircle     },
};

export default function Orders() {
  const [data, setData]         = useState<Order[]>(allOrders);
  const [filter, setFilter]     = useState("ALL");
  const [search, setSearch]     = useState("");

  const filtered = data.filter((o) => {
    const matchFilter = filter === "ALL" || o.status === filter;
    const matchSearch =
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.restaurantName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateStatus = (id: string, status: Order["status"]) => {
    setData((prev) =>
      prev.map((o) => o.id === id ? { ...o, status } : o)
    );
  };

  const stats = [
    { label: "New",       value: data.filter((o) => o.status === "NEW").length,       color: "#1565c0", icon: Plus        },
    { label: "Waiting",   value: data.filter((o) => o.status === "WAITING").length,   color: "#f57f17", icon: Clock       },
    { label: "Delivered", value: data.filter((o) => o.status === "DELIVERED").length, color: "#2e7d32", icon: CheckCircle },
    { label: "Rejected",  value: data.filter((o) => o.status === "REJECTED").length,  color: "#c62828", icon: XCircle     },
    { label: "Total",     value: data.length,                                          color: "#1a1a1a", icon: List        },
  ];

  return (
    <AdminLayout
      title="Orders"
      subtitle={`as of ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
    >
      {/* Stats */}
      <div className="tables-stats">
        {stats.map((s) => (
          <div key={s.label} className="tables-stat-card">
            <div className="tables-stat-icon" style={{ background: s.color + "20" }}>
              <s.icon size={18} color={s.color} />
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
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rest-filter-tabs">
          {["ALL", "NEW", "WAITING", "DELIVERED", "REJECTED"].map((s) => (
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

      {/* Orders List */}
      <div className="orders-list">
        {filtered.map((o) => {
          const sc = statusConfig[o.status];
          return (
            <div key={o.id} className="order-card-admin">
              <div className="order-card-left">
                <div className="order-card-id" style={{ color: "#d4920a" }}>
                  {o.orderNumber}
                </div>
                <div className="order-card-info">
                  <p className="order-client"><strong>{o.clientName}</strong></p>
                  <p className="order-meta">
                    <Utensils size={11} /> {o.items.map((i) => i.name).join(", ")} x{o.items[0]?.qty}
                  </p>
                  <p className="order-meta">
                    Table {o.tableNumber}
                  </p>
                </div>
              </div>
              <div className="order-card-mid">
                <p className="order-amount">
                  Frw {o.totalAmount.toLocaleString()}
                </p>
                <p className="order-meta">
                  <Phone size={11} /> {o.clientPhone}
                </p>
                <p className="order-meta">{o.restaurantName}</p>
              </div>
              <div className="order-card-right">
                <span
                  className="order-status-badge"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  <sc.icon size={12} /> {sc.label}
                </span>
                <p className="order-meta">
                  {new Date(o.createdAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
                <div className="order-actions">
                  {o.status === "NEW" && (
                    <>
                      <button
                        className="rest-action-btn edit"
                        onClick={() => updateStatus(o.id, "DELIVERED")}
                      >
                        <CheckCircle size={12} /> Accept
                      </button>
                      <button
                        className="rest-action-btn delete"
                        onClick={() => updateStatus(o.id, "REJECTED")}
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  )}
                  {o.status === "WAITING" && (
                    <button
                      className="rest-action-btn edit"
                      onClick={() => updateStatus(o.id, "DELIVERED")}
                    >
                      <CheckCircle size={12} /> Deliver
                    </button>
                  )}
                  {(o.status === "DELIVERED" || o.status === "REJECTED") && (
                    <span className="order-done-label">
                      {o.status === "DELIVERED" ? "✓ Completed" : "✗ Rejected"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="clients-empty">No orders found.</div>
        )}
      </div>
    </AdminLayout>
  );
}