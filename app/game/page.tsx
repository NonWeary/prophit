'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import MarketCard from '@/components/MarketCard'
import RelicCard from '@/components/RelicCard'
import TokenDisplay from '@/components/TokenDisplay'
import { getRelicById } from '@/lib/relics'
import type { MarketResult } from '@/lib/gameEngine'

export default function GamePage() {
  const router = useRouter()
  const {
    phase,
    round,
    tokens,
    relicIds,
    consecutiveCorrect,
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
    placeBet,
    removeBet,
    resolveMarkets,
    advanceRound,
    resetToLanding,
    usePeek,
    useCrowdHint,
  } = useGameStore()

  // Redirect to landing if no active run
  useEffect(() => {
    if (phase === 'landing') {
      router.replace('/')
    }
    if (phase === 'shop') {
      router.replace('/game/shop')
    }
  }, [phase, router])

  const hasHedgeFund = relicIds.includes('hedge_fund_brain')
  const hasConfirmationBias = relicIds.includes('confirmation_bias')
  const hasCrystalBall = relicIds.includes('crystal_ball')
  const hasWisdomOfCrowds = relicIds.includes('wisdom_of_crowds')

  const totalBetTokens = Object.values(currentBets).reduce((s, b) => s + b.wager, 0)
  const betsPlaced = Object.keys(currentBets).length
  const canResolve = phase === 'betting' && betsPlaced > 0

  if (phase === 'gameover') {
    return <GameOverScreen
      tokens={tokens}
      round={round}
      runWon={runWon}
      onRestart={() => { resetToLanding(); router.replace('/') }}
      onNewRun={() => {
        const store = useGameStore.getState()
        store.startRun()
        router.replace('/game')
      }}
    />
  }

  // Neutral loading guard
  if (phase === 'landing' || phase === 'shop') return null

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#080810', fontFamily: 'var(--font-mono)' }}
    >
      {/* Header */}
      <header
        className="border-b px-4 py-3 flex items-center justify-between gap-4 shrink-0"
        style={{ borderColor: '#1e1e3a', background: '#0e0e1a' }}
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs uppercase tracking-widest cursor-pointer"
            style={{ color: '#3a3a5c' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c8c8e8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3a3a5c')}
          >
            ← PROPHIT
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: '#3a3a5c' }} className="uppercase tracking-wider">ROUND</span>
            <span style={{ color: '#c8c8e8' }} className="font-bold">{round}</span>
            <span style={{ color: '#3a3a5c' }}>/</span>
            <span style={{ color: '#3a3a5c' }}>15</span>
          </div>
          {consecutiveCorrect >= 2 && (
            <div className="text-xs">
              <span style={{ color: '#ffcc00' }}>🔥 STREAK ×{consecutiveCorrect}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <TokenDisplay tokens={tokens} showDelta />
          {roundStartBonus > 0 && (
            <div className="text-xs animate-slide-up" style={{ color: '#00ff88' }}>
              +{roundStartBonus} BONUS
            </div>
          )}
        </div>
      </header>

      {/* Round progress bar */}
      <div className="h-0.5 w-full" style={{ background: '#1e1e3a' }}>
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${(round / 15) * 100}%`, background: '#00ff88' }}
        />
      </div>

      {/* Relics bar */}
      {relicIds.length > 0 && (
        <div
          className="border-b px-4 py-2 flex items-center gap-2 overflow-x-auto"
          style={{ borderColor: '#1e1e3a', background: '#080810' }}
        >
          <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: '#3a3a5c' }}>
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
          <div className="text-xs uppercase tracking-widest" style={{ color: '#3a3a5c' }}>
            {phase === 'betting' && 'PLACE YOUR BETS'}
            {phase === 'resolving' && '— RESOLVING —'}
            {phase === 'results' && 'RESULTS'}
          </div>
          {phase === 'betting' && totalBetTokens > 0 && (
            <div className="text-xs" style={{ color: '#6a6a9a' }}>
              <span style={{ color: '#3a3a5c' }}>STAKED: </span>
              <span style={{ color: '#ffcc00' }}>{totalBetTokens} PT</span>
              <span style={{ color: '#3a3a5c' }}> · FREE: </span>
              <span style={{ color: '#c8c8e8' }}>{tokens - totalBetTokens} PT</span>
            </div>
          )}
        </div>

        {/* Market cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(phase === 'results' ? currentResults : currentMarkets).map((item, i) => {
            if (phase === 'results') {
              const result = item as typeof currentResults[0]
              return (
                <MarketCard
                  key={result.market.id}
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
                />
              )
            }

            const market = item as typeof currentMarkets[0]
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
              />
            )
          })}
        </div>

        {/* Results summary */}
        {phase === 'results' && (
          <div
            className="border p-4 animate-slide-up"
            style={{ borderColor: '#1e1e3a', background: '#0e0e1a' }}
          >
            <ResultsSummary results={currentResults} />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          {phase === 'betting' && (
            <>
              {betsPlaced === 0 && (
                <span className="self-center text-xs" style={{ color: '#3a3a5c' }}>
                  SELECT AT LEAST ONE MARKET TO RESOLVE
                </span>
              )}
              <button
                onClick={resolveMarkets}
                disabled={!canResolve}
                className={`px-8 py-3 text-xs font-bold uppercase tracking-widest border-2 transition-colors ${
                  canResolve ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                }`}
                style={{
                  borderColor: canResolve ? '#00ff88' : '#1e1e3a',
                  color: canResolve ? '#00ff88' : '#3a3a5c',
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
              style={{ borderColor: '#00ff88', color: '#00ff88', background: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#00ff88'
                e.currentTarget.style.color = '#080810'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#00ff88'
              }}
            >
              {round % 3 === 0 && round < 15 ? 'ENTER SHOP →' : round >= 15 ? 'FINAL ROUND →' : 'NEXT ROUND →'}
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t px-4 py-2 flex justify-between text-xs shrink-0"
        style={{ borderColor: '#1e1e3a', color: '#3a3a5c' }}
      >
        <span>PROPHIT TERMINAL · RND {round}/15</span>
        <span>{tokens} PT REMAINING</span>
      </footer>
    </div>
  )
}

function ResultsSummary({ results }: { results: MarketResult[] }) {
  const total = results.reduce((sum, r) => sum + r.netChange, 0)
  const won = results.filter(r => r.bet && r.netChange > 0).length
  const lost = results.filter(r => r.bet && r.netChange < 0).length
  const skipped = results.filter(r => !r.bet).length

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
      <div>
        <span style={{ color: '#3a3a5c' }} className="uppercase tracking-wider">ROUND P&L  </span>
        <span
          style={{ color: total >= 0 ? '#00ff88' : '#ff4444' }}
          className="font-bold"
        >
          {total >= 0 ? '+' : ''}{total} PT
        </span>
      </div>
      <div>
        <span style={{ color: '#3a3a5c' }} className="uppercase tracking-wider">WON  </span>
        <span style={{ color: '#00ff88' }} className="font-bold">{won}</span>
      </div>
      <div>
        <span style={{ color: '#3a3a5c' }} className="uppercase tracking-wider">LOST  </span>
        <span style={{ color: '#ff4444' }} className="font-bold">{lost}</span>
      </div>
      {skipped > 0 && (
        <div>
          <span style={{ color: '#3a3a5c' }} className="uppercase tracking-wider">SKIPPED  </span>
          <span style={{ color: '#6a6a9a' }} className="font-bold">{skipped}</span>
        </div>
      )}
    </div>
  )
}

interface GameOverProps {
  tokens: number
  round: number
  runWon: boolean
  onRestart: () => void
  onNewRun: () => void
}

function GameOverScreen({ tokens, round, runWon, onRestart, onNewRun }: GameOverProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#080810', fontFamily: 'var(--font-mono)' }}
    >
      <div className="max-w-lg w-full text-center">
        <div
          className="text-xs uppercase tracking-widest mb-8"
          style={{ color: '#3a3a5c' }}
        >
          RUN COMPLETE
        </div>

        {runWon ? (
          <>
            <div
              className="text-6xl font-bold mb-4 animate-flicker"
              style={{ color: '#00ff88' }}
            >
              PROPHET
            </div>
            <p style={{ color: '#6a6a9a' }} className="text-sm mb-2">
              You completed all 15 rounds with {tokens} Prophet Tokens remaining.
            </p>
            <p style={{ color: '#3a3a5c' }} className="text-xs mb-12">
              The markets bow to you. Temporarily.
            </p>
          </>
        ) : (
          <>
            <div
              className="text-6xl font-bold mb-4"
              style={{ color: '#ff4444' }}
            >
              BANKRUPT
            </div>
            <p style={{ color: '#6a6a9a' }} className="text-sm mb-2">
              Run ended at round {round}. Final balance: {tokens} tokens.
            </p>
            <p style={{ color: '#3a3a5c' }} className="text-xs mb-12">
              The Prophet Tokens were never yours to keep.
            </p>
          </>
        )}

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={onNewRun}
            className="w-full py-4 text-sm font-bold uppercase tracking-widest border-2 cursor-pointer"
            style={{ borderColor: '#00ff88', color: '#00ff88', background: 'transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#00ff88'
              e.currentTarget.style.color = '#080810'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#00ff88'
            }}
          >
            NEW RUN
          </button>
          <button
            onClick={onRestart}
            className="w-full py-3 text-xs font-bold uppercase tracking-widest border cursor-pointer"
            style={{ borderColor: '#1e1e3a', color: '#6a6a9a', background: 'transparent' }}
          >
            BACK TO TERMINAL
          </button>
        </div>
      </div>
    </div>
  )
}