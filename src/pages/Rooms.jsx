import { useState } from "react";
import RoomCard from "../components/rooms/RoomCard";
import RoomFilter from "../components/rooms/RoomFilter";
import PricingTable from "../components/rooms/PricingTable";
import SectionTitle from "../components/common/SectionTitle";

const rooms = [
  {
    type: "Single Occupancy",
    category: "Single",
    price: "₹8,000",
    emoji: "🛏️",
    tag: "Most Popular",
    popular: true,
    features: [
      "Private room",
      "AC",
      "Attached bathroom",
      "WiFi",
      "Meals included",
      "Laundry",
      "Power backup",
    ],
  },
  {
    type: "Double Sharing",
    category: "Double",
    price: "₹5,500",
    emoji: "🛏️🛏️",
    tag: null,
    popular: false,
    features: [
      "Shared room (2 people)",
      "AC",
      "Common bathroom",
      "WiFi",
      "Meals included",
      "Power backup",
    ],
  },
  {
    type: "Triple Sharing",
    category: "Triple",
    price: "₹4,000",
    emoji: "🏨",
    tag: "Best Value",
    popular: false,
    features: [
      "Shared room (3 people)",
      "Fan",
      "Common bathroom",
      "WiFi",
      "Meals included",
      "Power backup",
    ],
  },
];

export default function Rooms() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? rooms : rooms.filter((r) => r.category === active);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-50px] left-[-30px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            🛏️ Room Options
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Rooms & Pricing
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Choose what fits your needs and budget
          </p>
        </div>
      </div>

      {/* Room Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <RoomFilter active={active} onChange={setActive} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((room) => (
              <RoomCard key={room.type} {...room} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle
            title="What's Included"
            subtitle="Full comparison of all room types"
          />
          <PricingTable />
        </div>
      </section>
    </div>
  );
}
