import { Card } from '../../shared/Card.tsx'
import { NumberInput } from '../../shared/NumberInput.tsx'
import { formatCurrency, fromAED, toAED } from '../../../utils/currency.ts'
import { calcFireNumber, calcYearsToFire } from '../../../utils/calculations.ts'
import { useVault } from '../../../hooks/useVault.ts'

export function FireCalculator() {
  const { state, dispatch } = useVault()
  const dc = state.meta.displayCurrency
  const rates = state.meta.fxRates
  const fire = state.fire
  const toDisplay = (aed: number) => fromAED(aed, dc, rates)
  const toStore = (display: number) => toAED(display, dc, rates)

  const set = (partial: Partial<typeof fire>) =>
    dispatch({ type: 'UPDATE_FIRE', payload: partial })

  const fireNumber = calcFireNumber(fire.annualExpenses)
  const years = calcYearsToFire(fire.currentInvestments, fire.monthlyContribution, fire.annualReturn, fireNumber)

  const projectedDate = years !== null
    ? new Date(Date.now() + years * 365.25 * 86400000).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : null

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">FIRE Calculator</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Annual Expenses ({dc})</label>
          <NumberInput value={toDisplay(fire.annualExpenses)} onChange={(v) => set({ annualExpenses: toStore(v) })} />
        </div>
        <div>
          <label>Current Investments ({dc})</label>
          <NumberInput value={toDisplay(fire.currentInvestments)} onChange={(v) => set({ currentInvestments: toStore(v) })} />
        </div>
        <div>
          <label>Monthly Contribution ({dc})</label>
          <NumberInput value={toDisplay(fire.monthlyContribution)} onChange={(v) => set({ monthlyContribution: toStore(v) })} />
        </div>
        <div>
          <label>Expected Annual Return (%)</label>
          <NumberInput value={fire.annualReturn} onChange={(v) => set({ annualReturn: v })} decimals={1} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-stone-700/50 rounded-lg p-4">
        <div>
          <div className="text-sm text-stone-400">FIRE Number</div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {formatCurrency(toDisplay(fireNumber), dc)}
          </div>
          <div className="text-xs text-stone-500">25x annual expenses</div>
        </div>
        <div>
          <div className="text-sm text-stone-400">Years to FIRE</div>
          <div className="text-lg font-bold">
            {years !== null ? `${years.toFixed(1)} years` : '—'}
          </div>
        </div>
        <div>
          <div className="text-sm text-stone-400">Projected Date</div>
          <div className="text-lg font-bold">
            {projectedDate || '—'}
          </div>
        </div>
      </div>
    </Card>
  )
}
