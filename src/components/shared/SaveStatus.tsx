export default function SaveStatus({ status }) {
  const config = {
    saving: { text: 'Saving...', color: 'text-amber-400', dot: 'bg-amber-500' },
    saved: { text: 'Saved', color: 'text-emerald-400', dot: 'bg-emerald-500' },
    'local-only': { text: 'Saved locally', color: 'text-amber-400', dot: 'bg-amber-500' },
    error: { text: 'Save error', color: 'text-rose-400', dot: 'bg-rose-600' },
  }

  const { text, color, dot } = config[status] || config.saved

  return (
    <div className={`flex items-center gap-2 text-xs ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === 'saving' ? 'animate-pulse' : ''}`} />
      {text}
    </div>
  )
}
