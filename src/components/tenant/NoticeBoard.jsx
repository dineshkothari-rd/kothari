const notices = [
  {
    id: 1,
    title: "Water Supply Interruption",
    date: "10 Apr 2025",
    message:
      "Water supply will be interrupted on 12 Apr from 10am to 2pm due to maintenance.",
    type: "warning",
  },
  {
    id: 2,
    title: "WiFi Upgrade Complete",
    date: "05 Apr 2025",
    message:
      "We have upgraded our internet connection to 200 Mbps. Enjoy faster speeds!",
    type: "success",
  },
  {
    id: 3,
    title: "Rent Reminder",
    date: "01 Apr 2025",
    message:
      "Monthly rent is due on 1st of every month. Please pay on time to avoid late fees.",
    type: "info",
  },
];

const typeStyles = {
  warning: "border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10",
  success: "border-l-4 border-green-400 bg-green-50 dark:bg-green-900/10",
  info: "border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/10",
};

const typeIcons = {
  warning: "⚠️",
  success: "✅",
  info: "ℹ️",
};

function NoticeCard({ title, date, message, type }) {
  return (
    <div className={`rounded-xl p-4 ${typeStyles[type]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{typeIcons[type]}</span>
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
          {title}
        </h3>
        <span className="ml-auto text-xs text-gray-400">{date}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{message}</p>
    </div>
  );
}

export default function NoticeBoard() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        📋 Notice Board
      </h2>
      <div className="flex flex-col gap-4">
        {notices.map((n) => (
          <NoticeCard key={n.id} {...n} />
        ))}
      </div>
    </div>
  );
}
