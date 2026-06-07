import { useState } from "react";
import Sidebar from "../Overview/Sidebar";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const settingsNav = [
  {
    label: "Account",
    sub: "Profile & personal info",
    icon: "👤",
    active: true,
  },
  { label: "Notifications", sub: "Alerts & updates", icon: "🔔" },
  { label: "Privacy", sub: "Data & visibility", icon: "🔒" },
  { label: "Payment", sub: "Cards & methods", icon: "💳" },
  { label: "Delivery", sub: "Addresses & zones", icon: "📦" },
  { label: "Language", sub: "Region & currency", icon: "🌐" },
  { label: "Help & Support", sub: "FAQ & contact", icon: "❓" },
];

const preferenceItems = [
  { label: "Email Notifications", key: "email", default: true },
  { label: "SMS Alerts", key: "sms", default: true },
  { label: "Order Updates", key: "orders", default: true },
  { label: "Promotional Emails", key: "promo", default: false },
  { label: "Dark Mode", key: "dark", default: false },
  { label: "✓ Verified", key: "verified", default: true },
];

export default function Settings() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Account");
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(preferenceItems.map((p) => [p.key, p.default])),
  );
  const [form, setForm] = useState({
    name: "Alice Mutesi",
    email: "alice@email.com",
    phone: "+250 788 000 000",
    dob: "March 15, 1992",
  });

  const togglePref = (key: string) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="settings-page">
      <Sidebar />

      <div className="settings-main">
        {/* Topbar */}
        <div className="settings-topbar">
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Manage your preferences and account
            </p>
          </div>
          <div className="settings-topbar-right">
            <div className="settings-search">
              <span>🔍</span>
              <input placeholder="Search settings..." />
            </div>
            <button className="settings-icon-btn">🔔</button>
            <div className="settings-avatar">AM</div>
          </div>
        </div>

        <div className="settings-body">
          {/* Left Nav */}
          <div className="settings-nav">
            {settingsNav.map((item) => (
              <button
                key={item.label}
                className={`settings-nav-item ${activeNav === item.label ? "active" : ""}`}
                onClick={() => setActiveNav(item.label)}
              >
                <span className="settings-nav-icon">{item.icon}</span>
                <div>
                  <p className="settings-nav-label">{item.label}</p>
                  <p className="settings-nav-sub">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="settings-content">
            <h2 className="settings-section-title">Account Settings</h2>

            {/* Avatar */}
            <div className="settings-avatar-row">
              <img
                src="/logo.png"
                alt="avatar"
                className="settings-user-avatar"
              />
              <div className="settings-avatar-actions">
                <button className="settings-change-photo-btn">
                  Change Photo
                </button>
                <button className="settings-remove-btn">Remove</button>
              </div>
              <p className="settings-avatar-hint">
                JPG, PNG or GIF · Max size 5MB
              </p>
            </div>

            <div className="settings-form-grid">
              {/* Left — form fields */}
              <div className="settings-fields">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label>Email Address</label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="settings-field">
                  <label>Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div className="settings-field">
                  <label>Date of Birth</label>
                  <input
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  />
                </div>

                {/* Password */}
                <div className="settings-password-section">
                  <p className="settings-password-label">Password & Security</p>
                  <p className="settings-password-hint">
                    Last changed 3 months ago
                  </p>
                  <button className="settings-change-pass-btn">
                    Change Password
                  </button>
                </div>

                {/* Actions */}
                <div className="settings-actions">
                  <button className="settings-save-btn">Save Changes</button>
                  <button className="settings-cancel-btn">Cancel</button>
                </div>
              </div>

              {/* Right — preferences */}
              <div className="settings-prefs">
                <p className="settings-prefs-title">Preferences</p>
                {preferenceItems.map((pref) => (
                  <div key={pref.key} className="settings-pref-row">
                    <span className="settings-pref-label">{pref.label}</span>
                    <button
                      className={`settings-toggle ${prefs[pref.key] ? "on" : ""}`}
                      onClick={() => togglePref(pref.key)}
                    >
                      <span className="settings-toggle-knob" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
