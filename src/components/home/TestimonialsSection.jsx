import SectionTitle from "../common/SectionTitle";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Engineering Student",
    text: "Best PG in Jaipur! Food is amazing and the WiFi never drops. Feels like home.",
    avatar: "👨‍🎓",
  },
  {
    name: "Priya Verma",
    role: "Working Professional",
    text: "Safe, clean and affordable. The staff is very helpful. Highly recommend!",
    avatar: "👩‍💼",
  },
  {
    name: "Amit Joshi",
    role: "MBA Student",
    text: "Great location and excellent facilities. The AC rooms are worth every penny.",
    avatar: "👨‍💼",
  },
];

function TestimonialCard({ name, role, text, avatar }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">"{text}"</p>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{avatar}</span>
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">{name}</p>
          <p className="text-gray-400 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="What Our Tenants Say"
          subtitle="Real experiences from real people"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
