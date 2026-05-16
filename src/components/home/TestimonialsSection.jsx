import SectionTitle from "../common/SectionTitle";
import { cardHover, fadeUp, staggerContainer } from "../common/motionConfig";
import { MotionDiv } from "../common/MotionPrimitives";

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
    <MotionDiv
      variants={fadeUp}
      whileHover={cardHover}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
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
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        "{text}"
      </p>
    </MotionDiv>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-slate-50 px-4 py-16 transition-colors duration-300 dark:bg-gray-950 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="What Our Tenants Say"
          subtitle="Real experiences from real people"
        />
        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} {...t} colorIndex={i} />
          ))}
        </MotionDiv>
      </div>
    </section>
  );
}
