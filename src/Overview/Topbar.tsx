import "./TopBar.css";

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>Browse Restaurants</h1>
        <p>Discover and order from the best spots near you</p>
      </div>

      <div className="topbar-right">
        <div className="search-bar">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#aaa"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search restaurants, cuisine..." />
        </div>

        <div className="topbar-icons">
          {/* Bell icon */}
          <button className="icon-btn">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* User avatar */}
          <div className="user-avatar-sm">JB</div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
