import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LayoutGrid,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  UserCircle,
} from "lucide-react";
import "./AdminSidebar.css";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin/overview" },
  { label: "Clients", icon: Users, path: "/admin/clients" },
  { label: "Tables", icon: LayoutGrid, path: "/admin/tables" },
  { label: "Orders", icon: ClipboardList, path: "/admin/orders" },
  { label: "Menus", icon: UtensilsCrossed, path: "/admin/menus" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, path: "/admin/settings" },
  { label: "My Account", icon: UserCircle, path: "/admin/account" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <img src="/logo.png" alt="Yumzy" />
        <span className="admin-logo-name">Yumzy</span>
      </div>

      {/* Main Nav */}
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="admin-sidebar-divider" />

      {/* Bottom Nav */}
      <nav className="admin-sidebar-nav">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Admin Profile */}
      <div className="admin-sidebar-profile">
        <div className="admin-profile-avatar">JB</div>
        <div>
          <p className="admin-profile-name">Jane BATAKARIZA</p>
          <p className="admin-profile-role">Admin</p>
        </div>
      </div>
    </aside>
  );
}
