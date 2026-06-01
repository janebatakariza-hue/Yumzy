import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

const navItems: { label: string; icon: string; path: string }[] = [
  { label: "Dashboard", icon: "▦", path: "/overview" },
  { label: "Restaurants", icon: "⊞", path: "/overview" },
  { label: "My Orders", icon: "≡", path: "/orders" },
  { label: "Tables", icon: "⬜", path: "/tables" },
  { label: "Favorites", icon: "♥", path: "/favorites" },
];

const bottomItems: { label: string; icon: string; path: string }[] = [
  { label: "Settings", icon: "⚙", path: "/settings" },
  { label: "My Profile", icon: "👤", path: "/profile" },
];

function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Yumzy" />
        <div>
          <span className="logo-name">Yumzy</span>
          <span className="logo-sub">CUSTOMER PORTAL</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="avatar">AM</div>
        <div>
          <p className="user-name">Alice Mutesi</p>
          <p className="user-email">alice@email.com</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-bottom-nav">
        {bottomItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="promo-card">
        <img src="/foodpromo.png" alt="Promo" />
        <p className="promo-title">Order today!</p>
        <p className="promo-sub">Get 10% off your first order.</p>
        <button className="promo-btn">Claim Offer →</button>
      </div>

      <div className="back">
        <button onClick={() => navigate("/")}>⬅️ Back to home</button>
      </div>

      <button className="logout-btn">↩ Log Out</button>
    </aside>
  );
}

export default Sidebar;
