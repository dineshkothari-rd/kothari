import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";

const rooms = [
  {
    type: "Single Occupancy",
    price: "₹8,000",
    features: ["Private room", "AC", "WiFi", "Meals"],
    emoji: "🛏️",
    tag: "Most Popular",
    popular: true,
  },
  {
    type: "Double Sharing",
    price: "₹5,500",
    features: ["Shared room", "AC", "WiFi", "Meals"],
    emoji: "🛏️🛏️",
    tag: null,
    popular: false,
  },
  {
    type: "Triple Sharing",
    price: "₹4,000",
    features: ["Shared room", "Fan", "WiFi", "Meals"],
    emoji: "🏨",
    tag: "Best Value",
    popular: false,
  },
];

function RoomCard({ type, price, features, emoji, tag, popular }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl border-2 ${
        popular
          ? "border-blue-500 shadow-blue-100 dark:shadow-blue-900/20 shadow-lg"
          : "border-gray-100 dark:border-gray-700 shadow-sm"
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
          <span className="text-sm font-normal text-gray-400">/month</span>
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
        className={`w-full text-center py-2.5 rounded-full font-bold text-sm transition ${
          popular
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90"
            : "border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
      >
        Book Now
      </Link>
    </div>
  );
}

export default function RoomsPreview() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="Our Room Options"
          subtitle="Choose the plan that fits your budget and lifestyle"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <RoomCard key={r.type} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
