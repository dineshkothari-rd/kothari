import { useState } from "react";
import GalleryFilter from "../components/gallery/GalleryFilter";
import GalleryGrid from "../components/gallery/GalleryGrid";
import PageHeader from "../components/common/PageHeader";

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
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-gray-950">
      <PageHeader
        eyebrow="Photo Gallery"
        title="Take a Look Around"
        subtitle="Browse rooms, common spaces, food, and facilities before you visit."
      />

      {/* Gallery */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <GalleryFilter active={active} onChange={setActive} />
          <GalleryGrid items={filtered} />
        </div>
      </section>
    </div>
  );
}
