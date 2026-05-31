export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) {
  const base =
    "inline-flex min-h-10 items-center justify-center rounded-xl px-5 py-2.5 text-center text-sm font-bold leading-none transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 dark:focus-visible:ring-offset-gray-950";

  const variants = {
    primary:
      "bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600",
    outline:
      "border border-slate-300 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-white",
    white: "bg-white text-slate-950 hover:bg-slate-100 dark:bg-white dark:text-slate-950",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
