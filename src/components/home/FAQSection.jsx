import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import { fadeUp, staggerContainer } from "../common/motionConfig";
import { MotionDiv, MotionP } from "../common/MotionPrimitives";

const faqs = [
  {
    question: "Are meals included in the rent?",
    answer:
      "Yes. Breakfast and dinner are included with all room types, with home-style food served daily.",
  },
  {
    question: "Can I visit before booking?",
    answer:
      "Yes. You can book a free visit from the contact page and we will call you to confirm a convenient time.",
  },
  {
    question: "Is WiFi available for students and working professionals?",
    answer:
      "Yes. High-speed WiFi is included so residents can attend classes, work calls, and study comfortably.",
  },
  {
    question: "How are payments tracked?",
    answer:
      "The admin dashboard keeps tenant, rent, balance, and payment status records organized in one place.",
  },
];

export default function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState(faqs[0].question);

  return (
    <section className="bg-white px-4 py-16 transition-colors duration-300 dark:bg-gray-900 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <SectionTitle
          title="Common Questions"
          subtitle="Quick answers before you schedule a visit"
        />
        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq) => {
            const isOpen = openQuestion === faq.question;

            return (
              <MotionDiv
                key={faq.question}
                variants={fadeUp}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenQuestion(isOpen ? "" : faq.question)
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white sm:text-base"
                >
                  {faq.question}
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg text-blue-600 dark:bg-gray-800">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <MotionP
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden px-5 pb-5 text-sm leading-6 text-slate-600 dark:text-slate-300"
                    >
                      {faq.answer}
                    </MotionP>
                  )}
                </AnimatePresence>
              </MotionDiv>
            );
          })}
        </MotionDiv>
      </div>
    </section>
  );
}
