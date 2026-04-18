export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
