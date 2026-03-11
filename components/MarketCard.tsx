'use client'

import { useState, useEffect } from 'react'
import type { Market } from '@/lib/markets'
import { calculateOdds } from '@/lib/markets'
import type { Bet, MarketResult } from '@/lib/gameEngine'

interface MarketCardProps {
  market: Market
  phase: 'betting' | 'resolving' | 'results'
  bet: Bet | null
  result?: MarketResult
  tokens: number
  // Relic features
  canPeek: boolean
  peekRevealed: boolean
  canHint: boolean
  hintRevealed: { leans: 'YES' | 'NO'; confidence: string } | null
  onBet: (prediction: 'YES' | 'NO', wager: number) => void
  onRemoveBet: () => void
  onPeek: () => void
  onCrowdHint: () => void
  hasHedgeFund: boolean
  hasConfirmationBias: boolean
  firstYesBetPlaced: boolean
  resolveDelay?: number // ms delay before showing result animation
  // Fix system (Story Mode)
  isFixed?: boolean
  fixedOutcome?: 'YES' | 'NO' | null
}

const CATEGORY_COLORS: Record<string, string> = {
  'Daily Life': '#4488ff',
  'Tech & Internet': '#aa44ff',
  'Pop Culture': '#ff8844',
  'Sports': '#44ddff',
  'Meta/Self-Referential': '#ffcc00',
}

