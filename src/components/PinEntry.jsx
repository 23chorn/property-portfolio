import { useState } from 'react'

export default function PinEntry({ onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(false)
    setChecking(true)

    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const data = await res.json()

      if (data.ok) {
        sessionStorage.setItem('pp-auth', '1')
        onSuccess()
      } else {
        setError(true)
        setPin('')
      }
    } catch {
      // API unreachable (local dev without vercel dev) — allow access
      sessionStorage.setItem('pp-auth', '1')
      onSuccess()
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-bg-surface border border-border rounded-xl p-8 w-full max-w-xs text-center">
        <h1 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-1">
          Property Portfolio
        </h1>
        <p className="text-xs text-text-muted mb-6">Enter PIN to continue</p>

        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoFocus
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-protonpass-ignore
          value={pin}
          onChange={(e) => {
            setError(false)
            setPin(e.target.value.replace(/\D/g, ''))
          }}
          placeholder="----"
          className={`w-full text-center text-2xl font-mono tracking-[0.5em] bg-bg-elevated border rounded-lg px-4 py-3 text-text-primary focus:outline-none ${
            error ? 'border-accent-red' : 'border-border focus:border-accent-blue'
          }`}
        />

        {error && (
          <p className="text-xs text-accent-red mt-2">Incorrect PIN</p>
        )}

        <button
          type="submit"
          disabled={pin.length < 4 || checking}
          className="w-full mt-4 bg-accent-blue text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-40 transition-opacity"
        >
          {checking ? 'Checking...' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}
