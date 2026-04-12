export default function GalleryCard({ emoji, title, category }) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer">
      <div className="h-48 bg-blue-50 dark:bg-gray-700 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300">
        {emoji}
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-800 dark:text-white text-sm">
          {title}
        </p>
        <span className="text-xs text-blue-600 dark:text-blue-400">
          {category}
        </span>
      </div>
    </div>
  );
}
