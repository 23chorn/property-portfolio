import { NavLink, Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="flex flex-col h-screen">
      <div className="h-10 bg-stone-900 border-b border-stone-800 flex items-center px-4 gap-1 shrink-0">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isActive
                ? 'bg-stone-700 text-stone-100'
                : 'text-stone-500 hover:text-stone-300'
            }`
          }
        >
          Vault
        </NavLink>
        <NavLink
          to="/property"
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isActive
                ? 'bg-stone-700 text-stone-100'
                : 'text-stone-500 hover:text-stone-300'
            }`
          }
        >
          Property Analyser
        </NavLink>
      </div>
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