export default function MarketCard({
  market,
  phase,
  bet,
  result,
  tokens,
  canPeek,
  peekRevealed,
  canHint,
  hintRevealed,
  onBet,
  onRemoveBet,
  onPeek,
  onCrowdHint,
  hasHedgeFund,
  hasConfirmationBias,
  firstYesBetPlaced,
  resolveDelay = 0,
  isFixed = false,
  fixedOutcome = null,
}: MarketCardProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<'YES' | 'NO' | null>(
    bet?.prediction ?? null
  )
  const [wager, setWager] = useState(bet?.wager ?? 10)
  const [showProgress, setShowProgress] = useState(false)
  const [progressDone, setProgressDone] = useState(false)

  const yesOdds = calculateOdds(market.baseProbability, 'YES')
  const noOdds = calculateOdds(market.baseProbability, 'NO')
  const catColor = CATEGORY_COLORS[market.category] ?? '#6a6a9a'

  useEffect(() => {
    if (phase === 'resolving') {
      const t1 = setTimeout(() => setShowProgress(true), resolveDelay)
      const t2 = setTimeout(() => setProgressDone(true), resolveDelay + 2000)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    } else {
      setShowProgress(false)
      setProgressDone(false)
    }
  }, [phase, resolveDelay])

  // Sync bet prop
  useEffect(() => {
    if (bet) {
      setSelectedPrediction(bet.prediction)
      setWager(bet.wager)
    } else {
      setSelectedPrediction(null)
    }
  }, [bet])

  function handleSelectPrediction(pred: 'YES' | 'NO') {
    if (phase !== 'betting') return
    if (selectedPrediction === pred) {
      setSelectedPrediction(null)
      onRemoveBet()
      return
    }
    setSelectedPrediction(pred)
    const clampedWager = Math.max(1, Math.min(wager, tokens))
    onBet(pred, clampedWager)
  }

  function handleWagerChange(val: number) {
    const clamped = Math.max(1, Math.min(val, tokens))
    setWager(clamped)
    if (selectedPrediction) onBet(selectedPrediction, clamped)
  }

  // Effective wager for YES with Confirmation Bias
  const effectiveYesWager = hasConfirmationBias && !firstYesBetPlaced && selectedPrediction === 'YES'
    ? Math.max(1, Math.floor(wager * 0.5))
    : wager

  const displayWager = selectedPrediction === 'YES' ? effectiveYesWager : wager

  // ── RESULT STATE ─────────────────────────────────────────────
  if (phase === 'results' && result) {
    const won = result.bet && result.bet.prediction === result.outcome
    const netChange = result.netChange

    return (
      <div className={`border flex flex-col animate-slide-up ${
        result.outcome === 'YES' ? 'border-[#00ff88]/40' : 'border-[#ff4444]/40'
      } bg-[#0e0e1a]`}>
        {/* Outcome banner */}
        <div className={`px-4 py-2 flex items-center justify-between ${
          result.outcome === 'YES' ? 'bg-[#00ff88]/10' : 'bg-[#ff4444]/10'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-lg ${
              result.outcome === 'YES' ? 'text-[#00ff88]' : 'text-[#ff4444]'
            }`}>
              {result.outcome}
            </span>
            <span className="text-[#3a3a5c] text-xs">RESOLVED</span>
          </div>
          {result.bet && (
            <div className={`font-bold text-sm ${netChange >= 0 ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
              {netChange >= 0 ? `+${netChange}` : netChange} PT
            </div>
          )}
          {!result.bet && (
            <div className="text-[#3a3a5c] text-xs">NO BET</div>
          )}
        </div>

        {/* Market title */}
        <div className="px-4 pt-3 pb-1">
          <div className="text-[6px] uppercase tracking-widest mb-1" style={{ color: catColor }}>
            {market.category}
          </div>
          <p className="text-[#c8c8e8] text-sm leading-snug">{market.title}</p>
        </div>

        {/* Flavor text */}
        <div className="px-4 py-3 flex-1">
          <p className="text-[#6a6a9a] text-xs italic leading-relaxed border-l-2 border-[#1e1e3a] pl-3">
            {result.flavorText}
          </p>
          {result.wasFixed && result.fixFlavorText && (
            <p className="mt-2 text-[#ff4444]/80 text-xs italic leading-relaxed border-l-2 pl-3" style={{ borderColor: '#2a0808' }}>
              {result.fixFlavorText}
            </p>
          )}
        </div>

        {/* Bet summary */}
        {result.bet && (
          <div className="px-4 pb-3 border-t border-[#1e1e3a] pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-[#3a3a5c]">
              BET <span className={result.bet.prediction === 'YES' ? 'text-[#00ff88]' : 'text-[#ff4444]'}>
                {result.bet.prediction}
              </span> @ {result.bet.wager} PT
            </span>
            {result.bonusGain > 0 && (
              <span className="text-[#ffcc00]">BONUS +{result.bonusGain} PT</span>
            )}
            {result.appliedRelics.length > 0 && (
              <span className="text-[#4488ff]">
                via {result.appliedRelics.map(r => r.replace(/_/g, ' ')).join(', ')}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  // ── RESOLVING STATE ──────────────────────────────────────────
  if (phase === 'resolving') {
    return (
      <div className="border border-[#1e1e3a] bg-[#0e0e1a] flex flex-col">
        <div className="px-4 pt-3 pb-1">
          <div className="text-[6px] uppercase tracking-widest mb-1" style={{ color: catColor }}>
            {market.category}
          </div>
          <p className="text-[#c8c8e8] text-sm leading-snug">{market.title}</p>
        </div>
        {bet && (
          <div className="px-4 py-1 text-xs text-[#3a3a5c]">
            BET <span className={bet.prediction === 'YES' ? 'text-[#00ff88]' : 'text-[#ff4444]'}>
              {bet.prediction}
            </span> @ {bet.wager} PT
          </div>
        )}
        <div className="px-4 py-4 flex-1">
          {showProgress ? (
            <div>
              <div className="flex justify-between text-xs text-[#3a3a5c] mb-2 uppercase tracking-wider">
                <span className="animate-blink">RESOLVING</span>
                <span>PROCESSING</span>
              </div>
              <div className="h-1.5 bg-[#1e1e3a] overflow-hidden">
                <div className="h-full bg-[#00ff88] animate-progress" />
              </div>
            </div>
          ) : (
            <div className="text-[#3a3a5c] text-xs animate-blink">QUEUED...</div>
          )}
        </div>
      </div>
    )
  }

  // ── BETTING STATE ────────────────────────────────────────────
  return (
    <div className={`border flex flex-col transition-colors ${
      selectedPrediction
        ? selectedPrediction === 'YES'
          ? 'border-[#00ff88]/50 bg-[#0e0e1a]'
          : 'border-[#ff4444]/50 bg-[#0e0e1a]'
        : 'border-[#1e1e3a] bg-[#0e0e1a]'
    }`}>
      {/* Fix indicator */}
      {isFixed && fixedOutcome && (
        <div
          className="px-4 py-1.5 flex items-center gap-2 text-xs border-b"
          style={{ background: 'rgba(255,68,68,0.06)', borderColor: '#2a0808' }}
        >
          <span style={{ color: '#ff4444' }}>⚠ FIXED →</span>
          <span
            className="font-bold"
            style={{ color: fixedOutcome === 'YES' ? '#00ff88' : '#ff4444' }}
          >
            {fixedOutcome}
          </span>
          <span style={{ color: '#3a3a5c' }}>GUARANTEED</span>
        </div>
      )}

      {/* Category + Title */}
      <div className="px-4 pt-4 pb-2">
        <div className="text-[6px] uppercase tracking-widest mb-1.5" style={{ color: catColor }}>
          {market.category}
        </div>
        <p className="text-[#c8c8e8] text-sm leading-snug font-medium">{market.title}</p>
      </div>

      {/* Odds display */}
      <div className="px-4 pb-3 flex gap-4 text-xs">
        <div>
          <span className="text-[#3a3a5c] uppercase tracking-wider">YES </span>
          <span className="text-[#00ff88] font-bold">{yesOdds.toFixed(2)}x</span>
        </div>
        <div>
          <span className="text-[#3a3a5c] uppercase tracking-wider">NO </span>
          <span className="text-[#ff4444] font-bold">{noOdds.toFixed(2)}x</span>
        </div>
        {peekRevealed && (
          <div className="ml-auto">
            <span className="text-[#ffcc00] text-xs">
              ◎ TRUE PROB: {(market.baseProbability * 100).toFixed(0)}% YES
            </span>
          </div>
        )}
        {hintRevealed && (
          <div className="ml-auto">
            <span className="text-[#aa44ff] text-xs">
              ◈ CROWD: {hintRevealed.leans} ({hintRevealed.confidence})
            </span>
          </div>
        )}
      </div>

      {/* YES / NO buttons */}
      <div className="px-4 pb-3 flex gap-2">
        <button
          onClick={() => handleSelectPrediction('YES')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border transition-colors cursor-pointer ${
            selectedPrediction === 'YES'
              ? 'bg-[#00ff88] text-[#080810] border-[#00ff88]'
              : 'border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/10'
          }`}
        >
          YES
          {selectedPrediction === 'YES' && hasConfirmationBias && !firstYesBetPlaced && (
            <span className="ml-1 text-[#080810]/70">½</span>
          )}
        </button>
        <button
          onClick={() => handleSelectPrediction('NO')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border transition-colors cursor-pointer ${
            selectedPrediction === 'NO'
              ? 'bg-[#ff4444] text-white border-[#ff4444]'
              : 'border-[#ff4444]/40 text-[#ff4444] hover:bg-[#ff4444]/10'
          }`}
        >
          NO
        </button>
      </div>

      {/* Wager + relic actions */}
      {selectedPrediction && (
        <div className="px-4 pb-4 border-t border-[#1e1e3a] pt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#3a3a5c] text-xs uppercase tracking-wider shrink-0">WAGER</span>
            <div className="flex items-center gap-1 flex-1">
              <button
                onClick={() => handleWagerChange(wager - 5)}
                className="w-7 h-7 border border-[#1e1e3a] text-[#6a6a9a] hover:text-[#c8c8e8] hover:border-[#3a3a5c] text-xs cursor-pointer"
              >−</button>
              <input
                type="number"
                min={1}
                max={tokens}
                value={wager}
                onChange={e => handleWagerChange(Number(e.target.value))}
                className="flex-1 bg-transparent border border-[#1e1e3a] text-[#c8c8e8] text-xs text-center py-1 focus:outline-none focus:border-[#3a3a5c] [appearance:textfield]"
              />
              <button
                onClick={() => handleWagerChange(wager + 5)}
                className="w-7 h-7 border border-[#1e1e3a] text-[#6a6a9a] hover:text-[#c8c8e8] hover:border-[#3a3a5c] text-xs cursor-pointer"
              >+</button>
              <button
                onClick={() => handleWagerChange(tokens)}
                className="px-2 h-7 border border-[#1e1e3a] text-[#3a3a5c] hover:text-[#ffcc00] hover:border-[#ffcc00]/40 text-xs cursor-pointer uppercase"
              >ALL</button>
            </div>
          </div>

          {/* Effective wager info */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#3a3a5c]">
            <span>
              COST: <span className="text-[#c8c8e8]">{displayWager} PT</span>
            </span>
            <span>
              WIN: <span className="text-[#00ff88]">
                +{Math.floor(displayWager * (calculateOdds(market.baseProbability, selectedPrediction) - 1))} PT
              </span>
            </span>
            {hasHedgeFund && (
              <span className="text-[#aa44ff]">⇌ HEDGED</span>
            )}
            {hasConfirmationBias && selectedPrediction === 'YES' && !firstYesBetPlaced && (
              <span className="text-[#4488ff]">↓ 50% BIAS DISCOUNT</span>
            )}
          </div>
        </div>
      )}

      {/* Relic action buttons */}
      {(canPeek || canHint) && (
        <div className="px-4 pb-3 flex gap-2">
          {canPeek && !peekRevealed && (
            <button
              onClick={onPeek}
              className="text-xs border border-[#ffcc00]/30 text-[#ffcc00] px-3 py-1.5 hover:bg-[#ffcc00]/10 cursor-pointer uppercase tracking-wider"
            >
              ◎ PEEK
            </button>
          )}
          {canHint && !hintRevealed && (
            <button
              onClick={onCrowdHint}
              className="text-xs border border-[#aa44ff]/30 text-[#aa44ff] px-3 py-1.5 hover:bg-[#aa44ff]/10 cursor-pointer uppercase tracking-wider"
            >
              ◈ CROWD
            </button>
          )}
        </div>
      )}
    </div>
  )
}