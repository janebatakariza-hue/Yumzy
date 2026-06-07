import AdminLayout from "../../layouts/AdminLayout";
import { revenueData } from "../../data/overview";
import {
  TrendingUp, ShoppingBag, Users, Star,
} from "lucide-react";
import "./Analytics.css";

const chartMax = Math.max(...revenueData.map((d) => d.revenue));

const topItems = [
  { name: "Tom Yummy",        orders: 342, revenue: 2052000, pct: 90 },
  { name: "Beef Steak",       orders: 280, revenue: 4200000, pct: 74 },
  { name: "Singapore Sling",  orders: 210, revenue: 1680000, pct: 55 },
  { name: "Cappuccino",       orders: 198, revenue:  495000, pct: 52 },
  { name: "Pizza Margherita", orders: 175, revenue: 2100000, pct: 46 },
];

const topRestaurants = [
  { name: "Soy Restaurant", revenue: 12000000, orders: 1240, rating: 4.2 },
  { name: "M Hotel & Spa",  revenue: 18000000, orders: 980,  rating: 4.8 },
  { name: "Aroma Cafe",     revenue:  6000000, orders: 760,  rating: 4.5 },
  { name: "Sundowner",      revenue:  8000000, orders: 540,  rating: 4.0 },
];

export default function Analytics() {
  return (
    <AdminLayout
      title="Analytics"
      subtitle="Revenue trends, top performers and key insights"
    >
      {/* Stats Row */}
      <div className="tables-stats">
        {[
          { label: "Total Revenue",  value: "38.2M RWF", color: "#2e7d32", icon: TrendingUp  },
          { label: "Total Orders",   value: "67,569",    color: "#1565c0", icon: ShoppingBag },
          { label: "Total Clients",  value: "60",        color: "#d4920a", icon: Users       },
          { label: "Avg Rating",     value: "4.4 ★",     color: "#c62828", icon: Star        },
        ].map((s) => (
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

      <div className="analytics-body">
        {/* Revenue Chart */}
        <div className="analytics-card analytics-chart-card">
          <h3 className="analytics-card-title">Revenue Over Time</h3>
          <div className="analytics-chart-wrap">
            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="ov-svg">
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#1a3d1a" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1a3d1a" stopOpacity="0"   />
                </linearGradient>
              </defs>
              {[0, 50, 100, 150, 200].map((y) => (
                <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#f0ece4" strokeWidth="1" />
              ))}
              <polyline
                fill="url(#aGrad)" stroke="none"
                points={[
                  ...revenueData.map((d, i) => {
                    const x = (i / (revenueData.length - 1)) * 500;
                    const y = 200 - (d.revenue / chartMax) * 180;
                    return `${x},${y}`;
                  }),
                  "500,200", "0,200",
                ].join(" ")}
              />
              <polyline
                fill="none" stroke="#1a3d1a" strokeWidth="2.5"
                strokeLinejoin="round" strokeLinecap="round"
                points={revenueData.map((d, i) => {
                  const x = (i / (revenueData.length - 1)) * 500;
                  const y = 200 - (d.revenue / chartMax) * 180;
                  return `${x},${y}`;
                }).join(" ")}
              />
              {revenueData.map((d, i) => {
                const x = (i / (revenueData.length - 1)) * 500;
                const y = 200 - (d.revenue / chartMax) * 180;
                return <circle key={i} cx={x} cy={y} r="4" fill="#1a3d1a" stroke="white" strokeWidth="2" />;
              })}
            </svg>
            <div className="analytics-chart-labels">
              {revenueData.map((d) => (
                <span key={d.date}>{d.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Restaurants */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Top Restaurants</h3>
          <div className="analytics-list">
            {topRestaurants.map((r, i) => (
              <div key={r.name} className="analytics-list-row">
                <span className="analytics-rank">#{i + 1}</span>
                <div className="analytics-list-info">
                  <p className="analytics-list-name">{r.name}</p>
                  <p className="analytics-list-meta">{r.orders} orders · ★ {r.rating}</p>
                </div>
                <span className="analytics-list-value">
                  {(r.revenue / 1_000_000).toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Menu Items */}
      <div className="analytics-card">
        <h3 className="analytics-card-title">Top Selling Items</h3>
        <div className="analytics-items">
          {topItems.map((item) => (
            <div key={item.name} className="analytics-item-row">
              <span className="analytics-item-name">{item.name}</span>
              <div className="analytics-bar-wrap">
                <div className="analytics-bar" style={{ width: `${item.pct}%` }} />
              </div>
              <span className="analytics-item-orders">{item.orders} orders</span>
              <span className="analytics-item-revenue">
                {(item.revenue / 1000).toFixed(0)}K RWF
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}