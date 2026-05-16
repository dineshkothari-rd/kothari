import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

function sortRecords(records, sortBy, direction) {
  if (!sortBy) return records;

  const multiplier = direction === "asc" ? 1 : -1;

  return [...records].sort((a, b) => {
    const first = a[sortBy]?.seconds ?? a[sortBy] ?? 0;
    const second = b[sortBy]?.seconds ?? b[sortBy] ?? 0;

    if (first === second) return 0;
    return first > second ? multiplier : -multiplier;
  });
}

export function useFirestoreCollection(collectionName, options = {}) {
  const { sortBy, direction = "desc" } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const records = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setData(sortRecords(records, sortBy, direction));
        setError(null);
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [collectionName, direction, sortBy]);

  return { data, loading, error };
}
