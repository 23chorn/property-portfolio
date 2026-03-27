import type { VaultData, Person } from '../types/vault.ts'

function createEmptyPerson(name: string, currency: "AED" | "GBP" | "USD"): Person {
  return {
    name,
    currency,
    monthlySalaryGross: 0,
    monthlySalaryNet: 0,
    monthlyFixedExpenses: [],
    monthlyVariableSpend: 0,
    monthlyContributions: [],
  }
}

export function createEmptyVault(): VaultData {
  return {
    meta: {
      version: "1.0",
      lastSaved: new Date().toISOString(),
      displayCurrency: "AED",
      fxRates: {
        AED_GBP: 0.21,
        AED_USD: 0.27,
      },
    },
    people: {
      person1: createEmptyPerson("Person 1", "AED"),
      person2: createEmptyPerson("Person 2", "GBP"),
    },
    property: [],
    savingsPots: [],
    goals: [],
    netWorthSnapshots: [],
  }
}
