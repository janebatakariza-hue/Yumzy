import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useAuth, getErrorMessage } from "../../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin/overview");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <img src="/login.png" alt="background" className="auth-bg" />
      <div className="auth-overlay" />

      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="Yumzy" />
          <span>Yumzy</span>
        </div>

        {mode === "login" ? (
          <>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-sub">Enter your email and password below</p>

            {error && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <div className="auth-field">
              <label>EMAIL</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>PASSWORD</label>
              <div className="auth-input-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
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

            <button className="auth-primary-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-socials">
              <button type="button" className="auth-social-btn">
                <FcGoogle size={16} /> Google{" "}
              </button>
              <button type="button" className="auth-social-btn">
                <FaFacebook size={16} /> Facebook
              </button>
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
            <p className="auth-sub">Admin accounts are created by platform administrators</p>

            <p className="auth-switch" style={{ marginTop: 24 }}>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Log In →</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
