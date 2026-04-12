import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ADMIN_EMAIL = "dineshkothari2021@gmail.com";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.email !== ADMIN_EMAIL) {
    return <Navigate to="/tenant" replace />;
  }

  return children;
}
