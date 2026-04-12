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
    <td className="text-center py-3 px-4">
      {value ? (
        <span className="text-green-500 font-bold text-lg">✓</span>
      ) : (
        <span className="text-red-400 font-bold text-lg">✗</span>
      )}
    </td>
  );
}

export default function PricingTable() {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-sm">
      <table className="w-full bg-white dark:bg-gray-800 text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="text-left py-4 px-4 font-semibold">Feature</th>
            <th className="text-center py-4 px-4 font-semibold">Single</th>
            <th className="text-center py-4 px-4 font-semibold">Double</th>
            <th className="text-center py-4 px-4 font-semibold">Triple</th>
          </tr>
        </thead>
        <tbody>
          {included.map((row, i) => (
            <tr
              key={row.feature}
              className={
                i % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-900"
                  : "bg-white dark:bg-gray-800"
              }
            >
              <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">
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
