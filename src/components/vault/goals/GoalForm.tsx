import { useState, useEffect } from 'react'
import { Modal } from '../../shared/Modal.tsx'
import { generateId } from '../../../utils/id.ts'
import type { Goal, GoalCategory, Currency, SavingsPot } from '../../../types/vault.ts'

interface GoalFormProps {
  open: boolean
  goal?: Goal
  savingsPots: SavingsPot[]
  onClose: () => void
  onSave: (goal: Goal) => void
}

const CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: 'home_purchase', label: 'Home Purchase' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'big_purchase', label: 'Big Purchase' },
  { value: 'retirement_fire', label: 'Retirement / FIRE' },
]

export function GoalForm({ open, goal, savingsPots, onClose, onSave }: GoalFormProps) {
  const [form, setForm] = useState<Goal>({
    id: '',
    label: '',
    category: 'big_purchase',
    targetAmount: 0,
    currency: 'AED',
    targetDate: new Date().toISOString().slice(0, 10),
    linkedPotIds: [],
    notes: '',
  })

  useEffect(() => {
    if (goal) {
      setForm({ ...goal, targetDate: goal.targetDate.slice(0, 10) })
    } else {
      setForm({
        id: generateId(),
        label: '',
        category: 'big_purchase',
        targetAmount: 0,
        currency: 'AED',
        targetDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
        linkedPotIds: [],
        notes: '',
      })
    }
  }, [goal, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label.trim()) return
    onSave({ ...form, targetDate: new Date(form.targetDate).toISOString() })
  }

  const togglePot = (potId: string) => {
    setForm((f) => ({
      ...f,
      linkedPotIds: f.linkedPotIds.includes(potId)
        ? f.linkedPotIds.filter((id) => id !== potId)
        : [...f.linkedPotIds, potId],
    }))
  }

  return (
    <Modal open={open} onClose={onClose} title={goal ? 'Edit Goal' : 'Add Goal'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Label</label>
          <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="e.g. Buy a home together" autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as GoalCategory }))}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Currency</label>
            <select value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value as Currency }))}>
              <option value="AED">AED</option>
              <option value="GBP">GBP</option>
                <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Target Amount</label>
            <input type="number" value={form.targetAmount || ''} onChange={(e) => setForm((f) => ({ ...f, targetAmount: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div>
            <label>Target Date</label>
            <input type="date" value={form.targetDate} onChange={(e) => setForm((f) => ({ ...f, targetDate: e.target.value }))} />
          </div>
        </div>
        {savingsPots.length > 0 && (
          <div>
            <label>Linked Pots</label>
            <div className="space-y-2 mt-1">
              {savingsPots.map((pot) => (
                <label key={pot.id} className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.linkedPotIds.includes(pot.id)}
                    onChange={() => togglePot(pot.id)}
                    className="w-4 h-4 rounded"
                  />
                  {pot.label}
                </label>
              ))}
            </div>
          </div>
        )}
        <div>
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
            placeholder="Optional notes..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium">Save</button>
        </div>
      </form>
    </Modal>
  )
}
