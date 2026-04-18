import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to Move In? 🏠
        </h2>
        <p className="text-white/75 text-lg mb-8">
          Contact us today and book a free visit to see the rooms in person.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition shadow-lg"
          >
            Book a Free Visit
          </Link>
          <Link
            to="/rooms"
            className="bg-white/10 border-2 border-white/40 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
