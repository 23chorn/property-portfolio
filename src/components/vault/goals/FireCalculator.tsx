import { useState } from 'react'
import { Card } from '../../shared/Card.tsx'
import { NumberInput } from '../../shared/NumberInput.tsx'
import { formatCurrency } from '../../../utils/currency.ts'
import { calcFireNumber, calcYearsToFire } from '../../../utils/calculations.ts'
import { useVault } from '../../../hooks/useVault.ts'

export function FireCalculator() {
  const { state } = useVault()
  const dc = state.meta.displayCurrency
  const [annualExpenses, setAnnualExpenses] = useState(0)
  const [currentInvestments, setCurrentInvestments] = useState(0)
  const [monthlyContribution, setMonthlyContribution] = useState(0)
  const [annualReturn, setAnnualReturn] = useState(7)

  const fireNumber = calcFireNumber(annualExpenses)
  const years = calcYearsToFire(currentInvestments, monthlyContribution, annualReturn, fireNumber)

  const projectedDate = years !== null
    ? new Date(Date.now() + years * 365.25 * 86400000).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : null

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">FIRE Calculator</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Annual Expenses ({dc})</label>
          <NumberInput value={annualExpenses} onChange={setAnnualExpenses} />
        </div>
        <div>
          <label>Current Investments ({dc})</label>
          <NumberInput value={currentInvestments} onChange={setCurrentInvestments} />
        </div>
        <div>
          <label>Monthly Contribution ({dc})</label>
          <NumberInput value={monthlyContribution} onChange={setMonthlyContribution} />
        </div>
        <div>
          <label>Expected Annual Return (%)</label>
          <NumberInput value={annualReturn} onChange={setAnnualReturn} decimals={1} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-stone-700/50 rounded-lg p-4">
        <div>
          <div className="text-sm text-stone-400">FIRE Number</div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {formatCurrency(fireNumber, dc)}
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
