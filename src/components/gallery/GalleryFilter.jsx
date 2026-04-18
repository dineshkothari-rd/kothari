const categories = ["All", "Rooms", "Common Area", "Food", "Facilities"];

export default function GalleryFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-200 ${
            active === cat
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
