import { useState } from "react";
import {
  Plus, Search, Edit, Trash2, X,
  ChefHat, Users, UserCheck, DollarSign,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { staffMembers as allStaff } from "../../data/staff";
import type { StaffMember } from "../../types";
import "./Staff.css";

const roleColors: Record<string, { bg: string; color: string }> = {
  WAITER:   { bg: "#e3f2fd", color: "#1565c0" },
  CHEF:     { bg: "#fff8e1", color: "#d4920a" },
  MANAGER:  { bg: "#e8f5e9", color: "#2e7d32" },
  CASHIER:  { bg: "#fbe9e7", color: "#bf360c" },
};

const shiftColors: Record<string, { bg: string; color: string }> = {
  MORNING:   { bg: "#fff8e1", color: "#d4920a" },
  AFTERNOON: { bg: "#e3f2fd", color: "#1565c0" },
  NIGHT:     { bg: "#ede7f6", color: "#6a1b9a" },
};

const emptyForm = {
  name: "", email: "", phone: "",
  role: "WAITER", shift: "MORNING",
  restaurantName: "", salary: "",
};

export default function Staff() {
  const [data, setData]         = useState<StaffMember[]>(allStaff);
  const [search, setSearch]     = useState("");
  const [filterRole, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);

  const filtered = data.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.restaurantName.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "ALL" || s.role === filterRole;
    return matchSearch && matchRole;
  });

  const toggleActive = (id: string) => {
    setData((prev) =>
      prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s)
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this staff member?")) {
      setData((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.role) {
      alert("Please fill name and role!");
      return;
    }
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role as StaffMember["role"],
      shift: form.shift as StaffMember["shift"],
      restaurantId: "1",
      restaurantName: form.restaurantName,
      salary: parseInt(form.salary) || 0,
      isActive: true,
      joinedAt: new Date().toISOString(),
    };
    setData((prev) => [newStaff, ...prev]);
    setShowForm(false);
    setForm(emptyForm);
  };

  const stats = [
    { label: "Total Staff",  value: data.length,                                   color: "#1a1a1a", icon: Users     },
    { label: "Active",       value: data.filter((s) => s.isActive).length,         color: "#2e7d32", icon: UserCheck },
    { label: "Waiters",      value: data.filter((s) => s.role === "WAITER").length, color: "#1565c0", icon: Users     },
    { label: "Chefs",        value: data.filter((s) => s.role === "CHEF").length,   color: "#d4920a", icon: ChefHat  },
    { label: "Monthly Cost", value: `${(data.reduce((s, m) => s + m.salary, 0) / 1000).toFixed(0)}K RWF`, color: "#c62828", icon: DollarSign },
  ];

  return (
    <AdminLayout
      title="Staff Management"
      subtitle="Manage all restaurant staff members"
      actions={
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={15} /> Add Staff
        </button>
      }
    >
      {/* Modal */}
      {showForm && (
        <div className="rest-modal-overlay">
          <div className="tables-modal">
            <div className="rest-modal-header">
              <h3>Add Staff Member</h3>
              <button className="rest-modal-close" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="tables-modal-body">
              {[
                { label: "Full Name",       key: "name",           placeholder: "Full name"          },
                { label: "Email",           key: "email",          placeholder: "email@yumzy.com"    },
                { label: "Phone",           key: "phone",          placeholder: "+250 7XX XXX XXX"   },
                { label: "Restaurant",      key: "restaurantName", placeholder: "Restaurant name"    },
                { label: "Salary (RWF)",    key: "salary",         placeholder: "e.g. 150000"        },
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
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="WAITER">Waiter</option>
                  <option value="CHEF">Chef</option>
                  <option value="MANAGER">Manager</option>
                  <option value="CASHIER">Cashier</option>
                </select>
              </div>
              <div className="cf-field">
                <label>Shift</label>
                <select value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}>
                  <option value="MORNING">Morning</option>
                  <option value="AFTERNOON">Afternoon</option>
                  <option value="NIGHT">Night</option>
                </select>
              </div>
              <button className="clients-add-submit-btn" onClick={handleSubmit}>
                Add Staff Member
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
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rest-filter-tabs">
          {["ALL", "WAITER", "CHEF", "MANAGER", "CASHIER"].map((r) => (
            <button
              key={r}
              className={`clients-cat-btn ${filterRole === r ? "active" : ""}`}
              onClick={() => setFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="clients-table-card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>STAFF MEMBER</th>
              <th>ROLE</th>
              <th>SHIFT</th>
              <th>RESTAURANT</th>
              <th>SALARY</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const rc = roleColors[s.role];
              const sc = shiftColors[s.shift];
              return (
                <tr key={s.id}>
                  <td>
                    <div className="client-cell">
                      <div className="staff-avatar" style={{ background: rc.bg, color: rc.color }}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="client-name">{s.name}</p>
                        <p className="client-meta">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="client-category-badge" style={{ background: rc.bg, color: rc.color }}>
                      {s.role}
                    </span>
                  </td>
                  <td>
                    <span className="client-category-badge" style={{ background: sc.bg, color: sc.color }}>
                      {s.shift}
                    </span>
                  </td>
                  <td className="client-meta">{s.restaurantName}</td>
                  <td className="client-sales">{s.salary.toLocaleString()} RWF</td>
                  <td>
                    <span className={`client-status ${s.isActive ? "active" : "inactive"}`}>
                      ● {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-row">
                      <button className="rest-action-btn edit"><Edit size={13} /></button>
                      <button className="rest-action-btn toggle" onClick={() => toggleActive(s.id)}>
                        <UserCheck size={13} />
                      </button>
                      <button className="rest-action-btn delete" onClick={() => handleDelete(s.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="clients-empty">No staff members found.</div>
        )}
      </div>
    </AdminLayout>
  );
}