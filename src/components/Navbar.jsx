import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-50 via-green-100 to-emerald-200 backdrop-blur-md border-b border-green-100 px-8 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">🌿</div>
        <span className="text-xl font-black text-brand-dark tracking-tighter">EcoTracker</span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-bold text-gray-600">
        <Link to="/" className="hover:text-brand-primary transition bg-white px-5 py-2 rounded-xl shadow-md">Events</Link>
        {user ? (
          <>
            {userData?.role === "attendee" && <Link to="/my-events" className="bg-white px-5 py-2 rounded-xl shadow-md">My Journey</Link>}
            {userData?.role === "host" && <Link to="/dashboard" className="text-brand-primary bg-white px-5 py-2 rounded-xl shadow-md">Host Panel</Link>}
            {userData?.role === "admin" && <Link to="/admin" className="text-brand-primary bg-white px-5 py-2 rounded-xl shadow-md border border-brand-primary">Admin Panel</Link>}
            <button onClick={() => { signOut(auth); navigate("/login"); }} className="bg-gray-100 px-4 py-2 rounded-xl ">Logout</button>
          </>
        ) : (
          <Link to="/signup" className="bg-brand-primary bg-white px-5 py-2 rounded-xl shadow-md">Join Us</Link>
        )}
      </div>
    </nav>
  );
}