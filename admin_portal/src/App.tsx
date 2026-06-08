import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Overview from "./Pages/Overview/Overview";
import Clients from "./Pages/Clients/Clients";
import Restaurants from "./Pages/Restaurants/Restaurants";
import Tables from "./Pages/Tables/Tables";
import Orders from "./Pages/Orders/Orders";
import Menus from "./Pages/Menus/Menus";
import Staff from "./Pages/Staff/Staff";
import Analytics from "./Pages/Analytics/Analytics";
import Payments from "./Pages/Payments/Payments";
import Reviews from "./Pages/Reviews/Reviews";
import Notifications from "./Pages/Notifications/Notifications";
import Settings from "./Pages/Settings/Settings";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Authentification from "./Pages/Authentication/Authentification";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/overview" />} />
      <Route path="/authentication" element={<Authentification />} />
      <Route path="/admin/overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
      <Route path="/admin/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/admin/restaurants" element={<ProtectedRoute><Restaurants /></ProtectedRoute>} />
      <Route path="/admin/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/admin/menus" element={<ProtectedRoute><Menus /></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/admin/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
    </Routes>
  );
}
