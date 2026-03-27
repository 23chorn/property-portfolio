import { useState, useEffect } from 'react'
import { NumberInput } from '../../shared/NumberInput.tsx'
import { Modal } from '../../shared/Modal.tsx'
import { generateId } from '../../../utils/id.ts'
import type { SavingsPot, Goal, Currency } from '../../../types/vault.ts'

interface SavingsPotFormProps {
  open: boolean
  pot?: SavingsPot
  goals: Goal[]
  onClose: () => void
  onSave: (pot: SavingsPot) => void
}

export function SavingsPotForm({ open, pot, goals, onClose, onSave }: SavingsPotFormProps) {
  const [form, setForm] = useState<SavingsPot>({
    id: '',
    label: '',
    currency: 'AED',
    currentBalance: 0,
    targetBalance: 0,
    linkedGoalId: null,
  })

  useEffect(() => {
    if (pot) {
      setForm(pot)
    } else {
      setForm({
        id: generateId(),
        label: '',
        currency: 'AED',
        currentBalance: 0,
        targetBalance: 0,
        linkedGoalId: null,
      })
    }
  }, [pot, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label.trim()) return
    onSave(form)
  }

  const set = (key: keyof SavingsPot, value: string | number | null) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <Modal open={open} onClose={onClose} title={pot ? 'Edit Savings Pot' : 'Add Savings Pot'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Label</label>
          <input value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="e.g. Wedding Fund" autoFocus />
        </div>
        <div>
          <label>Currency</label>
          <select value={form.currency} onChange={(e) => set('currency', e.target.value as Currency)}>
            <option value="AED">AED</option>
            <option value="GBP">GBP</option>
                <option value="USD">USD</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Current Balance</label>
            <NumberInput value={form.currentBalance} onChange={(v) => set('currentBalance', v)} />
          </div>
          <div>
            <label>Target Balance</label>
            <NumberInput value={form.targetBalance} onChange={(v) => set('targetBalance', v)} />
          </div>
        </div>
        <div>
          <label>Linked Goal (optional)</label>
          <select value={form.linkedGoalId || ''} onChange={(e) => set('linkedGoalId', e.target.value || null)}>
            <option value="">None</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium">Save</button>
        </div>
      </form>
    </Modal>
  )
}
