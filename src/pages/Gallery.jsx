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
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            Photo Gallery
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
      <section className="py-12 sm:py-16">
        <div className="container-shell">
          <GalleryFilter active={active} onChange={setActive} />
          <GalleryGrid items={filtered} />
        </div>
      </section>
    </div>
  );
}
