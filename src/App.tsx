import NavBar from "./Components/NavBar";
import "./App.css";
import HeroSection from "./Components/HeroSection";
import StatsBar from "./Components/StatsBar";
import Overview from "./Components/overview";
export default function App() {
  return (
    <div className="app">
      <NavBar />
      <HeroSection />
      <StatsBar />
      <Overview />
    </div>
  );
}
