import { useState } from "react";
import { Save, ClipboardList, Users, Star, TrendingUp } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import "./MyAccount.css";

export default function MyAccount() {
  const [form, setForm] = useState({
    name:  "Jane BATAKARIZA",
    email: "jane@yumzy.com",
    phone: "+250 788 000 000",
    dob:   "January 15, 1990",
  });
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications:   true,
  });

  const stats = [
    { label: "Orders Managed",   value: "1,240", icon: ClipboardList, color: "#1565c0" },
    { label: "Clients Added",    value: "60",     icon: Users,         color: "#2e7d32" },
    { label: "Reviews Approved", value: "48",     icon: Star,          color: "#d4920a" },
    { label: "Revenue Tracked",  value: "38.2M",  icon: TrendingUp,    color: "#c62828" },
  ];

  return (
    <AdminLayout
      title="My Account"
      subtitle="Manage your personal admin profile"
    >
      <div className="account-layout">
        {/* Left Card */}
        <div className="account-left-card">
          <div className="account-avatar-wrap">
            <div className="account-big-avatar">JB</div>
            <button className="admin-add-btn" style={{ width: "100%" }}>
              Change Photo
            </button>
          </div>
          <h2 className="account-name">{form.name}</h2>
          <p className="account-role">Super Admin · Yumzy</p>

          <div className="account-stats">
            {stats.map((s) => (
              <div key={s.label} className="account-stat-row">
                <div className="account-stat-icon" style={{ background: s.color + "20" }}>
                  <s.icon size={14} color={s.color} />
                </div>
                <div>
                  <p className="account-stat-value">{s.value}</p>
                  <p className="account-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="account-right">
          {/* Personal Info */}
          <div className="account-card">
            <h3 className="settings-section-title">Personal Information</h3>
            <div className="settings-form-grid">
              {[
                { label: "Full Name",    key: "name"  },
                { label: "Email",        key: "email" },
                { label: "Phone",        key: "phone" },
                { label: "Date of Birth",key: "dob"   },
              ].map((f) => (
                <div key={f.key} className="cf-field">
                  <label>{f.label}</label>
                  <input
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="account-card">
            <h3 className="settings-section-title">Preferences</h3>
            {[
              { key: "emailNotifications", label: "Email Notifications" },
              { key: "smsNotifications",   label: "SMS Notifications"   },
            ].map((p) => (
              <div key={p.key} className="settings-pref-row">
                <span className="settings-pref-label">{p.label}</span>
                <button
                  className={`settings-toggle ${prefs[p.key as keyof typeof prefs] ? "on" : ""}`}
                  onClick={() => setPrefs((prev) => ({ ...prev, [p.key]: !prev[p.key as keyof typeof prefs] }))}
                >
                  <span className="settings-toggle-knob" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="account-actions">
            <button className="settings-save-btn">
              <Save size={14} /> Save Changes
            </button>
            <button className="account-cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}