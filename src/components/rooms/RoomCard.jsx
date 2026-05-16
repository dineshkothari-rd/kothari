import { Link } from "react-router-dom";
import { cardHover, fadeUp } from "../common/motionConfig";
import { MotionDiv } from "../common/MotionPrimitives";

export default function RoomCard({
  type,
  price,
  features,
  emoji,
  tag,
  popular,
}) {
  return (
    <MotionDiv
      variants={fadeUp}
      whileHover={cardHover}
      className={`flex h-full flex-col gap-4 rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:bg-gray-900 ${
        popular
          ? "border-2 border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
          : "border border-slate-200 shadow-sm hover:border-blue-200 dark:border-gray-800 dark:hover:border-blue-800"
      }`}
    >
      {tag && (
        <span
          className={`self-start text-xs font-bold px-3 py-1 rounded-full ${
            popular
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          {tag}
        </span>
      )}

      <div className="text-5xl">{emoji}</div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {type}
        </h3>
        <p className="mt-1 text-3xl font-extrabold text-blue-600 dark:text-blue-400">
          {price}
          <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
            /month
          </span>
        </p>
      </div>

      <ul className="flex-grow space-y-2">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className={`inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 py-3 text-center text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          popular
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 shadow-md"
            : "border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
      >
        Book Now
      </Link>
    </MotionDiv>
  );
}
