import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "../common/motionConfig";
import { MotionDiv, MotionH2, MotionP } from "../common/MotionPrimitives";

export default function CTASection() {
  return (
    <section className="bg-[linear-gradient(135deg,#1d4ed8_0%,#0891b2_52%,#0f766e_100%)] px-4 py-16 transition-colors duration-300 dark:bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#134e4a_100%)] sm:px-6 sm:py-20">
      <MotionDiv
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-3xl text-center"
      >
        <MotionH2
          variants={fadeUp}
          className="mb-4 text-3xl font-extrabold text-white md:text-4xl"
        >
          Ready to Move In?
        </MotionH2>
        <MotionP
          variants={fadeUp}
          className="mb-8 text-base leading-7 text-white/75 sm:text-lg"
        >
          Contact us today and book a free visit to see the rooms in person.
        </MotionP>
        <MotionDiv
          variants={fadeUp}
          className="flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Book a Free Visit
          </Link>
          <Link
            to="/rooms"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View Pricing
          </Link>
        </MotionDiv>
      </MotionDiv>
    </section>
  );
}
