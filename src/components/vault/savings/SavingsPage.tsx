import { useState } from 'react'
import { useVault } from '../../../hooks/useVault.ts'
import { SavingsPotCard } from './SavingsPotCard.tsx'
import { SavingsPotForm } from './SavingsPotForm.tsx'
import type { SavingsPot } from '../../../types/vault.ts'

export function SavingsPage() {
  const { state, dispatch } = useVault()
  const [editing, setEditing] = useState<SavingsPot | null>(null)
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Savings Pots</h1>
        <button
          onClick={() => setAdding(true)}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-sm text-white font-medium"
        >
          + Add Pot
        </button>
      </div>

      {state.savingsPots.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          <p className="text-lg mb-1">No savings pots yet</p>
          <p className="text-sm">Create pots to track your savings towards goals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.savingsPots.map((pot) => (
            <SavingsPotCard
              key={pot.id}
              pot={pot}
              goals={state.goals}
              people={state.people}
              fxRates={state.meta.fxRates}
              onEdit={() => setEditing(pot)}
              onDelete={() => dispatch({ type: 'DELETE_POT', payload: pot.id })}
            />
          ))}
        </div>
      )}

      <SavingsPotForm
        open={adding}
        goals={state.goals}
        onClose={() => setAdding(false)}
        onSave={(p) => { dispatch({ type: 'ADD_POT', payload: p }); setAdding(false) }}
      />

      <SavingsPotForm
        open={!!editing}
        pot={editing ?? undefined}
        goals={state.goals}
        onClose={() => setEditing(null)}
        onSave={(p) => { dispatch({ type: 'UPDATE_POT', payload: p }); setEditing(null) }}
      />
    </div>
  )
}
