import { Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="flex flex-col h-screen">
      <Outlet />
    </div>
  )
}
