import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getFilmingLocations, getYouTubeVideos, getWikiSummary, getNearbyPlaces, getCountryInfo, getWeather, imgUrl } from '../services/api';
import { useApp } from '../context/AppContext';
import './MovieDetail.css';

function LeafletMap({ location }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  useEffect(() => {
    if (!location || !mapRef.current) return;
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css'; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const initMap = () => {
      const L = window.L; if (!L) return;
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      const map = L.map(mapRef.current).setView([location.lat, location.lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      const icon = L.divIcon({
        html: `<div style="background:#C9A84C;color:#1A2E1A;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4)"><span style="transform:rotate(45deg);font-size:16px">📍</span></div>`,
        iconSize:[36,36], iconAnchor:[18,36], className:''
      });
      L.marker([location.lat, location.lng], { icon }).addTo(map).bindPopup(`<b>${location.place}</b><br>${location.city}`).openPopup();
      mapInstanceRef.current = map;
    };
    if (window.L) { initMap(); } else {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = initMap; document.head.appendChild(s);
    }
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [location]);
  return <div ref={mapRef} style={{ width:'100%', height:'400px' }} />;
}

function extractCountry(city) {
  if (!city) return '';
  return city.split(',').pop().trim();
}

export default function MovieDetail() {
  const { type, id } = useParams();
  const { toggleFavorite, isFavorite, addToItinerary, toggleSavedMovie, isMovieSaved } = useApp();
  const [movie,      setMovie]      = useState(null);
  const [locs,       setLocs]       = useState([]);
  const [videos,     setVideos]     = useState([]);
  const [selLoc,     setSelLoc]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setTab]        = useState('locations');
  const [wiki,       setWiki]       = useState(null);
  const [nearby,     setNearby]     = useState([]);
  const [travelInfo, setTravelInfo] = useState(null);

  const fetchTravelInfo = (loc) => {
    setTravelInfo(null);
    const country = extractCountry(loc.city);
    Promise.all([getCountryInfo(country), getWeather(loc.lat, loc.lng)])
      .then(([info, weather]) => {
        if (info || weather) setTravelInfo({ ...(info||{}), ...(weather||{}) });
      });
  };

  useEffect(() => {
    setLoading(true); setWiki(null); setNearby([]); setTravelInfo(null);
    getMovieDetails(id, type).then(data => {
      setMovie(data);
      const l = getFilmingLocations(data);
      setLocs(l);
      const title = data.title || data.name;
      getWikiSummary(title).then(setWiki);
      getYouTubeVideos(title).then(setVideos);
      if (l.length) {
        setSelLoc(l[0]);
        getNearbyPlaces(l[0].lat, l[0].lng).then(setNearby);
        fetchTravelInfo(l[0]);
      }
    }).finally(() => setLoading(false));
  }, [id, type]);

  const handleLocSelect = (loc) => {
    setSelLoc(loc); setNearby([]);
    getNearbyPlaces(loc.lat, loc.lng).then(setNearby);
    fetchTravelInfo(loc);
  };

  if (loading) return <div className="detail-loading"><div className="spinner"/></div>;
  if (!movie)  return <div className="detail-loading"><p>Movie not found</p></div>;

  const title    = movie.title || movie.name;
  const year     = (movie.release_date || movie.first_air_date || '').slice(0,4);
  const backdrop = imgUrl(movie.backdrop_path, 'w1280');
  const poster   = imgUrl(movie.poster_path, 'w342');

  return (
    <div className="detail-page">

      {/* ── HEADER ── */}
      <div className="detail-backdrop" style={backdrop ? {backgroundImage:`url(${backdrop})`} : {}}>
        <div className="detail-backdrop-overlay"/>
        <div className="detail-header container">
          {poster && <img className="detail-poster" src={poster} alt={title}/>}
          <div className="detail-meta">
            <div className="detail-tags">
              {year && <span>{year}</span>}
              {movie.vote_average > 0 && <span>⭐ {movie.vote_average.toFixed(1)}</span>}
              {movie.runtime && <span>{movie.runtime} min</span>}
              {movie.genres?.slice(0,3).map(g => <span key={g.id}>{g.name}</span>)}
            </div>
            <h1>{title}</h1>
            <p className="detail-overview">{movie.overview?.slice(0,240)}{movie.overview?.length > 240 ? '…' : ''}</p>
            <div className="detail-actions">
              <button
                className={`btn-save ${isMovieSaved(movie.id) ? 'saved' : ''}`}
                onClick={() => toggleSavedMovie({ id:movie.id, title, poster_path:movie.poster_path, name:movie.name })}>
                {isMovieSaved(movie.id) ? '♥ Saved' : '♡ Save Movie'}
              </button>
              <span className="spots-badge">📍 {locs.length} filming spots</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── WIKIPEDIA ── */}
      {wiki && (
        <div className="wiki-bar container">
          {wiki.image && <img className="wiki-img" src={wiki.image} alt={title}/>}
          <div className="wiki-text">
            <h3>About {title}</h3>
            <p>{wiki.summary.slice(0,350)}{wiki.summary.length > 350 ? '…' : ''}</p>
            {wiki.url && <a href={wiki.url} target="_blank" rel="noreferrer">Read more on Wikipedia ↗</a>}
          </div>
        </div>
      )}

      {/* ── TABS ── */}
      <div className="detail-tabs container">
        <button className={activeTab==='locations'?'active':''} onClick={()=>setTab('locations')}>📍 Filming Locations</button>
        <button className={activeTab==='videos'   ?'active':''} onClick={()=>setTab('videos')}>▶ Videos</button>
        <button className={activeTab==='cast'     ?'active':''} onClick={()=>setTab('cast')}>🎭 Cast</button>
      </div>

      <div className="container detail-body">

        {/* LOCATIONS */}
        {activeTab === 'locations' && (
          <>
            <div className="locations-layout">
              <div className="locations-list">
                {locs.length === 0 && <p className="no-locs">No filming locations found.</p>}
                {locs.map(loc => (
                  <div key={loc.id} className={`loc-card ${selLoc?.id===loc.id?'active':''}`} onClick={()=>handleLocSelect(loc)}>
                    <div className="loc-pin">📍</div>
                    <div className="loc-info">
                      <h4>{loc.place}</h4>
                      <p>{loc.city}</p>
                      {loc.scene && <span className="scene-tag">{loc.scene}</span>}
                    </div>
                    <button className={`heart-btn ${isFavorite(loc.id)?'on':''}`}
                      onClick={e=>{e.stopPropagation();toggleFavorite({...loc,title:loc.place,movie:title});}}>
                      {isFavorite(loc.id)?'♥':'♡'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="map-panel">
                {selLoc ? (
                  <>
                    <div className="map-wrap"><LeafletMap location={selLoc}/></div>
                    <div className="map-footer">
                      <div><h4>{selLoc.place}</h4><p>{selLoc.city}</p></div>
                      <div className="map-btns">
                        <button className="btn-itinerary" onClick={()=>addToItinerary({...selLoc,movie:title})}>🗓 Add to Trip</button>
                        <a className="btn-navigate" href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(selLoc.place+' '+selLoc.city)}`} target="_blank" rel="noreferrer">Navigate ↗</a>
                      </div>
                    </div>
                  </>
                ) : <div className="map-empty"><p>Select a location</p></div>}
              </div>
            </div>

            {/* TRAVEL CARD */}
            {travelInfo && selLoc && (
              <div className="travel-card">
                <div className="travel-card-header">
                  <h3>✈️ Before You Visit {extractCountry(selLoc.city)}</h3>
                  <p>Essential travel information</p>
                </div>
                <div className="travel-grid">
                  {travelInfo.flag && (
                    <div className="travel-item">
                      <span className="travel-flag">{travelInfo.flag}</span>
                      <div><p className="tlabel">Country</p><p className="tvalue">{extractCountry(selLoc.city)}</p></div>
                    </div>
                  )}
                  {travelInfo.currency && (
                    <div className="travel-item">
                      <span className="travel-icon-box">💰</span>
                      <div><p className="tlabel">Currency</p><p className="tvalue">{travelInfo.currency} ({travelInfo.currencySymbol})</p></div>
                    </div>
                  )}
                  {travelInfo.language && (
                    <div className="travel-item">
                      <span className="travel-icon-box">🗣</span>
                      <div><p className="tlabel">Language</p><p className="tvalue">{travelInfo.language}</p></div>
                    </div>
                  )}
                  {travelInfo.temp !== undefined && (
                    <div className="travel-item">
                      <span className="travel-icon-box">{travelInfo.icon}</span>
                      <div><p className="tlabel">Weather Now</p><p className="tvalue">{travelInfo.temp}°C</p></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* NEARBY */}
            {nearby.length > 0 && (
              <div className="nearby-section">
                <h3>🍽 Nearby Restaurants & Cafés</h3>
                <p className="nearby-sub">Near <strong>{selLoc?.place}</strong></p>
                <div className="nearby-grid">
                  {nearby.map(p => (
                    <div key={p.id} className="nearby-card">
                      <span>{p.tags?.amenity==='cafe'?'☕':'🍽'}</span>
                      <div>
                        <h4>{p.tags?.name}</h4>
                        <p>{p.tags?.cuisine || p.tags?.amenity}</p>
                      </div>
                      <a href={`https://www.google.com/maps/search/${encodeURIComponent(p.tags?.name+' '+selLoc?.city)}`} target="_blank" rel="noreferrer">📍</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* VIDEOS */}
        {activeTab === 'videos' && (
          <div className="videos-section">
            <h3>Videos & Filming Location Tours</h3>
            {videos.length === 0
              ? <div className="yt-empty"><span>▶</span><p>No videos found</p><small>Make sure YouTube API is enabled in Google Cloud Console</small></div>
              : <div className="videos-grid">
                  {videos.map(v => (
                    <a key={v.id.videoId} className="video-card" href={`https://youtube.com/watch?v=${v.id.videoId}`} target="_blank" rel="noreferrer">
                      <div className="video-thumb">
                        <img src={v.snippet.thumbnails.medium.url} alt={v.snippet.title}/>
                        <div className="play-btn">▶</div>
                      </div>
                      <p>{v.snippet.title.slice(0,70)}{v.snippet.title.length>70?'…':''}</p>
                    </a>
                  ))}
                </div>
            }
          </div>
        )}

        {/* CAST */}
        {activeTab === 'cast' && (
          <div className="cast-grid">
            {movie.credits?.cast?.slice(0,12).map(p => (
              <div key={p.id} className="cast-card">
                {p.profile_path
                  ? <img src={imgUrl(p.profile_path,'w185')} alt={p.name}/>
                  : <div className="cast-placeholder">{p.name[0]}</div>
                }
                <h4>{p.name}</h4>
                <p>{p.character}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
