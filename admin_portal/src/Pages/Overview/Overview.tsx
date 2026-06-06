import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, TrendingUp, ShoppingBag, Package,
  Plus, ArrowUpRight,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  dashboardStats,
  revenueData,
  venueCards,
  orderSummary,
} from "../../data/overview";
import "./Overview.css";

const chartMax = Math.max(...revenueData.map((d) => d.revenue));

export default function Overview() {
  const navigate = useNavigate();
  const [activeChart, setActiveChart] = useState<"Today" | "Week" | "Month">("Today");

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(3)}M RWF`
      : n.toLocaleString();

  const statCards = [
    {
      label:  "Clients",
      value:  dashboardStats.totalClients.toString(),
      growth: `↑ ${dashboardStats.clientsGrowth}% this month`,
      icon:   Users,
      active: false,
    },
    {
      label:  "Revenue",
      value:  `${fmt(dashboardStats.totalRevenue)}`,
      growth: `↑ ${dashboardStats.revenueGrowth}% vs last month`,
      icon:   TrendingUp,
      active: true,
    },
    {
      label:  "Orders",
      value:  dashboardStats.totalOrders.toLocaleString(),
      growth: `↑ ${dashboardStats.ordersGrowth}% this week`,
      icon:   ShoppingBag,
      active: false,
    },
    {
      label:  "Items Sold",
      value:  dashboardStats.itemsSold.toLocaleString(),
      growth: `↑ ${dashboardStats.itemsGrowth}%`,
      icon:   Package,
      active: false,
    },
  ];

  return (
    <AdminLayout
      title="Overview"
      subtitle={`as of ${new Date().toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })}`}
    >
      {/* Stat Cards */}
      <div className="ov-stats">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`ov-stat-card ${s.active ? "active" : ""}`}
          >
            <div className="ov-stat-top">
              <p className="ov-stat-label">{s.label}</p>
              <div className={`ov-stat-icon ${s.active ? "active" : ""}`}>
                <s.icon size={16} />
              </div>
            </div>
            <p className="ov-stat-value">{s.value}</p>
            <p className="ov-stat-growth">{s.growth}</p>
          </div>
        ))}
      </div>

      {/* Middle Row — Chart + Create Panel */}
      <div className="ov-middle">
        {/* Line Chart */}
        <div className="ov-chart-card">
          <div className="ov-chart-header">
            <p className="ov-chart-date">
              as of 25 Aug 2022, 09:45 PM
            </p>
            <div className="ov-chart-tabs">
              {(["Today", "Week", "Month"] as const).map((t) => (
                <button
                  key={t}
                  className={`ov-chart-tab ${activeChart === t ? "active" : ""}`}
                  onClick={() => setActiveChart(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart */}
          <div className="ov-chart-wrap">
            <svg viewBox="0 0 500 160" preserveAspectRatio="none" className="ov-svg">
              {/* Grid lines */}
              {[0, 40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="0" y1={y} x2="500" y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}

              {/* Area fill */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#4ade80" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="0"   />
                </linearGradient>
              </defs>

              <polyline
                fill="url(#chartGrad)"
                stroke="none"
                points={[
                  ...revenueData.map((d, i) => {
                    const x = (i / (revenueData.length - 1)) * 500;
                    const y = 160 - (d.revenue / chartMax) * 140;
                    return `${x},${y}`;
                  }),
                  "500,160", "0,160",
                ].join(" ")}
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#4ade80"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={revenueData
                  .map((d, i) => {
                    const x = (i / (revenueData.length - 1)) * 500;
                    const y = 160 - (d.revenue / chartMax) * 140;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />

              {/* Dots */}
              {revenueData.map((d, i) => {
                const x = (i / (revenueData.length - 1)) * 500;
                const y = 160 - (d.revenue / chartMax) * 140;
                return (
                  <circle
                    key={i}
                    cx={x} cy={y} r="3"
                    fill="#4ade80"
                    stroke="#0f2010"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Create Panel */}
        <div className="ov-create-card">
          <p className="ov-create-title">Create</p>
          <p className="ov-create-today">Today</p>
          <p className="ov-create-new-label">Create New</p>
          <div className="ov-create-list">
            {["Restaurants", "Hotels", "Pub"].map((item) => (
              <div key={item} className="ov-create-item">
                <div className="ov-create-dot" />
                <span>{item}</span>
                <span className="ov-new-badge">New</span>
              </div>
            ))}
          </div>
          <button
            className="ov-create-btn"
            onClick={() => navigate("/admin/restaurants")}
          >
            <Plus size={14} /> Add New
          </button>
        </div>
      </div>

      {/* Bottom Row — Venue Cards + Order Summary */}
      <div className="ov-bottom">
        {/* Venue Cards Grid */}
        <div className="ov-venues">
          {venueCards.map((v) => (
            <div key={v.category} className="ov-venue-card">
              <div className="ov-venue-header">
                <span className="ov-venue-title">{v.category}</span>
                <button
                  className="ov-view-details"
                  onClick={() => navigate("/admin/restaurants")}
                >
                  View Details
                </button>
              </div>
              <p className="ov-venue-sales-label">Sales</p>
              {v.sales.map((s) => (
                <div key={s.name} className="ov-venue-row">
                  <span className="ov-venue-name">{s.name}</span>
                  <span className="ov-venue-value">
                    {s.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="ov-order-summary">
          {orderSummary.map((o) => (
            <div key={o.label} className="ov-order-row">
              <p className="ov-order-label">{o.label}</p>
              <p className="ov-order-value">{o.value}</p>
            </div>
          ))}
          <button
            className="ov-orders-btn"
            onClick={() => navigate("/admin/orders")}
          >
            View All Orders <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}