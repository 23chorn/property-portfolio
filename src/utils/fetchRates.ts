import type { VaultData } from '../types/vault.ts'

type FxRates = VaultData['meta']['fxRates']

interface ApiResponse {
  rates: Record<string, number>
}

export async function fetchLiveRates(): Promise<FxRates> {
  const res = await fetch('https://open.er-api.com/v6/latest/AED')
  if (!res.ok) throw new Error('Failed to fetch rates')
  const data: ApiResponse = await res.json()
  return {
    AED_GBP: Number(data.rates.GBP.toFixed(4)),
    AED_USD: Number(data.rates.USD.toFixed(4)),
  }
}
