import { useState } from "react";
import { restaurants } from "../Overview/Restaurants.data";
import Sidebar from "../Overview/Sidebar";
import TopBar from "../Overview/Topbar";
import FilterBar from "../Overview/Filterbar";
import { useNavigate } from "react-router-dom";

const badgeColors: Record<string, string> = {
  RESTAURANT: "#2d5a1b",
  HOTEL: "#1b3a5a",
  PUB: "#5a1b1b",
  CAFE: "#1b3a3a",
};

function Overview() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#f5f0e8",
          minWidth: 0,
        }}
      >
        <TopBar />
        <FilterBar />

        {/* Restaurant Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            padding: "24px 32px",
          }}
        >
          {restaurants.map((r) => {
            const isOpen = r.status !== "CLOSED";
            const isCLosingSoon = r.status.startsWith("CLOSES");
            return (
              <div
                key={r.id}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: "180px" }}>
                  <img
                    src={r.image}
                    alt={r.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: badgeColors[r.type] || "#333",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: "5px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {r.type}
                  </span>
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    {r.name}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                    📍 {r.location}
                  </p>
                  <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>
                    {r.cuisine}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "4px",
                    }}
                  >
                    <span style={{ color: "#d4920a", fontSize: "12px" }}>
                      {"★".repeat(Math.floor(r.rating))}
                      {"☆".repeat(5 - Math.floor(r.rating))}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1a1a1a",
                      }}
                    >
                      {r.rating}
                    </span>
                    <span style={{ fontSize: "12px", color: "#aaa" }}>
                      ({r.reviews})
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: "20px",
                        background:
                          isOpen && !isCLosingSoon
                            ? "#dcfce7"
                            : isCLosingSoon
                              ? "#fef3c7"
                              : "#fee2e2",
                        color:
                          isOpen && !isCLosingSoon
                            ? "#16a34a"
                            : isCLosingSoon
                              ? "#d97706"
                              : "#dc2626",
                      }}
                    >
                      {r.status === "OPEN" ? "● OPEN" : r.status}
                    </span>
                  </div>

                  <button
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "8px",
                      border: "none",
                      borderRadius: "8px",
                      background: isOpen ? "#d4920a" : "#f0ece4",
                      color: isOpen ? "#1a0f00" : "#aaa",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: isOpen ? "pointer" : "not-allowed",
                    }}
                    onClick={() => isOpen && navigate("/menu")}
                  >
                    {isOpen ? "View Menu →" : "Currently Closed"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "24px",
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ‹
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                background: currentPage === page ? "#1a3d1a" : "white",
                color: currentPage === page ? "white" : "#333",
                border:
                  currentPage === page ? "1px solid #1a3d1a" : "1px solid #ddd",
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default Overview;
