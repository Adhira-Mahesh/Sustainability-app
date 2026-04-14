import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roleRequired }) {
  const { user, userData } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (roleRequired) {
    const roles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
    if (!roles.includes(userData?.role)) {
      return <Navigate to="/" />;
    }
  }

  return children;
}