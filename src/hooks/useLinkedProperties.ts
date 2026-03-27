import { useState, useEffect } from 'react'
import type { Property } from '../types/vault.ts'
import { loadProperties } from '../utils/kv.ts'
import { calcAnnualCosts, calcMonthlyMortgage } from '../utils/finance.ts'

/**
 * Reads properties from the property analyser store and maps them
 * to the vault Property shape. Vault never duplicates property data —
 * it always derives from the analyser's source of truth.
 */
export function useLinkedProperties(): { properties: Property[]; loading: boolean } {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties().then((data) => {
      if (data && Array.isArray(data)) {
        const mapped: Property[] = data.map((p: any) => {
          const annualCosts = calcAnnualCosts(p)
          const monthlyMortgage = calcMonthlyMortgage(p)

          return {
            id: p.id,
            label: p.meta.name,
            currency: 'GBP' as const,
            currentValue: p.meta.currentEstimatedValue,
            mortgageOutstanding: p.mortgage.balance,
            monthlyRentalIncome: p.rental.monthlyRent,
            monthlyMortgagePayment: monthlyMortgage,
            annualMaintenanceCost: annualCosts.totalCosts,
          }
        })
        setProperties(mapped)
      }
      setLoading(false)
    })
  }, [])

  return { properties, loading }
}
