import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useVault } from '../../hooks/useVault.ts'
import type { Currency } from '../../types/vault.ts'

const links = [
  { to: '/', label: 'Dashboard', icon: '⬡', end: true },
  { to: '/finances', label: 'Finances', icon: '◈', end: false },
  { to: '/savings', label: 'Savings', icon: '◰', end: false },
  { to: '/goals', label: 'Goals', icon: '◎', end: false },
  { to: '/networth', label: 'Net Worth', icon: '◇', end: false },
]

const CURRENCIES: Currency[] = ['AED', 'GBP', 'USD']

function VaultHeader() {
  const { state, dispatch, saveStatus } = useVault()

  return (
    <header className="h-14 bg-stone-800/80 border-b border-stone-700 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <span className="text-base opacity-60">◆</span>
        <span className="font-semibold text-stone-100">Vault</span>
        {saveStatus === 'saving' && (
          <span className="flex items-center gap-1.5 text-xs text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Saving...
          </span>
        )}
        {saveStatus === 'saved' && (
          <span className="text-xs text-stone-500">Saved</span>
        )}
        {saveStatus === 'local-only' && (
          <span className="text-xs text-amber-400">Local only</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border border-stone-700">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => dispatch({ type: 'UPDATE_META', payload: { displayCurrency: c } })}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                state.meta.displayCurrency === c
                  ? 'bg-stone-600 text-stone-100'
                  : 'bg-stone-800 text-stone-500 hover:text-stone-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

function VaultSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation()

  const handleNav = () => {
    onClose()
  }

  return (
    <>
      {/* Mobile hamburger — hidden when sidebar is open */}
      {!open && (
        <button
          onClick={() => onClose()}
          className="lg:hidden fixed top-[calc(2.5rem+0.75rem)] left-3 z-50 bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-100"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>
      )}

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-56 bg-stone-800/50 border-r border-stone-700 p-4 shrink-0
        transform transition-transform duration-200 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="text-sm font-semibold text-stone-100">Navigation</span>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-100"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="space-y-1">
          {links.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNav}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-rose-600/20 text-rose-400'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-700/50'
                }`
              }
            >
              <span className="w-5 text-center text-base opacity-60 shrink-0">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  )
}

export function VaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <VaultHeader />
      <div className="flex flex-1 overflow-hidden">
        <VaultSidebar open={sidebarOpen} onClose={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
