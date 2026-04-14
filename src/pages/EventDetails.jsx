import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const { userData, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const docSnap = await getDoc(doc(db, "events", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEvent(data);

        if (user) {

          const rsvpDoc = await getDoc(doc(db, "rsvps", `${user.uid}_${id}`));
          if (rsvpDoc.exists()) {
            setJoined(true);
          }
        }
        // If Host views their own event or if Admin views event, show registrations [cite: 48]
        if (data.hostId === user?.uid || userData?.role === "admin") {
          const q = query(collection(db, "rsvps"), where("eventId", "==", id));
          const rsvpSnap = await getDocs(q);
          setRegistrations(rsvpSnap.docs.map(d => d.data()));
        }
      }
    };
    fetchEvent();
  }, [id, user]);

  const joinEvent = async () => {
    // Save RSVP (userId + eventId) [cite: 23]
    await setDoc(doc(db, "rsvps", `${user.uid}_${id}`), {
      userId: user.uid,
      eventId: id,
      userName: userData.name,
      eventTitle: event.title,
      status: "Joined"
    });
    alert("RSVP Confirmation: You have successfully joined!");
    setJoined(true);
  };

  const cancelRSVP = async () => {
    await deleteDoc(doc(db, "rsvps", `${user.uid}_${id}`));
    setJoined(false);
  };

  if (!event) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-10 pt-20">
      {/* Event Header Card */}
      <div className="glass p-10 rounded-[40px] shadow-2xl border-white/50 mb-10 overflow-hidden relative">
        <div className="z-10 relative">
          <h1 className="text-5xl md:text-6xl font-black text-brand-dark mb-4 leading-tight">{event.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-inner border border-green-200">
              📅 {new Date(event.date).toLocaleString("en-US", {
                  weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true
                })}
            </span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-inner border border-blue-200">
              📍 {event.location}
            </span>
          </div>

          {/* Render Categories */}
          {event.categories && event.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {event.categories.map(cat => (
                <span key={cat} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-md text-xs font-black uppercase shadow-lg shadow-green-500/30 tracking-wider">
                  {cat}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-500 text-lg mb-8 font-medium">Organized by: <span className="font-bold text-gray-800">{event.hostName}</span></p>
          
          <div className="bg-white/60 p-8 rounded-3xl border border-white shadow-inner mb-8 backdrop-blur-sm">
            <h3 className="text-2xl font-black text-brand-dark mb-4 drop-shadow-sm">About this event</h3>
            <p className="text-gray-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Floating Actions */}
          <div className="flex justify-start">
            {user && event.hostId !== user.uid && (
              <button
                onClick={joined ? cancelRSVP : joinEvent}
                className={`px-12 py-5 rounded-full text-xl font-black shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95
                  ${joined
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-red-500/30"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30"
                  }`}
              >
                {joined ? "Cancel RSVP ❌" : "Join Event 🌿"}
              </button>
            )}
            {!user && (
              <p className="text-gray-500 italic font-medium bg-white/50 px-4 py-2 rounded-lg">
                Please <a href="/login" className="text-green-700 font-bold hover:underline">log in</a> to RSVP or join this event.
              </p>
            )}
          </div>
        </div>
        
        {/* Background Image Element */}
        {event.imageUrl && (
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none" style={{
            backgroundImage: `url(${event.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
          }} />
        )}
      </div>

      {/* Host / Admin Registration Table */}
      {(userData?.role === "admin" || (userData?.role === "host" && event.hostId === user?.uid)) && (
        <div className="glass p-10 rounded-[40px] shadow-2xl border-white/50">
          <h2 className="text-3xl font-black text-brand-dark mb-6">Registrations</h2>
          <div className="bg-white/50 rounded-3xl overflow-hidden border border-white shadow-inner">
            <table className="w-full text-left">
              <thead className="bg-white/60 text-green-900 border-b border-white">
                <tr>
                  <th className="p-5 font-black uppercase text-sm tracking-wider">Attendee Name</th>
                  <th className="p-5 font-black uppercase text-sm tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="p-8 text-center text-gray-500 font-medium">No registrations yet.</td>
                  </tr>
                ) : (
                  registrations.map((reg, i) => (
                    <tr key={i} className="hover:bg-white/40 transition-colors">
                      <td className="p-5 font-bold text-gray-800">{reg.userName}</td>
                      <td className="p-5">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}