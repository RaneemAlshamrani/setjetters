import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURED_SPOTS } from '../services/api';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          {FEATURED_SPOTS.slice(0, 3).map((spot, i) => (
            <div key={spot.id} className={`hero-bg-img hero-bg-img-${i}`}
              style={{ backgroundImage: `url(${spot.image})` }} />
          ))}
          <div className="hero-bg-overlay" />
        </div>
        <div className="hero-content container">
          <p className="hero-eyebrow">✦ Cinema Tourism</p>
          <h1 className="hero-title">
            The World is<br />
            <em>Your Film Set</em>
          </h1>
          <p className="hero-subtitle">
            Discover the real locations behind your favourite movies & TV shows.
            Explore, plan, and travel to iconic cinematic destinations.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search a movie, TV show..."
            />
            <button type="submit">Explore</button>
          </form>
          <div className="hero-stats">
            <div className="stat"><strong>10K+</strong><span>Movies</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>195</strong><span>Countries</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>50K+</strong><span>Locations</span></div>
          </div>
        </div>
      </section>

      {/* ── FEATURED SPOTS ── */}
      <section className="spots-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">✦ Iconic Filming Spots</p>
              <h2 className="section-title">Where Cinema Meets Reality</h2>
            </div>
            <button className="see-all-btn" onClick={() => navigate('/search')}>
              View All →
            </button>
          </div>

          <div className="spots-grid">
            {FEATURED_SPOTS.map(spot => (
              <div
                key={spot.id}
                className={`spot-card ${hovered === spot.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHovered(spot.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(`/${spot.type}/${spot.movieId}`)}
              >
                <div className="spot-img" style={{ backgroundImage: `url(${spot.image})` }}>
                  <div className="spot-img-overlay" />
                  <div className="spot-badge">
                    <span>🎬</span> {spot.movie}
                  </div>
                </div>
                <div className="spot-info">
                  <h3>{spot.place}</h3>
                  <p className="spot-city">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {spot.city}
                  </p>
                  <p className="spot-scene">"{spot.scene}"</p>
                  <div className="spot-cta">
                    <span>View Details</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header centered">
            <p className="section-eyebrow">✦ The Experience</p>
            <h2 className="section-title">Plan Your Cinematic Journey</h2>
          </div>
          <div className="steps">
            {[
              { num:'01', title:'Discover',  desc:'Browse iconic filming locations from your favourite movies & shows', icon:'🔍' },
              { num:'02', title:'Explore',   desc:'View the exact filming spot on an interactive map with scene details', icon:'🗺' },
              { num:'03', title:'Plan',      desc:'Save locations to your personal travel itinerary', icon:'📋' },
              { num:'04', title:'Travel',    desc:'Navigate to each location and relive the magic in person', icon:'✈️' },
            ].map(s => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
