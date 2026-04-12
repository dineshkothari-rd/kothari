const details = [
  {
    icon: "📍",
    label: "Address",
    value: "Siwani mandi, Bhiwani, Haryana 127046",
  },
  { icon: "📞", label: "Phone", value: "+91 9812416720" },
  { icon: "✉️", label: "Email", value: "kotharipg@gmail.com" },
  { icon: "🕐", label: "Visit Hours", value: "Mon - Sat, 10am to 7pm" },
];

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm text-gray-400 mb-0.5">{label}</p>
        <p className="text-gray-800 dark:text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function ContactInfo() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Get In Touch
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Have questions? We'd love to hear from you. Book a free visit today!
        </p>
      </div>

      {details.map((d) => (
        <InfoCard key={d.label} {...d} />
      ))}

      {/* Google Map Embed */}
      <div className="rounded-xl overflow-hidden h-48">
        <iframe
          title="Kothari PG Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3492.8161278191487!2d75.61218137571744!3d28.903811571709497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3913b16e66f7743d%3A0xa1475210c4988afa!2sKothari%20PG%20Hotel!5e0!3m2!1sen!2sin!4v1775973986536!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
