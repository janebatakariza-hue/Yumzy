import React from "react";
import "./NavBar.css";
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
            <a href="#overview">Overview</a>
          </li>
          <li>
            <a href="#menu">Menu</a>
          </li>
          <li>
            <a href="#tables">Tables</a>
          </li>
          <li>
            <a href="#orders">Orders</a>
          </li>
          <li>
            <a href="#clients">Clients</a>
          </li>
        </ul>
      </nav>
    </>
  );
}
