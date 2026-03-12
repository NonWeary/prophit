'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import MarketCard from '@/components/MarketCard'
import RelicCard from '@/components/RelicCard'
import TokenDisplay from '@/components/TokenDisplay'
import { getRelicById } from '@/lib/relics'
import type { MarketResult } from '@/lib/gameEngine'
import { CHAPTER_BLINDS } from '@/lib/gameEngine'
import { CHAPTER_INFO } from '@/lib/storyMarkets'
import { getHeatLabel } from '@/lib/fixes'

export default function GamePage() {
  const router = useRouter()
  const {
    phase,
    mode,
    round,
    tokens,
    relicIds,
    consecutiveCorrect,
    chapter,
    showChapterIntro,
    currentMarkets,
    currentBets,
    currentResults,
    roundStartBonus,
    peeksUsed,
    crowdHintsUsedThisRound,
    peekReveal,
    crowdHintReveal,
    firstYesBetPlaced,
    runWon,
    activeFixMarketId,
    activeFixGuaranteedOutcome,
    bestStreak,
    totalCorrect,
    totalAttempted,
    gameOverReason,
    heat,
    pendingFtcNotice,
    placeBet,
    removeBet,
    resolveMarkets,
    advanceRound,
    resetToLanding,
    dismissChapterIntro,
    dismissFtcNotice,
    usePeek,
    useCrowdHint,
  } = useGameStore()

  useEffect(() => {
    if (phase === 'landing') router.replace('/')
    if (phase === 'shop') router.replace('/game/shop')
  }, [phase, router])

  const hasHedgeFund = relicIds.includes('hedge_fund_brain')
  const hasConfirmationBias = relicIds.includes('confirmation_bias')
  const hasCrystalBall = relicIds.includes('crystal_ball')
  const hasWisdomOfCrowds = relicIds.includes('wisdom_of_crowds')

  const totalBetTokens = Object.values(currentBets).reduce((s, b) => s + b.wager, 0)
  const betsPlaced = Object.keys(currentBets).length
  const canResolve = phase === 'betting' && betsPlaced > 0

  // Underdog win glow animation — fires when player correctly bets the <25% side
  const perfectAnimRound = useRef(-1)
  const [showPerfect, setShowPerfect] = useState(false)
  useEffect(() => {
    if (phase === 'results' && perfectAnimRound.current !== round) {
      const hasUnderdogWin = currentResults.some(r => {
        if (!r.bet || r.bet.prediction !== r.outcome) return false
        const prob = r.market.baseProbability
        return (r.bet.prediction === 'YES' && prob < 0.25) ||
               (r.bet.prediction === 'NO' && prob > 0.75)
      })
      if (hasUnderdogWin) {
        perfectAnimRound.current = round
        setShowPerfect(true)
        const t = setTimeout(() => setShowPerfect(false), 1400)
        return () => clearTimeout(t)
      }
    }
  }, [phase, currentResults, round])

  if (phase === 'gameover') {
    return (
      <GameOverScreen
        tokens={tokens}
        round={round}
        runWon={runWon}
        mode={mode}
        chapter={chapter}
        gameOverReason={gameOverReason}
        totalCorrect={totalCorrect}
        totalAttempted={totalAttempted}
        bestStreak={bestStreak}
        onRestart={() => { resetToLanding(); router.replace('/') }}
        onNewRun={() => {
          if (mode === 'story') {
            useGameStore.getState().startStoryRun()
          } else {
            useGameStore.getState().startEndlessRun()
          }
          router.replace('/game')
        }}
      />
    )
  }

  if (phase === 'landing' || phase === 'shop') return null

  const chapterInfo = mode === 'story' ? CHAPTER_INFO[chapter as 1 | 2 | 3 | 4 | 5] : null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080F1E', fontFamily: 'var(--font-mono)' }}>

      {/* Perfect-round glow overlay */}
      {showPerfect && (
        <div
          className="animate-perfect-glow pointer-events-none fixed inset-0 z-40"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.15) 0%, rgba(0,255,136,0.06) 40%, transparent 70%)' }}
        />
      )}

      {/* FTC notice overlay */}
      {pendingFtcNotice && (
        <FtcNoticeOverlay
          penalty={pendingFtcNotice.penalty}
          tokenEffect={pendingFtcNotice.tokenEffect}
          onDismiss={dismissFtcNotice}
        />
      )}

      {/* Chapter intro overlay */}
      {showChapterIntro && chapterInfo && (
        <ChapterIntroOverlay
          chapter={chapter}
          title={chapterInfo.title}
          blurb={chapterInfo.blurb}
          onDismiss={dismissChapterIntro}
        />
      )}

      {/* Header */}
      <header
        className="border-b px-4 py-3 flex items-center justify-between gap-4 shrink-0"
        style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs uppercase tracking-widest cursor-pointer transition-colors"
            style={{ color: '#4A6A94' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C8DCF8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4A6A94')}
          >
            ← PROPHIT
          </button>

          {mode === 'story' && chapterInfo && (
            <div className="flex items-center gap-2 text-xs">
              <span style={{ color: '#4A6A94' }}>CH</span>
              <span style={{ color: '#FFCC00' }} className="font-bold">{chapter}</span>
              <span style={{ color: '#4A6A94' }}>—</span>
              <span style={{ color: '#6A8AB4' }}>{chapterInfo.title}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: '#4A6A94' }} className="uppercase tracking-wider">RND</span>
            <span style={{ color: '#C8DCF8' }} className="font-bold">{round}</span>
            {mode === 'endless' && <span style={{ color: '#4A6A94' }}>/15</span>}
          </div>

          {mode === 'story' && (() => {
            const heatInfo = getHeatLabel(heat)
            return (
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span style={{ color: '#4A6A94' }} className="uppercase tracking-wider">MIN BET</span>
                  <span style={{ color: '#FFCC00' }} className="font-bold">
                    {CHAPTER_BLINDS[chapter as 1 | 2 | 3 | 4 | 5]}
                  </span>
                  <span style={{ color: '#4A6A94' }}>PT</span>
                </div>
                {heat > 0 && (
                  <div className="flex items-center gap-1">
                    <span style={{ color: '#4A6A94' }} className="uppercase tracking-wider">HEAT</span>
                    <span
                      style={{ color: heatInfo.color }}
                      className={`font-bold${heatInfo.animate ? ' animate-blink' : ''}`}
                    >
                      {heatInfo.label}
                    </span>
                  </div>
                )}
              </div>
            )
          })()}

          {consecutiveCorrect >= 2 && (
            <div className="text-xs" style={{ color: '#FFCC00' }}>
              🔥 ×{consecutiveCorrect}
            </div>
          )}

          {mode === 'endless' && totalAttempted > 0 && (
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <span style={{ color: '#4A6A94' }}>
                ACC <span style={{ color: '#4488FF' }}>{Math.round((totalCorrect / totalAttempted) * 100)}%</span>
              </span>
              <span style={{ color: '#4A6A94' }}>
                BEST <span style={{ color: '#4488FF' }}>{bestStreak}</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {roundStartBonus > 0 && (
            <span className="text-xs animate-slide-up" style={{ color: '#00FF88' }}>
              +{roundStartBonus} BONUS
            </span>
          )}
          <TokenDisplay tokens={tokens} showDelta />
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: '#1A2E52' }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: mode === 'story' ? `${(chapter / 5) * 100}%` : `${(round / 15) * 100}%`,
            background: mode === 'story' ? '#FFCC00' : '#00FF88',
          }}
        />
      </div>

      {/* Active fix indicator */}
      {mode === 'story' && activeFixMarketId && (() => {
        const fixIsThisRound = currentMarkets.some(m => m.id === activeFixMarketId)
        return (
          <div
            className="border-b px-4 py-2 flex items-center gap-3 text-xs"
            style={{ borderColor: '#2A0808', background: 'rgba(255,68,68,0.05)' }}
          >
            <span style={{ color: '#FF4444' }}>⚠ FIX ACTIVE</span>
            {fixIsThisRound ? (
              <span style={{ color: '#6A8AB4' }}>
                This market is rigged.{' '}
                <span style={{ color: activeFixGuaranteedOutcome === 'YES' ? '#00FF88' : '#FF4444' }}>
                  {activeFixGuaranteedOutcome}
                </span>
                {' '}is guaranteed. Bet accordingly.
              </span>
            ) : (
              <span style={{ color: '#6A8AB4' }}>
                An arrangement is in motion. It will surface when it surfaces.
              </span>
            )}
          </div>
        )
      })()}

      {/* Relics bar */}
      {relicIds.length > 0 && (
        <div
          className="border-b px-4 py-2 flex items-center gap-2 overflow-x-auto"
          style={{ borderColor: '#1A2E52', background: '#080F1E' }}
        >
          <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: '#4A6A94' }}>
            RELICS
          </span>
          {relicIds.map(id => {
            const relic = getRelicById(id)
            if (!relic) return null
            return <RelicCard key={id} relic={relic} owned compact />
          })}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-6 max-w-6xl mx-auto w-full">

        {/* Phase label */}
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest" style={{ color: '#4A6A94' }}>
            {phase === 'betting' && 'PLACE YOUR BETS'}
            {phase === 'resolving' && '— RESOLVING —'}
            {phase === 'results' && 'RESULTS'}
          </div>
          {phase === 'betting' && totalBetTokens > 0 && (
            <div className="text-xs flex gap-4">
              <span style={{ color: '#4A6A94' }}>
                STAKED <span style={{ color: '#FFCC00' }}>{totalBetTokens} PT</span>
              </span>
              <span style={{ color: '#4A6A94' }}>
                FREE <span style={{ color: '#C8DCF8' }}>{tokens - totalBetTokens} PT</span>
              </span>
            </div>
          )}
        </div>

        {/* Market cards */}
        <div className="grid grid-cols-1 max-w-xl mx-auto w-full gap-4">
          {(phase === 'results' ? currentResults : currentMarkets).map((item, i) => {
            if (phase === 'results') {
              const result = item as MarketResult
              return (
                <div
                  key={result.market.id}
                  className={showPerfect ? 'animate-card-flash' : undefined}
                  style={showPerfect ? { animationDelay: `${i * 150}ms` } : undefined}
                >
                  <MarketCard
                    market={result.market}
                    phase="results"
                    bet={result.bet}
                    result={result}
                    tokens={tokens}
                    canPeek={false}
                    peekRevealed={false}
                    canHint={false}
                    hintRevealed={null}
                    onBet={() => {}}
                    onRemoveBet={() => {}}
                    onPeek={() => {}}
                    onCrowdHint={() => {}}
                    hasHedgeFund={hasHedgeFund}
                    hasConfirmationBias={hasConfirmationBias}
                    firstYesBetPlaced={firstYesBetPlaced}
                    fixedOutcome={result.wasFixed ? result.outcome : null}
                  />
                </div>
              )
            }

            const market = item as typeof currentMarkets[0]
            const isFixed = market.id === activeFixMarketId
            const canPeek = hasCrystalBall && peeksUsed < 1 && !peekReveal[market.id]
            const canHint = hasWisdomOfCrowds && crowdHintsUsedThisRound < 1 && !crowdHintReveal[market.id]

            return (
              <MarketCard
                key={market.id}
                market={market}
                phase={phase as 'betting' | 'resolving'}
                bet={currentBets[market.id] ?? null}
                tokens={tokens}
                canPeek={canPeek}
                peekRevealed={!!peekReveal[market.id]}
                canHint={canHint}
                hintRevealed={crowdHintReveal[market.id] ?? null}
                onBet={(pred, wager) => placeBet(market.id, pred, wager)}
                onRemoveBet={() => removeBet(market.id)}
                onPeek={() => usePeek(market.id)}
                onCrowdHint={() => useCrowdHint(market.id)}
                hasHedgeFund={hasHedgeFund}
                hasConfirmationBias={hasConfirmationBias}
                firstYesBetPlaced={firstYesBetPlaced}
                resolveDelay={i * 300}
                isFixed={isFixed}
                fixedOutcome={isFixed ? activeFixGuaranteedOutcome : null}
                minWager={mode === 'story' ? CHAPTER_BLINDS[chapter as 1 | 2 | 3 | 4 | 5] : 1}
              />
            )
          })}
        </div>

        {/* Results summary */}
        {phase === 'results' && (
          <div
            className="border p-4 animate-slide-up"
            style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
          >
            <ResultsSummary results={currentResults} />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          {phase === 'betting' && (
            <>
              {betsPlaced === 0 && (
                <span className="self-center text-xs" style={{ color: '#4A6A94' }}>
                  SELECT AT LEAST ONE MARKET TO RESOLVE
                </span>
              )}
              <button
                onClick={resolveMarkets}
                disabled={!canResolve}
                className={`px-8 py-3 text-xs font-bold uppercase tracking-widest border-2 transition-colors ${canResolve ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
                style={{
                  borderColor: canResolve ? '#00FF88' : '#1A2E52',
                  color: canResolve ? '#00FF88' : '#4A6A94',
                  background: 'transparent',
                }}
              >
                RESOLVE MARKETS →
              </button>
            </>
          )}

          {phase === 'results' && (
            <button
              onClick={advanceRound}
              className="px-8 py-3 text-xs font-bold uppercase tracking-widest border-2 cursor-pointer transition-colors"
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
              {round % 3 === 0 && round < 15
                ? 'ENTER SHOP →'
                : round >= 15
                ? 'FINISH RUN →'
                : 'NEXT ROUND →'}
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t px-4 py-2 flex justify-between text-xs shrink-0"
        style={{ borderColor: '#1A2E52', color: '#4A6A94' }}
      >
        <span>
          {mode === 'story'
            ? `STORY MODE · CH${chapter}/5 · RND ${round}`
            : `ENDLESS MODE · RND ${round}/15`}
        </span>
        <span>{tokens} PT REMAINING</span>
      </footer>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function ChapterIntroOverlay({
  chapter, title, blurb, onDismiss,
}: {
  chapter: number
  title: string
  blurb: string
  onDismiss: () => void
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-500"
      style={{
        background: 'rgba(8,15,30,0.97)',
        opacity: visible ? 1 : 0,
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div className="max-w-lg w-full flex flex-col gap-6 animate-slide-up">
        {/* Chapter badge */}
        <div className="flex items-center gap-4">
          <div
            className="border px-3 py-1 text-xs uppercase tracking-widest"
            style={{ borderColor: '#FFCC00', color: '#FFCC00' }}
          >
            CHAPTER {chapter}
          </div>
          <div className="flex-1 h-px" style={{ background: '#1A2E52' }} />
        </div>

        {/* Title */}
        <h2
          className="font-bold leading-none"
          style={{ color: '#C8DCF8', fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: '-0.02em' }}
        >
          {title}
        </h2>

        {/* Blurb */}
        <p className="text-sm leading-relaxed" style={{ color: '#6A8AB4' }}>
          {blurb}
        </p>

        {/* Divider */}
        <div className="h-px" style={{ background: '#1A2E52' }} />

        <button
          onClick={onDismiss}
          className="self-start px-8 py-3 text-xs font-bold uppercase tracking-widest border-2 cursor-pointer transition-colors"
          style={{ borderColor: '#FFCC00', color: '#FFCC00', background: 'transparent' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#FFCC00'
            e.currentTarget.style.color = '#080F1E'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#FFCC00'
          }}
        >
          BEGIN CHAPTER {chapter} →
        </button>
      </div>
    </div>
  )
}

function FtcNoticeOverlay({
  penalty,
  tokenEffect,
  onDismiss,
}: {
  penalty: { id: string; name: string; description: string; type: string }
  tokenEffect: number
  onDismiss: () => void
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 40) }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-300"
      style={{ background: 'rgba(20,8,8,0.97)', opacity: visible ? 1 : 0, fontFamily: 'var(--font-mono)' }}
    >
      <div className="max-w-lg w-full flex flex-col gap-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div
            className="border px-3 py-1 text-xs uppercase tracking-widest animate-blink"
            style={{ borderColor: '#FF4444', color: '#FF4444' }}
          >
            FTC NOTICE
          </div>
          <div className="flex-1 h-px" style={{ background: '#2A0808' }} />
          <div className="text-xs" style={{ color: '#4A6A94' }}>CASE NO. {Date.now().toString().slice(-6)}</div>
        </div>

        {/* Alert line */}
        <p className="text-xs uppercase tracking-widest" style={{ color: '#FF6644' }}>
          Irregular activity detected. Consequence applied.
        </p>

        {/* Penalty name */}
        <h2 className="font-bold text-2xl" style={{ color: '#FF4444', letterSpacing: '-0.01em' }}>
          {penalty.name}
        </h2>

        {/* Description */}
        <p className="text-sm leading-relaxed border-l-2 pl-4" style={{ color: '#C8DCF8', borderColor: '#2A0808' }}>
          {penalty.description}
        </p>

        {/* Token effect */}
        {tokenEffect < 0 && (
          <div
            className="border px-4 py-3 text-sm"
            style={{ borderColor: '#2A0808', background: 'rgba(255,68,68,0.05)' }}
          >
            <span style={{ color: '#FF6644' }}>IMMEDIATE EFFECT: </span>
            <span style={{ color: '#FF4444' }} className="font-bold">{tokenEffect} PT</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-px" style={{ background: '#2A0808' }} />

        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: '#4A6A94' }}>
            This notice has been filed with the Commission. No further action is required at this time.
          </p>
          <button
            onClick={onDismiss}
            className="ml-6 shrink-0 px-6 py-2.5 text-xs font-bold uppercase tracking-widest border-2 cursor-pointer transition-colors"
            style={{ borderColor: '#FF4444', color: '#FF4444', background: 'transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FF4444'
              e.currentTarget.style.color = '#080F1E'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#FF4444'
            }}
          >
            ACKNOWLEDGE →
          </button>
        </div>
      </div>
    </div>
  )
}

function ResultsSummary({ results }: { results: MarketResult[] }) {
  const total = results.reduce((sum, r) => sum + r.netChange, 0)
  const won = results.filter(r => r.bet && r.netChange > 0).length
  const lost = results.filter(r => r.bet && r.netChange < 0).length
  const skipped = results.filter(r => !r.bet).length
  const fixed = results.filter(r => r.wasFixed && r.bet).length

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
      <div>
        <span style={{ color: '#4A6A94' }} className="uppercase tracking-wider">ROUND P&L  </span>
        <span style={{ color: total >= 0 ? '#00FF88' : '#FF4444' }} className="font-bold">
          {total >= 0 ? '+' : ''}{total} PT
        </span>
      </div>
      <div>
        <span style={{ color: '#4A6A94' }} className="uppercase tracking-wider">WON  </span>
        <span style={{ color: '#00FF88' }} className="font-bold">{won}</span>
      </div>
      <div>
        <span style={{ color: '#4A6A94' }} className="uppercase tracking-wider">LOST  </span>
        <span style={{ color: '#FF4444' }} className="font-bold">{lost}</span>
      </div>
      {skipped > 0 && (
        <div>
          <span style={{ color: '#4A6A94' }} className="uppercase tracking-wider">SKIPPED  </span>
          <span style={{ color: '#6A8AB4' }} className="font-bold">{skipped}</span>
        </div>
      )}
      {fixed > 0 && (
        <div>
          <span style={{ color: '#FF4444' }} className="uppercase tracking-wider">FIXED  </span>
          <span style={{ color: '#FF4444' }} className="font-bold">{fixed}</span>
        </div>
      )}
    </div>
  )
}

interface GameOverProps {
  tokens: number
  round: number
  runWon: boolean
  mode: string
  chapter: number
  gameOverReason: 'bankrupt' | 'blinded_out' | null
  totalCorrect: number
  totalAttempted: number
  bestStreak: number
  onRestart: () => void
  onNewRun: () => void
}

function GameOverScreen({
  tokens, round, runWon, mode, chapter, gameOverReason, totalCorrect, totalAttempted, bestStreak, onRestart, onNewRun,
}: GameOverProps) {
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
  const blind = CHAPTER_BLINDS[chapter as 1 | 2 | 3 | 4 | 5]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#080F1E', fontFamily: 'var(--font-mono)' }}
    >
      <div className="max-w-lg w-full text-center">
        <div className="text-xs uppercase tracking-widest mb-8" style={{ color: '#4A6A94' }}>
          {mode === 'story' ? 'STORY RUN COMPLETE' : 'ENDLESS RUN COMPLETE'}
        </div>

        {runWon ? (
          <>
            <div className="text-6xl font-bold mb-4 animate-flicker" style={{ color: '#00FF88' }}>
              {mode === 'story' ? 'KINGMAKER' : 'PROPHET'}
            </div>
            <p style={{ color: '#6A8AB4' }} className="text-sm mb-2">
              {mode === 'story'
                ? `You completed all 5 chapters with ${tokens} Prophet Tokens remaining.`
                : `You completed all 15 rounds with ${tokens} Prophet Tokens remaining.`}
            </p>
            <p style={{ color: '#4A6A94' }} className="text-xs mb-8">
              {mode === 'story'
                ? 'You started in an apartment. You ended with the world. Not bad.'
                : 'The markets bowed. Temporarily.'}
            </p>
          </>
        ) : gameOverReason === 'blinded_out' ? (
          <>
            <div className="text-6xl font-bold mb-4" style={{ color: '#FFCC00' }}>
              BLINDED OUT
            </div>
            <p style={{ color: '#6A8AB4' }} className="text-sm mb-2">
              Chapter {chapter} requires a minimum bet of{' '}
              <span style={{ color: '#FFCC00' }}>{blind} PT</span>.
              You had <span style={{ color: '#FF4444' }}>{tokens} PT</span> — not enough to ante up.
            </p>
            <p style={{ color: '#4A6A94' }} className="text-xs mb-8">
              The table has a minimum. You didn&apos;t meet it.
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl font-bold mb-4" style={{ color: '#FF4444' }}>
              BANKRUPT
            </div>
            <p style={{ color: '#6A8AB4' }} className="text-sm mb-2">
              {mode === 'story'
                ? `Run ended in Chapter ${chapter} at round ${round}.`
                : `Run ended at round ${round}.`}{' '}
              Final balance: {tokens} tokens.
            </p>
            <p style={{ color: '#4A6A94' }} className="text-xs mb-8">
              The Prophet Tokens were never truly yours.
            </p>
          </>
        )}

        {/* Stats */}
        <div
          className="border grid grid-cols-3 mb-8"
          style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
        >
          {[
            { label: 'CORRECT', value: totalCorrect },
            { label: 'ACCURACY', value: `${accuracy}%` },
            { label: 'BEST STREAK', value: bestStreak },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="py-4 px-3 border-r last:border-r-0 text-center"
              style={{ borderColor: '#1A2E52' }}
            >
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#4A6A94' }}>
                {label}
              </div>
              <div className="font-bold" style={{ color: '#C8DCF8' }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={onNewRun}
            className="w-full py-4 text-sm font-bold uppercase tracking-widest border-2 cursor-pointer transition-colors"
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
            RUN AGAIN
          </button>
          {mode === 'endless' && (
            <button
              onClick={() => { onRestart(); setTimeout(() => window.location.href = '/game/endless/scores', 50) }}
              className="w-full py-3 text-xs font-bold uppercase tracking-widest border cursor-pointer"
              style={{ borderColor: '#4488FF', color: '#4488FF', background: 'transparent' }}
            >
              VIEW HIGH SCORES
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full py-3 text-xs font-bold uppercase tracking-widest border cursor-pointer"
            style={{ borderColor: '#1A2E52', color: '#6A8AB4', background: 'transparent' }}
          >
            BACK TO TERMINAL
          </button>
        </div>
      </div>
    </div>
  )
}
