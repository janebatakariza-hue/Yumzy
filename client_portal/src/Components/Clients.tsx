import { useState } from "react";
import Sidebar from "../Overview/Sidebar";
import {
  Users, UserCheck, Star, DollarSign, TrendingUp,
  Plus, Megaphone, Tag, Download, Search
} from "lucide-react";
import "./Clients.css";

const stats = [
  { label: "Total Clients",     value: "2,847", icon: Users,      color: "#1a3d1a", bg: "#e8f5e9", gold: false },
  { label: "Active This Month", value: "1,392", icon: UserCheck,  color: "#1565c0", bg: "#e3f2fd", gold: false },
  { label: "VIP Clients",       value: "286",   icon: Star,       color: "#d4920a", bg: "#fff8e1", gold: true  },
  { label: "Average Spend",     value: "$74",   icon: DollarSign, color: "#1a1a1a", bg: "#f5f5f5", gold: false },
  { label: "Returning Rate",    value: "68%",   icon: TrendingUp, color: "#2e7d32", bg: "#e8f5e9", gold: false },
];

const clients = [
  {
    id: 1,
    name: "Emma Johnson",
    email: "emma@gmail.com",
    avatar: "EJ",
    avatarBg: "#d4920a",
    lastVisit: "Jun 2",
    orders: 34,
    spend: "$1,284",
    loyalty: "Gold",
    status: "Active",
    type: "VIP",
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael@gmail.com",
    avatar: "MB",
    avatarBg: "#1565c0",
    lastVisit: "Jun 1",
    orders: 21,
    spend: "$846",
    loyalty: "Silver",
    status: "Active",
    type: "Regular",
  },
  {
    id: 3,
    name: "Sophia Davis",
    email: "sophia@gmail.com",
    avatar: "SD",
    avatarBg: "#6a1b9a",
    lastVisit: "Today",
    orders: 45,
    spend: "$2,710",
    loyalty: "Platinum",
    status: "Active",
    type: "VIP",
  },
  {
    id: 4,
    name: "James Okonkwo",
    email: "james@gmail.com",
    avatar: "JO",
    avatarBg: "#2e7d32",
    lastVisit: "May 28",
    orders: 12,
    spend: "$420",
    loyalty: "Silver",
    status: "Inactive",
    type: "Regular",
  },
  {
    id: 5,
    name: "Aisha Nkosi",
    email: "aisha@gmail.com",
    avatar: "AN",
    avatarBg: "#c62828",
    lastVisit: "Jun 3",
    orders: 8,
    spend: "$190",
    loyalty: "Bronze",
    status: "Active",
    type: "Regular",
  },
];

const loyaltyColors: Record<string, { bg: string; color: string }> = {
  Gold:     { bg: "#fff8e1", color: "#d4920a" },
  Silver:   { bg: "#f5f5f5", color: "#757575" },
  Platinum: { bg: "#ede7f6", color: "#6a1b9a" },
  Bronze:   { bg: "#fbe9e7", color: "#bf360c" },
};

const recentActivity = [
  "Emma booked Table T05",
  "Michael left a review",
  "Sophia redeemed loyalty points",
  "James cancelled an order",
  "Aisha made her first order",
];

export default function Clients() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) => {
    const matchFilter = activeFilter === "All" || c.type === activeFilter;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="clients-page">
      <Sidebar />

      <div className="clients-main">
        {/* Topbar */}
        <div className="clients-topbar">
          <div>
            <h1 className="clients-title">Clients Management</h1>
            <p className="clients-subtitle">
              Manage customer relationships, loyalty and restaurant CRM
            </p>
          </div>
          <div className="clients-search">
            <Search size={14} color="#aaa" />
            <input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="clients-stats">
          {stats.map((s) => (
            <div key={s.label} className="clients-stat-card">
              <div className="clients-stat-icon" style={{ background: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p
                  className="clients-stat-value"
                  style={{ color: s.gold ? "#d4920a" : s.color === "#2e7d32" ? "#2e7d32" : "#1a1a1a" }}
                >
                  {s.value}
                </p>
                <p className="clients-stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="clients-body">
          {/* Left — Client Directory */}
          <div className="clients-left">
            <div className="clients-card">
              <div className="clients-card-header">
                <h3>Client Directory</h3>
                <div className="clients-filter-tabs">
                  {["All", "VIP", "Regular"].map((f) => (
                    <button
                      key={f}
                      className={`clients-filter-btn ${activeFilter === f ? "active" : ""}`}
                      onClick={() => setActiveFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <table className="clients-table">
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th>LAST VISIT</th>
                    <th>ORDERS</th>
                    <th>SPEND</th>
                    <th>LOYALTY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const lc = loyaltyColors[c.loyalty];
                    const isActive = c.status === "Active";
                    return (
                      <tr key={c.id}>
                        <td>
                          <div className="client-cell">
                            <div
                              className="client-avatar"
                              style={{ background: c.avatarBg }}
                            >
                              {c.avatar}
                            </div>
                            <div>
                              <p className="client-name">{c.name}</p>
                              <p className="client-email">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="client-visit">{c.lastVisit}</td>
                        <td>{c.orders}</td>
                        <td className="client-spend">{c.spend}</td>
                        <td>
                          <span
                            className="client-loyalty"
                            style={{ background: lc.bg, color: lc.color }}
                          >
                            {c.loyalty}
                          </span>
                        </td>
                        <td>
                          <span className={`client-status ${isActive ? "status-active" : "status-inactive"}`}>
                            ● {c.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right */}
          <div className="clients-right">
            {/* Customer Insights */}
            <div className="clients-card">
              <h3 className="clients-card-title">Customer Insights</h3>
              <p className="clients-insights-label">TOP CUSTOMER</p>
              <div className="clients-top-customer">
                <div className="client-avatar" style={{ background: "#d4920a", width: 40, height: 40, fontSize: 14 }}>EJ</div>
                <div>
                  <p className="client-name">Emma Johnson</p>
                  <p className="client-email">$1,284 Revenue</p>
                  <p className="client-email">Favorite: Truffle Burger</p>
                  <p className="client-email">3.2 Visits / Week</p>
                </div>
              </div>
              <div className="clients-insights-grid">
                <div className="clients-insight-box gold">
                  <p className="insight-value">286</p>
                  <p className="insight-label">VIP</p>
                </div>
                <div className="clients-insight-box">
                  <p className="insight-value">1,145</p>
                  <p className="insight-label">Regular</p>
                </div>
                <div className="clients-insight-box">
                  <p className="insight-value">348</p>
                  <p className="insight-label">New</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="clients-card">
              <h3 className="clients-card-title">Quick Actions</h3>
              <div className="clients-quick-actions">
                <button className="cqa-btn cqa-gold">
                  <Plus size={14} /> Add Client
                </button>
                <button className="cqa-btn cqa-gold">
                  <Megaphone size={14} /> Campaign
                </button>
                <button className="cqa-btn cqa-dark">
                  <Tag size={14} /> Promotion
                </button>
                <button className="cqa-btn cqa-dark">
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="clients-card">
              <h3 className="clients-card-title">Recent Activity</h3>
              <ul className="clients-activity">
                {recentActivity.map((a, i) => (
                  <li key={i} className="clients-activity-item">
                    <span className="activity-dot" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}