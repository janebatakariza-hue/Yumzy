import AdminSidebar from "../Components/AdminSidebar";
import "./AdminLayout.css";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout-main">
        {/* Page Header */}
        <div className="admin-layout-header">
          <div>
            <h1 className="admin-layout-title">{title}</h1>
            {subtitle && <p className="admin-layout-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="admin-layout-actions">{actions}</div>}
        </div>

        {/* Page Content */}
        <div className="admin-layout-content">{children}</div>
      </div>
    </div>
  );
}
