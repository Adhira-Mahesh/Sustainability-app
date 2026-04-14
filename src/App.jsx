import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Import your pages (ensure these files exist in /src/pages)
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login"; // Logic similar to Signup
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
import HostDashboard from "./pages/HostDashboard";
import CreateEvent from "./pages/CreateEvent";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto py-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/event/:id" element={<EventDetails />} />

              {/* Attendee Protected Routes */}
              <Route path="/my-events" element={
                <PrivateRoute roleRequired="attendee">
                  <MyEvents />
                </PrivateRoute>
              } />

              {/* Host Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute roleRequired="host">
                  <HostDashboard />
                </PrivateRoute>
              } />
              <Route path="/create-event" element={
                <PrivateRoute roleRequired={["host", "admin"]}>
                  <CreateEvent />
                </PrivateRoute>
              } />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={
                <PrivateRoute roleRequired="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;