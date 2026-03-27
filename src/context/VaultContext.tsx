import { createContext, useReducer, useCallback, useRef, useState, useEffect, useMemo, type ReactNode } from 'react'
import type { VaultData } from '../types/vault.ts'
import { vaultReducer, type VaultAction } from './vaultReducer.ts'
import { createEmptyVault } from '../store/defaults-vault.ts'
import { loadVaultData, saveVaultData } from '../utils/vaultKv.ts'
import { useLinkedProperties } from '../hooks/useLinkedProperties.ts'

type SaveStatus = 'saving' | 'saved' | 'local-only' | 'error'

interface VaultContextValue {
  state: VaultData
  dispatch: React.Dispatch<VaultAction>
  loading: boolean
  saveStatus: SaveStatus
}

export const VaultContext = createContext<VaultContextValue | null>(null)

export function VaultProvider({ children }: { children: ReactNode }) {
  const [state, baseDispatch] = useReducer(vaultReducer, null, createEmptyVault)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const initialLoadDone = useRef(false)

  const { properties: linkedProperties, loading: propsLoading } = useLinkedProperties()

  // Merge linked properties into state so all vault pages see them
  const stateWithProperties = useMemo(() => ({
    ...state,
    property: linkedProperties,
  }), [state, linkedProperties])

  // Load from KV on mount
  useEffect(() => {
    loadVaultData().then((data) => {
      if (data) {
        baseDispatch({ type: 'SET_VAULT', payload: data })
      }
      setLoading(false)
      initialLoadDone.current = true
    })
  }, [])

  // Debounced save on state changes
  const dispatch = useCallback((action: VaultAction) => {
    baseDispatch(action)
    if (action.type === 'SET_VAULT') return

    setSaveStatus('saving')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    // We need to save after the state updates, so we use a ref trick
  }, [])

  // Watch state changes and save
  useEffect(() => {
    if (!initialLoadDone.current) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    setSaveStatus('saving')
    debounceRef.current = setTimeout(async () => {
      const ok = await saveVaultData(state)
      setSaveStatus(ok ? 'saved' : 'local-only')
    }, 800)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [state])

  return (
    <VaultContext.Provider value={{ state: stateWithProperties, dispatch, loading: loading || propsLoading, saveStatus }}>
      {children}
    </VaultContext.Provider>
  )
}
