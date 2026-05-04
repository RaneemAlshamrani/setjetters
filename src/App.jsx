import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import Itinerary from './pages/Itinerary';
import Profile from './pages/Profile';
import './index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/search"       element={<Search />} />
          <Route path="/movie/:id"    element={<MovieDetail />} />
          <Route path="/tv/:id"       element={<MovieDetail />} />
          <Route path="/itinerary"    element={<Itinerary />} />
          <Route path="/profile"      element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
