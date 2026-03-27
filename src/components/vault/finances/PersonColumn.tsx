import { formatCurrency, fromAED, toAED, type FxRates } from '../../../utils/currency.ts'
import { NumberInput } from '../../shared/NumberInput.tsx'
import { useVault } from '../../../hooks/useVault.ts'
import type { Person, MonthlyExpense, Currency } from '../../../types/vault.ts'

function useCurrencyInput() {
  const { state } = useVault()
  const dc = state.meta.displayCurrency
  const rates = state.meta.fxRates
  // display: AED stored → display currency for input
  const toDisplay = (aed: number) => fromAED(aed, dc, rates)
  // store: display currency input → AED for storage
  const toStore = (display: number) => toAED(display, dc, rates)
  return { dc, rates, toDisplay, toStore }
}

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
  const { toDisplay, toStore } = useCurrencyInput()

  return (
    <div className="space-y-3">
      <div>
        <label>Gross</label>
        <NumberInput
          value={toDisplay(person.monthlySalaryGross)}
          onChange={(v) => update({ monthlySalaryGross: toStore(v) })}
        />
      </div>
      <div>
        <label>Net</label>
        <NumberInput
          value={toDisplay(person.monthlySalaryNet)}
          onChange={(v) => update({ monthlySalaryNet: toStore(v) })}
        />
      </div>
    </div>
  )
}

export function PersonExpenses({ person, onChange, displayCurrency }: PersonColumnProps) {
  const update = (partial: Partial<Person>) => onChange({ ...person, ...partial })
  const { dc, toDisplay, toStore } = useCurrencyInput()

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
              value={toDisplay(expense.amount)}
              onChange={(v) => updateExpense(i, { ...expense, amount: toStore(v) })}
            />
            <button onClick={() => removeExpense(i)} className="text-stone-500 hover:text-rose-400 px-1">
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3">
        <button onClick={addExpense} className="text-sm text-amber-400 hover:text-amber-300">+ Add</button>
        <span className="text-sm text-stone-400 font-mono">{formatCurrency(toDisplay(total), dc)}</span>
      </div>
    </div>
  )
}

export function PersonVariableSpend({ person, onChange }: PersonColumnProps) {
  const update = (partial: Partial<Person>) => onChange({ ...person, ...partial })
  const { toDisplay, toStore } = useCurrencyInput()

  return (
    <NumberInput
      value={toDisplay(person.monthlyVariableSpend)}
      onChange={(v) => update({ monthlyVariableSpend: toStore(v) })}
    />
  )
}
