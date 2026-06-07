import { Routes, Route, Navigate } from "react-router-dom";
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
      <Route path="/admin/overview" element={<Overview />} />
      <Route path="/admin/clients" element={<Clients />} />
      <Route path="/admin/restaurants" element={<Restaurants />} />
      <Route path="/admin/tables" element={<Tables />} />
      <Route path="/admin/orders" element={<Orders />} />
      <Route path="/admin/menus" element={<Menus />} />
      <Route path="/admin/staff" element={<Staff />} />
      <Route path="/admin/analytics" element={<Analytics />} />
      <Route path="/admin/payments" element={<Payments />} />
      <Route path="/admin/reviews" element={<Reviews />} />
      <Route path="/admin/notifications" element={<Notifications />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/account" element={<MyAccount />} />
      <Route path="/authentication" element={<Authentification />} />
    </Routes>
  );
}
