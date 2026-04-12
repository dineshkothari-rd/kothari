import SectionTitle from "../common/SectionTitle";

const features = [
  {
    icon: "📶",
    title: "High Speed WiFi",
    desc: "Uninterrupted internet for work and studies",
  },
  {
    icon: "🍽️",
    title: "Meals Included",
    desc: "Healthy home-cooked breakfast and dinner",
  },
  {
    icon: "❄️",
    title: "AC Rooms",
    desc: "Stay cool and comfortable all year round",
  },
  {
    icon: "🔒",
    title: "CCTV Security",
    desc: "24/7 surveillance for your safety",
  },
  {
    icon: "🔋",
    title: "Power Backup",
    desc: "No interruptions even during power cuts",
  },
  { icon: "🚗", title: "Parking", desc: "Safe parking for bikes and cars" },
];

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="Everything You Need"
          subtitle="We take care of everything so you can focus on what matters"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
