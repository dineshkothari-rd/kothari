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
      <div className="bg-blue-600 dark:bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Photo Gallery</h1>
        <p className="text-blue-100 dark:text-gray-300 text-lg">
          Take a look around your future home
        </p>
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
