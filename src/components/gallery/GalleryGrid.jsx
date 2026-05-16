import GalleryCard from "./GalleryCard";

export default function GalleryGrid({ items }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-lg">No photos in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <GalleryCard key={item.id} {...item} />
      ))}
    </div>
  );
}
