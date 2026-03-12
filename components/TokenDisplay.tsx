'use client'

import { useEffect, useRef, useState } from 'react'

interface TokenDisplayProps {
  tokens: number
  showDelta?: boolean
  className?: string
}

export default function TokenDisplay({ tokens, showDelta, className = '' }: TokenDisplayProps) {
  const [displayed, setDisplayed] = useState(tokens)
  const [delta, setDelta] = useState<number | null>(null)
  const [bumping, setBumping] = useState(false)
  const prevRef = useRef(tokens)

  useEffect(() => {
    if (tokens === prevRef.current) return
    const diff = tokens - prevRef.current
    prevRef.current = tokens

    setDelta(diff)
    setBumping(true)

    // Animate count up/down
    const steps = 20
    const stepValue = diff / steps
    let step = 0
    const start = displayed

    const interval = setInterval(() => {
      step++
      setDisplayed(Math.round(start + stepValue * step))
      if (step >= steps) {
        setDisplayed(tokens)
        clearInterval(interval)
      }
    }, 30)

    const bumpTimer = setTimeout(() => setBumping(false), 400)
    const deltaTimer = setTimeout(() => setDelta(null), 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(bumpTimer)
      clearTimeout(deltaTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens])

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <span className="text-[#6A8AB4] text-xs uppercase tracking-widest">TOKENS</span>
      <span
        className={`text-[#00FF88] font-bold tabular-nums ${bumping ? 'animate-token-bump' : ''}`}
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {displayed.toLocaleString()}
      </span>
      {showDelta && delta !== null && (
        <span
          className={`absolute -top-5 right-0 text-xs font-bold animate-slide-up ${
            delta > 0 ? 'text-[#00FF88]' : 'text-[#FF4444]'
          }`}
        >
          {delta > 0 ? `+${delta}` : delta}
        </span>
      )}
    </div>
  )
}
