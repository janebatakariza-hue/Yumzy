import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, SlidersHorizontal, ArrowUpDown,
  Eye, MoreVertical, Search, X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { clients as allClients } from "../../data/clients";
import type { Client } from "../../types";
import "./Clients.css";

const categoryColors: Record<string, { bg: string; color: string }> = {
  RESTAURANT: { bg: "#e8f5e9", color: "#2e7d32" },
  HOTEL:      { bg: "#e3f2fd", color: "#1565c0" },
  PUB:        { bg: "#fbe9e7", color: "#bf360c" },
  CAFE:       { bg: "#fff8e1", color: "#d4920a" },
};

export default function Clients() {
  const navigate = useNavigate();
  const [search, setSearch]         = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [filterCat, setFilterCat]   = useState("ALL");
  const [form, setForm]             = useState({
    name: "", category: "", representative: "",
    createdAt: "", address: "", email: "", phone: "",
  });

  const filtered = allClients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "ALL" || c.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleSubmit = () => {
    alert(`Client "${form.name}" added successfully!`);
    setShowForm(false);
    setForm({ name: "", category: "", representative: "", createdAt: "", address: "", email: "", phone: "" });
  };

  return (
    <AdminLayout
      title="Clients"
      subtitle="Manage all your restaurant clients"
      actions={
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={15} /> New Client
        </button>
      }
    >
      {/* Add Client Form Modal */}
      {showForm && (
        <div className="clients-modal-overlay">
          <div className="clients-modal">
            <div className="clients-modal-header">
              <h3>Add New Client</h3>
              <button className="clients-modal-close" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="clients-modal-body">
              <div className="clients-modal-left">
                <div className="cf-field">
                  <label>Client Name</label>
                  <input
                    placeholder="client name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="cf-field">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Choose category</option>
                    <option value="RESTAURANT">Restaurant</option>
                    <option value="HOTEL">Hotel</option>
                    <option value="PUB">Pub</option>
                    <option value="CAFE">Cafe</option>
                  </select>
                </div>
                <div className="cf-field">
                  <label>Representative</label>
                  <input
                    placeholder="Names"
                    value={form.representative}
                    onChange={(e) => setForm({ ...form, representative: e.target.value })}
                  />
                </div>
                <div className="cf-field">
                  <label>Date of Creation</label>
                  <input
                    placeholder="Month & year"
                    value={form.createdAt}
                    onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
                  />
                </div>
                <div className="cf-field">
                  <label>Address</label>
                  <input
                    placeholder="Province, district, sector, cell"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="cf-field">
                  <label>Email</label>
                  <input
                    placeholder="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="cf-field">
                  <label>Phone</label>
                  <input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <button className="clients-add-submit-btn" onClick={handleSubmit}>
                  Add Client
                </button>
              </div>
              <div className="clients-modal-right">
                <img src="/soy.png" alt="restaurant" className="clients-modal-img" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="clients-toolbar">
        <div className="clients-search">
          <Search size={14} color="#aaa" />
          <input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="clients-filter-tabs">
          {["ALL", "RESTAURANT", "HOTEL", "PUB", "CAFE"].map((cat) => (
            <button
              key={cat}
              className={`clients-cat-btn ${filterCat === cat ? "active" : ""}`}
              onClick={() => setFilterCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="clients-table-card">
        <div className="clients-table-header">
          <h3>All Clients</h3>
          <div className="clients-table-actions">
            <button className="clients-tool-btn">
              <ArrowUpDown size={14} /> Sort
            </button>
            <button className="clients-tool-btn">
              <SlidersHorizontal size={14} /> Filter
            </button>
          </div>
        </div>

        <table className="clients-table">
          <thead>
            <tr>
              <th>CLIENT DETAILS</th>
              <th>SALES</th>
              <th>DETAILED REPORT</th>
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: Client) => {
              const cc = categoryColors[c.category];
              return (
                <tr key={c.id}>
                  <td>
                    <div className="client-cell">
                      <div
                        className="client-avatar"
                        style={{ background: cc.bg, color: cc.color }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="client-name">{c.name}</p>
                        <p className="client-meta">
                          Updated {new Date(c.lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} ago
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="client-sales">
                      {c.totalSales.toLocaleString()} frw
                    </p>
                    <p className="client-meta">
                      on wednesday 20
                    </p>
                  </td>
                  <td>
                    <button
                      className="client-eye-btn"
                      onClick={() => navigate(`/admin/clients/${c.id}`)}
                    >
                      <Eye size={16} color="#d4920a" />
                    </button>
                  </td>
                  <td>
                    <span
                      className="client-category-badge"
                      style={{ background: cc.bg, color: cc.color }}
                    >
                      {c.category === "RESTAURANT" ? "RESTO" : c.category}
                    </span>
                  </td>
                  <td>
                    <span className={`client-status ${c.isActive ? "active" : "inactive"}`}>
                      ● {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button className="client-more-btn">
                      <MoreVertical size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="clients-empty">
            No clients found matching your search.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}