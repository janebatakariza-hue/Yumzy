import { useState } from "react";
import "./Pagination.css";

function Pagination() {
  const [current, setCurrent] = useState(1);
  const total = 3;

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => setCurrent((p) => Math.max(1, p - 1))}
      >
        ‹
      </button>

      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`page-btn ${current === page ? "active" : ""}`}
          onClick={() => setCurrent(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn"
        onClick={() => setCurrent((p) => Math.min(total, p + 1))}
      >
        ›
      </button>
    </div>
  );
}

export default Pagination;
