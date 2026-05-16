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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-950 text-white">
        <img
          src="/images/pg-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="container-shell relative py-16 text-center sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-sm font-semibold mb-4">
            Room Options
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
      <section className="py-12 sm:py-16">
        <div className="container-shell">
          <RoomFilter active={active} onChange={setActive} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((room) => (
              <RoomCard key={room.type} {...room} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="container-shell pb-16">
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
