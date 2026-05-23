import SectionTitle from "../common/SectionTitle";
import { cardHover, fadeUp, staggerContainer } from "../common/motionConfig";
import { MotionDiv } from "../common/MotionPrimitives";

const features = [
  {
    icon: "📶",
    title: "Unified Customers",
    desc: "Handle hotel guests, PG tenants and library members together",
    color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
  },
  {
    icon: "🍽️",
    title: "Flexible Charges",
    desc: "Track rent, stay charges and membership fees with balances",
    color:
      "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
  },
  {
    icon: "❄️",
    title: "Receipt Sharing",
    desc: "Download or share payment receipts directly from records",
    color: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
  },
  {
    icon: "🔒",
    title: "ID Records",
    desc: "Store customer details and ID proof in the same workflow",
    color:
      "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
  },
  {
    icon: "🔋",
    title: "Due Tracking",
    desc: "See paid, partial, pending and overdue amounts clearly",
    color:
      "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
  },
  {
    icon: "🚗",
    title: "Operational Tools",
    desc: "Manage notices, enquiries and meter readings when needed",
    color:
      "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
  },
];

function FeatureCard({ icon, title, desc, color }) {
  return (
    <MotionDiv
      variants={fadeUp}
      whileHover={cardHover}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-3xl transition-transform duration-300 group-hover:scale-105`}
      >
        {icon}
      </div>
      <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
        {desc}
      </p>
    </MotionDiv>
  );
}

export default function FeaturesSection() {
  return (
    <section className="bg-slate-50 px-4 py-16 transition-colors duration-300 dark:bg-gray-950 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="Everything You Need"
          subtitle="A clean dashboard for daily hospitality and workspace operations"
        />
        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </MotionDiv>
      </div>
    </section>
  );
}
