import NavBar from "./Components/NavBar";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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
import MyTables from "./Components/MyTables";
import Clients from "./Components/Clients";

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
      <Route path="/overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/restaurants" element={<ProtectedRoute><Restaurants /></ProtectedRoute>} />
      <Route path="/tables" element={<ProtectedRoute><MyTables /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
    </Routes>
  );
}
