export default function MetricCard({ label, value, subValue, positive, className = '' }) {
  const colorClass = positive === true
    ? 'text-emerald-400'
    : positive === false
      ? 'text-rose-400'
      : 'text-stone-100'

  return (
    <div className={`bg-stone-800 border border-stone-700 rounded-xl p-3 sm:p-5 ${className}`}>
      <p className="text-xs text-stone-500 uppercase tracking-wider mb-1 sm:mb-2">{label}</p>
      <p className={`text-lg sm:text-2xl font-mono font-medium ${colorClass}`}>{value}</p>
      {subValue && (
        <p className="text-xs text-stone-400 mt-1">{subValue}</p>
      )}
    </div>
  )
}
