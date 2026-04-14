import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [isHost, setIsHost] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const role = isHost ? "host" : "attendee";
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: form.name,
        email: form.email,
        role: role,
        phone: isHost ? form.phone : null
      });
      navigate(isHost ? "/dashboard" : "/");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="eco-bg flex items-center justify-center px-6">
    <div className="glass w-full max-w-md p-10 rounded-[40px] shadow-2xl">
      <h2 className="text-3xl font-black text-center text-brand-dark mb-6">
        {isHost ? "Host Registration" : "Join the Movement"}
      </h2>
      
      <form onSubmit={handleSignup} className="space-y-4">
        <input type="text" placeholder={isHost ? "Organization Name" : "Full Name"} className="w-full p-3 border rounded-xl" onChange={(e) => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" onChange={(e) => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl" onChange={(e) => setForm({...form, password: e.target.value})} required />
        <button className="btn-primary w-full btn-eco w-full py-4 text-lg disabled:opacity-50">Create Account</button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-500">Already have an account? 
          <Link to="/login" className="text-brand-primary font-bold ml-1 hover:underline">Login here</Link>
        </p>
        <button onClick={() => setIsHost(!isHost)} className="mt-4 text-xs text-dark-400 underline">
          Register as a {isHost ? "User" : "Host"} instead
        </button>
      </div>
    </div>
    </div>
  );
}