import { useState } from "react";
import Sidebar from "../Overview/Sidebar";
import {
  LayoutGrid,
  Users,
  BookOpen,
  Ban,
  DollarSign,
  QrCode,
  Plus,
  UserCheck,
  Shuffle,
  Edit,
  Eye,
} from "lucide-react";
import "./MyTables.css";

const stats = [
  {
    label: "Total Tables",
    value: "42",
    icon: LayoutGrid,
    color: "#1a3d1a",
    bg: "#e8f5e9",
  },
  {
    label: "Available",
    value: "18",
    icon: Users,
    color: "#1565c0",
    bg: "#e3f2fd",
  },
  {
    label: "Reserved",
    value: "11",
    icon: BookOpen,
    color: "#e65100",
    bg: "#fff3e0",
  },
  {
    label: "Occupied",
    value: "13",
    icon: Ban,
    color: "#b71c1c",
    bg: "#ffebee",
  },
  {
    label: "Revenue Today",
    value: "$3,860",
    icon: DollarSign,
    color: "#1a3d1a",
    bg: "#f0fdf4",
  },
];

const tables = [
  {
    id: "T01",
    status: "Available",
    capacity: "4 Seats",
    waiter: "Sarah",
    bill: "$8",
  },
  {
    id: "T02",
    status: "Occupied",
    capacity: "2 Seats",
    waiter: "Kim",
    bill: "$0",
  },
  {
    id: "T03",
    status: "Reserved",
    capacity: "6 Seats",
    waiter: "Grace",
    bill: "$90",
  },
  {
    id: "T04",
    status: "Available",
    capacity: "4 Seats",
    waiter: "Sarah",
    bill: "$0",
  },
  {
    id: "T05",
    status: "Occupied",
    capacity: "8 Seats",
    waiter: "Daniel",
    bill: "$145",
  },
  {
    id: "T06",
    status: "Available",
    capacity: "2 Seats",
    waiter: "Kim",
    bill: "$0",
  },
  {
    id: "T07",
    status: "Reserved",
    capacity: "4 Seats",
    waiter: "Grace",
    bill: "$55",
  },
  {
    id: "T08",
    status: "Occupied",
    capacity: "6 Seats",
    waiter: "Daniel",
    bill: "$210",
  },
];

const reservations = [
  { name: "Emeka Johnson", time: "6:00 PM", info: "T03 · 2 Guests" },
  { name: "Michael Brown", time: "8:30 PM", info: "T06 · 4 Guests" },
  { name: "Sophie Davis", time: "7:00 PM", info: "T08 · 6 Guests" },
  { name: "Aisha Nkosi", time: "9:00 PM", info: "T02 · 2 Guests" },
];

const floorPlan = [
  { id: "T01", seats: "4 Seats", status: "Available" },
  { id: "T02", seats: "2 Seats", status: "Occupied" },
  { id: "T03", seats: "6 Seats", status: "Occupied" },
  { id: "T04", seats: "4 Seats", status: "Available" },
  { id: "T05", seats: "8 Seats", status: "Reserved" },
  { id: "T06", seats: "4 Seats", status: "Occupied" },
  { id: "T07", seats: "4 Seats", status: "Available" },
  { id: "T08", seats: "6 Seats", status: "Reserved" },
  { id: "T09", seats: "2 Seats", status: "Available" },
];

const statusColors: Record<
  string,
  { bg: string; color: string; badge: string }
> = {
  Available: { bg: "#e8f5e9", color: "#2e7d32", badge: "badge-available" },
  Occupied: { bg: "#ffebee", color: "#c62828", badge: "badge-occupied" },
  Reserved: { bg: "#fff8e1", color: "#f57f17", badge: "badge-reserved" },
};

const quickActions = [
  { label: "Add Reservation", icon: Plus, className: "qa-gold" },
  { label: "Assign Waiter", icon: UserCheck, className: "qa-gold" },
  { label: "Merge Tables", icon: Shuffle, className: "qa-dark" },
  { label: "View QR Codes", icon: QrCode, className: "qa-dark" },
  { label: "Edit Table", icon: Edit, className: "qa-dark" },
];

