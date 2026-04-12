import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";

const rooms = [
  {
    type: "Single Occupancy",
    price: "₹8,000/mo",
    features: ["Private room", "AC", "WiFi", "Meals"],
    emoji: "🛏️",
  },
  {
    type: "Double Sharing",
    price: "₹5,500/mo",
    features: ["Shared room", "AC", "WiFi", "Meals"],
    emoji: "🛏️🛏️",
  },
  {
    type: "Triple Sharing",
    price: "₹4,000/mo",
    features: ["Shared room", "Fan", "WiFi", "Meals"],
    emoji: "🏨",
  },
];

function RoomCard({ type, price, features, emoji }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
      <div className="text-4xl">{emoji}</div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {type}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mt-1">
          {price}
        </p>
      </div>
      <ul className="text-gray-500 dark:text-gray-400 text-sm space-y-1">
        {features.map((f) => (
          <li key={f}>✓ {f}</li>
        ))}
      </ul>
      <Link to="/rooms">
        <Button variant="outline" className="w-full text-center">
          View Details
        </Button>
      </Link>
    </div>
  );
}

export default function RoomsPreview() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
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
