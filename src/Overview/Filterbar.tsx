import { useState } from "react";
import "./FilterBar.css";

const filters = [
  { label: "All", icon: "" },
  { label: "Restaurant", icon: "🍽" },
  { label: "Hotel", icon: "🏨" },
  { label: "Pub", icon: "🍺" },
  { label: "Cafe", icon: "☕" },
];

function FilterBar() {
  const [active, setActive] = useState("All");

  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f.label}
            className={`filter-btn ${active === f.label ? "active" : ""}`}
            onClick={() => setActive(f.label)}
          >
            {f.icon && <span>{f.icon}</span>}
            {f.label}
          </button>
        ))}
      </div>

      <div className="sort-by">
        <span>Sort by:</span>
        <select>
          <option>Rating</option>
          <option>Name</option>
          <option>Distance</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
