const filters = ["All", "Single", "Double", "Triple"];

export default function RoomFilter({ active, onChange }) {
  return (
    <div className="mb-10 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`min-h-10 whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            active === f
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
