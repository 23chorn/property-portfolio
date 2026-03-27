import type { Currency } from '../../types/vault.ts'
import { formatCurrency, convertCurrency, type FxRates } from '../../utils/currency.ts'

interface CurrencyDisplayProps {
  amount: number
  currency: Currency
  fxRates: FxRates
  displayCurrency?: Currency
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CurrencyDisplay({ amount, currency, fxRates, displayCurrency, className = '', size = 'md' }: CurrencyDisplayProps) {
  const showIn = displayCurrency ?? currency
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
  }

  if (showIn === currency) {
    return (
      <div className={className}>
        <div className={`font-mono ${sizeClasses[size]}`}>{formatCurrency(amount, currency)}</div>
      </div>
    )
  }

  const converted = convertCurrency(amount, currency, showIn, fxRates)
  return (
    <div className={className}>
      <div className={`font-mono ${sizeClasses[size]}`}>{formatCurrency(converted, showIn)}</div>
      <div className="font-mono text-xs text-stone-500">{formatCurrency(amount, currency)}</div>
    </div>
  )
}
