import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Workshop", "Clean-up", "Tree Planting", "Donation Drive", "Recycling",
  "Seminar", "Advocacy", "Fundraiser", "Other"
];

export default function Home() {
  const { user } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchRSVPs = async () => {
      if (!user) return;

      const q = query(collection(db, "rsvps"), where("userId", "==", user.uid));
      const rsvpSnap = await getDocs(q);

      const joinedIds = rsvpSnap.docs.map(doc => doc.data().eventId);
      setJoinedEvents(joinedIds);
    };

    fetchEvents();
    fetchRSVPs();
  }, [user]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 ||
      (event.categories && event.categories.some(c => selectedCategories.includes(c)));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-20 fade-in">
      {/* Dynamic Hero with Background Image */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden rounded-b-[60px] shadow-2xl">
        <div className="absolute inset-0 bg-green-900/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          alt="Nature"
          style={{ animation: 'pulse 15s infinite alternate' }}
        />
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="bg-white/20 text-green-100 px-5 py-2 rounded-full text-sm font-bold backdrop-blur-md mb-6 inline-block border border-white/30 shadow-lg">
            Community-Led Action
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Nurture the <span className="text-green-400 bg-clip-text">Future.</span>
          </h1>
          <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 drop-shadow-md font-medium">
            Discover and join local sustainability events. Filter by your passions and make a real difference in your community today.
          </p>

          {/* SEARCH BAR IN HERO */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 backdrop-blur-md text-gray-800 p-5 pl-14 rounded-full outline-none focus:ring-4 focus:ring-green-400 shadow-2xl transition-all text-lg font-medium"
            />
            <button
              onClick={() => document.getElementById("events").scrollIntoView({ behavior: 'smooth' })}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 rounded-full font-bold shadow-lg transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <div id="events" className="max-w-7xl mx-auto px-6">

        {/* FILTERS SECTION */}
        <div className="mb-12 glass p-6 rounded-[32px] shadow-lg flex flex-col md:flex-row gap-6 items-center">
          <span className="font-bold text-green-800 text-lg whitespace-nowrap">Filter by Topic:</span>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${selectedCategories.includes(cat)
                    ? "bg-green-600 text-white shadow-green-600/40 transform scale-105"
                    : "bg-white/60 text-green-800 hover:bg-white border-transparent hover:border-green-200"
                  }`}
              >
                {cat}
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-black text-brand-dark tracking-tight">
            {filteredEvents.length > 0 ? "Upcoming Events" : "No events found"}
          </h2>
          <span className="text-gray-500 font-bold">{filteredEvents.length} Results</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <div key={event.id} className="glass p-2 rounded-[32px] group overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
              <div className="h-56 w-full rounded-[26px] mb-4 overflow-hidden relative shrink-0">
                {/* Use the host's image, or a fallback if it fails */}
                <img
                  src={event.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={event.title}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000" }}
                />
                {joinedEvents.includes(event.id) && (
                  <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Joined ✓
                  </div>
                )}
                {/* CATEGORY BADGES */}
                {event.categories && event.categories.length > 0 && (
                  <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap max-w-[80%]">
                    {event.categories.slice(0, 2).map(cat => (
                      <span key={cat} className="bg-white/90 backdrop-blur text-green-800 px-2 py-1 rounded-md text-[10px] font-black uppercase shadow-sm">
                        {cat}
                      </span>
                    ))}
                    {event.categories.length > 2 && (
                      <span className="bg-white/90 backdrop-blur text-green-800 px-2 py-1 rounded-md text-[10px] font-black uppercase shadow-sm">
                        +{event.categories.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 pt-0 flex flex-col flex-1">
                <h3 className="text-2xl font-black text-brand-dark mb-2 leading-tight group-hover:text-green-700 transition-colors">{event.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium">{event.description}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1">📍 {event.location}</span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 rounded-full px-2 py-1 text-center">📅 {new Date(event.date).toLocaleDateString()}</span>
                  </div>

                  <Link to={`/event/${event.id}`} className="btn-eco w-full block text-center py-3 rounded-xl shadow-md hover:shadow-xl">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-400 mb-4">No events match your criteria</h3>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategories([]) }}
              className="btn-eco py-3 px-8"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}