import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const adminRef = doc(db, "admins", user.email);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          setIsAdmin(true);
          setAdminName(adminSnap.data().name || user.email);
        } else {
          setIsAdmin(false);
          setAdminName("");
        }
      } else {
        setIsAdmin(false);
        setAdminName("");
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, adminName }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
