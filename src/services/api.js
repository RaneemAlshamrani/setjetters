const TMDB_KEY  = process.env.REACT_APP_TMDB_API_KEY;
const YT_KEY    = process.env.REACT_APP_YOUTUBE_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE  = 'https://image.tmdb.org/t/p';

// ── TMDB ──────────────────────────────────────────────────
export const searchMovies = async (query) => {
  const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
  const data = await res.json();
  return data.results?.filter(r => r.media_type !== 'person') || [];
};

export const getMovieDetails = async (id, type = 'movie') => {
  const res = await fetch(`${TMDB_BASE}/${type}/${id}?api_key=${TMDB_KEY}&append_to_response=credits,videos,images`);
  return res.json();
};

export const getTrending = async () => {
  const res = await fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}`);
  const data = await res.json();
  return data.results?.slice(0, 12) || [];
};

export const imgUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const getFilmingLocations = (movie) => {
  const known = KNOWN_LOCATIONS[movie.id] || [];
  const countries = movie.production_countries?.map(c => ({
    id: `${movie.id}-${c.iso_3166_1}`,
    place: c.name, city: c.name,
    scene: 'Production location',
    lat: COUNTRY_COORDS[c.iso_3166_1]?.lat || 0,
    lng: COUNTRY_COORDS[c.iso_3166_1]?.lng || 0,
  })) || [];
  return [...known, ...countries].slice(0, 8);
};

// ── YouTube ───────────────────────────────────────────────
export const getYouTubeVideos = async (query) => {
  if (!YT_KEY) return [];
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' filming location tour')}&type=video&maxResults=4&key=${YT_KEY}`);
    const data = await res.json();
    if (data.error) return [];
    return data.items || [];
  } catch { return []; }
};

// ── Wikipedia ─────────────────────────────────────────────
export const getWikiSummary = async (title) => {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    const data = await res.json();
    if (data.type === 'disambiguation' || !data.extract) return null;
    return { summary: data.extract, image: data.thumbnail?.source || null, url: data.content_urls?.desktop?.page || null };
  } catch { return null; }
};

// ── Overpass — nearby places ──────────────────────────────
export const getNearbyPlaces = async (lat, lng) => {
  const query = `[out:json][timeout:10];(node["amenity"="restaurant"](around:500,${lat},${lng});node["amenity"="cafe"](around:500,${lat},${lng}););out body 8;`;
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
    const data = await res.json();
    return data.elements?.filter(e => e.tags?.name) || [];
  } catch { return []; }
};

// ── RestCountries ─────────────────────────────────────────
export const getCountryInfo = async (countryName) => {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=name,flags,currencies,languages`);
    const data = await res.json();
    if (!data || data.status === 404) return null;
    const c = data[0];
    return {
      flag: c.flags?.emoji || '',
      currency: Object.values(c.currencies || {})[0]?.name || '',
      currencySymbol: Object.values(c.currencies || {})[0]?.symbol || '',
      language: Object.values(c.languages || {})[0] || '',
    };
  } catch { return null; }
};

// ── Open-Meteo weather ────────────────────────────────────
export const getWeather = async (lat, lng) => {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode&timezone=auto`);
    const data = await res.json();
    const temp = data.current?.temperature_2m;
    const code = data.current?.weathercode;
    const icon = code <= 1 ? '☀️' : code <= 3 ? '⛅' : code <= 67 ? '🌧' : '❄️';
    return { temp, icon };
  } catch { return null; }
};

