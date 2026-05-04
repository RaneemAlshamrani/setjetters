# 🎬 SetJetters — Where Movies Meet Travel

**SetJetters** is a cinema tourism web application that bridges the gap between movies and real-world travel. Discover the actual filming locations of your favourite movies and TV shows, explore them on an interactive map, and plan your cinematic journey.

🔗 **Live Demo:** [setjetters-pied.vercel.app](https://setjetters-pied.vercel.app)
📁 **Repository:** [github.com/RaneemAlshamrani/setjetters](https://github.com/RaneemAlshamrani/setjetters)

---

## 👥 Team

| Name | Student ID | Role |
|------|------------|------|
| Raghad Asiri | 2208261 | Project Manager & Frontend Developer |
| Raneem Al-Shammari | 2208199 | UI/UX Designer & Frontend Developer |
| Lamia Adel | 2211848 | Frontend Developer & API Integration |

> **Course:** CPIT 405 — Web Development
> **University:** King Abdulaziz University
> **Semester:** Spring 2026

---

## ✨ Features

- **🖼 Cinematic Home Page** — Gallery of iconic real-world filming locations
- **🔍 Movie Search** — Search any movie or TV show using the TMDB API
- **📍 Filming Locations Map** — Interactive map showing the exact filming spots
- **✈️ Travel Essentials Card** — Currency, language & live weather for each destination
- **🍽 Nearby Places** — Restaurants and cafés near filming locations
- **📖 Wikipedia Summary** — Quick movie info powered by Wikipedia
- **▶ YouTube Videos** — Filming location tours and official trailers
- **🗓 Itinerary Builder** — Save locations and build your personal cinematic trip
- **👤 Profile Page** — View saved movies, locations, and team information

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend Framework | React.js 18 |
| Routing | React Router v6 |
| State Management | React Context API + localStorage |
| Maps | Leaflet.js + OpenStreetMap |
| Fonts | Playfair Display + DM Sans |
| Deployment | Vercel |

---

## 🔌 APIs Used

| API | Purpose | Free? |
|-----|---------|-------|
| TMDB API | Movie & TV show data | ✅ Free |
| YouTube Data API v3 | Trailers & location videos | ✅ Free |
| Leaflet + OpenStreetMap | Interactive maps | ✅ Free |
| Wikipedia REST API | Movie summaries | ✅ Free |
| RestCountries API | Currency & language info | ✅ Free |
| Open-Meteo API | Live weather data | ✅ Free |
| Overpass API | Nearby restaurants & cafés | ✅ Free |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js ≥ 16
- npm

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/RaneemAlshamrani/setjetters.git
cd setjetters
```

**2. Install dependencies**
```bash
npm install
```

**3. Create environment variables file**

Create a `.env` file in the root directory:
```
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key_here
```

**4. Get your API keys**

- **TMDB:** Sign up at themoviedb.org — free and instant
- **YouTube:** Enable YouTube Data API v3 in Google Cloud Console — free tier available

**5. Run the app**
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 📁 Project Structure

```
setjetters/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── context/
│   │   └── AppContext.jsx
│   ├── pages/
│   │   ├── Home.jsx / Home.css
│   │   ├── Search.jsx / Search.css
│   │   ├── MovieDetail.jsx / MovieDetail.css
│   │   ├── Itinerary.jsx / Itinerary.css
│   │   └── Profile.jsx / Profile.css
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Deployment

The app is deployed on **Vercel**. Every push to the `main` branch triggers an automatic redeployment.

To deploy your own instance:
1. Fork this repository
2. Import it on vercel.com
3. Add the environment variables in Vercel project settings
4. Click **Deploy**

---

*🎬 SetJetters — Lights, Camera, Travel!*
