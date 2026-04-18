import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 text-white overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-white/5 rounded-full" />
      <div className="absolute bottom-[-80px] left-[-40px] w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
          🏆 #1 Rated PG in Jaipur
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-5">
          Your Home Away <br />
          <span className="text-cyan-300">From Home 🏠</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
          Premium PG accommodation in Jaipur with all modern amenities.
          Comfortable, safe and affordable living for students & professionals.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link
            to="/rooms"
            className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold text-base hover:bg-blue-50 transition shadow-lg"
          >
            View Rooms & Pricing
          </Link>
          <Link
            to="/contact"
            className="bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-3 rounded-full font-bold text-base hover:bg-white/20 transition"
          >
            Book a Free Visit
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { value: "50+", label: "Happy Tenants" },
            { value: "4.9★", label: "Average Rating" },
            { value: "3+", label: "Years Running" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-sm text-white/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
