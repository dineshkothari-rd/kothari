import Button from "./Button";

export default function InfiniteListFooter({
  total,
  visible,
  hasMore,
  loadMore,
  sentinelRef,
}) {
  if (!total) return null;

  return (
    <div className="mt-4 flex flex-col items-center gap-3 text-center">
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
        Showing {visible} of {total}
      </p>
      {hasMore && (
        <>
          <div ref={sentinelRef} className="h-1 w-full" />
          <Button variant="outline" onClick={loadMore} className="min-w-36">
            Load more
          </Button>
        </>
      )}
    </div>
  );
}
