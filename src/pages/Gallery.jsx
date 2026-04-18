import { useState } from "react";
import GalleryFilter from "../components/gallery/GalleryFilter";
import GalleryGrid from "../components/gallery/GalleryGrid";

const galleryItems = [
  { id: 1, emoji: "🛏️", title: "Single Occupancy Room", category: "Rooms" },
  { id: 2, emoji: "🛏️🛏️", title: "Double Sharing Room", category: "Rooms" },
  { id: 3, emoji: "🏨", title: "Triple Sharing Room", category: "Rooms" },
  { id: 4, emoji: "🪑", title: "Common Sitting Area", category: "Common Area" },
  { id: 5, emoji: "📚", title: "Study Room", category: "Common Area" },
  { id: 6, emoji: "🍽️", title: "Dining Hall", category: "Common Area" },
  { id: 7, emoji: "🥗", title: "Healthy Breakfast", category: "Food" },
  { id: 8, emoji: "🍛", title: "Home Cooked Dinner", category: "Food" },
  { id: 9, emoji: "🥘", title: "Special Weekend Meal", category: "Food" },
  { id: 10, emoji: "📶", title: "WiFi Setup", category: "Facilities" },
  { id: 11, emoji: "🔒", title: "CCTV Security", category: "Facilities" },
  { id: 12, emoji: "🚗", title: "Parking Area", category: "Facilities" },
];

export default function Gallery() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === active);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-50px] left-[-30px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            🖼️ Photo Gallery
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Photo Gallery
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Take a look around your future home
          </p>
        </div>
      </div>

      {/* Gallery */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GalleryFilter active={active} onChange={setActive} />
          <GalleryGrid items={filtered} />
        </div>
      </section>
    </div>
  );
}
