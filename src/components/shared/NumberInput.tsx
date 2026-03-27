import { useState, useRef, useEffect } from 'react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  className?: string
  step?: string
  decimals?: number
  /** Only fire onChange on blur, not on every keystroke */
  lazy?: boolean
}

function formatWithCommas(n: number, decimals: number): string {
  if (n === 0) return ''
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export function NumberInput({ value, onChange, className = '', step, decimals = 0, lazy = false }: NumberInputProps) {
  const [focused, setFocused] = useState(false)
  const [raw, setRaw] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync display when value changes externally (and not focused)
  useEffect(() => {
    if (!focused) {
      setRaw(formatWithCommas(value, decimals))
    }
  }, [value, focused, decimals])

  const handleFocus = () => {
    setFocused(true)
    setRaw(value ? String(value) : '')
  }

  const handleBlur = () => {
    setFocused(false)
    const parsed = parseFloat(raw) || 0
    onChange(parsed)
    setRaw(formatWithCommas(parsed, decimals))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    // Allow digits, decimal point, minus
    if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
      setRaw(v)
      if (!lazy) {
        const parsed = parseFloat(v) || 0
        onChange(parsed)
      }
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      className={className}
      value={raw}
      step={step}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}
