const categories = ["All", "Rooms", "Common Area", "Food", "Facilities"];

export default function GalleryFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 rounded-full font-medium transition ${
            active === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
