import SectionTitle from "../common/SectionTitle";

const features = [
  {
    icon: "📶",
    title: "High Speed WiFi",
    desc: "Uninterrupted internet for work and studies",
    color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
  },
  {
    icon: "🍽️",
    title: "Meals Included",
    desc: "Healthy home-cooked breakfast and dinner",
    color:
      "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
  },
  {
    icon: "❄️",
    title: "AC Rooms",
    desc: "Stay cool and comfortable all year round",
    color: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
  },
  {
    icon: "🔒",
    title: "CCTV Security",
    desc: "24/7 surveillance for your safety",
    color:
      "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
  },
  {
    icon: "🔋",
    title: "Power Backup",
    desc: "No interruptions even during power cuts",
    color:
      "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
  },
  {
    icon: "🚗",
    title: "Parking",
    desc: "Safe parking for bikes and cars",
    color:
      "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
  },
];

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition group border border-gray-100 dark:border-gray-700">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
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
