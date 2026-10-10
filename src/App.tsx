import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MASTER_INDIA_TOURISM_DIRECTORY } from './tourismdata';

// ==========================================
// ⚙️ SUPABASE CONFIGURATION (Official Client)
// ==========================================
const SUPABASE_URL = "https://mdwcvukhlpvjwxmskidg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd2N2dWtobHB2and4bXNraWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NDg1NzAsImV4cCI6MjEwNzIyNDU3MH0.fg4qUeUD1Jq816546cqtBpMyUfeSdAvwNouLzBEjS_U";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const APP_CONFIG = {
  ADMIN_EMAIL: "C2studioindia@gmail.com",
};

export default function App() {
  const [tab, setTab] = useState<'home' | 'planner' | 'travel' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCityKey, setActiveCityKey] = useState<string | null>(null);

  const [plannerSearch, setPlannerSearch] = useState("");
  const [selectedDestKey, setSelectedDestKey] = useState("kedarnath");
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);

  const [dbDestinations, setDbDestinations] = useState<any[]>([]);

  // Fetch data via official Supabase Client
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const { data, error } = await supabase.from('destinations').select('*');
        if (error) {
          console.error('Error fetching destinations:', error);
        } else if (data && data.length > 0) {
          setDbDestinations(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
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

  const sourceDirectory = dbDestinations.length > 0 
    ? dbDestinations.map(item => ({
        Name: item.name,
        City: item.name,
        State: item.state,
        history_geo_political: item.description,
        image_url: item.image_url,
        weather: "Live from Supabase",
        budget: "Flexible",
        transport_roadmap: "Available via App Navigation",
        markets_food: "Local Delicacies"
      }))
    : Object.values(MASTER_INDIA_TOURISM_DIRECTORY);

  const filteredDestinations = sourceDirectory.filter((data) =>
    data.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.State.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlannerDestinations = sourceDirectory.filter((data) =>
    data.Name.toLowerCase().includes(plannerSearch.toLowerCase()) ||
    data.State.toLowerCase().includes(plannerSearch.toLowerCase())
  );

  const handleSpotHotelSearch = (cityName: string) => {
    setHotelCity(cityName);
    setHotelResults([
      { id: 1, name: `${cityName} Heritage Stay`, price: "₹2,499 / night" },
      { id: 2, name: `${cityName} Deluxe Inn & Resort`, price: "₹3,899 / night" }
    ]);
    setActiveCityKey(null);
    setTab('travel');
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans select-none antialiased">
      
      {/* Top Header */}
      <div className="bg-black/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
        <div>
          <h1 className="font-black text-sm tracking-wider bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            INDIA TOUR TRIP 🇮🇳
          </h1>
          <p className="text-[9px] text-neutral-400">indiatourtrip.in • Enterprise Suite</p>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 animate-pulse">⚡ Supabase Connected</span>
      </div>

      <div className="max-w-md mx-auto p-3 space-y-4">
        
        {/* TAB 1: HOME */}
        {tab === 'home' && (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 text-xs">🔍</span>
              <input 
                type="text" 
                placeholder="Search destinations, forts, shrines..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 rounded-xl border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-4">
              {filteredDestinations.map((dest, index) => (
                <div key={index} className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl space-y-3 pb-3">
                  <div className="relative h-48 bg-neutral-950 overflow-hidden">
                    <img 
                      src={dest.image_url} 
                      alt={dest.Name} 
                      className="w-full h-full object-cover" 
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-orange-400 font-bold border border-neutral-800">
                      ☀️ {dest.weather}
                    </div>
                  </div>

                  <div className="px-3 space-y-2 text-xs">
                    <h2 className="text-base font-bold text-white">{dest.Name} <span className="text-xs text-orange-400 font-normal">({dest.State})</span></h2>
                    <p className="text-neutral-300 text-[11px] leading-relaxed line-clamp-3">{dest.history_geo_political}</p>
                    
                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => setActiveCityKey(dest.Name)} 
                        className="w-1/2 py-2.5 bg-neutral-800 font-bold text-white rounded-xl active:scale-95 transition-transform">
                        Full Guide →
                      </button>
                      <button 
                        onClick={() => handleSpotHotelSearch(dest.City || dest.Name)} 
                        className="w-1/2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-1">
                        🏨 Find Hotels
                      </button>
                    </div>
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
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 text-xs">🔍</span>
                <input 
                  type="text" 
                  placeholder="Type to search destination..." 
                  value={plannerSearch} 
                  onChange={(e) => setPlannerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {filteredPlannerDestinations.map((d, index) => (
                  <div 
                    key={index} 
                    onClick={() => { setSelectedDestKey(d.Name); setPlannerSearch(d.Name); setGeneratedItinerary(d); }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${selectedDestKey === d.Name ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-300'}`}>
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
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-lg shadow-lg active:scale-95 transition-transform">
                Generate Custom Plan
              </button>
            </div>

            {generatedItinerary && (
              <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
                <h3 className="font-bold text-amber-400 text-sm">📍 {generatedItinerary.Name}</h3>
                <p className="text-neutral-300 text-[11px]">{generatedItinerary.history_geo_political}</p>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 space-y-1">
                  <p className="font-bold text-orange-400">🚗 Transport Roadmap:</p>
                  <p className="text-[10px] text-neutral-300">{generatedItinerary.transport_roadmap}</p>
                </div>
                <p className="text-rose-400 font-bold text-[10px]">💰 Estimated Budget: {generatedItinerary.budget}</p>
                <button 
                  onClick={() => handleSpotHotelSearch(generatedItinerary.City || generatedItinerary.Name)}
                  className="w-full py-2 bg-orange-500 font-bold text-white rounded-xl text-xs">
                  🏨 Book Stay Here
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRAVEL TOOLS */}
        {tab === 'travel' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏨 Hotel Booking</h2>
              <input type="text" placeholder="Enter City or Spot" value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white"/>
              <button onClick={() => setHotelResults([{ id: 1, name: `${hotelCity || 'Local'} Heritage Palace`, price: "₹3,499 / night" }, { id: 2, name: `${hotelCity || 'Local'} Luxury Stay`, price: "₹4,899 / night" }])} className="w-full py-2.5 bg-orange-500 font-bold text-white rounded-xl">Search Hotels</button>
              {hotelResults && hotelResults.map(h => (
                <div key={h.id} className="bg-neutral-950 p-2.5 rounded-xl flex justify-between items-center border border-neutral-800">
                  <div>
                    <p className="font-bold text-white">{h.name}</p>
                    <p className="text-[10px] text-rose-400 font-semibold">{h.price}</p>
                  </div>
                  <a href="https://www.makemytrip.com/hotels/" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 px-3 py-1.5 rounded-lg font-bold text-white">Book Now</a>
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
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {tab === 'profile' && (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 text-center space-y-4 shadow-xl">
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

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-left space-y-2">
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">🌟 Founder's Vision</p>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  "Building India's most advanced digital tourism, smart itinerary, and real-time transit companion platform for modern explorers."
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-left space-y-2">
                <div className="flex justify-between bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400">Platform Version:</span>
                  <span className="font-bold text-amber-400">v3.0.0 Pro Enterprise</span>
                </div>
                
                <div className="flex justify-between items-center bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400">Customer Support:</span>
                  <button 
                    onClick={() => setShowEnquiryModal(true)} 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs active:scale-95 transition-transform shadow">
                    ✉️ Send Enquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FULL GUIDE DETAIL MODAL */}
      {activeCityKey && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-2xl p-4 space-y-3 text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-orange-400">{sourceDirectory.find(d => d.Name === activeCityKey)?.Name}</h3>
              <button onClick={() => setActiveCityKey(null)} className="text-neutral-400 font-bold text-base">✕</button>
            </div>

            <p className="text-neutral-300 leading-relaxed">{sourceDirectory.find(d => d.Name === activeCityKey)?.history_geo_political}</p>
            
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 space-y-1">
              <p className="text-amber-400 font-bold">☀️ Weather & Climate:</p>
              <p className="text-neutral-300 text-[11px]">{sourceDirectory.find(d => d.Name === activeCityKey)?.weather}</p>
            </div>

            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 space-y-1">
              <p className="text-amber-400 font-bold">🛍️ Markets & Local Food:</p>
              <p className="text-neutral-300 text-[11px]">{sourceDirectory.find(d => d.Name === activeCityKey)?.markets_food}</p>
            </div>

            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 space-y-1">
              <p className="text-orange-400 font-bold">🚗 Transport Roadmap:</p>
              <p className="text-neutral-300 text-[11px]">{sourceDirectory.find(d => d.Name === activeCityKey)?.transport_roadmap}</p>
            </div>

            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 space-y-1">
              <p className="text-rose-400 font-bold">💰 Estimated Budget:</p>
              <p className="text-neutral-300 text-[11px]">{sourceDirectory.find(d => d.Name === activeCityKey)?.budget}</p>
            </div>

            <button 
              onClick={() => {
                const found = sourceDirectory.find(d => d.Name === activeCityKey);
                handleSpotHotelSearch(found?.City || found?.Name || "Destination");
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
              🏨 View & Book Hotels Near This Spot
            </button>

            <button onClick={() => setActiveCityKey(null)} className="w-full py-2 bg-neutral-800 font-bold text-white rounded-xl">Close Guide</button>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-2xl p-4 space-y-4 text-xs shadow-2xl">
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
                  className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Your Query / Message</label>
                <textarea 
                  rows={4}
                  placeholder="Write your message here..." 
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="text-[9px] text-neutral-400 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                💡 Target Mail: <span className="text-emerald-400 font-bold">{APP_CONFIG.ADMIN_EMAIL}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowEnquiryModal(false)}
                  className="w-1/2 py-2.5 bg-neutral-800 font-bold text-white rounded-xl">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-xl shadow">
                  Send Mail 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-neutral-800 py-3 px-8 flex justify-between items-center z-40 text-xl">
        <button onClick={() => setTab('home')} className={`${tab === 'home' ? 'text-white scale-110' : 'text-neutral-500'}`}>🏠</button>
        <button onClick={() => setTab('planner')} className={`${tab === 'planner' ? 'text-white scale-110' : 'text-neutral-500'}`}>🗺️</button>
        <button onClick={() => setTab('travel')} className={`${tab === 'travel' ? 'text-white scale-110' : 'text-neutral-500'}`}>🚗</button>
        <button onClick={() => setTab('profile')} className={`${tab === 'profile' ? 'text-white scale-110' : 'text-neutral-500'}`}>👤</button>
      </div>

    </div>
  );
}
