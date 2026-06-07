import { useState } from "react";
import {
  Plus, Search, Edit, Trash2, X,
  Coffee, Utensils, Cake, Soup,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { menuItems as allItems } from "../../data/menus";
import type { MenuItem } from "../../types";
import "./Menus.css";

const categories = [
  { key: "ALL",     label: "All",     icon: Utensils },
  { key: "DRINKS",  label: "Drinks",  icon: Coffee   },
  { key: "FOOD",    label: "Food",    icon: Utensils },
  { key: "DESSERT", label: "Dessert", icon: Cake     },
  { key: "STARTER", label: "Starter", icon: Soup     },
];

const emptyForm = {
  name: "", description: "", price: "",
  category: "FOOD", restaurantId: "1",
};

export default function Menus() {
  const [data, setData]         = useState<MenuItem[]>(allItems);
  const [cat, setCat]           = useState("ALL");
  const [search, setSearch]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);

  const filtered = data.filter((m) => {
    const matchCat    = cat === "ALL" || m.category === cat;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleAvailable = (id: string) => {
    setData((prev) =>
      prev.map((m) => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m)
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this menu item?")) {
      setData((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.price) {
      alert("Please fill name and price!");
      return;
    }
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      price: parseInt(form.price),
      category: form.category as MenuItem["category"],
      restaurantId: form.restaurantId,
      isAvailable: true,
      isSpecial: false,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => [newItem, ...prev]);
    setShowForm(false);
    setForm(emptyForm);
  };

  return (
    <AdminLayout
      title="Menus"
      subtitle="Manage all food and drink menu items"
      actions={
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={15} /> Add Item
        </button>
      }
    >
      {/* Modal */}
      {showForm && (
        <div className="rest-modal-overlay">
          <div className="tables-modal">
            <div className="rest-modal-header">
              <h3>Add Menu Item</h3>
              <button className="rest-modal-close" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="tables-modal-body">
              {[
                { label: "Item Name",    key: "name",        placeholder: "e.g. Tom Yummy"     },
                { label: "Description",  key: "description", placeholder: "Brief description"   },
                { label: "Price (RWF)",  key: "price",       placeholder: "e.g. 6000"           },
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
                  <option value="FOOD">Food</option>
                  <option value="DRINKS">Drinks</option>
                  <option value="DESSERT">Dessert</option>
                  <option value="STARTER">Starter</option>
                </select>
              </div>
              <button className="clients-add-submit-btn" onClick={handleSubmit}>
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="menus-cats">
        {categories.map((c) => (
          <button
            key={c.key}
            className={`menus-cat-btn ${cat === c.key ? "active" : ""}`}
            onClick={() => setCat(c.key)}
          >
            <c.icon size={16} />
            {c.label}
          </button>
        ))}
        <div className="clients-search" style={{ marginLeft: "auto" }}>
          <Search size={14} color="#aaa" />
          <input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="menus-grid">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`menu-item-card ${!item.isAvailable ? "unavailable" : ""}`}
          >
            <div className="menu-item-img-wrap">
              <img
                src={item.image || "/dish.png"}
                alt={item.name}
                className="menu-item-img"
              />
              {item.isSpecial && (
                <span className="menu-item-special">Special</span>
              )}
              {!item.isAvailable && (
                <span className="menu-item-unavailable-badge">Unavailable</span>
              )}
            </div>
            <div className="menu-item-body">
              <h3 className="menu-item-name">{item.name}</h3>
              <p className="menu-item-desc">{item.description}</p>
              <p className="menu-item-price">
                {item.price.toLocaleString()} RWF
              </p>
              <div className="menu-item-actions">
                <button className="rest-action-btn edit">
                  <Edit size={12} /> Edit
                </button>
                <button
                  className={`rest-action-btn ${item.isAvailable ? "toggle" : "edit"}`}
                  onClick={() => toggleAvailable(item.id)}
                >
                  {item.isAvailable ? "Hide" : "Show"}
                </button>
                <button
                  className="rest-action-btn delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="clients-empty">No menu items found.</div>
      )}
    </AdminLayout>
  );
}