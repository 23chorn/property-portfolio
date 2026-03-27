export default function SaveStatus({ status }) {
  const config = {
    saving: { text: 'Saving...', color: 'text-accent-amber', dot: 'bg-accent-amber' },
    saved: { text: 'Saved', color: 'text-accent-green', dot: 'bg-accent-green' },
    'local-only': { text: 'Saved locally', color: 'text-accent-amber', dot: 'bg-accent-amber' },
    error: { text: 'Save error', color: 'text-accent-red', dot: 'bg-accent-red' },
  }

  const { text, color, dot } = config[status] || config.saved

  return (
    <div className={`flex items-center gap-2 text-xs ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === 'saving' ? 'animate-pulse' : ''}`} />
      {text}
    </div>
  )
}
