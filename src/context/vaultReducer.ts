import type { VaultData, Person, Currency } from '../types/vault.ts'
import { convertCurrency, type FxRates } from '../utils/currency.ts'

export type VaultAction =
  | { type: 'SET_VAULT'; payload: VaultData }
  | { type: 'UPDATE_META'; payload: Partial<VaultData['meta']> }
  | { type: 'UPDATE_PERSON'; payload: { key: 'person1' | 'person2'; person: Person } }
  | { type: 'ADD_PROPERTY'; payload: Property }
  | { type: 'UPDATE_PROPERTY'; payload: Property }
  | { type: 'DELETE_PROPERTY'; payload: string }
  | { type: 'ADD_POT'; payload: SavingsPot }
  | { type: 'UPDATE_POT'; payload: SavingsPot }
  | { type: 'DELETE_POT'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_SNAPSHOT'; payload: NetWorthSnapshot }
  | { type: 'DELETE_SNAPSHOT'; payload: string }

function convertPerson(person: Person, from: Currency, to: Currency, rates: FxRates): Person {
  if (from === to) return person
  const c = (amount: number) => convertCurrency(amount, from, to, rates)
  return {
    ...person,
    currency: to,
    monthlySalaryGross: c(person.monthlySalaryGross),
    monthlySalaryNet: c(person.monthlySalaryNet),
    monthlyFixedExpenses: person.monthlyFixedExpenses.map((e) => ({
      ...e,
      amount: c(e.amount),
    })),
    monthlyVariableSpend: c(person.monthlyVariableSpend),
    monthlyContributions: person.monthlyContributions.map((cont) => ({
      ...cont,
      amount: c(cont.amount),
    })),
  }
}

export function vaultReducer(state: VaultData, action: VaultAction): VaultData {
  switch (action.type) {
    case 'SET_VAULT':
      return {
        ...action.payload,
        meta: {
          ...action.payload.meta,
          displayCurrency: action.payload.meta.displayCurrency ?? 'AED',
          fxRates: {
            AED_GBP: action.payload.meta.fxRates?.AED_GBP ?? 0.21,
            AED_USD: action.payload.meta.fxRates?.AED_USD ?? 0.27,
          },
        },
      }

    case 'UPDATE_META': {
      const newMeta = { ...state.meta, ...action.payload }
      const oldCurrency = state.meta.displayCurrency
      const newCurrency = newMeta.displayCurrency

      // If display currency changed, convert both people's values
      if (newCurrency && newCurrency !== oldCurrency) {
        const rates = newMeta.fxRates ?? state.meta.fxRates
        return {
          ...state,
          meta: newMeta,
          people: {
            person1: convertPerson(state.people.person1, oldCurrency, newCurrency, rates),
            person2: convertPerson(state.people.person2, oldCurrency, newCurrency, rates),
          },
        }
      }

      return { ...state, meta: newMeta }
    }

    case 'UPDATE_PERSON':
      return {
        ...state,
        people: {
          ...state.people,
          [action.payload.key]: action.payload.person,
        },
      }

    case 'ADD_PROPERTY':
      return { ...state, property: [...state.property, action.payload] }

    case 'UPDATE_PROPERTY':
      return {
        ...state,
        property: state.property.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      }

    case 'DELETE_PROPERTY':
      return {
        ...state,
        property: state.property.filter((p) => p.id !== action.payload),
      }

    case 'ADD_POT':
      return { ...state, savingsPots: [...state.savingsPots, action.payload] }

    case 'UPDATE_POT':
      return {
        ...state,
        savingsPots: state.savingsPots.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      }

    case 'DELETE_POT':
      return {
        ...state,
        savingsPots: state.savingsPots.filter((p) => p.id !== action.payload),
        people: {
          person1: {
            ...state.people.person1,
            monthlyContributions: state.people.person1.monthlyContributions.filter(
              (c) => c.potId !== action.payload,
            ),
          },
          person2: {
            ...state.people.person2,
            monthlyContributions: state.people.person2.monthlyContributions.filter(
              (c) => c.potId !== action.payload,
            ),
          },
        },
      }

    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] }

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? action.payload : g,
        ),
      }

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
        savingsPots: state.savingsPots.map((p) =>
          p.linkedGoalId === action.payload ? { ...p, linkedGoalId: null } : p,
        ),
      }

    case 'ADD_SNAPSHOT':
      return {
        ...state,
        netWorthSnapshots: [...state.netWorthSnapshots, action.payload],
      }

    case 'DELETE_SNAPSHOT':
      return {
        ...state,
        netWorthSnapshots: state.netWorthSnapshots.filter(
          (s) => s.date !== action.payload,
        ),
      }

    default:
      return state
  }
}
