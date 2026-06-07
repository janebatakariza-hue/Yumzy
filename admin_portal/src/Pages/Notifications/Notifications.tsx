import { useState } from "react";
import {
  Bell, ShoppingBag, CreditCard, Star,
  Monitor, AlertTriangle, CheckCheck,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { notifications as allNotifs } from "../../data/notifications";
import type { Notification } from "../../types";
import "./Notifications.css";

const typeConfig = {
  ORDER:   { icon: ShoppingBag,    color: "#1565c0", bg: "#e3f2fd" },
  PAYMENT: { icon: CreditCard,     color: "#2e7d32", bg: "#e8f5e9" },
  REVIEW:  { icon: Star,           color: "#d4920a", bg: "#fff8e1" },
  SYSTEM:  { icon: Monitor,        color: "#6a1b9a", bg: "#ede7f6" },
  ALERT:   { icon: AlertTriangle,  color: "#c62828", bg: "#ffebee" },
};

export default function Notifications() {
  const [data, setData]     = useState<Notification[]>(allNotifs);
  const [filter, setFilter] = useState("ALL");

  const markAllRead = () => {
    setData((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setData((prev) =>
      prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const filtered = data.filter((n) =>
    filter === "ALL" ? true :
    filter === "UNREAD" ? !n.isRead :
    n.type === filter
  );

  const unreadCount = data.filter((n) => !n.isRead).length;

  return (
    <AdminLayout
      title="Notifications"
      subtitle={`You have ${unreadCount} unread notifications`}
      actions={
        <button className="admin-add-btn" onClick={markAllRead}>
          <CheckCheck size={15} /> Mark All Read
        </button>
      }
    >
      {/* Filter Tabs */}
      <div className="rest-toolbar">
        <div className="rest-filter-tabs">
          {["ALL", "UNREAD", "ORDER", "PAYMENT", "REVIEW", "SYSTEM", "ALERT"].map((f) => (
            <button
              key={f}
              className={`clients-cat-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifs-list">
        {filtered.map((n) => {
          const tc = typeConfig[n.type];
          return (
            <div
              key={n.id}
              className={`notif-card ${!n.isRead ? "unread" : ""}`}
              onClick={() => markRead(n.id)}
            >
              <div className="notif-icon" style={{ background: tc.bg }}>
                <tc.icon size={18} color={tc.color} />
              </div>
              <div className="notif-body">
                <p className="notif-title">{n.title}</p>
                <p className="notif-message">{n.message}</p>
                <p className="notif-time">
                  {new Date(n.createdAt).toLocaleString("en-GB", {
                    day: "numeric", month: "short",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              {!n.isRead && <div className="notif-dot" />}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="clients-empty">No notifications found.</div>
        )}
      </div>
    </AdminLayout>
  );
}