export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
