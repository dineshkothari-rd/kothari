import { MotionDiv } from "../common/MotionPrimitives";

const phoneNumber = "+919812416720";
const whatsappUrl =
  "https://wa.me/919812416720?text=Hi%20Kothari%20PG%2C%20I%20want%20to%20book%20a%20visit.";

export default function FloatingContact() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.35, ease: "easeOut" }}
      className="fixed bottom-4 left-4 right-4 z-30 flex justify-center sm:left-auto sm:right-5 sm:justify-end"
    >
      <div className="flex w-full max-w-sm gap-2 rounded-full border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 sm:w-auto">
        <a
          href={`tel:${phoneNumber}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:flex-none"
        >
          Call
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 sm:flex-none"
        >
          WhatsApp
        </a>
      </div>
    </MotionDiv>
  );
}
