import { useState } from 'react'
import { useVault } from '../../../hooks/useVault.ts'
import { GoalCard } from './GoalCard.tsx'
import { GoalForm } from './GoalForm.tsx'
import { FireCalculator } from './FireCalculator.tsx'
import type { Goal } from '../../../types/vault.ts'

const CATEGORY_LABELS: Record<string, string> = {
  home_purchase: 'Home Purchase',
  wedding: 'Wedding',
  emergency_fund: 'Emergency Fund',
  big_purchase: 'Big Purchase',
  retirement_fire: 'Retirement / FIRE',
}

export function GoalsPage() {
  const { state, dispatch } = useVault()
  const [editing, setEditing] = useState<Goal | null>(null)
  const [adding, setAdding] = useState(false)

  const grouped = state.goals.reduce<Record<string, Goal[]>>((acc, goal) => {
    const key = goal.category
    if (!acc[key]) acc[key] = []
    acc[key].push(goal)
    return acc
  }, {})

  const hasFireGoal = state.goals.some((g) => g.category === 'retirement_fire')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-mono">Goals</h1>
        <button
          onClick={() => setAdding(true)}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-sm text-white font-medium"
        >
          + Add Goal
        </button>
      </div>

      {state.goals.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          <p className="text-lg mb-1">No goals yet</p>
          <p className="text-sm">Set up goals to track your progress toward life milestones.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, goals]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-stone-300 mb-3">
              {CATEGORY_LABELS[category] || category}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  pots={state.savingsPots}
                  people={state.people}
                  fxRates={state.meta.fxRates}
                  onEdit={() => setEditing(goal)}
                  onDelete={() => dispatch({ type: 'DELETE_GOAL', payload: goal.id })}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {hasFireGoal && <FireCalculator />}

      <GoalForm
        open={adding}
        savingsPots={state.savingsPots}
        onClose={() => setAdding(false)}
        onSave={(g) => { dispatch({ type: 'ADD_GOAL', payload: g }); setAdding(false) }}
      />

      <GoalForm
        open={!!editing}
        goal={editing ?? undefined}
        savingsPots={state.savingsPots}
        onClose={() => setEditing(null)}
        onSave={(g) => { dispatch({ type: 'UPDATE_GOAL', payload: g }); setEditing(null) }}
      />
    </div>
  )
}
