import React from 'react';
import { useApp } from '../context/AppContext';
import './Itinerary.css';

export default function Itinerary() {
  const { itinerary, removeFromItinerary } = useApp();

  const countries = [...new Set(itinerary.map(i => i.city?.split(',').pop()?.trim()).filter(Boolean))];
  const movies    = [...new Set(itinerary.map(i => i.movie).filter(Boolean))];

  return (
    <div className="itin-page">
      <div className="itin-header">
        <div className="container">
          <p className="itin-eyebrow">✦ Your Journey</p>
          <h1>My Cinematic Itinerary</h1>
          <p className="itin-subtitle">{itinerary.length} location{itinerary.length !== 1 ? 's' : ''} saved across {countries.length} countr{countries.length !== 1 ? 'ies' : 'y'}</p>
        </div>
      </div>

      <div className="container itin-body">
        {itinerary.length === 0 ? (
          <div className="itin-empty">
            <div className="itin-empty-icon">🗺</div>
            <h2>Your itinerary is empty</h2>
            <p>Browse filming locations and add them to your cinematic trip</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="itin-stats">
              {[
                { icon:'📍', label:'Locations', value: itinerary.length },
                { icon:'🌍', label:'Countries',  value: countries.length },
                { icon:'🎬', label:'Movies',     value: movies.length   },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <span className="stat-icon">{s.icon}</span>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Location cards */}
            <div className="itin-cards">
              {itinerary.map((loc, idx) => (
                <div key={loc.id} className="itin-card">
                  <div className="itin-card-num">{String(idx + 1).padStart(2, '0')}</div>
                  <div className="itin-card-body">
                    <h3>{loc.place}</h3>
                    <p className="itin-city">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {loc.city}
                    </p>
                    {loc.scene && <p className="itin-scene">"{loc.scene}"</p>}
                    {loc.movie && <span className="itin-movie-tag">🎬 {loc.movie}</span>}
                  </div>
                  <div className="itin-card-actions">
                    <a className="itin-nav-btn"
                      href={`https://www.google.com/maps/search/${encodeURIComponent(loc.place + ' ' + loc.city)}`}
                      target="_blank" rel="noreferrer">
                      🗺 Navigate
                    </a>
                    <a className="itin-wiki-btn"
                      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(loc.place)}`}
                      target="_blank" rel="noreferrer">
                      📖 Info
                    </a>
                    <button className="itin-remove-btn" onClick={() => removeFromItinerary(loc.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
