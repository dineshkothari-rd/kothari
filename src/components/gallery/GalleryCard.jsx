export default function GalleryCard({ emoji, title, category }) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800">
      <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#dbeafe_0,#f8fafc_38%,#ccfbf1_100%)] text-6xl transition-transform duration-300 group-hover:scale-[1.02] dark:bg-[radial-gradient(circle_at_30%_20%,#1e3a8a_0,#111827_45%,#134e4a_100%)]">
        <span aria-hidden="true">{emoji}</span>
      </div>
      <div className="p-4">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </p>
        <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {category}
        </span>
      </div>
    </article>
  );
}
