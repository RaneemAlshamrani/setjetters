import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sj_favorites')) || []; } catch { return []; }
  });
  const [itinerary, setItinerary] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sj_itinerary')) || []; } catch { return []; }
  });
  const [savedMovies, setSavedMovies] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sj_movies')) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('sj_favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('sj_itinerary', JSON.stringify(itinerary)); }, [itinerary]);
  useEffect(() => { localStorage.setItem('sj_movies', JSON.stringify(savedMovies)); }, [savedMovies]);

  const toggleFavorite = (loc) => setFavorites(prev =>
    prev.find(f => f.id === loc.id) ? prev.filter(f => f.id !== loc.id) : [...prev, loc]);
  const isFavorite = (id) => favorites.some(f => f.id === id);

  const addToItinerary = (loc) => {
    if (!itinerary.find(i => i.id === loc.id))
      setItinerary(prev => [...prev, { ...loc, addedAt: Date.now() }]);
  };
  const removeFromItinerary = (id) => setItinerary(prev => prev.filter(i => i.id !== id));

  const toggleSavedMovie = (movie) => setSavedMovies(prev =>
    prev.find(m => m.id === movie.id) ? prev.filter(m => m.id !== movie.id) : [...prev, movie]);
  const isMovieSaved = (id) => savedMovies.some(m => m.id === id);

  return (
    <AppContext.Provider value={{
      favorites, itinerary, savedMovies,
      toggleFavorite, isFavorite,
      addToItinerary, removeFromItinerary,
      toggleSavedMovie, isMovieSaved,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
