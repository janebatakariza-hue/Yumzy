import { useState } from "react";
import Sidebar from "../Overview/Sidebar";
import "./MyProfile.css";

export default function MyProfile() {
  const [form, setForm] = useState({
    name: "Alice Mutesi",
    email: "alice@email.com",
    phone: "+250 780 000 000",
    dob: "March 15, 2002",
  });

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications: true,
  });

  const togglePref = (key: keyof typeof prefs) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-main">
        {/* Topbar */}
        <div className="profile-topbar">
          <div className="profile-search">
            <span>🔍</span>
            <input placeholder="Search anything..." />
          </div>
          <div className="profile-avatar-top">
            <img src="/logo.png" alt="avatar" />
          </div>
        </div>

        {/* Title */}
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">
            Manage your personal information and Yumzy account.
          </p>
        </div>

        <div className="profile-body">
          {/* Left Card */}
          <div className="profile-left-card">
            <div className="profile-pic-wrap">
              <img src="/logo.png" alt="Alice" className="profile-pic" />
            </div>
            <h2 className="profile-name">{form.name}</h2>
            <p className="profile-badge">Premium Yumzy Member</p>
            <button className="profile-change-photo-btn">Change Photo</button>

            <div className="profile-stats">
              <div className="profile-stat-row">
                <span className="profile-stat-label">Orders Completed</span>
                <span className="profile-stat-value">128</span>
              </div>
              <div className="profile-stat-row">
                <span className="profile-stat-label">Favorite Restaurants</span>
                <span className="profile-stat-value">24</span>
              </div>
              <div className="profile-stat-row">
                <span className="profile-stat-label">Member Since</span>
                <span className="profile-stat-value">2024</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="profile-right">
            {/* Personal Information */}
            <div className="profile-section">
              <h3 className="profile-section-title">Personal Information</h3>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="profile-field">
                  <label>Email Address</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="profile-field">
                  <label>Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="profile-field">
                  <label>Date of Birth</label>
                  <input
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="profile-section">
              <h3 className="profile-section-title">Preferences</h3>
              <div className="profile-prefs">
                <div className="profile-pref-row">
                  <span>Email Notifications</span>
                  <button
                    className={`profile-toggle ${prefs.emailNotifications ? "on" : ""}`}
                    onClick={() => togglePref("emailNotifications")}
                  >
                    <span className="profile-toggle-knob" />
                  </button>
                </div>
                <div className="profile-pref-row">
                  <span>SMS Notifications</span>
                  <button
                    className={`profile-toggle ${prefs.smsNotifications ? "on" : ""}`}
                    onClick={() => togglePref("smsNotifications")}
                  >
                    <span className="profile-toggle-knob" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="profile-actions">
              <button className="profile-save-btn">Save Changes</button>
              <button className="profile-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}