import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";

export default function Contact() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="bg-blue-600 dark:bg-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-blue-100 dark:text-gray-300 text-lg">
          We're here to help. Reach out anytime!
        </p>
      </div>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </div>
  );
}
