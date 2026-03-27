import { useState, useEffect, useCallback, useRef } from 'react'
import { DEFAULT_PROPERTY } from './defaults'
import { loadProperties, saveProperties } from '../utils/kv'

export function usePropertyStore() {
  const [properties, setProperties] = useState([DEFAULT_PROPERTY])
  const [activePropertyId, setActivePropertyId] = useState('prop_1')
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving' | 'saved' | 'local-only' | 'error'
  const debounceRef = useRef(null)
  const initialLoadDone = useRef(false)

  // Load from KV on mount
  useEffect(() => {
    loadProperties().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setProperties(data)
        setActivePropertyId(data[0].id)
      }
      setLoading(false)
      initialLoadDone.current = true
    })
  }, [])

  // Debounced save on property changes
  useEffect(() => {
    if (!initialLoadDone.current) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    setSaveStatus('saving')
    debounceRef.current = setTimeout(async () => {
      const ok = await saveProperties(properties)
      setSaveStatus(ok ? 'saved' : 'local-only')
    }, 800)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [properties])

  const activeProperty = properties.find((p) => p.id === activePropertyId) || properties[0]

  const updateProperty = useCallback((updater) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === activePropertyId
          ? typeof updater === 'function'
            ? updater(p)
            : { ...p, ...updater }
          : p
      )
    )
  }, [activePropertyId])

  const updateField = useCallback((section, field, value) => {
    updateProperty((p) => ({
      ...p,
      [section]: {
        ...p[section],
        [field]: value,
      },
    }))
  }, [updateProperty])

  const resetSection = useCallback((section) => {
    updateProperty((p) => ({
      ...p,
      [section]: DEFAULT_PROPERTY[section],
    }))
  }, [updateProperty])

  return {
    properties,
    activeProperty,
    activePropertyId,
    setActivePropertyId,
    updateProperty,
    updateField,
    resetSection,
    loading,
    saveStatus,
  }
}
