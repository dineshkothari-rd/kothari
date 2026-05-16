import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "../common/motionConfig";
import { MotionDiv, MotionH1, MotionP } from "../common/MotionPrimitives";

const highlights = [
  { value: "50+", label: "Happy Tenants" },
  { value: "4.9", label: "Average Rating" },
  { value: "3+", label: "Years Running" },
];

export default function HeroSection() {
  return (
    <section className="bg-[linear-gradient(135deg,#1d4ed8_0%,#0891b2_48%,#0f766e_100%)] text-white dark:bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#134e4a_100%)]">
      <MotionDiv
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col justify-center px-4 py-16 text-center sm:px-6 lg:min-h-[680px]"
      >
        <MotionP
          variants={fadeUp}
          className="mx-auto mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90 shadow-sm backdrop-blur"
        >
          Rated PG accommodation in Jaipur
        </MotionP>

        <MotionH1
          variants={fadeUp}
          className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        >
          Comfortable PG living for students and professionals
        </MotionH1>

        <MotionP
          variants={fadeUp}
          className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg lg:text-xl"
        >
          Clean rooms, reliable facilities, home-style meals, and simple admin
          support in one dependable place.
        </MotionP>

        <MotionDiv
          variants={fadeUp}
          className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/rooms"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View Rooms & Pricing
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Book a Free Visit
          </Link>
        </MotionDiv>

        <MotionDiv
          variants={staggerContainer}
          className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 min-[460px]:grid-cols-3"
        >
          {highlights.map((stat) => (
            <MotionDiv
              key={stat.label}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-5 backdrop-blur"
            >
              <p className="text-3xl font-extrabold text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-white/65">{stat.label}</p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </MotionDiv>
    </section>
  );
}
