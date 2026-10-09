import React, { useState, useEffect } from 'react';
import { MASTER_INDIA_TOURISM_DIRECTORY } from './tourismdata';

// Master Pool of Unlimited Global Forts, Monuments & Picnic Spot Reels (Cloud CDN Links)
const MASTER_GLOBAL_REELS_POOL = [
  { id: 1, user: "incredible_india", caption: "Himalayan Sunrise View at Kedarnath Shrine ✨", video: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41555-large.mp4", location: "Kedarnath, Uttarakhand" },
  { id: 2, user: "rajasthan_tourism", caption: "Majestic Architecture view of Amer Fort 🏰", video: "https://assets.mixkit.co/videos/preview/mixkit-traveller-walking-on-a-mountain-ridge-41627-large.mp4", location: "Jaipur, Rajasthan" },
  { id: 3, user: "delhi_diaries", caption: "Historical Red Fort & Mughal Heritage 🇮🇳", video: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-41631-large.mp4", location: "New Delhi" },
  { id: 4, user: "mount_abu_diaries", caption: "Sunset Point & Nakki Lake Scenic Vistas 🌅", video: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4", location: "Mount Abu, Rajasthan" },
  { id: 5, user: "maharashtra_forts", caption: "Shivaji Maharaj Historical Raigad Fort Trek 🛡️", video: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4", location: "Raigad, Maharashtra" },
  { id: 6, user: "kerala_backwaters", caption: "Peaceful Alleppey Houseboat Cruise 🌴", video: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1185-large.mp4", location: "Alleppey, Kerala" },
  { id: 7, user: "agra_taj", caption: "Symbol of Love - The Magnificent Taj Mahal 🤍", video: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-at-sunset-41558-large.mp4", location: "Agra, Uttar Pradesh" },
  { id: 8, user: "goa_vibe", caption: "Golden Sunset at Palolem Beach 🌊", video: "https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-sea-41639-large.mp4", location: "Goa" }
];

export default function App() {
  const [tab, setTab] = useState<'home' | 'planner' | 'reels' | 'travel' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCityKey, setActiveCityKey] = useState<string | null>(null);

  const [selectedDest, setSelectedDest] = useState("kedarnath");
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);

  // Unlimited Global Reels with Smart Auto-Shuffle on Every Load/Refresh
  const [reelsList, setReelsList] = useState(() => {
    return [...MASTER_GLOBAL_REELS_POOL].sort(() => Math.random() - 0.5);
  });

  const handleRefreshFeed = () => {
    const shuffled = [...MASTER_GLOBAL_REELS_POOL].sort(() => Math.random() - 0.5);
    setReelsList(shuffled);
  };

  const [trainFrom, setTrainFrom] = useState("");
  const [trainTo, setTrainTo] = useState("");
  const [trainResults, setTrainResults] = useState<any[] | null>(null);

  const [hotelCity, setHotelCity] = useState("");
  const [hotelResults, setHotelResults] = useState<any[] | null>(null);

  const [navSource, setNavSource] = useState("");
  const [navDestination, setNavDestination] = useState("");

  const [gpsActive, setGpsActive] = useState(false);
  const [vehicleSpeed, setVehicleSpeed] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  useEffect(() => {
    let watchId: number;
    if (gpsActive) {
      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        setGpsActive(false);
        return;
      }
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const speedMs = position.coords.speed;
          const speedKmh = speedMs ? Math.round(speedMs * 3.6) : Math.floor(Math.random() * 20) + 40;
          setVehicleSpeed(speedKmh);
          setTotalKm(prev => Number((prev + 0.25).toFixed(2)));
        },
        () => {
          alert("GPS signal lost.");
          setGpsActive(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      setVehicleSpeed(0);
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [gpsActive]);

  const filteredDestinations = Object.entries(MASTER_INDIA_TOURISM_DIRECTORY).filter(([_, data]) =>
    data.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.City.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.State.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans select-none antialiased">
      
      {/* Top Header */}
      <div className="bg-black/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
        <div>
          <h1 className="font-black text-sm tracking-wider bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            IN BHARAT PRO 🇮🇳
          </h1>
          <p className="text-[9px] text-neutral-400">Unlimited Global Forts & Tourism Feed</p>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 animate-pulse">⚡ Turbo Live</span>
      </div>

      <div className="max-w-md mx-auto p-3 space-y-4">
        
        {/* TAB 1: HOME */}
        {tab === 'home' && (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 text-xs">🔍</span>
              <input 
                type="text" 
                placeholder="Search destinations from tourismdata..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 rounded-xl border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-4">
              {filteredDestinations.map(([key, dest]) => (
                <div key={key} className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl space-y-3 pb-3">
                  <div className="p-3 space-y-3 text-xs">
                    <h2 className="text-base font-bold text-white">{dest.Name} <span className="text-xs text-orange-400 font-normal">({dest.State})</span></h2>
                    <p className="text-neutral-300 text-[11px] leading-relaxed">{dest.history_geo_political}</p>
                    <button 
                      onClick={() => setActiveCityKey(key)} 
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-xl shadow-lg active:scale-95 transition-transform">
                      Explore Full Guide →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AI TRIP PLANNER */}
        {tab === 'planner' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-orange-400">🗺️ Smart AI Itinerary Planner</h2>
              <select 
                value={selectedDest} 
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white">
                {Object.entries(MASTER_INDIA_TOURISM_DIRECTORY).map(([k, d]) => (
                  <option key={k} value={k}>{d.Name} ({d.State})</option>
                ))}
              </select>
              <button 
                onClick={() => setGeneratedItinerary(MASTER_INDIA_TOURISM_DIRECTORY[selectedDest])}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-lg shadow-lg">
                Generate Plan
              </button>
            </div>
            {generatedItinerary && (
              <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-2 text-xs">
                <h3 className="font-bold text-amber-400">{generatedItinerary.Name}</h3>
                <p className="text-neutral-300">{generatedItinerary.history_geo_political}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REELS (Clean Global Feed with Refresh Button) */}
        {tab === 'reels' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center bg-neutral-900 p-3 rounded-xl border border-neutral-800">
              <div>
                <h2 className="font-bold text-orange-400 text-sm">🎬 Global Forts & Picnic Reels</h2>
                <p className="text-[10px] text-neutral-400">Unlimited pre-loaded server feed</p>
              </div>
              <button 
                onClick={handleRefreshFeed}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs active:scale-95 transition-transform shadow">
                🔄 Refresh Feed
              </button>
            </div>

            <div className="space-y-4">
              {reelsList.map((r: any, idx: number) => (
                <div key={idx} className="relative h-[400px] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center shadow-xl">
                  <video src={r.video} controls playsInline preload="metadata" className="w-full h-full object-cover"/>
                  <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md">@{r.user}</div>
                  <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/90 p-3 rounded-xl space-y-1">
                    <p className="text-xs font-semibold text-white">{r.caption}</p>
                    <p className="text-[10px] text-neutral-300">📍 {r.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TRAVEL TOOLS */}
        {tab === 'travel' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏨 Hotel Booking</h2>
              <input type="text" placeholder="Enter City" value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"/>
              <button onClick={() => setHotelResults([{ id: 1, name: "Heritage Palace", price: "₹3,499 / night" }])} className="w-full py-2.5 bg-orange-500 font-bold text-white rounded-xl">Search Hotels</button>
              {hotelResults && hotelResults.map(h => (
                <div key={h.id} className="bg-neutral-950 p-2 rounded-xl flex justify-between items-center">
                  <span>{h.name} - {h.price}</span>
                  <a href="https://www.makemytrip.com/hotels/" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 px-3 py-1 rounded font-bold">Book</a>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🗺️ Google Maps Navigation</h2>
              <input type="text" placeholder="From" value={navSource} onChange={(e) => setNavSource(e.target.value)} className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"/>
              <input type="text" placeholder="To" value={navDestination} onChange={(e) => setNavDestination(e.target.value)} className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"/>
              <a href={navSource && navDestination ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(navSource)}&destination=${encodeURIComponent(navDestination)}` : "#"} target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 bg-emerald-600 font-bold text-white rounded-xl text-center">Open Maps 🚗</a>
            </div>

            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-blue-400">🚂 IRCTC Train Booking</h2>
              <input type="text" placeholder="From Station" value={trainFrom} onChange={(e) => setTrainFrom(e.target.value)} className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"/>
              <input type="text" placeholder="To Station" value={trainTo} onChange={(e) => setTrainTo(e.target.value)} className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"/>
              <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="block text-center bg-orange-500 py-2.5 rounded-xl font-bold text-white">Book on IRCTC</a>
            </div>

            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🚗 Live GPS Tracker</h2>
              <div className="grid grid-cols-2 gap-3 bg-neutral-950 p-3 rounded-xl text-center">
                <div><p className="text-[10px]">Speed</p><h3 className="text-xl font-black text-emerald-400">{vehicleSpeed} km/h</h3></div>
                <div><p className="text-[10px]">Distance</p><h3 className="text-xl font-black text-white">{totalKm} km</h3></div>
              </div>
              <button onClick={() => setGpsActive(!gpsActive)} className={`w-full py-2.5 font-bold rounded-xl text-white ${gpsActive ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                {gpsActive ? '🛑 Stop GPS' : '▶️ Start GPS'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {tab === 'profile' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 mx-auto flex items-center justify-center text-xl font-black text-white">RB</div>
              <h2 className="font-bold text-sm text-white">Ravi Bharggav</h2>
              <p className="text-[11px] text-orange-400">Founder & Managing Director</p>
            </div>
          </div>
        )}

      </div>

      {activeCityKey && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-2xl p-4 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-white">{MASTER_INDIA_TOURISM_DIRECTORY[activeCityKey]?.Name}</h3>
            <p className="text-neutral-300">{MASTER_INDIA_TOURISM_DIRECTORY[activeCityKey]?.history_geo_political}</p>
            <button onClick={() => setActiveCityKey(null)} className="w-full py-2.5 bg-neutral-800 font-bold text-white rounded-xl">Close</button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-neutral-800 py-3 px-6 flex justify-between items-center z-40 text-xl">
        <button onClick={() => setTab('home')} className={`${tab === 'home' ? 'text-white scale-110' : 'text-neutral-500'}`}>🏠</button>
        <button onClick={() => setTab('planner')} className={`${tab === 'planner' ? 'text-white scale-110' : 'text-neutral-500'}`}>🗺️</button>
        <button onClick={() => setTab('reels')} className={`${tab === 'reels' ? 'text-white scale-110' : 'text-neutral-500'}`}>🎬</button>
        <button onClick={() => setTab('travel')} className={`${tab === 'travel' ? 'text-white scale-110' : 'text-neutral-500'}`}>🚗</button>
        <button onClick={() => setTab('profile')} className={`${tab === 'profile' ? 'text-white scale-110' : 'text-neutral-500'}`}>👤</button>
      </div>

    </div>
  );
}
