const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '⬡' },
  { id: 'config', label: 'Configuration', icon: '⚙' },
  { id: 'costs', label: 'Cost Breakdown', icon: '◈' },
  { id: 'mortgage', label: 'Mortgage Model', icon: '◰' },
  { id: 'rates', label: 'Rate Sensitivity', icon: '◎' },
  { id: 'projections', label: '20-Year Projection', icon: '◇' },
  { id: 'sellvshold', label: 'Sell vs Hold', icon: '⇄' },
]

export default function Sidebar({ activeSection, onNavigate, propertyName }) {
  return (
    <aside className="w-60 min-h-screen bg-bg-surface border-r border-border flex flex-col shrink-0">
      <div className="p-5 border-b border-border">
        <h1 className="text-sm font-semibold text-text-primary tracking-wide uppercase">
          Property Portfolio
        </h1>
        <p className="text-xs text-text-muted mt-1">Analyser</p>
      </div>

      {/* Property selector */}
      <div className="p-4 border-b border-border">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Properties</p>
        <div className="bg-bg-elevated rounded-lg p-3 border border-accent-blue/30">
          <p className="text-sm text-text-primary font-medium truncate">{propertyName}</p>
        </div>
        <button
          disabled
          className="mt-2 w-full text-xs text-text-muted border border-border rounded-lg py-2 cursor-not-allowed opacity-50"
          title="Multiple properties — coming soon"
        >
          + Add Property
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
              activeSection === item.id
                ? 'bg-accent-blue/10 text-accent-blue'
                : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
            }`}
          >
            <span className="text-base opacity-60">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
