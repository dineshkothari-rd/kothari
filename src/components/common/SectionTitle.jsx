export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-10 text-center sm:mb-12">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
