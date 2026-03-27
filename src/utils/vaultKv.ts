import type { VaultData } from '../types/vault.ts'

const STORAGE_KEY = 'vault-app-v1'

export async function loadVaultData(): Promise<VaultData | null> {
  try {
    const res = await fetch('/api/vault')
    if (!res.ok) throw new Error()
    const data = await res.json()
    return data
  } catch {
    const local = localStorage.getItem(STORAGE_KEY)
    return local ? JSON.parse(local) : null
  }
}

export async function saveVaultData(data: VaultData): Promise<boolean> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  try {
    const res = await fetch('/api/vault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.ok
  } catch {
    console.warn('KV sync failed, vault data saved locally only')
    return false
  }
}
