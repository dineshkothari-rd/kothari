import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useTenantData(userId) {
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchTenant() {
      try {
        const ref = doc(db, "tenants", userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setTenantData(snap.data());
        }
      } catch (err) {
        console.error("Error fetching tenant:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTenant();
  }, [userId]);

  return { tenantData, loading };
}
