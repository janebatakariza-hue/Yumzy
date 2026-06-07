import { useState } from "react";
import {
  User, Bell, Lock, Globe, Palette, Save,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import "./Settings.css";

const settingsNav = [
  { key: "account",       label: "Account",       icon: User    },
  { key: "notifications", label: "Notifications", icon: Bell    },
  { key: "security",      label: "Security",      icon: Lock    },
  { key: "language",      label: "Language",      icon: Globe   },
  { key: "appearance",    label: "Appearance",    icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab]   = useState("account");
  const [form, setForm]             = useState({
    name: "Jane BATAKARIZA",
    email: "jane@yumzy.com",
    phone: "+250 788 000 000",
    role: "Admin",
  });
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsAlerts:          true,
    orderUpdates:       true,
    promoEmails:        false,
    darkMode:           false,
  });

  const togglePref = (key: string) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <AdminLayout
      title="Settings"
      subtitle="Manage your admin preferences and account"
    >
      <div className="settings-layout">
        {/* Left Nav */}
        <div className="settings-sidenav">
          {settingsNav.map((s) => (
            <button
              key={s.key}
              className={`settings-sidenav-item ${activeTab === s.key ? "active" : ""}`}
              onClick={() => setActiveTab(s.key)}
            >
              <s.icon size={16} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content-area">
          {activeTab === "account" && (
            <div className="settings-section">
              <h3 className="settings-section-title">Account Information</h3>
              <div className="settings-avatar-row">
                <div className="settings-big-avatar">JB</div>
                <div>
                  <button className="admin-add-btn">Change Photo</button>
                  <p className="client-meta" style={{ marginTop: 6 }}>JPG, PNG or GIF · Max 5MB</p>
                </div>
              </div>
              <div className="settings-form-grid">
                {[
                  { label: "Full Name", key: "name"  },
                  { label: "Email",     key: "email" },
                  { label: "Phone",     key: "phone" },
                  { label: "Role",      key: "role"  },
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
              <button className="settings-save-btn">
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settings-section">
              <h3 className="settings-section-title">Notification Preferences</h3>
              {[
                { key: "emailNotifications", label: "Email Notifications" },
                { key: "smsAlerts",          label: "SMS Alerts"          },
                { key: "orderUpdates",       label: "Order Updates"       },
                { key: "promoEmails",        label: "Promotional Emails"  },
              ].map((p) => (
                <div key={p.key} className="settings-pref-row">
                  <span className="settings-pref-label">{p.label}</span>
                  <button
                    className={`settings-toggle ${prefs[p.key as keyof typeof prefs] ? "on" : ""}`}
                    onClick={() => togglePref(p.key)}
                  >
                    <span className="settings-toggle-knob" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-section">
              <h3 className="settings-section-title">Security</h3>
              <div className="cf-field">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="cf-field">
                <label>New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="cf-field">
                <label>Confirm New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <button className="settings-save-btn" style={{ marginTop: 8 }}>
                <Save size={14} /> Update Password
              </button>
            </div>
          )}

          {activeTab === "language" && (
            <div className="settings-section">
              <h3 className="settings-section-title">Language & Region</h3>
              <div className="cf-field">
                <label>Language</label>
                <select>
                  <option>English</option>
                  <option>French</option>
                  <option>Kinyarwanda</option>
                </select>
              </div>
              <div className="cf-field">
                <label>Currency</label>
                <select>
                  <option>RWF — Rwandan Franc</option>
                  <option>USD — US Dollar</option>
                  <option>EUR — Euro</option>
                </select>
              </div>
              <div className="cf-field">
                <label>Timezone</label>
                <select>
                  <option>Africa/Kigali (UTC+2)</option>
                  <option>UTC</option>
                </select>
              </div>
              <button className="settings-save-btn" style={{ marginTop: 8 }}>
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="settings-section">
              <h3 className="settings-section-title">Appearance</h3>
              <div className="settings-pref-row">
                <span className="settings-pref-label">Dark Mode</span>
                <button
                  className={`settings-toggle ${prefs.darkMode ? "on" : ""}`}
                  onClick={() => togglePref("darkMode")}
                >
                  <span className="settings-toggle-knob" />
                </button>
              </div>
              <p className="client-meta" style={{ marginTop: 8 }}>
                Dark mode affects only the admin portal interface.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}