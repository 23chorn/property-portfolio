import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const apps = [
  { path: '/', label: 'Vault', match: (p: string) => p === '/' || p.startsWith('/finances') || p.startsWith('/savings') || p.startsWith('/goals') || p.startsWith('/networth') },
  { path: '/property', label: 'Property Analyser', match: (p: string) => p.startsWith('/property') },
]

export function AppSwitcher({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const current = apps.find((a) => a.match(location.pathname)) ?? apps[0]

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-semibold text-stone-100 hover:text-white transition-colors"
      >
        <span>{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-stone-800 border border-stone-700 rounded-lg shadow-xl py-1 min-w-[180px] z-50">
          {apps.map((app) => (
            <button
              key={app.path}
              onClick={() => { navigate(app.path); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                app.label === current.label
                  ? 'text-rose-400 bg-rose-600/10'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-700/50'
              }`}
            >
              {app.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
