const included = [
  { feature: "WiFi", single: true, double: true, triple: true },
  { feature: "Meals", single: true, double: true, triple: true },
  { feature: "AC", single: true, double: true, triple: false },
  { feature: "Attached Bathroom", single: true, double: false, triple: false },
  { feature: "Power Backup", single: true, double: true, triple: true },
  { feature: "Laundry", single: true, double: true, triple: false },
  { feature: "Parking", single: true, double: true, triple: true },
  { feature: "CCTV Security", single: true, double: true, triple: true },
];

function Cell({ value }) {
  return (
    <td className="text-center py-3.5 px-4">
      {value ? (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold">
          ✓
        </span>
      ) : (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-400 text-sm font-bold">
          ✗
        </span>
      )}
    </td>
  );
}

export default function PricingTable() {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <table className="w-full bg-white dark:bg-gray-800 text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
            <th className="text-left py-4 px-5 font-bold rounded-tl-2xl">
              Feature
            </th>
            <th className="text-center py-4 px-4 font-bold">Single</th>
            <th className="text-center py-4 px-4 font-bold">Double</th>
            <th className="text-center py-4 px-4 font-bold rounded-tr-2xl">
              Triple
            </th>
          </tr>
        </thead>
        <tbody>
          {included.map((row, i) => (
            <tr
              key={row.feature}
              className={`border-t border-gray-100 dark:border-gray-700 ${
                i % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-900"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <td className="py-3.5 px-5 text-gray-700 dark:text-gray-300 font-medium">
                {row.feature}
              </td>
              <Cell value={row.single} />
              <Cell value={row.double} />
              <Cell value={row.triple} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
