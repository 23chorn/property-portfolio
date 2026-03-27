export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-stone-100">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-stone-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
