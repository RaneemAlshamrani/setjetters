import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchMovies, imgUrl } from '../services/api';
import './Search.css';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(q);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setQuery(q);
    if (!q) return;
    setLoading(true);
    searchMovies(q).then(setResults).finally(() => setLoading(false));
  }, [q]);

  const filtered = results.filter(r => {
    if (filter === 'Movies') return r.media_type === 'movie' || !r.media_type;
    if (filter === 'TV Shows') return r.media_type === 'tv';
    return true;
  });

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="container">
          <h1>Find Filming Locations</h1>
          <form className="search-form" onSubmit={e => { e.preventDefault(); if (query.trim()) setParams({ q: query.trim() }); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search any movie or TV show..." autoFocus />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>

      <div className="container search-body">
        {q && (
          <>
            <div className="search-meta">
              <div className="filter-row">
                {['All','Movies','TV Shows'].map(f => (
                  <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
              {!loading && <p className="result-count">{filtered.length} results for "{q}"</p>}
            </div>
            {loading
              ? <div className="results-grid">{[...Array(8)].map((_,i) => <div key={i} className="result-skeleton skeleton"/>)}</div>
              : filtered.length > 0
                ? <div className="results-grid">
                    {filtered.map(m => (
                      <div key={m.id} className="result-card" onClick={() => navigate(`/${m.media_type === 'tv' ? 'tv' : 'movie'}/${m.id}`)}>
                        <div className="result-poster">
                          {imgUrl(m.poster_path, 'w342')
                            ? <img src={imgUrl(m.poster_path,'w342')} alt={m.title||m.name} />
                            : <div className="result-placeholder">{(m.title||m.name||'?')[0]}</div>
                          }
                          <div className="result-overlay">
                            <span>View Filming Spots →</span>
                          </div>
                        </div>
                        <div className="result-info">
                          <h3>{m.title || m.name}</h3>
                          <p>{(m.release_date || m.first_air_date || '').slice(0,4)}</p>
                          {m.vote_average > 0 && <span className="result-rating">⭐ {m.vote_average.toFixed(1)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                : <div className="empty-state">
                    <span>🎬</span>
                    <h3>No results for "{q}"</h3>
                    <p>Try a different movie or TV show title</p>
                  </div>
            }
          </>
        )}
        {!q && (
          <div className="search-prompt">
            <span>✦</span>
            <h2>Search any movie or TV show</h2>
            <p>Discover the real filming locations behind your favourites</p>
          </div>
        )}
      </div>
    </div>
  );
}
