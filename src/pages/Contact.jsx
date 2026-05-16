import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";

export default function Contact() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="relative overflow-hidden bg-slate-950 text-white">
        <img
          src="/images/pg-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="container-shell relative py-16 text-center sm:py-20">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            Get In Touch
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
      <section className="py-12 sm:py-16">
        <div className="container-shell grid grid-cols-1 gap-8 md:grid-cols-2">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </div>
  );
}
