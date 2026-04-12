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
      <div className="bg-blue-600 dark:bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Rooms & Pricing</h1>
        <p className="text-blue-100 dark:text-gray-300 text-lg">
          Choose what fits your needs and budget
        </p>
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
