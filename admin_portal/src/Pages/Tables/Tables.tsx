import { useState } from "react";
import {
  Plus, Search, Edit, Trash2, UserCheck,
  LayoutGrid, List, X, Users,
  CheckCircle, Clock, Ban,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { tables as allTables } from "../../data/tables";
import type { Table } from "../../types";
import "./Tables.css";

const statusConfig = {
  AVAILABLE: { label: "Available", color: "#2e7d32", bg: "#e8f5e9", icon: CheckCircle },
  OCCUPIED:  { label: "Occupied",  color: "#c62828", bg: "#ffebee", icon: Ban         },
  RESERVED:  { label: "Reserved",  color: "#f57f17", bg: "#fff8e1", icon: Clock       },
};

const emptyForm = {
  tableNumber: "",
  capacity: "",
  status: "AVAILABLE",
  restaurantId: "1",
  waiterName: "",
  reservedFor: "",
  reservedAt: "",
};

export default function Tables() {
  const [data, setData]           = useState<Table[]>(allTables);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilter] = useState("ALL");
  const [view, setView]           = useState<"grid" | "list">("grid");
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);

  const filtered = data.filter((t) => {
    const matchSearch =
      t.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
      (t.waiterName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Total Tables", value: data.length,                                    color: "#1a1a1a", icon: LayoutGrid  },
    { label: "Available",    value: data.filter((t) => t.status === "AVAILABLE").length, color: "#2e7d32", icon: CheckCircle },
    { label: "Occupied",     value: data.filter((t) => t.status === "OCCUPIED").length,  color: "#c62828", icon: Ban         },
    { label: "Reserved",     value: data.filter((t) => t.status === "RESERVED").length,  color: "#f57f17", icon: Clock       },
    { label: "Total Seats",  value: data.reduce((s, t) => s + t.capacity, 0),       color: "#1565c0", icon: Users       },
  ];

  const handleSubmit = () => {
    if (!form.tableNumber || !form.capacity) {
      alert("Please fill in table number and capacity!");
      return;
    }
    const newTable: Table = {
      id: Date.now().toString(),
      tableNumber: form.tableNumber,
      capacity: parseInt(form.capacity),
      status: form.status as Table["status"],
      restaurantId: form.restaurantId,
      waiterName: form.waiterName,
      currentBill: 0,
      reservedFor: form.reservedFor || undefined,
      reservedAt: form.reservedAt || undefined,
    };
    setData((prev) => [...prev, newTable]);
    setShowForm(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this table?")) {
      setData((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const cycleStatus = (id: string) => {
    const cycle: Table["status"][] = ["AVAILABLE", "OCCUPIED", "RESERVED"];
    setData((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = cycle[(cycle.indexOf(t.status) + 1) % cycle.length];
        return { ...t, status: next };
      })
    );
  };

  return (
    <AdminLayout
      title="Tables Management"
      subtitle="Monitor and manage all restaurant tables"
      actions={
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={15} /> Add Table
        </button>
      }
    >
      {/* Modal */}
      {showForm && (
        <div className="rest-modal-overlay">
          <div className="tables-modal">
            <div className="rest-modal-header">
              <h3>Add New Table</h3>
              <button className="rest-modal-close" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="tables-modal-body">
              {[
                { label: "Table Number", key: "tableNumber", placeholder: "e.g. T09"        },
                { label: "Capacity",     key: "capacity",    placeholder: "Number of seats"  },
                { label: "Waiter Name",  key: "waiterName",  placeholder: "Assigned waiter"  },
                { label: "Reserved For", key: "reservedFor", placeholder: "Guest name"       },
                { label: "Reserved At",  key: "reservedAt",  placeholder: "e.g. 7:00 PM"     },
              ].map((f) => (
                <div key={f.key} className="cf-field">
                  <label>{f.label}</label>
                  <input
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="cf-field">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="RESERVED">Reserved</option>
                </select>
              </div>
              <button className="clients-add-submit-btn" onClick={handleSubmit}>
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

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
            placeholder="Search tables or waiters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rest-filter-tabs">
          {["ALL", "AVAILABLE", "OCCUPIED", "RESERVED"].map((s) => (
            <button
              key={s}
              className={`clients-cat-btn ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="rest-view-toggle">
          <button
            className={`rest-view-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            <LayoutGrid size={13} /> Grid
          </button>
          <button
            className={`rest-view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            <List size={13} /> List
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="tables-grid">
          {filtered.map((t) => {
            const sc = statusConfig[t.status];
            return (
              <div key={t.id} className="table-card">
                <div className="table-card-header" style={{ background: sc.bg }}>
                  <span className="table-card-number">{t.tableNumber}</span>
                  <span className="table-card-status" style={{ color: sc.color }}>
                    <sc.icon size={13} /> {sc.label}
                  </span>
                </div>
                <div className="table-card-body">
                  <div className="table-card-row">
                    <span className="table-card-label">Capacity</span>
                    <span className="table-card-value">{t.capacity} Seats</span>
                  </div>
                  <div className="table-card-row">
                    <span className="table-card-label">Waiter</span>
                    <span className="table-card-value">{t.waiterName || "—"}</span>
                  </div>
                  {t.reservedFor && (
                    <div className="table-card-row">
                      <span className="table-card-label">Reserved For</span>
                      <span className="table-card-value">{t.reservedFor}</span>
                    </div>
                  )}
                  {t.reservedAt && (
                    <div className="table-card-row">
                      <span className="table-card-label">Time</span>
                      <span className="table-card-value">{t.reservedAt}</span>
                    </div>
                  )}
                  {t.currentBill !== undefined && t.currentBill > 0 && (
                    <div className="table-card-row">
                      <span className="table-card-label">Current Bill</span>
                      <span className="table-card-bill">
                        {t.currentBill.toLocaleString()} RWF
                      </span>
                    </div>
                  )}
                  <div className="table-card-actions">
                    <button
                      className="rest-action-btn edit"
                      onClick={() => cycleStatus(t.id)}
                    >
                      <Edit size={12} /> Status
                    </button>
                    <button className="rest-action-btn toggle">
                      <UserCheck size={12} /> Assign
                    </button>
                    <button
                      className="rest-action-btn delete"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="clients-table-card">
          <table className="clients-table">
            <thead>
              <tr>
                <th>TABLE</th>
                <th>STATUS</th>
                <th>CAPACITY</th>
                <th>WAITER</th>
                <th>RESERVED FOR</th>
                <th>CURRENT BILL</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const sc = statusConfig[t.status];
                return (
                  <tr key={t.id}>
                    <td className="client-name">{t.tableNumber}</td>
                    <td>
                      <span
                        className="client-category-badge"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td>{t.capacity} Seats</td>
                    <td>{t.waiterName || "—"}</td>
                    <td>{t.reservedFor || "—"}</td>
                    <td className="client-sales">
                      {t.currentBill
                        ? `${t.currentBill.toLocaleString()} RWF`
                        : "—"}
                    </td>
                    <td>
                      <div className="table-actions-row">
                        <button
                          className="rest-action-btn edit"
                          onClick={() => cycleStatus(t.id)}
                        >
                          <Edit size={13} />
                        </button>
                        <button className="rest-action-btn toggle">
                          <UserCheck size={13} />
                        </button>
                        <button
                          className="rest-action-btn delete"
                          onClick={() => handleDelete(t.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="clients-empty">No tables found.</div>
      )}
    </AdminLayout>
  );
}