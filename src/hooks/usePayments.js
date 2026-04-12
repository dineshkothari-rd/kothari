import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export function usePayments(userId) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "payments"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { payments, loading };
}
