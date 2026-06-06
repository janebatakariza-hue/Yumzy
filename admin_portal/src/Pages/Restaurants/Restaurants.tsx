import { useState } from "react";
import {
  Plus, Search, Star, MapPin, Phone,
  Mail, Edit, Trash2, ToggleLeft,
  ToggleRight, X, Store,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { restaurants as allRestaurants } from "../../data/restaurants";
import type { Restaurant } from "../../types";
import "./Restaurants.css";

const categoryColors: Record<string, { bg: string; color: string }> = {
  RESTAURANT: { bg: "#e8f5e9", color: "#2e7d32" },
  HOTEL:      { bg: "#e3f2fd", color: "#1565c0" },
  PUB:        { bg: "#fbe9e7", color: "#bf360c" },
  CAFE:       { bg: "#fff8e1", color: "#d4920a" },
};

const emptyForm = {
  name: "", category: "", address: "",
  phone: "", email: "", representative: "",
};

export default function Restaurants() {
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("ALL");
  const [showForm, setShowForm]   = useState(false);
  const [view, setView]           = useState<"grid" | "list">("grid");
  const [form, setForm]           = useState(emptyForm);
  const [data, setData]           = useState<Restaurant[]>(allRestaurants);

  const filtered = data.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "ALL" || r.category === filterCat;
    return matchSearch && matchCat;
  });

  const toggleActive = (id: string) => {
    setData((prev) =>
      prev.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this restaurant?")) {
      setData((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.category) {
      alert("Please fill in at least name and category!");
      return;
    }
    const newRestaurant: Restaurant = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category as Restaurant["category"],
      address: form.address,
      phone: form.phone,
      email: form.email,
      representative: form.representative,
      rating: 0,
      totalSales: 0,
      isActive: true,
      isOpen: false,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => [newRestaurant, ...prev]);
    setShowForm(false);
    setForm(emptyForm);
  };

  const stats = [
    { label: "Total",       value: data.length,                              color: "#1a1a1a" },
    { label: "Active",      value: data.filter((r) => r.isActive).length,   color: "#2e7d32" },
    { label: "Inactive",    value: data.filter((r) => !r.isActive).length,  color: "#dc2626" },
    { label: "Open Now",    value: data.filter((r) => r.isOpen).length,     color: "#1565c0" },
  ];

  return (
    <AdminLayout
      title="Restaurants"
      subtitle="Manage all registered restaurants, hotels, pubs and cafes"
      actions={
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={15} /> Add Restaurant
        </button>
      }
    >
      {/* Modal */}
      {showForm && (
        <div className="rest-modal-overlay">
          <div className="rest-modal">
            <div className="rest-modal-header">
              <h3>Add New Restaurant</h3>
              <button onClick={() => setShowForm(false)} className="rest-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="rest-modal-body">
              <div className="rest-modal-left">
                {[
                  { label: "Restaurant Name", key: "name",           placeholder: "e.g. Soy Restaurant"         },
                  { label: "Representative",  key: "representative", placeholder: "Full name"                   },
                  { label: "Address",         key: "address",        placeholder: "Province, district, sector"  },
                  { label: "Email",           key: "email",          placeholder: "email@example.com"           },
                  { label: "Phone",           key: "phone",          placeholder: "+250 7XX XXX XXX"            },
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
                <button className="clients-add-submit-btn" onClick={handleSubmit}>
                  Add Restaurant
                </button>
              </div>
              <div className="rest-modal-right">
                <Store size={80} color="#e8e8e8" />
                <p>Your restaurant will appear in the list after adding</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini Stats */}
      <div className="rest-mini-stats">
        {stats.map((s) => (
          <div key={s.label} className="rest-mini-stat">
            <p className="rest-mini-value" style={{ color: s.color }}>{s.value}</p>
            <p className="rest-mini-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rest-toolbar">
        <div className="clients-search">
          <Search size={14} color="#aaa" />
          <input
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rest-filter-tabs">
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
        <div className="rest-view-toggle">
          <button
            className={`rest-view-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            className={`rest-view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="rest-grid">
          {filtered.map((r) => {
            const cc = categoryColors[r.category];
            return (
              <div key={r.id} className={`rest-card ${!r.isActive ? "inactive" : ""}`}>
                <div className="rest-card-img-wrap">
                  <img src={r.image || "/soy.png"} alt={r.name} className="rest-card-img" />
                  <span
                    className="rest-card-badge"
                    style={{ background: cc.bg, color: cc.color }}
                  >
                    {r.category}
                  </span>
                  <span className={`rest-card-open ${r.isOpen ? "open" : "closed"}`}>
                    {r.isOpen ? "● OPEN" : "● CLOSED"}
                  </span>
                </div>
                <div className="rest-card-body">
                  <h3 className="rest-card-name">{r.name}</h3>
                  <div className="rest-card-info">
                    <span><MapPin size={11} /> {r.address}</span>
                    <span><Phone size={11} /> {r.phone}</span>
                    <span><Mail size={11} /> {r.email}</span>
                  </div>
                  <div className="rest-card-meta">
                    <span className="rest-card-rating">
                      <Star size={12} fill="#d4920a" color="#d4920a" /> {r.rating}
                    </span>
                    <span className="rest-card-sales">
                      {(r.totalSales / 1_000_000).toFixed(1)}M RWF
                    </span>
                  </div>
                  <div className="rest-card-actions">
                    <button className="rest-action-btn edit">
                      <Edit size={13} /> Edit
                    </button>
                    <button
                      className="rest-action-btn toggle"
                      onClick={() => toggleActive(r.id)}
                    >
                      {r.isActive
                        ? <><ToggleRight size={13} /> Deactivate</>
                        : <><ToggleLeft size={13} /> Activate</>
                      }
                    </button>
                    <button
                      className="rest-action-btn delete"
                      onClick={() => handleDelete(r.id)}
                    >
                      <Trash2 size={13} />
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
                <th>RESTAURANT</th>
                <th>CATEGORY</th>
                <th>ADDRESS</th>
                <th>RATING</th>
                <th>SALES</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const cc = categoryColors[r.category];
                return (
                  <tr key={r.id}>
                    <td>
                      <div className="client-cell">
                        <img
                          src={r.image || "/soy.png"}
                          alt={r.name}
                          className="rest-list-img"
                        />
                        <div>
                          <p className="client-name">{r.name}</p>
                          <p className="client-meta">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="client-category-badge"
                        style={{ background: cc.bg, color: cc.color }}
                      >
                        {r.category}
                      </span>
                    </td>
                    <td className="client-meta">{r.address}</td>
                    <td>
                      <span className="rest-card-rating">
                        <Star size={12} fill="#d4920a" color="#d4920a" /> {r.rating}
                      </span>
                    </td>
                    <td className="client-sales">
                      {(r.totalSales / 1_000_000).toFixed(1)}M RWF
                    </td>
                    <td>
                      <span className={`client-status ${r.isActive ? "active" : "inactive"}`}>
                        ● {r.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-row">
                        <button className="rest-action-btn edit">
                          <Edit size={13} />
                        </button>
                        <button
                          className="rest-action-btn delete"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                        <button
                          className="rest-action-btn toggle"
                          onClick={() => toggleActive(r.id)}
                        >
                          {r.isActive
                            ? <ToggleRight size={13} />
                            : <ToggleLeft size={13} />
                          }
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
        <div className="clients-empty">
          No restaurants found matching your search.
        </div>
      )}
    </AdminLayout>
  );
}