import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
