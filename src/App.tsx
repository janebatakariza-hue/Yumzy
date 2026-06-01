import NavBar from "./Components/NavBar";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HeroSection from "./Components/HeroSection";
import StatsBar from "./Components/StatsBar";
import Overview from "./Components/overview";
import MenuPage from "./Components/MenuPage";
import MyOrders from "./Components/MyOrders";
import AuthPage from "./Components/AuthPage";
import Favorites from "./Components/Favourite";
import Settings from "./Components/Settings";
import MyProfile from "./Components/MyProfile";
import Restaurants from "./Components/RestaurantPage";
export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <HeroSection />
            <StatsBar />
          </>
        }
      />

      <Route path="/login" element={<AuthPage />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/restaurants" element={<Restaurants />} />
    </Routes>
  );
}
