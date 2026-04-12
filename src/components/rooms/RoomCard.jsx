import Button from "../common/Button";
import { Link } from "react-router-dom";

export default function RoomCard({ type, price, features, emoji, tag }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition p-6 flex flex-col gap-4 relative">
      {tag && (
        <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          {tag}
        </span>
      )}

      <div className="text-5xl">{emoji}</div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {type}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl mt-1">
          {price}
          <span className="text-sm font-normal text-gray-400">/month</span>
        </p>
      </div>

      <ul className="space-y-2 flex-grow">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm"
          >
            <span className="text-green-500 font-bold">✓</span> {f}
          </li>
        ))}
      </ul>

      <Link to="/contact">
        <Button variant="primary" className="w-full text-center">
          Book Now
        </Button>
      </Link>
    </div>
  );
}
