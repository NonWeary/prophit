'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

const TICKER_ITEMS = [
  'BARISTA MISSPELLING RATE: +12.4%',
  'ELEVATOR INCIDENT PROBABILITY: ELEVATED',
  'GLOBAL OAT MILK SUPPLY: UNCERTAIN',
  'SENATOR FLIP PROBABILITY: 34%',
  'CENTRAL BANK: EMERGENCY SESSION POSSIBLE',
  'PROPHET TOKENS: FINITE AND DWINDLING',
  'YOUR PREDICTIONS: PENDING VERIFICATION',
  'CROWD SENTIMENT: CONFUSED AND INVESTED',
  'HOT STREAK: UNCONFIRMED',
  'SUNK COST: IRRECOVERABLE (FOR NOW)',
  'WORLD LEADERS: ONLINE AND ACTIVE',
  'FIX CONFIRMED: AWAITING RESOLUTION',
]

export default function LandingPage() {
  const router = useRouter()
  const { phase, mode, startStoryRun, startEndlessRun } = useGameStore()
  const [tick, setTick] = useState(0)
  const [blinkOn, setBlinkOn] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3200)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    const b = setInterval(() => setBlinkOn(v => !v), 530)
    return () => clearInterval(b)
  }, [])

  const hasActiveRun = mounted && phase !== 'landing' && phase !== 'gameover'
  const tickerText = TICKER_ITEMS[tick % TICKER_ITEMS.length]

  function handleStory() {
    startStoryRun()
    router.push('/game')
  }

  function handleEndless() {
    startEndlessRun()
    router.push('/game')
  }

  function handleResume() {
    if (phase === 'shop') {
      router.push('/game/shop')
    } else {
      router.push('/game')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080F1E', fontFamily: 'var(--font-mono)' }}>
      {/* Ticker */}
      <div
        className="w-full border-b px-4 py-1.5 flex items-center gap-4 text-xs overflow-hidden"
        style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
      >
        <span style={{ color: '#00FF88' }} className="uppercase tracking-widest shrink-0">PROPHIT</span>
        <span style={{ color: '#4A6A94' }}>|</span>
        <span style={{ color: '#6A8AB4' }} className="uppercase tracking-wider truncate">{tickerText}</span>
        <span style={{ color: blinkOn ? '#00FF88' : 'transparent' }} className="ml-auto shrink-0">■</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <div className="text-center mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-widest mb-6" style={{ color: '#4A6A94' }}>
            ABSURDIST PREDICTION MARKETS · TERMINAL v0.2
          </div>
          <h1
            className="font-bold mb-5 leading-none"
            style={{ color: '#C8DCF8', fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '-0.02em' }}
          >
            PROPH<span style={{ color: '#00FF88' }}>IT</span>
          </h1>
          <p style={{ color: '#6A8AB4' }} className="text-sm leading-relaxed max-w-md mx-auto">
            Make predictions on the absurd. Earn Prophet Tokens when you&apos;re right.
            Lose them when you&apos;re wrong. Go broke, the run ends.
          </p>
        </div>

        {/* Mode selection */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Story Mode */}
          <div
            className="border flex flex-col p-6 gap-4 cursor-pointer group transition-all"
            style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
            onClick={handleStory}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#00FF88')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2E52')}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4A6A94' }}>
                  MODE 01
                </div>
                <div className="font-bold text-xl" style={{ color: '#C8DCF8' }}>
                  STORY MODE
                </div>
              </div>
              <span style={{ color: '#00FF88' }} className="text-2xl">→</span>
            </div>

            <p style={{ color: '#6A8AB4' }} className="text-xs italic leading-relaxed">
              &ldquo;Start small. End corrupt.&rdquo;
            </p>

            <div style={{ color: '#4A6A94', borderColor: '#1A2E52' }} className="text-xs leading-relaxed border-t pt-3">
              5 chapters. Rise from apartment dweller to global kingmaker.
              Rig markets. Bribe hosts. Arrange incidents.
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs border-t pt-3" style={{ borderColor: '#1A2E52' }}>
              {[['15', 'ROUNDS'], ['5', 'CHAPTERS'], ['12', 'FIXES']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ color: '#00FF88' }} className="font-bold">{v}</div>
                  <div style={{ color: '#4A6A94' }}>{l}</div>
                </div>
              ))}
            </div>

            <button
              className="w-full py-3 text-xs font-bold uppercase tracking-widest border-2 transition-colors"
              style={{ borderColor: '#00FF88', color: '#00FF88', background: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#00FF88'
                e.currentTarget.style.color = '#080F1E'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#00FF88'
              }}
            >
              BEGIN STORY →
            </button>
          </div>

          {/* Endless Mode */}
          <div
            className="border flex flex-col p-6 gap-4 cursor-pointer group transition-all"
            style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
            onClick={handleEndless}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#4488FF')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2E52')}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4A6A94' }}>
                  MODE 02
                </div>
                <div className="font-bold text-xl" style={{ color: '#C8DCF8' }}>
                  ENDLESS MODE
                </div>
              </div>
              <span style={{ color: '#4488FF' }} className="text-2xl">→</span>
            </div>

            <p style={{ color: '#6A8AB4' }} className="text-xs italic leading-relaxed">
              &ldquo;How long can you stay right?&rdquo;
            </p>

            <div style={{ color: '#4A6A94' }} className="text-xs leading-relaxed border-t pt-3">
              No narrative. No chapters. Pure prediction.
              Track your streak. Chase the high score. Go bankrupt eventually.
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs border-t pt-3" style={{ borderColor: '#1A2E52' }}>
              {[['35+', 'MARKETS'], ['8', 'RELICS'], ['∞', 'ROUNDS']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ color: '#4488FF' }} className="font-bold">{v}</div>
                  <div style={{ color: '#4A6A94' }}>{l}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="w-full py-3 text-xs font-bold uppercase tracking-widest border-2 transition-colors"
                style={{ borderColor: '#4488FF', color: '#4488FF', background: 'transparent' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#4488FF'
                  e.currentTarget.style.color = '#080F1E'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#4488FF'
                }}
              >
                BEGIN ENDLESS →
              </button>
              <button
                onClick={e => { e.stopPropagation(); router.push('/game/endless/scores') }}
                className="w-full py-2 text-xs uppercase tracking-widest border cursor-pointer transition-colors"
                style={{ borderColor: '#1A2E52', color: '#4A6A94', background: 'transparent' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#4A6A94'
                  e.currentTarget.style.color = '#6A8AB4'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1A2E52'
                  e.currentTarget.style.color = '#4A6A94'
                }}
              >
                HIGH SCORES
              </button>
            </div>
          </div>
        </div>

        {/* Resume run */}
        {hasActiveRun && (
          <div className="w-full max-w-2xl">
            <button
              onClick={handleResume}
              className="w-full py-3 text-xs font-bold uppercase tracking-widest border cursor-pointer transition-colors"
              style={{ borderColor: '#1A2E52', color: '#6A8AB4', background: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#4A6A94'
                e.currentTarget.style.color = '#C8DCF8'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1A2E52'
                e.currentTarget.style.color = '#6A8AB4'
              }}
            >
              ↩ RESUME {mode === 'story' ? 'STORY' : 'ENDLESS'} RUN
            </button>
          </div>
        )}

        {/* How it works */}
        <div className="mt-14 w-full max-w-2xl">
          <div
            className="text-xs uppercase tracking-widest mb-4 pb-2 border-b"
            style={{ color: '#4A6A94', borderColor: '#1A2E52' }}
          >
            HOW IT WORKS
          </div>
          <div className="grid grid-cols-1 gap-1 text-xs" style={{ color: '#6A8AB4' }}>
            {[
              ['01', '3 absurd prediction markets per round. Pick YES or NO. Wager Prophet Tokens.'],
              ['02', 'Correct = profit. Wrong = loss. Go to zero = run over.'],
              ['03', 'Every 3 rounds: visit the shop. Buy relics. Modify your strategy.'],
              ['04', 'Story Mode: rig markets with Fixes. Escalate from neighbor disputes to geopolitics.'],
              ['05', 'Endless Mode: pure prediction. Track your streak. Top the leaderboard.'],
            ].map(([num, text]) => (
              <div key={num} className="flex gap-3 items-start py-1.5 border-b" style={{ borderColor: '#0E1A30' }}>
                <span className="shrink-0 font-bold" style={{ color: '#1A2E52' }}>{num}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2 flex justify-between text-xs" style={{ borderColor: '#1A2E52', color: '#4A6A94' }}>
        <span>PROPHIT TERMINAL v0.2</span>
        <span>TOKENS ARE NOT LEGAL TENDER · RESULTS MAY VARY</span>
      </div>
    </div>
  )
}
