import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  LayoutGrid,
  ClipboardList,
  ChefHat,
  BarChart2,
  CreditCard,
  Star,
  Bell,
  Settings,
  UserCircle,
  LogOut,
  Store,
} from "lucide-react";
import "./AdminSidebar.css";

const navItems = [
  { label: "Overview",      icon: LayoutDashboard, path: "/admin/overview"      },
  { label: "Clients",       icon: Users,           path: "/admin/clients"       },
  { label: "Restaurants",   icon: Store,           path: "/admin/restaurants"   },
  { label: "Tables",        icon: LayoutGrid,      path: "/admin/tables"        },
  { label: "Orders",        icon: ClipboardList,   path: "/admin/orders"        },
  { label: "Menus",         icon: UtensilsCrossed, path: "/admin/menus"         },
  { label: "Staff",         icon: ChefHat,         path: "/admin/staff"         },
  { label: "Analytics",     icon: BarChart2,       path: "/admin/analytics"     },
  { label: "Payments",      icon: CreditCard,      path: "/admin/payments"      },
  { label: "Reviews",       icon: Star,            path: "/admin/reviews"       },
  { label: "Notifications", icon: Bell,            path: "/admin/notifications" },
];

const bottomItems = [
  { label: "Settings",   icon: Settings,   path: "/admin/settings" },
  { label: "My Account", icon: UserCircle, path: "/admin/account"  },
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
      <div className="admin-sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="admin-sidebar-divider" />

      {/* Bottom Nav */}
      <div className="admin-sidebar-bottom">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </div>
          );
        })}

        {/* Logout */}
        <div
          className="admin-nav-item logout"
          onClick={() => navigate("/admin/login")}
        >
          <LogOut size={17} />
          <span>Log Out</span>
        </div>
      </div>

      {/* Admin Profile */}
      <div
        className="admin-sidebar-profile"
        onClick={() => navigate("/admin/account")}
      >
        <div className="admin-profile-avatar">JB</div>
        <div className="admin-profile-info">
          <p className="admin-profile-name">Jane BATAKARIZA</p>
          <p className="admin-profile-role">Admin</p>
        </div>
      </div>
    </aside>
  );
}