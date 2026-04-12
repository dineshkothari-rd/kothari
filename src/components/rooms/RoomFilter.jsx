const filters = ["All", "Single", "Double", "Triple"];

export default function RoomFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-5 py-2 rounded-full font-medium transition ${
            active === f
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
