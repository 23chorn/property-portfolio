const STORAGE_KEY = 'property-analyser-v1'

export async function loadProperties() {
  try {
    const res = await fetch('/api/properties')
    if (!res.ok) throw new Error()
    const data = await res.json()
    return data
  } catch {
    const local = localStorage.getItem(STORAGE_KEY)
    return local ? JSON.parse(local) : null
  }
}

export async function saveProperties(properties) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties))
  try {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(properties),
    })
    return res.ok
  } catch {
    console.warn('KV sync failed, data saved locally only')
    return false
  }
}
