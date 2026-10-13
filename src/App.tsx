Import React, { useState, useEffect } from 'react';
import { MASTER_INDIA_TOURISM_DIRECTORY } from './tourismdata';
import { Analytics } from '@vercel/analytics/react';

const SUPABASE_URL = "https://mdwcvukhlpvjwxmskidg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd2N2dWtobHB2and4bXNraWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NDg1NzAsImV4cCI6MjEwNzIyNDU3MH0.fg4qUeUD1Jq816546cqtBpMyUfeSdAvwNouLzBEjS_U";

const APP_CONFIG = {
  ADMIN_EMAIL: "C2studioindia@gmail.com",
};

const getField = (obj: any, keys: string[]) => {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") {
      return obj[k];
    }
  }
  return "";
};

const getSmartNearbySpots = (name: string, state: string) => {
  const normalized = (name || "").toLowerCase();
  if (normalized.includes("badrinath")) return "Tapt Kund, Mana Village, Vasudhara Falls, Vyas Gufa";
  if (normalized.includes("kedarnath")) return "Bhairavnath Temple, Vasuki Tal, Gaurikund, Shankaracharya Samadhi";
  if (normalized.includes("taj mahal") || normalized.includes("agra")) return "Agra Fort, Mehtab Bagh, Jama Masjid, Itimad-ud-Daulah";
  if (normalized.includes("goa")) return "Calangute Beach, Fort Aguada, Dudhsagar Falls, Chapora Fort";
  if (normalized.includes("jaipur")) return "Hawa Mahal, Amber Fort, City Palace, Jantar Mantar";
  if (normalized.includes("varanasi")) return "Kashi Vishwanath, Dashashwamedh Ghat, Sarnath, Assi Ghat";
  if (normalized.includes("manali")) return "Solang Valley, Rohtang Pass, Hadimba Temple, Vashisht Springs";
  
  return `${name || "Destination"} Viewpoint, Heritage Market & ${state || "India"} Central Museum`;
};

function IndiaTourTripLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 250"
      className={className}
      role="img"
      aria-label="INDIA TOUR TRIP travel portal logo"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>INDIA TOUR TRIP</title>
      <g>
        <path d="M65 24 H145 L133 37 V106 H119 V67 L105 53 V106 H91 V37 Z" fill="#F58220" />
        <path d="M83 24 Q105 7 127 24 Z" fill="#F58220" />
        <path d="M79 49 H137 V57 H79 Z M83 62 H133 V69 H83 Z" fill="#F58220" />
        <path d="M86 69 H98 V105 H86 Z M104 69 H116 V105 H104 Z M122 69 H134 V105 H122 Z" fill="#F58220" />
        <path d="M76 105 H144 V114 H76 Z" fill="#F58220" />
        <path d="M158 22 H185 L257 91 V22 H284 V114 H258 L185 45 V114 H158 Z" fill="#3b82f6" />
        <path d="M326 27 C309 27 296 40 296 56 C296 77 326 101 326 101 C326 101 356 77 356 56 C356 40 343 27 326 27 Z" fill="#F58220" />
        <circle cx="326" cy="55" r="10" fill="#FFFFFF" />
        <path d="M70 127 Q187 159 318 120" fill="none" stroke="#F58220" strokeWidth="5" strokeLinecap="round" />
        <path d="M305 111 L324 118 L309 132 Z" fill="#F58220" />
      </g>
      <text x="240" y="183" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize="49" fontWeight="800" letterSpacing="2">INDIA</text>
      <path d="M74 211 H122 M358 211 H406" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" />
      <text x="240" y="219" textAnchor="middle" fill="#F58220" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="700" letterSpacing="4">TOUR TRIP</text>
    </svg>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<'home' | 'planner' | 'travel' | 'profile' | 'legal'>('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeCityKey, setActiveCityKey] = useState<string | null>(null);

  const [plannerSearch, setPlannerSearch] = useState("");
  const [selectedDestKey, setSelectedDestKey] = useState("kedarnath");
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);

  const [dbDestinations, setDbDestinations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/Category?select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setDbDestinations(data);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1200);
      }
    }
    fetchDestinations();
  }, []);

  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");

  const handleDirectMailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryMessage) {
      alert("Please fill in both your name and message!");
      return;
    }

    const mailtoUrl = `mailto:${APP_CONFIG.ADMIN_EMAIL}?subject=Enquiry from ${encodeURIComponent(enquiryName)} via India Tour Trip&body=${encodeURIComponent(enquiryMessage)}`;
    window.location.href = mailtoUrl;
    setShowEnquiryModal(false);
    setEnquiryName("");
    setEnquiryMessage("");
  };

  const [trainFrom, setTrainFrom] = useState("");
  const [trainTo, setTrainTo] = useState("");

  const [hotelCity, setHotelCity] = useState("");
  const [hotelResults, setHotelResults] = useState<any[] | null>(null);

  const [navSource, setNavSource] = useState("");
  const [navDestination, setNavDestination] = useState("");

  const rawSourceDirectory = dbDestinations.length > 0 
    ? dbDestinations.map(item => {
        const name = getField(item, ['name', 'Name', 'NAME', 'title', 'Title', 'destination', 'Destination']) || "Destination";
        const state = getField(item, ['state', 'State', 'STATE', 'country', 'Country', 'region', 'Region']) || "India";
        const category = getField(item, ['category', 'Category', 'CATEGORY', 'type', 'Type', 'genre', 'Genre']) || "General";
        
        const dbNearby = getField(item, ['nearest_spot', 'nearest_spots', 'nearby', 'Nearby', 'spots', 'Spots']);
        const finalNearby = (dbNearby && String(dbNearby).trim() !== "") 
          ? dbNearby 
          : getSmartNearbySpots(name, state);

        return {
          Name: name,
          City: name,
          State: state,
          Category: category,
          history_geo_political: getField(item, ['description', 'Description', 'history', 'History', 'details', 'Details']) || "Explore this amazing destination.",
          image_url: getField(item, ['image_url', 'image', 'Image', 'img', 'photo', 'Photo']) || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
          weather: getField(item, ['weather', 'Weather']) || "Pleasant",
          budget: getField(item, ['budget', 'Budget']) || "₹5,000 - ₹10,000",
          transport_roadmap: getField(item, ['transport_roadmap', 'transport', 'Transport']) || "Accessible via local transit & cabs.",
          markets_food: getField(item, ['markets_food', 'food', 'Food']) || "Local street food & handicraft markets.",
          nearest_spot: finalNearby
        };
      })
    : Object.values(MASTER_INDIA_TOURISM_DIRECTORY).map((item: any) => ({
        ...item,
        Category: item.Category || "General"
      }));

  // SORTING: Keep Indian destinations at the very top
  const sourceDirectory = [...rawSourceDirectory].sort((a, b) => {
    const aIsIndia = (a.State || "").toLowerCase().includes("india") || !(a.State || "").toLowerCase().includes("maldives");
    const bIsIndia = (b.State || "").toLowerCase().includes("india") || !(b.State || "").toLowerCase().includes("maldives");
    if (aIsIndia && !bIsIndia) return -1;
    if (!aIsIndia && bIsIndia) return 1;
    return 0;
  });

  const availableCategories = ["All", ...Array.from(new Set(sourceDirectory.map(d => d.Category))).filter(Boolean)];

  const filteredDestinations = sourceDirectory.filter((data) => {
    const matchesSearch = (data.Name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (data.State || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (data.Category || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || 
                            (data.Category || "").toLowerCase().trim() === selectedCategory.toLowerCase().trim();
    
    return matchesSearch && matchesCategory;
  });

  const filteredPlannerDestinations = sourceDirectory.filter((data) =>
    (data.Name || "").toLowerCase().includes(plannerSearch.toLowerCase()) ||
    (data.State || "").toLowerCase().includes(plannerSearch.toLowerCase())
  );

  const handleSpotHotelSearch = (cityName: string) => {
    setHotelCity(cityName);
    setHotelResults([
      { id: 1, name: `${cityName} Heritage Stay`, price: "₹2,499 / night", affiliateUrl: "https://www.makemytrip.com/hotels/" },
      { id: 2, name: `${cityName} Deluxe Inn & Resort`, price: "₹3,899 / night", affiliateUrl: "https://www.makemytrip.com/hotels/" }
    ]);
    setActiveCityKey(null);
    setTab('travel');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6 font-sans select-none p-4">
        <div className="w-56 animate-bounce">
          <IndiaTourTripLogo className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="w-32 h-1 bg-neutral-900 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 animate-[pulse_1s_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-28 font-sans select-none antialiased">
      <Analytics />

      <div className="bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-900 px-5 py-3 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3 w-36">
          <IndiaTourTripLogo className="w-full h-auto" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live DB
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-5">
        
        {tab === 'home' && (
          <div className="space-y-4">
            <div className="relative pt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pt-1 text-neutral-400 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="Explore destinations, forts, shrines..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-neutral-900/90 rounded-2xl border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all shadow-inner"
              />
            </div>

            {availableCategories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {availableCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-950' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-5">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((dest, index) => (
                  <div key={index} className="bg-neutral-900/90 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl space-y-3 pb-4">
                    <div className="relative h-52 bg-neutral-950 overflow-hidden">
                      <img 
                        src={dest.image_url} 
                        alt={dest.Name} 
                        className="w-full h-full object-cover" 
                        onError={(e: any) => {
                          e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>
                      <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] text-amber-400 font-bold border border-white/10 shadow">
                        ☀️ {dest.weather}
                      </div>
                    </div>

                    <div className="px-4 space-y-2.5 text-xs">
                      <div className="flex justify-between items-start">
                        <h2 className="text-base font-bold text-white">{dest.Name} <span className="text-xs text-orange-400 font-normal">({dest.State})</span></h2>
                        <span className="text-[10px] bg-neutral-950 px-2.5 py-1 rounded-lg text-neutral-400 border border-neutral-800">{dest.Category}</span>
                      </div>
                      <p className="text-neutral-300 text-[11px] leading-relaxed line-clamp-3">{dest.history_geo_political}</p>
                      
                      <div className="bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800 text-[11px] flex items-center justify-between">
                        <span className="text-orange-400 font-bold flex items-center gap-1 shrink-0">📍 Nearby Spots:</span>
                        <span className="text-neutral-300 font-medium truncate max-w-[210px] ml-1">{dest.nearest_spot}</span>
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button 
                          onClick={() => setActiveCityKey(dest.Name)} 
                          className="w-1/2 py-3 bg-neutral-800 hover:bg-neutral-700 font-bold text-white rounded-2xl border border-neutral-700 active:scale-95 transition-all">
                          Full Guide →
                        </button>
                        <button 
                          onClick={() => handleSpotHotelSearch(dest.City || dest.Name)} 
                          className="w-1/2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-2xl shadow-lg shadow-orange-950/50 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                          🏨 Find Hotels
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-neutral-400 text-xs bg-neutral-900/50 rounded-3xl border border-neutral-800 p-6 space-y-2">
                  <p className="text-sm font-bold text-orange-400">🔍 No destinations found</p>
                  <p>Try searching with a different keyword or category.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'planner' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-orange-400">🗺️ Smart AI Itinerary Planner</h2>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 text-xs">🔍</span>
                <input 
                  type="text" 
                  placeholder="Type to search destination..." 
                  value={plannerSearch} 
                  onChange={(e) => setPlannerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {filteredPlannerDestinations.map((d, index) => (
                  <div 
                    key={index} 
                    onClick={() => { setSelectedDestKey(d.Name); setPlannerSearch(d.Name); setGeneratedItinerary(d); }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${selectedDestKey === d.Name ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-300'}`}>
                    <span>{d.Name} ({d.State})</span>
                    {selectedDestKey === d.Name && <span>✓ Selected</span>}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  const found = sourceDirectory.find(d => d.Name === selectedDestKey) || sourceDirectory[0];
                  setGeneratedItinerary(found);
                }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-2xl shadow-lg active:scale-95 transition-transform">
                Generate Custom Plan
              </button>
            </div>

            {generatedItinerary && (
              <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-800 space-y-3">
                <h3 className="font-bold text-amber-400 text-sm">📍 {generatedItinerary.Name}</h3>
                <p className="text-neutral-300 text-[11px]">{generatedItinerary.history_geo_political}</p>
                <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-1">
                  <p className="font-bold text-orange-400">🚗 Transport Roadmap:</p>
                  <p className="text-[10px] text-neutral-300">{generatedItinerary.transport_roadmap}</p>
                </div>
                <p className="text-rose-400 font-bold text-[10px]">💰 Estimated Budget: {generatedItinerary.budget}</p>
                <button 
                  onClick={() => handleSpotHotelSearch(generatedItinerary.City || generatedItinerary.Name)}
                  className="w-full py-3 bg-orange-500 font-bold text-white rounded-2xl text-xs">
                  🏨 Book Stay Here
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'travel' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏨 Hotel Booking (Affiliate Ready)</h2>
              <input type="text" placeholder="Enter City or Spot" value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} className="w-full p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-white"/>
              <button onClick={() => setHotelResults([{ id: 1, name: `${hotelCity || 'Local'} Heritage Palace`, price: "₹3,499 / night", affiliateUrl: "https://www.makemytrip.com/hotels/" }, { id: 2, name: `${hotelCity || 'Local'} Luxury Stay`, price: "₹4,899 / night", affiliateUrl: "https://www.makemytrip.com/hotels/" }])} className="w-full py-3 bg-orange-500 font-bold text-white rounded-2xl">Search Hotels</button>
              {hotelResults && hotelResults.map(h => (
                <div key={h.id} className="bg-neutral-950 p-3 rounded-2xl flex justify-between items-center border border-neutral-800">
                  <div>
                    <p className="font-bold text-white">{h.name}</p>
                    <p className="text-[10px] text-rose-400 font-semibold">{h.price}</p>
                  </div>
                  <a href={h.affiliateUrl} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 px-3.5 py-2 rounded-xl font-bold text-white">Book Now</a>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🗺️ Google Maps Navigation</h2>
              <input type="text" placeholder="From" value={navSource} onChange={(e) => setNavSource(e.target.value)} className="w-full p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-white"/>
              <input type="text" placeholder="To" value={navDestination} onChange={(e) => setNavDestination(e.target.value)} className="w-full p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-white"/>
              <a href={navSource && navDestination ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(navSource)}&destination=${encodeURIComponent(navDestination)}` : "#"} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-emerald-600 font-bold text-white rounded-2xl text-center">Open Maps 🚗</a>
            </div>

            <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-blue-400">🚂 IRCTC Train Booking</h2>
              <input type="text" placeholder="From Station" value={trainFrom} onChange={(e) => setTrainFrom(e.target.value)} className="w-full p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-white"/>
              <input type="text" placeholder="To Station" value={trainTo} onChange={(e) => setTrainTo(e.target.value)} className="w-full p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-white"/>
              <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="block text-center bg-orange-500 py-3 rounded-2xl font-bold text-white">Book on IRCTC</a>
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-5 rounded-3xl border border-neutral-800 text-center space-y-4 shadow-xl">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-xl font-black text-white shadow-lg">
                  RB
                </div>
                <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-black font-bold">✓</span>
              </div>

              <div>
                <h2 className="font-extrabold text-sm text-white tracking-wide">Ravi Bharggav</h2>
                <p className="text-[11px] text-orange-400 font-bold mt-0.5">Founder & Managing Director</p>
                <p className="text-[10px] text-neutral-400 mt-1">indiatourtrip.in • India</p>
              </div>

              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 text-left space-y-2">
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">🌟 Founder's Vision</p>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  "Building India's most advanced digital tourism, smart itinerary, and real-time transit companion platform for modern explorers."
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-left space-y-2">
                <div className="flex justify-between bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                  <span className="text-neutral-400">Platform Version:</span>
                  <span className="font-bold text-amber-400">v3.0.0 Pro Enterprise</span>
                </div>
                
                <div className="flex justify-between items-center bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                  <span className="text-neutral-400">Customer Support:</span>
                  <button 
                    onClick={() => setShowEnquiryModal(true)} 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs active:scale-95 transition-transform shadow">
                    ✉️ Send Enquiry
                  </button>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setTab('legal')} 
                    className="w-full py-2.5 bg-neutral-800 font-bold text-amber-400 rounded-2xl text-center border border-neutral-700">
                    📜 Privacy Policy & Terms
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'legal' && (
          <div className="space-y-4 text-xs bg-neutral-900 p-4 rounded-3xl border border-neutral-800">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h2 className="font-bold text-sm text-amber-400">📜 Legal & Policies</h2>
              <button onClick={() => setTab('profile')} className="text-neutral-400 font-bold text-base">✕</button>
            </div>

            <div className="space-y-3 text-[11px] text-neutral-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h3 className="font-bold text-orange-400">1. Privacy Policy</h3>
                <p>Welcome to indiatourtrip.in. We respect your privacy and are committed to protecting any personal information you share with us during your travel exploration and booking navigation.</p>
              </div>

              <div>
                <h3 className="font-bold text-orange-400">2. Affiliate Disclosure</h3>
                <p>indiatourtrip.in participates in various affiliate marketing programs, which means we may get paid commissions on editorial choice products purchased through our links to retailer sites (such as MakeMyTrip, Booking.com, etc.). This comes at no additional cost to you.</p>
              </div>

              <div>
                <h3 className="font-bold text-orange-400">3. Terms & Conditions</h3>
                <p>By accessing indiatourtrip.in, you agree to comply with our terms. All tourism data, maps guidance, and itinerary planners are provided for travel assistance and exploration purposes.</p>
              </div>

              <div>
                <h3 className="font-bold text-orange-400">4. Contact Information</h3>
                <p>For any queries or partnership requests, reach out directly to our management at: <span className="text-emerald-400 font-bold">{APP_CONFIG.ADMIN_EMAIL}</span></p>
              </div>
            </div>

            <button onClick={() => setTab('profile')} className="w-full py-3 bg-orange-500 font-bold text-white rounded-2xl">Back to Profile</button>
          </div>
        )}

      </div>

      {activeCityKey && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-3xl p-4 space-y-3 text-xs max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-orange-400">{sourceDirectory.find(d => d.Name === activeCityKey)?.Name}</h3>
              <button onClick={() => setActiveCityKey(null)} className="text-neutral-400 font-bold text-base">✕</button>
            </div>

            <p className="text-neutral-300 leading-relaxed">{sourceDirectory.find(d => d.Name === activeCityKey)?.history_geo_political}</p>
            
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-1">
              <p className="text-amber-400 font-bold">☀️ Weather & Climate:</p>
              <p className="text-neutral-300 text-[11px]">{sourceDirectory.find(d => d.Name === activeCityKey)?.weather}</p>
            </div>

            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-1">
              <p className="text-amber-400 font-bold">🛍️ Markets & Local Food:</p>
              <p className="text-neutral-300 text-[11px]">{sourceDirectory.find(d => d.Name === activeCityKey)?.markets_food}</p>
            </div>

            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-1">
              <p className="text-orange-400 font-bold">🚗 Transport Roadmap:</p>
              <p className="text-neutral-300 text-[11px]">{sourceDirectory.find(d => d.Name === activeCityKey)?.transport_roadmap}</p>
            </div>

            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-1">
              <p className="text-rose-400 font-bold">💰 Estimated Budget:</p>
              <p className="text-neutral-300 text-[11px]">{sourceDirectory.find(d => d.Name === activeCityKey)?.budget}</p>
            </div>

            <button 
              onClick={() => {
                const found = sourceDirectory.find(d => d.Name === activeCityKey);
                handleSpotHotelSearch(found?.City || found?.Name || "Destination");
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
              🏨 View & Book Hotels Near This Spot
            </button>

            <button onClick={() => setActiveCityKey(null)} className="w-full py-2.5 bg-neutral-800 font-bold text-white rounded-2xl">Close Guide</button>
          </div>
        </div>
      )}

      {showEnquiryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-3xl p-4 space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-orange-400">📬 Send Direct Enquiry</h3>
              <button onClick={() => setShowEnquiryModal(false)} className="text-neutral-400 font-bold text-base">✕</button>
            </div>

            <form onSubmit={handleDirectMailSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name..." 
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  className="w-full p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Your Query / Message</label>
                <textarea 
                  rows={4}
                  placeholder="Write your message here..." 
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="text-[9px] text-neutral-400 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                💡 Target Mail: <span className="text-emerald-400 font-bold">{APP_CONFIG.ADMIN_EMAIL}</span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowEnquiryModal(false)}
                  className="w-1/2 py-3 bg-neutral-800 font-bold text-white rounded-2xl">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-2xl shadow">
                  Send Mail 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 py-3 px-6 flex justify-around items-center z-40 max-w-md mx-auto rounded-t-3xl shadow-2xl">
        <button onClick={() => setTab('home')} className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-all ${tab === 'home' ? 'text-orange-400 scale-110' : 'text-neutral-500'}`}>
          <span className="text-lg">🏠</span> Home
        </button>
        <button onClick={() => setTab('planner')} className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-all ${tab === 'planner' ? 'text-orange-400 scale-110' : 'text-neutral-500'}`}>
          <span className="text-lg">🗺️</span> Planner
        </button>
        <button onClick={() => setTab('travel')} className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-all ${tab === 'travel' ? 'text-orange-400 scale-110' : 'text-neutral-500'}`}>
          <span className="text-lg">🚗</span> Travel
        </button>
        <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-all ${tab === 'profile' ? 'text-orange-400 scale-110' : 'text-neutral-500'}`}>
          <span className="text-lg">👤</span> Profile
        </button>
      </div>

    </div>
  );
}


