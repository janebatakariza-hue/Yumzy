import "./RestaurantCard.css";
import restaurantImg from "./restaurant.jpg";

type Restaurant = {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
  reviews: number;
  status: string;
  type: string;
  image: string;
};

const badgeClass: Record<string, string> = {
  RESTAURANT: "badge-restaurant",
  HOTEL: "badge-hotel",
  PUB: "badge-pub",
  CAFE: "badge-cafe",
};

const statusClass = (status: string) => {
  if (status === "OPEN") return "open";
  if (status === "CLOSED") return "closed";
  return "closing";
};

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const isOpen = restaurant.status !== "CLOSED";

  return (
    <div className="restaurant-card">
      {/* Image */}
      <div className="card-image-wrapper">
        <img src={restaurantImg} alt={restaurant.name} />
        <span className={`card-badge ${badgeClass[restaurant.type]}`}>
          {restaurant.type}
        </span>
      </div>

      {/* Body */}
      <div className="card-body">
        <h3 className="card-name">{restaurant.name}</h3>
        <p className="card-location"> {restaurant.location}</p>
        <p className="card-cuisine">{restaurant.cuisine}</p>

        <div className="card-meta">
          <span className="stars">
            {"★".repeat(Math.floor(restaurant.rating))}
            {"☆".repeat(5 - Math.floor(restaurant.rating))}
          </span>
          <span className="rating">{restaurant.rating}</span>
          <span className="reviews">({restaurant.reviews})</span>
          <span className={`status ${statusClass(restaurant.status)}`}>
            {restaurant.status === "OPEN" ? "● OPEN" : restaurant.status}
          </span>
        </div>

        <button className={`card-btn ${!isOpen ? "disabled" : ""}`}>
          {isOpen ? "View Menu →" : "Currently Closed"}
        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;
