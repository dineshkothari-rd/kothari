import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";

export default function Contact() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-50px] left-[-30px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            📬 Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Contact Us
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            We're here to help. Reach out anytime!
          </p>
        </div>
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
