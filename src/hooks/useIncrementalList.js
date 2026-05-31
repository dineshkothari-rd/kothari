import { useEffect, useMemo, useRef, useState } from "react";

export function useIncrementalList(items = [], batchSize = 12) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= items.length) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + batchSize, items.length));
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [batchSize, items.length, visibleCount]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  return {
    visibleItems,
    sentinelRef,
    visibleCount: visibleItems.length,
    hasMore: visibleItems.length < items.length,
    loadMore: () =>
      setVisibleCount((count) => Math.min(count + batchSize, items.length)),
  };
}
