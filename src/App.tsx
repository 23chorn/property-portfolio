import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { VaultProvider } from './context/VaultContext.tsx'
import { AppShell } from './components/layout/AppShell.tsx'
import { VaultLayout } from './components/vault/VaultLayout.tsx'
import { DashboardPage } from './components/vault/dashboard/DashboardPage.tsx'
import { FinancesPage } from './components/vault/finances/FinancesPage.tsx'
import { SavingsPage } from './components/vault/savings/SavingsPage.tsx'
import { GoalsPage } from './components/vault/goals/GoalsPage.tsx'
import { NetWorthPage } from './components/vault/networth/NetWorthPage.tsx'
import PinEntry from './components/PinEntry.tsx'
import PropertyApp from './components/property/PropertyApp.tsx'

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('pp-auth') === '1')

  if (!authed) {
    return <PinEntry onSuccess={() => setAuthed(true)} />
  }

  return (
    <BrowserRouter>
      <VaultProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<VaultLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="finances" element={<FinancesPage />} />
              <Route path="savings" element={<SavingsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="networth" element={<NetWorthPage />} />
            </Route>
            <Route path="/property" element={<PropertyApp />} />
          </Route>
        </Routes>
      </VaultProvider>
    </BrowserRouter>
  )
}
