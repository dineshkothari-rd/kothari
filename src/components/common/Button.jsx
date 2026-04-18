export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const base =
    "px-6 py-2.5 rounded-full font-semibold transition duration-300 ";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400",
    white: "bg-white text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
