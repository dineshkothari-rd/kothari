export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="border-b border-white/10 bg-[linear-gradient(135deg,#1d4ed8_0%,#0891b2_52%,#0f766e_100%)] text-white dark:bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#134e4a_100%)]">
      <div className="mx-auto flex min-h-64 w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:min-h-72">
        {eyebrow && (
          <p className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90 shadow-sm backdrop-blur">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
