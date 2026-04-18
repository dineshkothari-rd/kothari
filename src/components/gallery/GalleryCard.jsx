export default function GalleryCard({ emoji, title, category }) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer">
      <div className="h-44 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
        {emoji}
      </div>
      <div className="p-4">
        <p className="font-bold text-gray-800 dark:text-white text-sm">
          {title}
        </p>
        <span className="inline-block mt-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-0.5 rounded-full">
          {category}
        </span>
      </div>
    </div>
  );
}
