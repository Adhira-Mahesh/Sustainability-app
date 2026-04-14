import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Workshop", "Clean-up", "Tree Planting", "Donation Drive", "Recycling",
  "Seminar", "Advocacy", "Fundraiser", "Other"
];

export default function CreateEvent() {
  const { userData } = useAuth();
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    imageUrl: "",
    categories: [] // New Field
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCategoryToggle = (cat) => {
    setForm((prev) => {
      const isSelected = prev.categories.includes(cat);
      const newCategories = isSelected
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: newCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "events"), {
        ...form,
        // Fallback image if host leaves it empty
        imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000",
        hostId: auth.currentUser.uid,
        hostName: userData?.name || "Organizer",
        createdAt: new Date().toISOString()
      });
      alert("Event Published Successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="glass p-10 rounded-[40px] shadow-2xl border-white/50">
        <h1 className="text-3xl font-black text-brand-dark mb-2">Host an Event</h1>
        <p className="text-gray-500 mb-8 font-medium">Add a beautiful image to attract more attendees.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text" placeholder="Event Title"
              className="w-full bg-white/50 p-4 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setForm({ ...form, title: e.target.value })} required
            />

            {/* NEW IMAGE URL FIELD */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-green-800 ml-2">EVENT COVER IMAGE URL</label>
              <input
                type="url"
                placeholder="Paste an image link (Unsplash, Pexels, etc.)"
                className="w-full bg-white/50 p-4 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="datetime-local" className="bg-white/50 p-4 border border-white rounded-2xl outline-none"
                onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <input type="text" placeholder="Location" className="bg-white/50 p-4 border border-white rounded-2xl outline-none"
                onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>

            {/* CATEGORIES FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-green-800 ml-2">EVENT CATEGORIES (SELECT MULTIPLE)</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${form.categories.includes(cat)
                        ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                        : "bg-white/50 text-green-800 border border-white hover:bg-white"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <textarea placeholder="Description" className="w-full bg-white/50 p-4 border border-white rounded-2xl h-32 outline-none"
              onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          <button disabled={loading} className="btn-eco w-full py-4 text-lg">
            {loading ? "Publishing..." : "Launch Event 🌿"}
          </button>
        </form>
      </div>
    </div>
  );
}