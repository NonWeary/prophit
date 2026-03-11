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
      style={{ background: '#080810', fontFamily: 'var(--font-mono)' }}
    >
      {/* Header */}
      <div
        className="border-b px-4 py-1.5 flex items-center gap-4 text-xs"
        style={{ borderColor: '#1e1e3a', background: '#0e0e1a' }}
      >
        <span style={{ color: '#4488ff' }} className="uppercase tracking-widest">ENDLESS MODE</span>
        <span style={{ color: '#3a3a5c' }}>|</span>
        <span style={{ color: '#6a6a9a' }} className="uppercase tracking-wider">HIGH SCORES</span>
        <span
          style={{ color: blinkOn ? '#4488ff' : 'transparent' }}
          className="ml-auto"
        >
          ■
        </span>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 flex flex-col gap-8">

        {/* Title */}
        <div>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#3a3a5c' }}>
            TOP 5 RUNS
          </div>
          <h1 className="font-bold text-3xl" style={{ color: '#c8c8e8', letterSpacing: '-0.02em' }}>
            ENDLESS MODE{' '}
            <span style={{ color: '#4488ff' }}>HIGH SCORES</span>
          </h1>
          <p className="mt-2 text-xs" style={{ color: '#6a6a9a' }}>
            Ranked by correct predictions. Accuracy breaks ties.
          </p>
        </div>

        {/* Scoreboard */}
        {hasScores ? (
          <div className="flex flex-col gap-0 border" style={{ borderColor: '#1e1e3a' }}>
            {/* Column headers */}
            <div
              className="grid text-xs uppercase tracking-widest px-4 py-2 border-b"
              style={{
                borderColor: '#1e1e3a',
                background: '#0e0e1a',
                color: '#3a3a5c',
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
                    borderColor: '#1e1e3a',
                    background: isTop ? 'rgba(68,136,255,0.05)' : 'transparent',
                    gridTemplateColumns: '2rem 1fr repeat(5, auto)',
                    gap: '1rem',
                  }}
                >
                  {/* Rank */}
                  <span
                    className="font-bold text-base"
                    style={{ color: isTop ? '#4488ff' : '#3a3a5c' }}
                  >
                    {i === 0 ? '★' : i + 1}
                  </span>

                  {/* Date */}
                  <div>
                    <div className="text-xs" style={{ color: '#c8c8e8' }}>
                      {entry.date}
                    </div>
                    {isTop && (
                      <div
                        className="text-[10px] uppercase tracking-wider mt-0.5"
                        style={{ color: '#4488ff' }}
                      >
                        BEST RUN
                      </div>
                    )}
                  </div>

                  {/* Correct */}
                  <span
                    className="text-right font-bold"
                    style={{ color: '#00ff88' }}
                  >
                    {entry.totalCorrect}
                  </span>

                  {/* Accuracy */}
                  <span
                    className="text-right"
                    style={{
                      color: accuracy >= 60 ? '#00ff88' : accuracy >= 40 ? '#ffcc00' : '#ff4444',
                    }}
                  >
                    {accuracy}%
                  </span>

                  {/* Streak */}
                  <span
                    className="text-right"
                    style={{ color: entry.bestStreak >= 5 ? '#ffcc00' : '#c8c8e8' }}
                  >
                    {entry.bestStreak}
                    {entry.bestStreak >= 5 && ' 🔥'}
                  </span>

                  {/* Rounds */}
                  <span className="text-right" style={{ color: '#6a6a9a' }}>
                    {entry.round}
                  </span>

                  {/* Final tokens */}
                  <span
                    className="text-right font-bold"
                    style={{ color: entry.finalTokens > 0 ? '#00ff88' : '#ff4444' }}
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
            style={{ borderColor: '#1e1e3a', background: '#0e0e1a' }}
          >
            <div className="font-bold text-2xl mb-3" style={{ color: '#1e1e3a' }}>
              NO SCORES YET
            </div>
            <p className="text-xs" style={{ color: '#3a3a5c' }}>
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
            style={{ borderColor: '#1e1e3a', background: '#0e0e1a', color: '#3a3a5c' }}
          >
            <div><span style={{ color: '#00ff88' }}>CORRECT</span> — total winning bets placed</div>
            <div><span style={{ color: '#ffcc00' }}>ACCURACY</span> — correct bets ÷ total bets</div>
            <div><span style={{ color: '#4488ff' }}>STREAK</span> — best consecutive win streak</div>
            <div><span style={{ color: '#c8c8e8' }}>ROUNDS</span> — rounds completed before bust</div>
            <div><span style={{ color: '#00ff88' }}>FINAL PT</span> — tokens at end of run</div>
            <div><span style={{ color: '#ff4444' }}>BANKRUPT</span> — went to zero. respectable.</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 text-xs font-bold uppercase tracking-widest border-2 cursor-pointer transition-colors"
            style={{ borderColor: '#4488ff', color: '#4488ff', background: 'transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#4488ff'
              e.currentTarget.style.color = '#080810'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#4488ff'
            }}
          >
            NEW RUN →
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 text-xs font-bold uppercase tracking-widest border cursor-pointer"
            style={{ borderColor: '#1e1e3a', color: '#6a6a9a', background: 'transparent' }}
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
              style={{ borderColor: '#1e1e3a', color: '#3a3a5c', background: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#ff4444'
                e.currentTarget.style.color = '#ff4444'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e1e3a'
                e.currentTarget.style.color = '#3a3a5c'
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
        style={{ borderColor: '#1e1e3a', color: '#3a3a5c' }}
      >
        <span>PROPHIT ENDLESS · HIGH SCORES</span>
        <span>TOP 5 RUNS STORED LOCALLY</span>
      </div>
    </div>
  )
}
