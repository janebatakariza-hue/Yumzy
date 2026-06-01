import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import { Eye, EyeOff, Chrome, Facebook } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="auth-page">
      {/* Background food image */}
      <img src="/login.png" alt="background" className="auth-bg" />
      <div className="auth-overlay" />

      {/* Card */}
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/logo.png" alt="Yumzy" />
          <span>Yumzy</span>
        </div>

        {mode === "login" ? (
          <>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-sub">Enter your email and password below</p>

            <div className="auth-field">
              <label>EMAIL</label>
              <input type="email" placeholder="you@email.com" />
            </div>

            <div className="auth-field">
              <label>PASSWORD</label>
              <div className="auth-input-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••"
                />
                <button
                  className="auth-eye"
                  onClick={() => setShowPass((p) => !p)}
                >
                  {showPass ? (
                    <EyeOff size={16} color="#aaa" />
                  ) : (
                    <Eye size={16} color="#aaa" />
                  )}
                </button>
              </div>
              <span className="auth-forgot">Forgot password?</span>
            </div>

            <button className="auth-primary-btn" onClick={() => navigate("/")}>
              Log In
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-socials">
              <button className="auth-social-btn"><Chrome size={15}/> Google </button>
              <button className="auth-social-btn"><Facebook size={15} /> Facebook</button>
            </div>

            <p className="auth-switch">
              Don't have an account?{" "}
              <span onClick={() => setMode("signup")}>Create Account</span>
            </p>

            <p className="auth-terms">Terms of Service &amp; Privacy Policy</p>
          </>
        ) : (
          <>
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-sub">
              Start ordering from the best spots near you
            </p>

            <div className="auth-row">
              <div className="auth-field">
                <label>FIRST NAME</label>
                <input type="text" placeholder="First name" />
              </div>
              <div className="auth-field">
                <label>LAST NAME</label>
                <input type="text" placeholder="Last name" />
              </div>
            </div>

            <div className="auth-field">
              <label>EMAIL ADDRESS</label>
              <input type="email" placeholder="you@email.com" />
            </div>

            <div className="auth-field">
              <label>PHONE NUMBER</label>
              <div className="auth-phone-wrap">
                <select className="auth-country-code">
                  <option>+250</option>
                  <option>+1</option>
                  <option>+44</option>
                  <option>+254</option>
                </select>
                <input type="tel" placeholder="700 000 000" />
              </div>
            </div>

            <div className="auth-row">
              <div className="auth-field">
                <label>PASSWORD</label>
                <div className="auth-input-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                  />
                  <button
                    className="auth-eye"
                    onClick={() => setShowPass((p) => !p)}
                  >
                    {showConfirm ? (
                      <EyeOff size={16} color="#aaa" />
                    ) : (
                      <Eye size={16} color="#aaa" />
                    )}
                  </button>
                </div>
                <div className="auth-strength">
                  <div className="auth-strength-bar filled" />
                  <div className="auth-strength-bar filled" />
                  <div className="auth-strength-bar" />
                  <div className="auth-strength-bar" />
                </div>
              </div>
              <div className="auth-field">
                <label>CONFIRM PASSWORD</label>
                <div className="auth-input-wrap">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                  />
                  <button
                    className="auth-eye"
                    onClick={() => setShowConfirm((p) => !p)}
                  >
                    {showConfirm ? (
                      <EyeOff size={16} color="#aaa" />
                    ) : (
                      <Eye size={16} color="#aaa" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="auth-agree">
              I agree to the <span className="auth-link">Terms of Service</span>{" "}
              and <span className="auth-link">Privacy Policy</span>
            </p>

            <button className="auth-primary-btn" onClick={() => navigate("/")}>
              Create Account
            </button>

            <div className="auth-divider">
              <span>or sign up with</span>
            </div>

            <div className="auth-socials">
              <button className="auth-social-btn">
                <Chrome size={15} /> Google
              </button>
              <button className="auth-social-btn">
                <Facebook size={15} /> Facebook
              </button>
            </div>

            <p className="auth-switch">
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Log In →</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
