import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Overview/Sidebar";
import "./MyOrders.css";

const allOrders = [
  {
    id: 1,
    restaurant: "Soy Restaurant",
    image: "/soy.png",
    orderRef: "YMZ-2041",
    itemCount: 3,
    items: "Grilled Chicken, Plantain, Tilapia Fish",
    total: 18500,
    status: "IN_TRANSIT",
    date: "Today, 1:45 PM",
  },
  {
    id: 2,
    restaurant: "Aroma Cafe",
    image: "/aroma.png",
    orderRef: "YMZ-2038",
    itemCount: 2,
    items: "Cappuccino, Croissant",
    total: 6200,
    status: "DELIVERED",
    date: "May 10, 11:20 AM",
  },
  {
    id: 3,
    restaurant: "Planet Burger",
    image: "/planet.png",
    orderRef: "YMZ-2034",
    itemCount: 4,
    items: "Double Burger, Fries, Cola x2",
    total: 14800,
    status: "DELIVERED",
    date: "May 9, 7:15 PM",
  },
  {
    id: 4,
    restaurant: "M Hotel & Spa",
    image: "/hotel.png",
    orderRef: "YMZ-2031",
    itemCount: 2,
    items: "Beef Steak, Red Wine",
    total: 32000,
    status: "CANCELLED",
    date: "May 8, 3:00 PM",
  },
];

const filters = ["All", "Active", "Completed", "Cancelled"];

const statusMap: Record<string, { label: string; className: string }> = {
  IN_TRANSIT: { label: "In Transit", className: "status-transit" },
  DELIVERED:  { label: "Delivered",  className: "status-delivered" },
  CANCELLED:  { label: "Cancelled",  className: "status-cancelled" },
};

const filterMap: Record<string, string[]> = {
  All:       ["IN_TRANSIT", "DELIVERED", "CANCELLED"],
  Active:    ["IN_TRANSIT"],
  Completed: ["DELIVERED"],
  Cancelled: ["CANCELLED"],
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = allOrders.filter((o) =>
    filterMap[activeFilter].includes(o.status)
  );

  const fmt = (n: number) => `RWF ${n.toLocaleString()}`;

  return (
    <div className="orders-page">
      <Sidebar />

      <div className="orders-main">
        {/* Topbar */}
        <div className="orders-topbar">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">Track and manage all your food orders</p>
          </div>
          <div className="orders-topbar-right">
            <div className="orders-search">
              <span>🔍</span>
              <input placeholder="Search orders..." />
            </div>
            <button className="orders-icon-btn">🔔</button>
            <div className="orders-avatar">JB</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="orders-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`orders-filter-btn ${activeFilter === f ? "active" : ""}`}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="orders-list">
          {filtered.length === 0 ? (
            <p className="orders-empty">No orders in this category.</p>
          ) : (
            filtered.map((order) => {
              const status = statusMap[order.status];
              const isTransit = order.status === "IN_TRANSIT";
              return (
                <div key={order.id} className={`order-card ${isTransit ? "order-card-active" : ""}`}>
                  <img src={order.image} alt={order.restaurant} className="order-card-img" />

                  <div className="order-card-info">
                    <h3 className="order-card-name">{order.restaurant}</h3>
                    <p className="order-card-ref">
                      Order #{order.orderRef} · {order.itemCount} items
                    </p>
                    <p className="order-card-items">{order.items}</p>
                    <p className="order-card-total">{fmt(order.total)}</p>
                  </div>

                  <div className="order-card-right">
                    <span className={`order-status ${status.className}`}>
                      ● {status.label}
                    </span>
                    <p className="order-card-date">{order.date}</p>
                    {isTransit ? (
                      <button
                        className="order-track-btn"
                        onClick={() => navigate("/menu")}
                      >
                        Track Order →
                      </button>
                    ) : (
                      <button
                        className="order-reorder-btn"
                        onClick={() => navigate("/menu")}
                      >
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="orders-pagination">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>‹</button>
          {[1, 2].map((page) => (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}>›</button>
        </div>
      </div>
    </div>
  );
}