export default function Tables() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = tables.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.waiter.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeStatus === "All" || t.status === activeStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="tables-page">
      <Sidebar />

      <div className="tables-main">
        {/* Topbar */}
        <div className="tables-topbar">
          <div>
            <h1 className="tables-title">Tables Management</h1>
            <p className="tables-subtitle">
              Monitor table availability, reservations and dining activity
            </p>
          </div>
          <div className="tables-search">
            <Eye size={14} color="#aaa" />
            <input
              placeholder="Search tables, waiters, reservations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="tables-stats">
          {stats.map((s) => (
            <div key={s.label} className="tables-stat-card">
              <div className="tables-stat-icon" style={{ background: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p className="tables-stat-value">{s.value}</p>
                <p className="tables-stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tables-body">
          {/* Left — Directory + Floor Plan */}
          <div className="tables-left">
            {/* Table Directory */}
            <div className="tables-card">
              <div className="tables-card-header">
                <h3>Table Directory</h3>
                <div className="tables-status-filters">
                  {["All", "Available", "Reserved", "Occupied"].map((s) => (
                    <button
                      key={s}
                      className={`tables-status-btn ${activeStatus === s ? "active" : ""}`}
                      onClick={() => setActiveStatus(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <table className="tables-table">
                <thead>
                  <tr>
                    <th>TABLE</th>
                    <th>STATUS</th>
                    <th>CAPACITY</th>
                    <th>WAITER</th>
                    <th>BILL</th>
                    <th>QR</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const sc = statusColors[t.status];
                    return (
                      <tr key={t.id}>
                        <td className="table-id">{t.id}</td>
                        <td>
                          <span
                            className="table-badge"
                            style={{ background: sc.bg, color: sc.color }}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>{t.capacity}</td>
                        <td>{t.waiter}</td>
                        <td className="table-bill">{t.bill}</td>
                        <td>
                          <button className="table-qr-btn">
                            <QrCode size={14} />
                          </button>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-btn edit">
                              <Edit size={13} />
                            </button>
                            <button className="table-action-btn assign">
                              <UserCheck size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Floor Plan */}
            <div className="tables-card">
              <div className="tables-card-header">
                <h3>Restaurant Floor Plan</h3>
                <div className="floor-legend">
                  <span className="legend-dot available" /> Available
                  <span className="legend-dot occupied" /> Occupied
                  <span className="legend-dot reserved" /> Reserved
                </div>
              </div>
              <div className="floor-grid">
                {floorPlan.map((t) => {
                  const sc = statusColors[t.status];
                  return (
                    <div
                      key={t.id}
                      className="floor-table"
                      style={{ background: sc.bg, borderColor: sc.color }}
                    >
                      <p className="floor-table-id" style={{ color: sc.color }}>
                        {t.id}
                      </p>
                      <p className="floor-table-seats">{t.seats}</p>
                      <p
                        className="floor-table-status"
                        style={{ color: sc.color }}
                      >
                        {t.status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — Reservations + Quick Actions */}
          <div className="tables-right">
            {/* Upcoming Reservations */}
            <div className="tables-card">
              <div className="tables-card-header">
                <h3>Upcoming Reservations</h3>
                <button className="add-res-btn">
                  <Plus size={13} /> Add
                </button>
              </div>
              <div className="reservations-list">
                {reservations.map((r, i) => (
                  <div key={i} className="reservation-item">
                    <div className="reservation-avatar">{r.name.charAt(0)}</div>
                    <div className="reservation-info">
                      <p className="reservation-name">{r.name}</p>
                      <p className="reservation-meta">
                        {r.time} · {r.info}
                      </p>
                    </div>
                    <button className="reservation-action">
                      <Eye size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="tables-card">
              <h3 className="tables-card-title">Quick Actions</h3>
              <div className="quick-actions">
                {quickActions.map((a) => (
                  <button key={a.label} className={`qa-btn ${a.className}`}>
                    <a.icon size={14} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
