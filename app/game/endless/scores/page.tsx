'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { HighScoreEntry } from '@/store/gameStore'

export default function ScoresPage() {
  const router = useRouter()
  const [scores, setScores] = useState<HighScoreEntry[]>([])
  const [blinkOn, setBlinkOn] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('prophit-scores')
      if (raw) setScores(JSON.parse(raw))
    } catch {
      setScores([])
    }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setBlinkOn(v => !v), 530)
    return () => clearInterval(t)
  }, [])

  const hasScores = scores.length > 0

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#080F1E', fontFamily: 'var(--font-mono)' }}
    >
      {/* Header */}
      <div
        className="border-b px-4 py-1.5 flex items-center gap-4 text-xs"
        style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
      >
        <span style={{ color: '#4488FF' }} className="uppercase tracking-widest">ENDLESS MODE</span>
        <span style={{ color: '#4A6A94' }}>|</span>
        <span style={{ color: '#6A8AB4' }} className="uppercase tracking-wider">HIGH SCORES</span>
        <span
          style={{ color: blinkOn ? '#4488FF' : 'transparent' }}
          className="ml-auto"
        >
          ■
        </span>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 flex flex-col gap-8">

        {/* Title */}
        <div>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#4A6A94' }}>
            TOP 5 RUNS
          </div>
          <h1 className="font-bold text-3xl" style={{ color: '#C8DCF8', letterSpacing: '-0.02em' }}>
            ENDLESS MODE{' '}
            <span style={{ color: '#4488FF' }}>HIGH SCORES</span>
          </h1>
          <p className="mt-2 text-xs" style={{ color: '#6A8AB4' }}>
            Ranked by correct predictions. Accuracy breaks ties.
          </p>
        </div>

        {/* Scoreboard */}
        {hasScores ? (
          <div className="flex flex-col gap-0 border" style={{ borderColor: '#1A2E52' }}>
            {/* Column headers */}
            <div
              className="grid text-xs uppercase tracking-widest px-4 py-2 border-b"
              style={{
                borderColor: '#1A2E52',
                background: '#0E1A30',
                color: '#4A6A94',
                gridTemplateColumns: '2rem 1fr repeat(5, auto)',
                gap: '1rem',
              }}
            >
              <span>#</span>
              <span>DATE</span>
              <span className="text-right">CORRECT</span>
              <span className="text-right">ACCURACY</span>
              <span className="text-right">STREAK</span>
              <span className="text-right">ROUNDS</span>
              <span className="text-right">FINAL PT</span>
            </div>

            {scores.map((entry, i) => {
              const accuracy = entry.totalAttempted > 0
                ? Math.round((entry.totalCorrect / entry.totalAttempted) * 100)
                : 0
              const isTop = i === 0

              return (
                <div
                  key={entry.id}
                  className="grid px-4 py-4 border-b last:border-b-0 text-sm items-center"
                  style={{
                    borderColor: '#1A2E52',
                    background: isTop ? 'rgba(68,136,255,0.04)' : 'transparent',
                    gridTemplateColumns: '2rem 1fr repeat(5, auto)',
                    gap: '1rem',
                  }}
                >
                  {/* Rank */}
                  <span
                    className="font-bold text-base"
                    style={{ color: isTop ? '#4488FF' : '#4A6A94' }}
                  >
                    {i === 0 ? '★' : i + 1}
                  </span>

                  {/* Date */}
                  <div>
                    <div className="text-xs" style={{ color: '#C8DCF8' }}>
                      {entry.date}
                    </div>
                    {isTop && (
                      <div
                        className="text-[10px] uppercase tracking-wider mt-0.5"
                        style={{ color: '#4488FF' }}
                      >
                        BEST RUN
                      </div>
                    )}
                  </div>

                  {/* Correct */}
                  <span
                    className="text-right font-bold"
                    style={{ color: '#00FF88' }}
                  >
                    {entry.totalCorrect}
                  </span>

                  {/* Accuracy */}
                  <span
                    className="text-right"
                    style={{
                      color: accuracy >= 60 ? '#00FF88' : accuracy >= 40 ? '#FFCC00' : '#FF4444',
                    }}
                  >
                    {accuracy}%
                  </span>

                  {/* Streak */}
                  <span
                    className="text-right"
                    style={{ color: entry.bestStreak >= 5 ? '#FFCC00' : '#C8DCF8' }}
                  >
                    {entry.bestStreak}
                    {entry.bestStreak >= 5 && ' 🔥'}
                  </span>

                  {/* Rounds */}
                  <span className="text-right" style={{ color: '#6A8AB4' }}>
                    {entry.round}
                  </span>

                  {/* Final tokens */}
                  <span
                    className="text-right font-bold"
                    style={{ color: entry.finalTokens > 0 ? '#00FF88' : '#FF4444' }}
                  >
                    {entry.finalTokens > 0 ? `${entry.finalTokens} PT` : 'BANKRUPT'}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            className="border p-16 text-center"
            style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
          >
            <div className="font-bold text-2xl mb-3" style={{ color: '#1A2E52' }}>
              NO SCORES YET
            </div>
            <p className="text-xs" style={{ color: '#4A6A94' }}>
              Complete an Endless Mode run to appear on the leaderboard.
              <br />
              Bankruptcy counts.
            </p>
          </div>
        )}

        {/* Stats legend */}
        {hasScores && (
          <div
            className="border p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs"
            style={{ borderColor: '#1A2E52', background: '#0E1A30', color: '#4A6A94' }}
          >
            <div><span style={{ color: '#00FF88' }}>CORRECT</span> — total winning bets placed</div>
            <div><span style={{ color: '#FFCC00' }}>ACCURACY</span> — correct bets ÷ total bets</div>
            <div><span style={{ color: '#4488FF' }}>STREAK</span> — best consecutive win streak</div>
            <div><span style={{ color: '#C8DCF8' }}>ROUNDS</span> — rounds completed before bust</div>
            <div><span style={{ color: '#00FF88' }}>FINAL PT</span> — tokens at end of run</div>
            <div><span style={{ color: '#FF4444' }}>BANKRUPT</span> — went to zero. respectable.</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 text-xs font-bold uppercase tracking-widest border-2 cursor-pointer transition-colors"
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
            NEW RUN →
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 text-xs font-bold uppercase tracking-widest border cursor-pointer"
            style={{ borderColor: '#1A2E52', color: '#6A8AB4', background: 'transparent' }}
          >
            ← BACK TO TERMINAL
          </button>
          {hasScores && (
            <button
              onClick={() => {
                localStorage.removeItem('prophit-scores')
                setScores([])
              }}
              className="ml-auto px-4 py-3 text-xs uppercase tracking-widest border cursor-pointer"
              style={{ borderColor: '#1A2E52', color: '#4A6A94', background: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#FF4444'
                e.currentTarget.style.color = '#FF4444'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1A2E52'
                e.currentTarget.style.color = '#4A6A94'
              }}
            >
              CLEAR SCORES
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <div
        className="border-t px-4 py-2 flex justify-between text-xs"
        style={{ borderColor: '#1A2E52', color: '#4A6A94' }}
      >
        <span>PROPHIT ENDLESS · HIGH SCORES</span>
        <span>TOP 5 RUNS STORED LOCALLY</span>
      </div>
    </div>
  )
}
