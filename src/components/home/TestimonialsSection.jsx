import SectionTitle from "../common/SectionTitle";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Engineering Student",
    text: "Best PG in Jaipur! Food is amazing and the WiFi never drops. Feels like home.",
    avatar: "RS",
  },
  {
    name: "Priya Verma",
    role: "Working Professional",
    text: "Safe, clean and affordable. The staff is very helpful. Highly recommend!",
    avatar: "PV",
  },
  {
    name: "Amit Joshi",
    role: "MBA Student",
    text: "Great location and excellent facilities. The AC rooms are worth every penny.",
    avatar: "AJ",
  },
];

const colors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-amber-500",
];

function TestimonialCard({ name, role, text, avatar, colorIndex }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {avatar}
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-white text-sm">
            {name}
          </p>
          <p className="text-gray-400 text-xs">{role}</p>
        </div>
        <div className="ml-auto text-yellow-400 text-sm">★★★★★</div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        "{text}"
      </p>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="What Our Tenants Say"
          subtitle="Real experiences from real people"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} {...t} colorIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
