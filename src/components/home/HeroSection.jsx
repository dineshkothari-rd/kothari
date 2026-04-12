import { Link } from "react-router-dom";
import Button from "../common/Button";

export default function HeroSection() {
  return (
    <section className="bg-blue-600 dark:bg-gray-900 text-white py-24 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Your Home Away <br /> From Home 🏠
        </h1>
        <p className="text-lg md:text-xl text-blue-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Premium PG accommodation in Jaipur with all modern amenities.
          Comfortable, safe and affordable living for students & professionals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/rooms">
            <Button variant="white">View Rooms & Pricing</Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Book a Visit
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
