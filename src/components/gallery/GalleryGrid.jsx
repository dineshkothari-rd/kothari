import GalleryCard from "./GalleryCard";

export default function GalleryGrid({ items }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-600">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-lg">No photos in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <GalleryCard key={item.id} {...item} />
      ))}
    </div>
  );
}
