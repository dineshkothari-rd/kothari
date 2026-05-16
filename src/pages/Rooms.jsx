import { useState } from "react";
import RoomCard from "../components/rooms/RoomCard";
import RoomFilter from "../components/rooms/RoomFilter";
import PricingTable from "../components/rooms/PricingTable";
import SectionTitle from "../components/common/SectionTitle";
import PageHeader from "../components/common/PageHeader";

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
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-gray-950">
      <PageHeader
        eyebrow="Room Options"
        title="Rooms & Pricing"
        subtitle="Choose a room that fits your routine, privacy needs, and budget."
      />

      {/* Room Cards */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <RoomFilter active={active} onChange={setActive} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((room) => (
              <RoomCard key={room.type} {...room} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
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
