import React from "react";
import "./HeroSection.css";
function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title-white">Bold Flavours.</h1>
        <h1 className="hero-title-gold">Unforgettable Taste</h1>
        <p className="hero-subtitle">
          Crafted with passion, served with perfection.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Explore Restaurants → </button>
          <button className="btn-secondary">Book a table</button>
        </div>
      </div>
      <div className="hero-image">
        <img src="/dish.png" alt="Featured Dish" />
      </div>
    </section>
  );
}
export default HeroSection;
