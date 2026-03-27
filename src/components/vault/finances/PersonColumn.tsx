import { formatCurrency } from '../../../utils/currency.ts'
import { NumberInput } from '../../shared/NumberInput.tsx'
import type { Person, MonthlyExpense, Currency } from '../../../types/vault.ts'

interface PersonColumnProps {
  person: Person
  onChange: (person: Person) => void
  displayCurrency?: Currency
}

export function PersonHeader({ person, onChange }: PersonColumnProps) {
  const update = (partial: Partial<Person>) => onChange({ ...person, ...partial })

  return (
    <div>
      <label>Name</label>
      <input value={person.name} onChange={(e) => update({ name: e.target.value })} />
    </div>
  )
}

export function PersonIncome({ person, onChange }: PersonColumnProps) {
  const update = (partial: Partial<Person>) => onChange({ ...person, ...partial })

  return (
    <div className="space-y-3">
      <div>
        <label>Gross</label>
        <NumberInput
          value={person.monthlySalaryGross}
          onChange={(v) => update({ monthlySalaryGross: v })}
        />
      </div>
      <div>
        <label>Net</label>
        <NumberInput
          value={person.monthlySalaryNet}
          onChange={(v) => update({ monthlySalaryNet: v })}
        />
      </div>
    </div>
  )
}

export function PersonExpenses({ person, onChange, displayCurrency }: PersonColumnProps) {
  const update = (partial: Partial<Person>) => onChange({ ...person, ...partial })

  const updateExpense = (index: number, expense: MonthlyExpense) => {
    const updated = [...person.monthlyFixedExpenses]
    updated[index] = expense
    update({ monthlyFixedExpenses: updated })
  }

  const addExpense = () => {
    update({ monthlyFixedExpenses: [...person.monthlyFixedExpenses, { label: '', amount: 0 }] })
  }

  const removeExpense = (index: number) => {
    update({ monthlyFixedExpenses: person.monthlyFixedExpenses.filter((_, i) => i !== index) })
  }

  const total = person.monthlyFixedExpenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div>
      <div className="space-y-2">
        {person.monthlyFixedExpenses.map((expense, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="flex-1"
              value={expense.label}
              onChange={(e) => updateExpense(i, { ...expense, label: e.target.value })}
              placeholder="e.g. Rent"
            />
            <NumberInput
              className="w-24"
              value={expense.amount}
              onChange={(v) => updateExpense(i, { ...expense, amount: v })}
            />
            <button onClick={() => removeExpense(i)} className="text-stone-500 hover:text-rose-400 px-1">
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3">
        <button onClick={addExpense} className="text-sm text-amber-400 hover:text-amber-300">+ Add</button>
        <span className="text-sm text-stone-400 font-mono">{formatCurrency(total, displayCurrency)}</span>
      </div>
    </div>
  )
}

export function PersonVariableSpend({ person, onChange }: PersonColumnProps) {
  const update = (partial: Partial<Person>) => onChange({ ...person, ...partial })

  return (
    <NumberInput
      value={person.monthlyVariableSpend}
      onChange={(v) => update({ monthlyVariableSpend: v })}
    />
  )
}
