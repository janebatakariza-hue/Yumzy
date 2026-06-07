import { useState } from "react";
import { Search, CreditCard, Smartphone, Banknote, TrendingUp } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { payments as allPayments } from "../../data/payments";
import "./Payments.css";

const statusConfig = {
  PAID:     { bg: "#e8f5e9", color: "#2e7d32" },
  PENDING:  { bg: "#fff8e1", color: "#f57f17" },
  FAILED:   { bg: "#ffebee", color: "#c62828" },
  REFUNDED: { bg: "#ede7f6", color: "#6a1b9a" },
};

const methodIcons = {
  CASH:         Banknote,
  CARD:         CreditCard,
  MOBILE_MONEY: Smartphone,
};

export default function Payments() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("ALL");

  const filtered = allPayments.filter((p) => {
    const matchSearch =
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPaid    = allPayments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const totalPending = allPayments.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const totalFailed  = allPayments.filter((p) => p.status === "FAILED").reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: "Total Collected", value: `${totalPaid.toLocaleString()} RWF`,   color: "#2e7d32", icon: TrendingUp  },
    { label: "Pending",         value: `${totalPending.toLocaleString()} RWF`, color: "#f57f17", icon: CreditCard  },
    { label: "Failed",          value: `${totalFailed.toLocaleString()} RWF`,  color: "#c62828", icon: CreditCard  },
    { label: "Transactions",    value: allPayments.length.toString(),           color: "#1565c0", icon: Banknote    },
  ];

  return (
    <AdminLayout
      title="Payments"
      subtitle="Track all transactions and payment statuses"
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
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rest-filter-tabs">
          {["ALL", "PAID", "PENDING", "FAILED", "REFUNDED"].map((s) => (
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

      {/* Table */}
      <div className="clients-table-card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>ORDER</th>
              <th>CLIENT</th>
              <th>RESTAURANT</th>
              <th>AMOUNT</th>
              <th>METHOD</th>
              <th>STATUS</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const sc = statusConfig[p.status];
              const MethodIcon = methodIcons[p.method];
              return (
                <tr key={p.id}>
                  <td className="client-name">{p.orderNumber}</td>
                  <td className="client-meta">{p.clientName}</td>
                  <td className="client-meta">{p.restaurantName}</td>
                  <td className="client-sales">{p.amount.toLocaleString()} RWF</td>
                  <td>
                    <span className="payment-method">
                      <MethodIcon size={13} />
                      {p.method.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span className="client-category-badge" style={{ background: sc.bg, color: sc.color }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="client-meta">
                    {new Date(p.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="clients-empty">No payments found.</div>
        )}
      </div>
    </AdminLayout>
  );
}