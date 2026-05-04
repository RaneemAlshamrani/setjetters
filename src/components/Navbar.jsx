import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setQuery(''); }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">SetJetters</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies, shows..." />
        </form>

        <div className="navbar-links">
          <Link to="/"          className={pathname === '/'          ? 'active' : ''}>Discover</Link>
          <Link to="/itinerary" className={pathname === '/itinerary' ? 'active' : ''}>My Trips</Link>
          <Link to="/profile"   className={pathname === '/profile'   ? 'active' : ''}>Profile</Link>
        </div>
      </div>
    </nav>
  );
}
