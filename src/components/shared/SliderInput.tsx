export default function SliderInput({ label, value, onChange, min = 0, max = 100, step = 1, prefix = '', suffix = '', decimals = 0 }) {
  const displayValue = typeof value === 'number' ? value : 0
  const percent = max !== min ? ((displayValue - min) / (max - min)) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-stone-400">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-stone-500">{prefix}</span>}
          <input
            type="number"
            value={displayValue}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            step={step}
            min={min}
            max={max}
            className="w-20 bg-stone-700 border border-stone-700 rounded px-2 py-1 text-right text-sm text-stone-100 font-mono focus:outline-none focus:border-rose-500"
          />
          {suffix && <span className="text-sm text-stone-500">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        value={displayValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        style={{
          background: `linear-gradient(to right, #f43f5e ${percent}%, #44403c ${percent}%)`,
        }}
      />
    </div>
  )
}
