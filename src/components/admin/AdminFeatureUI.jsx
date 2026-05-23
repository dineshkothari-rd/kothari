export function Panel({ title, subtitle, action, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white";

export function EmptyState({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-400 dark:border-gray-700 dark:bg-gray-950">
      {children}
    </div>
  );
}

export function StatusPill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-200",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    amber:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    red: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone] || tones.slate}`}
    >
      {children}
    </span>
  );
}

export function SimpleTable({ headers, rows, emptyText }) {
  if (!rows.length) return <EmptyState>{emptyText}</EmptyState>;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-950">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-left text-xs font-bold uppercase text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className="border-t border-slate-100 dark:border-gray-800"
              >
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row.key}-${index}`}
                    className="px-3 py-2.5 text-slate-600 dark:text-slate-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
