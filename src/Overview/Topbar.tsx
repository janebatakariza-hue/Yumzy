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
          <span>🔍</span>
          <input type="text" placeholder="Search restaurants, cuisine..." />
        </div>
        <div className="topbar-icons">
          <button className="icon-btn">🔔</button>
          <div className="user-avatar-sm">JB</div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
