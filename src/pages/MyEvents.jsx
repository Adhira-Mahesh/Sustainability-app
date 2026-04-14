import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function MyEvents() {
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    const fetchMyRSVPs = async () => {
      const q = query(collection(db, "rsvps"), where("userId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      setRsvps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchMyRSVPs();
  }, []);

  const handleCancel = async (rsvpId) => {
    if (confirm("Are you sure you want to cancel your registration?")) {
      const rsvpRef = doc(db, "rsvps", rsvpId);
      await updateDoc(rsvpRef, { status: "Cancelled" });
      setRsvps(rsvps.map(r => r.id === rsvpId ? { ...r, status: "Cancelled" } : r));
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
      <div className="grid gap-4">
        {rsvps.length === 0 && <p className="text-gray-500">You haven't joined any events yet.</p>}
        {rsvps.map(rsvp => (
          <Link 
            key={rsvp.id} 
            to={`/event/${rsvp.eventId}`} 
            className="block"
          >
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 backdrop-blur-md p-5 rounded-xl shadow-sm border flex justify-between items-center hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div>
                <h3 className="text-xl font-bold">{rsvp.eventTitle}</h3>
                <span className="text-green-700 font-bold text-sm">🌿 Joined</span>
              </div>
             
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}