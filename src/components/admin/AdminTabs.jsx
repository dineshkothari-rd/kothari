const tabs = [
  { id: "overview", label: "Overview" },
  { id: "tenants", label: "Tenants" },
  { id: "payments", label: "Payments" },
  { id: "notices", label: "Notices" },
];

export default function AdminTabs({ active, onChange }) {
  return (
    <div className="surface flex gap-2 overflow-x-auto p-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-bold transition ${
            active === tab.id
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
