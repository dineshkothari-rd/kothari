import { MotionDiv, MotionH1, MotionP } from "./MotionPrimitives";
import { fadeUp, staggerContainer } from "./motionConfig";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="border-b border-slate-200/80 bg-white/70 text-slate-950 backdrop-blur dark:border-gray-800/80 dark:bg-gray-950/70 dark:text-white">
      <MotionDiv
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-56 w-full max-w-6xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:min-h-64"
      >
        {eyebrow && (
          <MotionP
            variants={fadeUp}
            className="mb-4 inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-semibold text-slate-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-slate-400"
          >
            {eyebrow}
          </MotionP>
        )}
        <MotionH1
          variants={fadeUp}
          className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl"
        >
          {title}
        </MotionH1>
        {subtitle && (
          <MotionP
            variants={fadeUp}
            className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg"
          >
            {subtitle}
          </MotionP>
        )}
      </MotionDiv>
    </header>
  );
}
