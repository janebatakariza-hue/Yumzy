import "./Sidebar.css";

const navItems = [
  { label: "Dashboard", icon: "▦", active: true },
  { label: "Restaurants", icon: "🍽", active: false },
  { label: "My Orders", icon: "📋", active: false },
  { label: "Tables", icon: "🪑", active: false },
  { label: "Favorites", icon: "♥", active: false },
];

const bottomItems = [
  { label: "Settings", icon: "⚙" },
  { label: "My Profile", icon: "👤" },
];

function Sidebar() {
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
          <a
            key={item.label}
            className={`nav-item ${item.active ? "active" : ""}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom-nav">
        {bottomItems.map((item) => (
          <a key={item.label} className="nav-item">
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>

      <div className="promo-card">
        <img src="/food-promo.png" alt="Promo" />
        <p className="promo-title">Order today!</p>
        <p className="promo-sub">Get 10% off your first order.</p>
        <button className="promo-btn">Claim Offer →</button>
      </div>

      <button className="logout-btn">↩ Log Out</button>
    </aside>
  );
}

export default Sidebar;
// export type Restaurant = {
//   id: number;
//   name: string;
//   location: string;
//   cuisine: string;
// };
// rating: number;
// reviews: number;
// status: string;
// type: string;
// image: string;
