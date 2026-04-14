import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Authenticate with Firebase Auth
      const res = await signInWithEmailAndPassword(auth, form.email, form.password);
      console.log("Auth successful, UID:", res.user.uid);

      // 2. Fetch the Role from Firestore
      const userDoc = await getDoc(doc(db, "users", res.user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log("User role found:", role);
        
        // Redirect based on role
        if (role === "host") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        // This happens if the user exists in Auth but not in the 'users' collection
        console.error("No Firestore document found for this UID!");
        alert("Account error: User profile not found in database. Please sign up again.");
      }
    } catch (err) {
      console.error("Login Error:", err.code, err.message);
      alert("Login Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eco-bg flex items-center justify-center px-6">
      <div className="glass w-full max-w-md p-10 rounded-[40px] shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">🌿</div>
          <h2 className="text-3xl font-black text-gray-900">Welcome Back</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-white/50 p-4 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setForm({...form, email: e.target.value})}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-white/50 p-4 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setForm({...form, password: e.target.value})}
            required 
          />
          <button 
            disabled={loading}
            className="btn-eco w-full py-4 text-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          New here? <Link to="/signup" className="text-brand-dark font-black hover:underline transition">Create Account</Link>
        </p>
      </div>
    </div>
  );
}