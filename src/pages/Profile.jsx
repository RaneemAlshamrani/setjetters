import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { imgUrl } from '../services/api';
import './Profile.css';

const TEAM = [
  { name:'Raghad Asiri',       id:'2208261', role:'Project Manager & Frontend Dev', initial:'R' },
  { name:'Raneem Al-Shammari', id:'2208199', role:'UI/UX Designer & Frontend Dev',  initial:'N' },
  { name:'Lamia Adel',         id:'2211848', role:'Frontend Dev & API Integration', initial:'L' },
];

export default function Profile() {
  const { favorites, savedMovies, itinerary, toggleFavorite, toggleSavedMovie } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('movies');

  return (
    <div className="profile-page">

      {/* Banner */}
      <div className="profile-banner">
        <div className="container profile-header">
          <div className="profile-logo">✦</div>
          <div>
            <p className="profile-eyebrow">CPIT 405 · Spring 2026</p>
            <h1>SetJetters</h1>
            <p className="profile-tagline">Where Movies Meet Travel</p>
            <div className="profile-stats">
              <span><strong>{savedMovies.length}</strong> Movies</span>
              <span className="ps-divider"/>
              <span><strong>{favorites.length}</strong> Locations</span>
              <span className="ps-divider"/>
              <span><strong>{itinerary.length}</strong> In Itinerary</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs container">
        <button className={tab==='movies'    ?'active':''} onClick={()=>setTab('movies')}>🎬 Saved Movies</button>
        <button className={tab==='locations' ?'active':''} onClick={()=>setTab('locations')}>📍 Saved Spots</button>
        <button className={tab==='team'      ?'active':''} onClick={()=>setTab('team')}>👥 Our Team</button>
      </div>

      <div className="container profile-body">

        {/* Saved Movies */}
        {tab === 'movies' && (
          <section className="profile-section">
            <div className="ps-header">
              <h2>Saved Movies</h2>
              <button onClick={() => navigate('/search')}>+ Add More</button>
            </div>
            {savedMovies.length === 0
              ? <div className="ps-empty"><span>🎬</span><p>No saved movies yet</p><small>Search and save your favourite movies</small></div>
              : <div className="saved-grid">
                  {savedMovies.map(m => (
                    <div key={m.id} className="saved-movie-card" onClick={() => navigate(`/movie/${m.id}`)}>
                      <div className="saved-movie-poster">
                        {imgUrl(m.poster_path,'w185')
                          ? <img src={imgUrl(m.poster_path,'w185')} alt={m.title||m.name}/>
                          : <div className="saved-placeholder">{(m.title||m.name||'?')[0]}</div>
                        }
                        <button className="saved-remove" onClick={e=>{e.stopPropagation();toggleSavedMovie(m);}}>✕</button>
                      </div>
                      <p>{m.title||m.name}</p>
                    </div>
                  ))}
                </div>
            }
          </section>
        )}

        {/* Saved Spots */}
        {tab === 'locations' && (
          <section className="profile-section">
            <div className="ps-header"><h2>Saved Filming Spots</h2></div>
            {favorites.length === 0
              ? <div className="ps-empty"><span>📍</span><p>No saved locations yet</p><small>Explore movies and save filming spots</small></div>
              : <div className="saved-spots">
                  {favorites.map(loc => (
                    <div key={loc.id} className="saved-spot-card">
                      <div className="spot-dot"/>
                      <div className="spot-card-info">
                        <h4>{loc.place || loc.title}</h4>
                        <p>{loc.city}</p>
                        {loc.movie && <span className="spot-movie">🎬 {loc.movie}</span>}
                      </div>
                      <div className="spot-card-actions">
                        <a className="spot-map-btn"
                          href={`https://www.openstreetmap.org/search?query=${encodeURIComponent((loc.place||loc.city)+' '+(loc.city||''))}`}
                          target="_blank" rel="noreferrer">View on Map ↗</a>
                        <button className="spot-remove-btn" onClick={() => toggleFavorite(loc)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </section>
        )}

        {/* Team */}
        {tab === 'team' && (
          <section className="profile-section">
            <div className="ps-header"><h2>Our Team</h2></div>
            <div className="team-grid">
              {TEAM.map(m => (
                <div key={m.id} className="team-card">
                  <div className="team-avatar">{m.initial}</div>
                  <h3>{m.name}</h3>
                  <p className="team-role">{m.role}</p>
                  <span className="team-id">{m.id}</span>
                </div>
              ))}
            </div>
            <div className="course-card">
              <div className="course-item"><span>🎓</span><div><p>Course</p><strong>CPIT 405 — Web Development</strong></div></div>
              <div className="course-item"><span>🏫</span><div><p>University</p><strong>King Abdulaziz University</strong></div></div>
              <div className="course-item"><span>📅</span><div><p>Semester</p><strong>Spring 2026</strong></div></div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
