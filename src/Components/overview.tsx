import Sidebar from "../Overview/Sidebar";
import TopBar from "../Overview/Topbar";
import FilterBar from "../Overview/Filterbar";
import RestaurantCard from "../Overview/Restaurantcard";
import Pagination from "../Overview/Pagination";
import { restaurants } from "../Overview/restaurants.data";
import "./overview.css";

function Overview() {
  return (
    <div className="overview-page">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <FilterBar />
        <div className="restaurant-grid">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
        <Pagination />
      </div>
    </div>
  );
}

export default Overview;
