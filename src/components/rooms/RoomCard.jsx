import { Link } from "react-router-dom";

export default function RoomCard({
  type,
  price,
  features,
  emoji,
  tag,
  popular,
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl border-2 ${
        popular
          ? "border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
          : "border-gray-100 dark:border-gray-700 shadow-sm hover:border-blue-200"
      }`}
    >
      {tag && (
        <span
          className={`self-start text-xs font-bold px-3 py-1 rounded-full ${
            popular
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          {tag}
        </span>
      )}

      <div className="text-5xl">{emoji}</div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {type}
        </h3>
        <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
          {price}
          <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
            /month
          </span>
        </p>
      </div>

      <ul className="space-y-2 flex-grow">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm"
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className={`w-full text-center py-3 rounded-full font-bold text-sm transition-all duration-200 ${
          popular
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 shadow-md"
            : "border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
      >
        Book Now
      </Link>
    </div>
  );
}
