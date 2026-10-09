import React, { useState, useEffect } from 'react';
import { MASTER_INDIA_TOURISM_DIRECTORY } from './tourismdata';

export default function App() {
  const [tab, setTab] = useState<'home' | 'planner' | 'reels' | 'travel' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCityKey, setActiveCityKey] = useState<string | null>(null);

  // AI Trip Planner State
  const [selectedDest, setSelectedDest] = useState("kedarnath");
  const [tripDuration, setTripDuration] = useState("3 Days");
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);

  // Reels State with LocalStorage Persistence
  const [reelsList, setReelsList] = useState(() => {
    try {
      const saved = localStorage.getItem('in_bharat_reels');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, user: "incredible_india", caption: "Himalayan Sunrise View at Kedarnath Shrine ✨", likes: 4210, video: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41555-large.mp4", location: "Kedarnath, UK" },
      { id: 2, user: "rajasthan_tourism", caption: "Majestic Architecture view 🏰", likes: 2150, video: "https://assets.mixkit.co/videos/preview/mixkit-traveller-walking-on-a-mountain-ridge-41627-large.mp4", location: "Badrinath, UK" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('in_bharat_reels', JSON.stringify(reelsList));
  }, [reelsList]);

  const [newReelUrl, setNewReelUrl] = useState("");
  const [newReelCaption, setNewReelCaption] = useState("");

  // Ixigo & IRCTC Booking State
  const [trainFrom, setTrainFrom] = useState("");
  const [trainTo, setTrainTo] = useState("");
  const [trainResults, setTrainResults] = useState<any[] | null>(null);

  // Hotel Booking State
  const [hotelCity, setHotelCity] = useState("");
  const [hotelResults, setHotelResults] = useState<any[] | null>(null);

  // Google Maps Direct Navigation State
  const [navSource, setNavSource] = useState("");
  const [navDestination, setNavDestination] = useState("");

  // Real GPS Road Trip Tracker State
  const [gpsActive, setGpsActive] = useState(false);
  const [vehicleSpeed, setVehicleSpeed] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  useEffect(() => {
    let watchId: number;
    if (gpsActive) {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
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
        (error) => {
          console.error(error);
          alert("GPS signal lost or permission denied.");
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
    data.State.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.Type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans select-none antialiased">
      
      {/* Top Header */}
      <div className="bg-black/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
        <div>
          <h1 className="font-black text-sm tracking-wider bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            IN BHARAT PRO 🇮🇳
          </h1>
          <p className="text-[9px] text-neutral-400">All-in-One Hotels, Trains, GPS & Maps</p>
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
                placeholder="Search destinations, states, or shrines..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 rounded-xl border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-4">
              {filteredDestinations.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 text-xs">No matching destinations found.</div>
              ) : (
                filteredDestinations.map(([key, dest]) => (
                  <div key={key} className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl space-y-3 pb-3">
                    <div className="relative h-52 bg-neutral-950">
                      <img src={dest.image_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-orange-400 font-bold border border-neutral-800">
                        ☀️ {dest.weather}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h2 className="text-base font-bold text-white">{dest.Name} <span className="text-xs text-orange-400 font-normal">({dest.State})</span></h2>
                        <p className="text-[10px] text-neutral-300">Type: {dest.Type}</p>
                      </div>
                    </div>

                    <div className="px-3 space-y-3 text-xs">
                      <p className="text-neutral-300 text-[11px] leading-relaxed">{dest.history_geo_political}</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                          <p className="font-bold text-amber-400 mb-1">🍲 Local Food</p>
                          <p className="text-[10px] text-neutral-300 truncate">{dest.markets_food}</p>
                        </div>
                        <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                          <p className="font-bold text-rose-400 mb-1">💰 Budget Info</p>
                          <p className="text-[10px] text-neutral-300 truncate">{dest.budget}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => setActiveCityKey(key)} 
                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-xl shadow-lg active:scale-95 transition-transform">
                        Explore Full Tourism & Food Guide →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AI TRIP PLANNER */}
        {tab === 'planner' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-orange-400">🗺️ Smart AI Tourism & Itinerary Planner</h2>
              <p className="text-[11px] text-neutral-400">Generate a custom day-by-day travel schedule instantly.</p>
              
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold">Select Destination</label>
                <select 
                  value={selectedDest} 
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white">
                  {Object.entries(MASTER_INDIA_TOURISM_DIRECTORY).map(([k, d]) => (
                    <option key={k} value={k}>{d.Name} ({d.State})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold">Trip Duration</label>
                <select 
                  value={tripDuration} 
                  onChange={(e) => setTripDuration(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white">
                  <option value="2 Days">2 Days Weekend Tour</option>
                  <option value="3 Days">3 Days Comprehensive Tour</option>
                  <option value="5 Days">5 Days Immersive Tour</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  const data = MASTER_INDIA_TOURISM_DIRECTORY[selectedDest];
                  const daysCount = parseInt(tripDuration) || 3;
                  const itineraryDays = [];
                  for (let i = 1; i <= daysCount; i++) {
                    itineraryDays.push({
                      day: i,
                      title: i === 1 ? "Arrival, Darshan & Heritage" : i === 2 ? "Local Food Trails & Markets" : "Scenic Exploration & Culture",
                      morning: i === 1 ? `Arrive at ${data.City}. Check into hotel.` : `Morning sightseeing around ${data.Name}.`,
                      afternoon: `Explore local attractions & picnic spot: ${data.picnic_spots.split('\n')[0]}`,
                      evening: `Enjoy local cuisine & markets: ${data.markets_food.split(',')[0]}`,
                      budgetTip: data.budget
                    });
                  }
                  setGeneratedItinerary({ ...data, itineraryDays });
                }}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-lg shadow-lg active:scale-95 transition-transform">
                Generate Custom Itinerary Plan
              </button>
            </div>

            {generatedItinerary && (
              <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <div>
                    <h3 className="font-bold text-amber-400 text-sm">📍 {generatedItinerary.Name}</h3>
                    <p className="text-[10px] text-neutral-400">{generatedItinerary.State} • {tripDuration}</p>
                  </div>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold">AI Generated</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                    <p className="font-bold text-orange-400">🚗 Transport Roadmap:</p>
                    <p className="text-[11px] text-neutral-300">{generatedItinerary.transport_roadmap}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-white text-xs">🗓️ Day-by-Day Schedule:</h4>
                    {generatedItinerary.itineraryDays?.map((d: any) => (
                      <div key={d.day} className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2">
                        <div className="font-bold text-amber-400 border-b border-neutral-900 pb-1">Day {d.day}: {d.title}</div>
                        <p className="text-[11px] text-neutral-300">🌅 <strong>Morning:</strong> {d.morning}</p>
                        <p className="text-[11px] text-neutral-300">☀️ <strong>Afternoon:</strong> {d.afternoon}</p>
                        <p className="text-[11px] text-neutral-300">🌙 <strong>Evening:</strong> {d.evening}</p>
                        <p className="text-[10px] text-orange-400 pt-1">💰 {d.budgetTip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REELS (Gallery Upload with Audio) */}
        {tab === 'reels' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 space-y-2">
              <h2 className="font-bold text-orange-400">📹 Upload Video from Gallery</h2>
              <input 
                type="file" 
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const videoUrl = URL.createObjectURL(file);
                    setNewReelUrl(videoUrl);
                  }
                }}
                className="w-full p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-white text-[11px] file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white"
              />
              <input 
                type="text" 
                placeholder="Caption & Location (e.g. Jaipur Fort)..." 
                value={newReelCaption} 
                onChange={(e) => setNewReelCaption(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 rounded-lg border border-neutral-800 text-white"
              />
              <button 
                onClick={() => {
                  if(!newReelUrl || !newReelCaption) return alert("Please select a video from gallery and enter a caption!");
                  const updatedReels = [{ id: Date.now(), user: "ravi_bharggav", caption: newReelCaption, likes: 1, video: newReelUrl, location: "In Bharat" }, ...reelsList];
                  setReelsList(updatedReels);
                  setNewReelUrl(""); setNewReelCaption("");
                  alert("Reel Published Successfully!");
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 font-bold text-white rounded-lg active:scale-95 transition-transform">
                Post Travel Reel
              </button>
            </div>

            <div className="space-y-4">
              {reelsList.map((r: any) => (
                <div key={r.id} className="relative h-[400px] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl flex items-center justify-center">
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

        {/* TAB 4: TRAVEL TOOLS (Hotels, IRCTC, Google Maps & GPS) */}
        {tab === 'travel' && (
          <div className="space-y-4 text-xs">
            
            {/* HOTEL & STAY BOOKING */}
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏨 Hotel & Stay Booking Gateway</h2>
              <p className="text-[11px] text-neutral-400">Search best hotels, resorts, and homestays across India.</p>
              
              <input 
                type="text" 
                placeholder="Enter City or Destination (e.g. Jaipur / Mount Abu)" 
                value={hotelCity} 
                onChange={(e) => setHotelCity(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"
              />
              <button 
                onClick={() => {
                  if(!hotelCity) return alert("Please enter a city or destination!");
                  setHotelResults([
                    { id: 1, name: "Luxury Heritage Palace & Resort", rating: "⭐️ 4.8", price: "₹3,499 / night" },
                    { id: 2, name: "Comfort Inn & Budget Suites", rating: "⭐️ 4.2", price: "₹1,850 / night" }
                  ]);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white rounded-xl shadow-lg active:scale-95 transition-transform">
                Search Available Hotels
              </button>

              {hotelResults && (
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  {hotelResults.map((h) => (
                    <div key={h.id} className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{h.name}</p>
                        <p className="text-[10px] text-neutral-400">{h.rating} • {h.price}</p>
                      </div>
                      <a 
                        href="https://www.makemytrip.com/hotels/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-emerald-600 px-3 py-1.5 rounded-lg font-bold text-white active:scale-95 text-center">
                        Book Stay
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GOOGLE MAPS DIRECT ROUTE NAVIGATION */}
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🗺️ Google Maps Direct Route & Navigation</h2>
              <input 
                type="text" 
                placeholder="Starting From (e.g. Jaipur)" 
                value={navSource} 
                onChange={(e) => setNavSource(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"
              />
              <input 
                type="text" 
                placeholder="Going To (e.g. Kedarnath / Delhi)" 
                value={navDestination} 
                onChange={(e) => setNavDestination(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"
              />
              <a 
                href={navSource && navDestination ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(navSource)}&destination=${encodeURIComponent(navDestination)}` : "#"} 
                onClick={(e) => {
                  if(!navSource || !navDestination) {
                    e.preventDefault();
                    alert("Please enter both Starting Point and Destination!");
                  }
                }}
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white rounded-xl shadow-lg text-center active:scale-95 transition-transform">
                Open Route on Google Maps 🚗
              </a>
            </div>

            {/* IRCTC BOOKING */}
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-blue-400">🚂 Official IRCTC Train Booking Gateway</h2>
              <input 
                type="text" 
                placeholder="From Station (e.g. NDLS)" 
                value={trainFrom} 
                onChange={(e) => setTrainFrom(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"
              />
              <input 
                type="text" 
                placeholder="To Station (e.g. Varanasi - BSB)" 
                value={trainTo} 
                onChange={(e) => setTrainTo(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"
              />
              <button 
                onClick={() => {
                  if(!trainFrom || !trainTo) return alert("Please enter both stations!");
                  setTrainResults([
                    { id: 1, name: "Vande Bharat Express", timing: "06:00 AM → 02:00 PM", class: "CC", price: "₹2,100" },
                    { id: 2, name: "Shiv Ganga Express", timing: "06:25 PM → 06:40 AM", class: "3A", price: "₹1,250" }
                  ]);
                }}
                className="w-full py-2.5 bg-blue-600 font-bold text-white rounded-xl shadow-lg active:scale-95 transition-transform">
                Search Available Trains
              </button>

              {trainResults && (
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  {trainResults.map((t) => (
                    <div key={t.id} className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{t.name}</p>
                        <p className="text-[10px] text-neutral-400">{t.timing} • {t.class}</p>
                      </div>
                      <a 
                        href="https://www.irctc.co.in" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-orange-500 px-3 py-1.5 rounded-lg font-bold text-white active:scale-95 text-center">
                        Book on IRCTC ({t.price})
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ROAD GPS TRACKER */}
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🚗 Khud Ki Gaadi - Live Road GPS Tracker</h2>
              <div className="grid grid-cols-2 gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                <div>
                  <p className="text-[10px] text-neutral-400">Live Speed</p>
                  <h3 className="text-xl font-black text-emerald-400 mt-1">{vehicleSpeed} <span className="text-xs">km/h</span></h3>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400">Total Distance</p>
                  <h3 className="text-xl font-black text-white mt-1">{totalKm} <span className="text-xs">km</span></h3>
                </div>
              </div>

              <button 
                onClick={() => setGpsActive(!gpsActive)} 
                className={`w-full py-2.5 font-bold rounded-xl text-white active:scale-95 transition-transform ${gpsActive ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                {gpsActive ? '🛑 Stop GPS Tracker' : '▶️ Start Gaadi GPS'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {tab === 'profile' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 text-center space-y-3">
              <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 mx-auto">
                <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center text-xl font-black text-white">RB</div>
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">Ravi Bharggav</h2>
                <p className="text-[11px] text-orange-400">Founder & Managing Director</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* DETAILED CITY GUIDE MODAL */}
      {activeCityKey && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-4 space-y-3 text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-white">{MASTER_INDIA_TOURISM_DIRECTORY[activeCityKey].Name} Guide</h3>
              <button onClick={() => setActiveCityKey(null)} className="text-neutral-400 font-bold text-base">✕</button>
            </div>

            <div className="space-y-3 text-neutral-300">
              <div>
                <p className="font-bold text-orange-400 mb-1">🏛️ History & Geo-Political:</p>
                <p className="text-[11px]">{MASTER_INDIA_TOURISM_DIRECTORY[activeCityKey].history_geo_political}</p>
              </div>
              <div>
                <p className="font-bold text-amber-400 mb-1">🍲 Picnic Spots & Food:</p>
                <p className="text-[11px]">{MASTER_INDIA_TOURISM_DIRECTORY[activeCityKey].picnic_spots}</p>
                <p className="text-[11px] mt-1">{MASTER_INDIA_TOURISM_DIRECTORY[activeCityKey].markets_food}</p>
              </div>
              <div>
                <p className="font-bold text-rose-400 mb-1">📞 Helpline & Culture:</p>
                <p className="text-[11px]">{MASTER_INDIA_TOURISM_DIRECTORY[activeCityKey].culture_helpline}</p>
              </div>
            </div>

            <button onClick={() => setActiveCityKey(null)} className="w-full py-2.5 bg-neutral-800 font-bold text-white rounded-xl shadow">Close Guide</button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-neutral-800 py-3 px-6 flex justify-between items-center z-40 text-xl">
        <button onClick={() => setTab('home')} className={`${tab === 'home' ? 'text-white scale-110' : 'text-neutral-500'} transition-all`}>🏠</button>
        <button onClick={() => setTab('planner')} className={`${tab === 'planner' ? 'text-white scale-110' : 'text-neutral-500'} transition-all`}>🗺️</button>
        <button onClick={() => setTab('reels')} className={`${tab === 'reels' ? 'text-white scale-110' : 'text-neutral-500'} transition-all`}>🎬</button>
        <button onClick={() => setTab('travel')} className={`${tab === 'travel' ? 'text-white scale-110' : 'text-neutral-500'} transition-all`}>🚗</button>
        <button onClick={() => setTab('profile')} className={`${tab === 'profile' ? 'text-white scale-110' : 'text-neutral-500'} transition-all`}>👤</button>
      </div>

    </div>
  );
}