// ── Static filming locations data ─────────────────────────
const KNOWN_LOCATIONS = {
  27205: [ // Inception
    { id:'inc-1', place:'Pont de Bir-Hakeim',  city:'Paris, France',   scene:'Dream fold scene',    lat:48.853, lng:2.289   },
    { id:'inc-2', place:'St Pancras Station',  city:'London, UK',      scene:'Train station scene', lat:51.531, lng:-0.123  },
    { id:'inc-3', place:'Ginza District',       city:'Tokyo, Japan',    scene:'Zero-gravity fight',  lat:35.671, lng:139.765 },
    { id:'inc-4', place:'Lower Wacker Drive',   city:'Chicago, USA',    scene:'Chase sequence',      lat:41.882, lng:-87.632 },
  ],
  438631: [ // Dune
    { id:'dune-1', place:'Wadi Rum Desert',    city:'Jordan',          scene:'Arrakis dunes',       lat:29.575, lng:35.420  },
    { id:'dune-2', place:'Liwa Desert',        city:'Abu Dhabi, UAE',  scene:'Desert expanse',      lat:23.117, lng:53.767  },
    { id:'dune-3', place:'Abisko',             city:'Norway',          scene:'Ice planet scenes',   lat:68.349, lng:18.831  },
  ],
  120: [ // Lord of the Rings
    { id:'lotr-1', place:'Matamata (Hobbiton)', city:'New Zealand',    scene:'The Shire',           lat:-37.872, lng:175.682 },
    { id:'lotr-2', place:'Tongariro',           city:'New Zealand',    scene:'Mordor',              lat:-39.200, lng:175.570 },
  ],
  680: [ // Pulp Fiction
    { id:'pf-1',  place:'Johnnie\'s Coffee Shop', city:'Los Angeles, USA', scene:'Diner scene',    lat:34.063, lng:-118.308 },
  ],
  11: [ // Star Wars
    { id:'sw-1',  place:'Wadi Rum Desert',    city:'Jordan',          scene:'Tatooine',            lat:29.575, lng:35.420  },
    { id:'sw-2',  place:'Skellig Michael',    city:'Ireland',         scene:'Ahch-To',             lat:51.772, lng:-10.539 },
  ],
};

const COUNTRY_COORDS = {
  US:{lat:37.09,lng:-95.71}, GB:{lat:55.37,lng:-3.43}, FR:{lat:46.23,lng:2.21},
  JP:{lat:36.20,lng:138.25}, DE:{lat:51.16,lng:10.45}, AU:{lat:-25.27,lng:133.77},
  CA:{lat:56.13,lng:-106.34}, IT:{lat:41.87,lng:12.56}, SA:{lat:23.88,lng:45.08},
  JO:{lat:30.59,lng:36.24},  AE:{lat:23.42,lng:53.84}, NZ:{lat:-40.90,lng:174.88},
  ES:{lat:40.46,lng:-3.74},  IN:{lat:20.59,lng:78.96}, CN:{lat:35.86,lng:104.19},
  KR:{lat:35.91,lng:127.77}, IE:{lat:53.41,lng:-8.24},
};

// ── Featured filming spots for Home page ──────────────────
export const FEATURED_SPOTS = [
  { id:'spot-1', place:'Pont de Bir-Hakeim', city:'Paris, France',   movie:'Inception',          movieId:27205, type:'movie', scene:'Dream fold scene',   image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', lat:48.853, lng:2.289   },
  { id:'spot-2', place:'Wadi Rum Desert',    city:'Jordan',          movie:'Dune',               movieId:438631,type:'movie', scene:'Arrakis dunes',      image:'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80', lat:29.575, lng:35.420  },
  { id:'spot-3', place:'Hobbiton',           city:'New Zealand',     movie:'Lord of the Rings',  movieId:120,   type:'movie', scene:'The Shire',          image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', lat:-37.872,lng:175.682 },
  { id:'spot-4', place:'St Pancras Station', city:'London, UK',      movie:'Inception',          movieId:27205, type:'movie', scene:'Train station scene', image:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', lat:51.531, lng:-0.123  },
  { id:'spot-5', place:'Skellig Michael',    city:'Ireland',         movie:'Star Wars',          movieId:11,    type:'movie', scene:'Ahch-To island',     image:'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80', lat:51.772, lng:-10.539 },
  { id:'spot-6', place:'Liwa Desert',        city:'Abu Dhabi, UAE',  movie:'Dune',               movieId:438631,type:'movie', scene:'Desert expanse',     image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', lat:23.117, lng:53.767  },
  { id:'spot-7', place:'Tongariro',          city:'New Zealand',     movie:'Lord of the Rings',  movieId:120,   type:'movie', scene:'Mordor',             image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', lat:-39.200,lng:175.570 },
  { id:'spot-8', place:'Ginza District',     city:'Tokyo, Japan',    movie:'Inception',          movieId:27205, type:'movie', scene:'Zero-gravity fight', image:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', lat:35.671, lng:139.765 },
];
