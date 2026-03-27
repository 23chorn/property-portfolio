interface ProgressBarProps {
  current: number
  target: number
  color?: string
}

export function ProgressBar({ current, target, color = 'bg-rose-500' }: ProgressBarProps) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0

  return (
    <div className="w-full bg-stone-700 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
