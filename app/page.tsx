'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

const TICKER_ITEMS = [
  'BARISTA MISSPELLING RATE: +12.4%',
  'ELEVATOR STOPS: ABOVE CONSENSUS',
  'REPLY-ALL INCIDENTS: ELEVATED',
  'AI CONFIDENCE: HIGH | ACCURACY: LOW',
  'CLOUD UPTIME: STATUS UNKNOWN',
  'PROPHET TOKENS: FINITE',
  'YOUR PREDICTIONS: PENDING',
  'CROWD SENTIMENT: CONFUSED',
  'VIBES: MIXED TO UNCERTAIN',
  'HOT STREAK: UNCONFIRMED',
  'SUNK COST: IRRECOVERABLE (MAYBE)',
]

export default function LandingPage() {
  const router = useRouter()
  const { phase, startRun } = useGameStore()
  const [tick, setTick] = useState(0)
  const [blinkOn, setBlinkOn] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const b = setInterval(() => setBlinkOn(v => !v), 530)
    return () => clearInterval(b)
  }, [])

  function handleStart() {
    startRun()
    router.push('/game')
  }

  function handleResume() {
    router.push('/game')
  }

  const hasActiveRun = mounted && phase !== 'landing' && phase !== 'gameover'
  const tickerText = TICKER_ITEMS[tick % TICKER_ITEMS.length]

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#080810', fontFamily: 'var(--font-mono)' }}
    >
      {/* Top ticker */}
      <div
        className="w-full border-b px-4 py-1.5 flex items-center gap-4 text-xs overflow-hidden"
        style={{ borderColor: '#1e1e3a', background: '#0e0e1a' }}
      >
        <span style={{ color: '#00ff88' }} className="uppercase tracking-widest shrink-0">
          PROPHIT
        </span>
        <span style={{ color: '#3a3a5c' }}>|</span>
        <span style={{ color: '#6a6a9a' }} className="uppercase tracking-wider truncate">
          {tickerText}
        </span>
        <span
          style={{ color: blinkOn ? '#00ff88' : 'transparent' }}
          className="ml-auto shrink-0"
        >
          ■
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Logo / title area */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="text-xs uppercase tracking-widest mb-6" style={{ color: '#3a3a5c' }}>
            ABSURDIST PREDICTION MARKETS · TERMINAL v0.1
          </div>

          <h1
            className="font-bold mb-4 leading-none"
            style={{ color: '#c8c8e8', fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '-0.02em' }}
          >
            PROPH
            <span style={{ color: '#00ff88' }}>IT</span>
          </h1>

          <p style={{ color: '#6a6a9a' }} className="text-sm leading-relaxed max-w-md mx-auto">
            Make predictions on the absurd. Earn Prophet Tokens when you&apos;re right.
            Lose them when you&apos;re wrong. Go broke, run ends.
            <br />
            <span style={{ color: '#3a3a5c' }}>The markets are always watching.</span>
          </p>
        </div>

        {/* Stats bar */}
        <div
          className="w-full max-w-lg border mb-8 grid grid-cols-3 text-center"
          style={{ borderColor: '#1e1e3a', background: '#0e0e1a' }}
        >
          {[
            { label: 'STARTING TOKENS', value: '100 PT' },
            { label: 'ROUNDS', value: '15' },
            { label: 'MARKETS / ROUND', value: '3' },
          ].map(({ label, value }) => (
            <div key={label} className="py-4 px-3 border-r last:border-r-0" style={{ borderColor: '#1e1e3a' }}>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#3a3a5c' }}>
                {label}
              </div>
              <div className="font-bold" style={{ color: '#c8c8e8' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <button
            onClick={handleStart}
            className="w-full py-4 text-sm font-bold uppercase tracking-widest border-2 transition-colors cursor-pointer"
            style={{
              borderColor: '#00ff88',
              color: '#00ff88',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              ;(e.target as HTMLElement).style.background = '#00ff88'
              ;(e.target as HTMLElement).style.color = '#080810'
            }}
            onMouseLeave={e => {
              ;(e.target as HTMLElement).style.background = 'transparent'
              ;(e.target as HTMLElement).style.color = '#00ff88'
            }}
          >
            {hasActiveRun ? 'NEW RUN' : 'START RUN'}
          </button>

          {hasActiveRun && (
            <button
              onClick={handleResume}
              className="w-full py-3 text-sm font-bold uppercase tracking-widest border transition-colors cursor-pointer"
              style={{ borderColor: '#1e1e3a', color: '#6a6a9a' }}
              onMouseEnter={e => {
                ;(e.target as HTMLElement).style.borderColor = '#3a3a5c'
                ;(e.target as HTMLElement).style.color = '#c8c8e8'
              }}
              onMouseLeave={e => {
                ;(e.target as HTMLElement).style.borderColor = '#1e1e3a'
                ;(e.target as HTMLElement).style.color = '#6a6a9a'
              }}
            >
              RESUME RUN
            </button>
          )}
        </div>

        {/* How to play */}
        <div className="mt-16 w-full max-w-lg">
          <div
            className="text-xs uppercase tracking-widest mb-4 pb-2 border-b"
            style={{ color: '#3a3a5c', borderColor: '#1e1e3a' }}
          >
            HOW IT WORKS
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs" style={{ color: '#6a6a9a' }}>
            {[
              ['01', 'You\'re presented with 3 absurd prediction markets per round.'],
              ['02', 'Pick YES or NO and wager Prophet Tokens. Contrarian calls pay more.'],
              ['03', 'Markets resolve with weighted randomness + flavor text.'],
              ['04', 'Every 3 rounds: visit the shop. Buy relics. Modify your reality.'],
              ['05', 'Run ends at round 15 or when you go broke. Whichever comes first.'],
            ].map(([num, text]) => (
              <div key={num} className="flex gap-3 items-start py-1.5 border-b" style={{ borderColor: '#0e0e1a' }}>
                <span className="shrink-0 font-bold" style={{ color: '#1e1e3a' }}>{num}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="border-t px-4 py-2 flex justify-between text-xs"
        style={{ borderColor: '#1e1e3a', color: '#3a3a5c' }}
      >
        <span>PROPHIT TERMINAL</span>
        <span>RESULTS MAY VARY · TOKENS ARE NOT LEGAL TENDER</span>
      </div>
    </div>
  )
}