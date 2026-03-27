import SectionHeader from '../shared/SectionHeader'
import { formatCurrency, formatPercent } from '../../utils/format'
import { calcMonthlyMortgage, calcAnnualCosts, calcSection24Tax } from '../../utils/finance'

export default function TaxAnalysis({ property }) {
  const { mortgage, tax } = property
  const monthlyMortgage = calcMonthlyMortgage(property)
  const { annualRent, totalCosts } = calcAnnualCosts(property)
  const mortgageInterest = mortgage.type === 'interest-only'
    ? monthlyMortgage * 12
    : mortgage.balance * (mortgage.currentRate / 100)

  const s24 = calcSection24Tax(annualRent, totalCosts, mortgageInterest, tax.taxRate, tax.personalAllowance, tax.claimsPersonalAllowance)

  return (
    <div className="space-y-6">
      <SectionHeader title="Tax Analysis" subtitle="Section 24 and NRLS implications" />

      <div className="bg-bg-surface border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Section 24 Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-muted">Taxable Profit</p>
            <p className="text-lg font-mono text-text-primary">{formatCurrency(s24.taxableProfit)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Gross Tax ({formatPercent(tax.taxRate, 0)})</p>
            <p className="text-lg font-mono text-accent-red">{formatCurrency(s24.grossTax)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Mortgage Interest Tax Credit</p>
            <p className="text-lg font-mono text-accent-green">{formatCurrency(s24.taxCredit)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Net Tax Payable</p>
            <p className="text-lg font-mono text-accent-red">{formatCurrency(s24.netTax)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
