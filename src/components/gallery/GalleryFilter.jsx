const categories = ["All", "Rooms", "Common Area", "Food", "Facilities"];

export default function GalleryFilter({ active, onChange }) {
  return (
    <div className="mb-10 flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`min-h-10 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            active === cat
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-gray-900 dark:hover:text-white"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
