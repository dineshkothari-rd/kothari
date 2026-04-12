import { Link } from "react-router-dom";
import Button from "../common/Button";

export default function CTASection() {
  return (
    <section className="py-16 px-4 bg-blue-600 dark:bg-gray-900 text-white text-center transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Move In?</h2>
        <p className="text-blue-100 dark:text-gray-300 mb-8">
          Contact us today and book a free visit to see the rooms in person.
        </p>
        <Link to="/contact">
          <Button variant="white">Book a Free Visit</Button>
        </Link>
      </div>
    </section>
  );
}
