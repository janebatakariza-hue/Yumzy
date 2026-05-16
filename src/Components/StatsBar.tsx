import './StatsBar.css';
import React from 'react';

function StatsBar() {
  const stats = [
    { value: "50+", label: "Restaurants", gold: false },
    { value: "10k+", label: "Happy Customers", gold: false },
    { value: "4.8⭐", label: "Average Rating", gold: false },
    { value: "3 types", label: "Restaurant .Hotel .Pub", gold: true },
  ];
  return (
    <div className="stats-bar">
      {stats.map((stat, index) => (
        <div className="stat-item" key={index}>
          <span className={stat.gold ? "Stat-value-gold" : "Stat-value"}>
            {stat.value}
          </span>
          <span className="Stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
export default StatsBar;