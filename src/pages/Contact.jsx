import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import PageHeader from "../components/common/PageHeader";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-gray-950">
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="Book a visit, ask a question, or check room availability."
      />

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-8">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </div>
  );
}
