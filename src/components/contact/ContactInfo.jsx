import { fadeUp, staggerContainer } from "../common/motionConfig";
import { MotionDiv } from "../common/MotionPrimitives";

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
    <MotionDiv
      variants={fadeUp}
      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-800"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">
          {label}
        </p>
        <p className="text-gray-800 dark:text-white font-semibold text-sm">
          {value}
        </p>
      </div>
    </MotionDiv>
  );
}

export default function ContactInfo() {
  return (
    <MotionDiv
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">
          Get In Touch 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Have questions? We'd love to hear from you!
        </p>
      </div>

      {details.map((d) => (
        <InfoCard key={d.label} {...d} />
      ))}

      <MotionDiv
        variants={fadeUp}
        className="h-56 overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-800"
      >
        <iframe
          title="Kothari PG Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3492.8161278191487!2d75.61218137571744!3d28.903811571709497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3913b16e66f7743d%3A0xa1475210c4988afa!2sKothari%20PG%20Hotel!5e0!3m2!1sen!2sin!4v1775973986536!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </MotionDiv>
    </MotionDiv>
  );
}
