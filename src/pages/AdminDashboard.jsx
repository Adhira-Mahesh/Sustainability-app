import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Workshop", "Clean-up", "Tree Planting", "Donation Drive", "Recycling",
  "Seminar", "Advocacy", "Fundraiser", "Other"
];

export default function AdminDashboard() {
  const { user, userData } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Editing
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", date: "", location: "", description: "", categories: [], imageUrl: "" });

  const fetchAllEvents = async () => {
    try {
      const snap = await getDocs(collection(db, "events"));
      const eventsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllEvents(eventsData);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && userData?.role === "admin") fetchAllEvents();
  }, [user, userData]);

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "events", eventId));
        setAllEvents(allEvents.filter(e => e.id !== eventId));
        alert("Event deleted successfully.");
      } catch (err) {
        alert("Failed to delete event.");
      }
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event.id);
    setEditForm({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      categories: event.categories || [],
      imageUrl: event.imageUrl || ""
    });
  };

  const handleCategoryToggle = (cat) => {
    setEditForm((prev) => {
      const isSelected = prev.categories.includes(cat);
      const newCategories = isSelected
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: newCategories };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const eventRef = doc(db, "events", editingEvent);
      await updateDoc(eventRef, editForm);
      setEditingEvent(null);
      fetchAllEvents(); 
      alert("Event updated successfully!");
    } catch (err) {
      alert("Error updating event.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage all events and oversee platform activity.</p>
        </div>
        <Link to="/create-event" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2">
          <span>+</span> Create New Event
        </Link>
      </div>

      {/* Events List */}
      <div className="grid gap-6">
        {allEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">There are no events on the platform yet.</p>
          </div>
        ) : (
          allEvents.map(event => (
            <div key={event.id} className="bg-gradient-to-r from-purple-50 via-white to-purple-50 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-purple-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:shadow-md transition-all">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">{event.title}</h3>
                
                <p className="text-sm text-gray-500 mb-2 font-medium">Hosted by <span className="font-bold text-gray-800">{event.hostName}</span> ({event.hostId})</p>

                {event.categories && event.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.categories.map(cat => (
                      <span key={cat} className="bg-white/80 text-purple-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border border-purple-200">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-md">📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-md">📍 {event.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 w-full md:w-auto mt-4 md:mt-0">
                <Link to={`/event/${event.id}`} className="flex-1 md:flex-none text-center px-4 py-3 md:py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition shadow-sm">
                  View Event & Attendees
                </Link>
                <button onClick={() => startEdit(event)} className="flex-1 md:flex-none text-center px-4 py-3 md:py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)} className="flex-1 md:flex-none text-center px-4 py-3 md:py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition shadow-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Event Modal (Simple Overlay) */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl p-8 rounded-[32px] shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-100">
            <h2 className="text-3xl font-black text-brand-dark mb-6">Edit Event Details (Admin)</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label>
                <input type="text" className="w-full bg-gray-50 p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date & Time</label>
                  <input type="datetime-local" className="w-full bg-gray-50 p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                  <input type="text" className="w-full bg-gray-50 p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} required />
                </div>
              </div>

              {/* Edit Categories */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Event Categories</label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${editForm.categories.includes(cat)
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                          : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Update Image URL</label>
                <input
                  type="url"
                  className="w-full bg-gray-50 p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  value={editForm.imageUrl}
                  onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })}
                  placeholder="Paste an image link..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea className="w-full bg-gray-50 p-4 border border-gray-200 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium resize-none" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} required />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button type="submit" className="flex-1 bg-purple-600 text-white py-4 rounded-full font-black text-lg shadow-lg hover:bg-purple-700 hover:shadow-purple-700/30 transition-all hover:-translate-y-1">Save Changes</button>
                <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}