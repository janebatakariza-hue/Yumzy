import NavBar from "./Components/NavBar";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HeroSection from "./Components/HeroSection";
import StatsBar from "./Components/StatsBar";
import Overview from "./Components/overview";
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
      <Route path="/overview" element={<Overview />} />
    </Routes>
  );
}
