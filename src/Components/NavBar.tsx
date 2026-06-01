import "./NavBar.css";
import { Link } from "react-router-dom";
export default function NavBar() {
  return (
    <>
      <nav>
        {/* Logo */}
        <div className="logo">
          <img src="/logo.png" alt="Yumzy Logo" />
          <span>YUMZY</span>
        </div>

        {/* Nav Links */}
        <ul>
          <li>
            <Link to="/overview">Overview</Link>
          </li>
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
          <li>
            <Link to="/tables">Tables</Link>
          </li>
          <li>
            <Link to="/clients">Clients</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
