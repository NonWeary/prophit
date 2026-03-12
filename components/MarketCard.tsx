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
  // Blinds (Story Mode)
  minWager?: number
}

const CATEGORY_COLORS: Record<string, string> = {
  'Daily Life': '#4488FF',
  'Tech & Internet': '#AA44FF',
  'Pop Culture': '#FF8844',
  'Sports': '#44DDFF',
  'Meta/Self-Referential': '#FFCC00',
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
  minWager = 1,
}: MarketCardProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<'YES' | 'NO' | null>(
    bet?.prediction ?? null
  )
  const [wager, setWager] = useState(bet?.wager ?? Math.max(minWager, 10))
  const [showProgress, setShowProgress] = useState(false)
  const [progressDone, setProgressDone] = useState(false)

  const yesOdds = calculateOdds(market.baseProbability, 'YES')
  const noOdds = calculateOdds(market.baseProbability, 'NO')
  const catColor = CATEGORY_COLORS[market.category] ?? '#6A8AB4'

  const yesPct = Math.round(market.baseProbability * 100)
  const noPct = 100 - yesPct
  const isTossUp = yesPct >= 40 && yesPct <= 60
  const yesFavored = !isTossUp && yesPct >= 60
  const noFavored = !isTossUp && noPct >= 60
  const yesLabelColor = yesFavored ? '#00FF88' : '#4A6A94'
  const noLabelColor = noFavored ? '#FF4444' : '#4A6A94'
  const underdogProb = yesFavored ? noPct / 100 : noFavored ? yesPct / 100 : null
  const underdogMultiplier = underdogProb !== null ? (1 / underdogProb).toFixed(1) : null

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
    const clampedWager = Math.max(minWager, Math.min(wager, tokens))
    setWager(clampedWager)
    onBet(pred, clampedWager)
  }

  function handleWagerChange(val: number) {
    const clamped = Math.max(minWager, Math.min(val, tokens))
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
        result.outcome === 'YES' ? 'border-[#00FF88]/40' : 'border-[#FF4444]/40'
      } bg-[#0E1A30]`}>
        {/* Outcome banner */}
        <div className={`px-4 py-2 flex items-center justify-between ${
          result.outcome === 'YES' ? 'bg-[#00FF88]/10' : 'bg-[#FF4444]/10'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-lg ${
              result.outcome === 'YES' ? 'text-[#00FF88]' : 'text-[#FF4444]'
            }`}>
              {result.outcome}
            </span>
            <span className="text-[#4A6A94] text-xs">RESOLVED</span>
          </div>
          {result.bet && (
            <div className={`font-bold text-sm ${netChange >= 0 ? 'text-[#00FF88]' : 'text-[#FF4444]'}`}>
              {netChange >= 0 ? `+${netChange}` : netChange} PT
            </div>
          )}
          {!result.bet && (
            <div className="text-[#4A6A94] text-xs">NO BET</div>
          )}
        </div>

        {/* Market title */}
        <div className="px-4 pt-3 pb-1">
          <div className="text-[6px] uppercase tracking-widest mb-1" style={{ color: catColor }}>
            {market.category}
          </div>
          <p className="text-[#C8DCF8] text-sm leading-snug">{market.title}</p>
        </div>

        {/* Flavor text */}
        <div className="px-4 py-3 flex-1">
          <p className="text-[#6A8AB4] text-xs italic leading-relaxed border-l-2 border-[#1A2E52] pl-3">
            {result.flavorText}
          </p>
          {result.wasFixed && result.fixFlavorText && (
            <p className="mt-2 text-[#FF4444]/80 text-xs italic leading-relaxed border-l-2 pl-3" style={{ borderColor: '#2A0808' }}>
              {result.fixFlavorText}
            </p>
          )}
        </div>

        {/* Bet summary */}
        {result.bet && (
          <div className="px-4 pb-3 border-t border-[#1A2E52] pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-[#4A6A94]">
              BET <span className={result.bet.prediction === 'YES' ? 'text-[#00FF88]' : 'text-[#FF4444]'}>
                {result.bet.prediction}
              </span> @ {result.bet.wager} PT
            </span>
            {result.bonusGain > 0 && (
              <span className="text-[#FFCC00]">BONUS +{result.bonusGain} PT</span>
            )}
            {result.appliedRelics.length > 0 && (
              <span className="text-[#4488FF]">
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
      <div className="border border-[#1A2E52] bg-[#0E1A30] flex flex-col">
        <div className="px-4 pt-3 pb-1">
          <div className="text-[6px] uppercase tracking-widest mb-1" style={{ color: catColor }}>
            {market.category}
          </div>
          <p className="text-[#C8DCF8] text-sm leading-snug">{market.title}</p>
        </div>
        {bet && (
          <div className="px-4 py-1 text-xs text-[#4A6A94]">
            BET <span className={bet.prediction === 'YES' ? 'text-[#00FF88]' : 'text-[#FF4444]'}>
              {bet.prediction}
            </span> @ {bet.wager} PT
          </div>
        )}
        <div className="px-4 py-4 flex-1">
          {showProgress ? (
            <div>
              <div className="flex justify-between text-xs text-[#4A6A94] mb-2 uppercase tracking-wider">
                <span className="animate-blink">RESOLVING</span>
                <span>PROCESSING</span>
              </div>
              <div className="h-1.5 bg-[#1A2E52] overflow-hidden">
                <div className="h-full bg-[#00FF88] animate-progress" />
              </div>
            </div>
          ) : (
            <div className="text-[#4A6A94] text-xs animate-blink">QUEUED...</div>
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
          ? 'border-[#00FF88]/50 bg-[#0E1A30]'
          : 'border-[#FF4444]/50 bg-[#0E1A30]'
        : 'border-[#1A2E52] bg-[#0E1A30]'
    }`}>
      {/* Fix indicator */}
      {isFixed && fixedOutcome && (
        <div
          className="px-4 py-1.5 flex items-center gap-2 text-xs border-b"
          style={{ background: 'rgba(255,68,68,0.06)', borderColor: '#2A0808' }}
        >
          <span style={{ color: '#FF4444' }}>⚠ FIXED →</span>
          <span
            className="font-bold"
            style={{ color: fixedOutcome === 'YES' ? '#00FF88' : '#FF4444' }}
          >
            {fixedOutcome}
          </span>
          <span style={{ color: '#4A6A94' }}>GUARANTEED</span>
        </div>
      )}

      {/* Category + Title */}
      <div className="px-4 pt-4 pb-2">
        <div className="text-[6px] uppercase tracking-widest mb-1.5" style={{ color: catColor }}>
          {market.category}
        </div>
        <p className="text-[#C8DCF8] text-sm leading-snug font-medium">{market.title}</p>

        {/* Lore drop — Story Mode only, injected at round generation */}
        {market.loreDrop && (
          <div className="mt-2 pt-2 border-t border-[#1A2E52]">
            <p className="text-[10px] italic leading-relaxed text-[#4A6A94]">{market.loreDrop}</p>
          </div>
        )}
      </div>

      {/* Odds display */}
      <div className="px-4 pb-3">
        {/* YES / NO percentage labels */}
        <div className="flex items-baseline justify-between text-xs mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold" style={{ color: yesLabelColor }}>YES {yesPct}%</span>
            {(yesFavored || isTossUp) && (
              <span
                className="text-[9px] uppercase tracking-widest"
                style={{ color: yesLabelColor }}
              >
                {isTossUp ? 'TOSS-UP' : 'FAVORED'}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            {noFavored && (
              <span className="text-[9px] uppercase tracking-widest" style={{ color: '#FF4444' }}>
                FAVORED
              </span>
            )}
            <span className="font-bold" style={{ color: noLabelColor }}>NO {noPct}%</span>
          </div>
        </div>

        {/* Probability bar */}
        <div className="h-1 bg-[#1A2E52] overflow-hidden mb-1.5">
          <div className="h-full" style={{ width: `${yesPct}%`, background: yesLabelColor }} />
        </div>

        {/* Underdog payout */}
        {underdogMultiplier && (
          <div className="text-[10px] text-[#4A6A94] mb-1">
            Underdog pays {underdogMultiplier}x
          </div>
        )}

        {/* Peek / Hint reveals */}
        {(peekRevealed || hintRevealed) && (
          <div className="flex flex-wrap gap-3 mt-1 text-xs">
            {peekRevealed && (
              <span className="text-[#FFCC00]">
                ◎ TRUE PROB: {(market.baseProbability * 100).toFixed(0)}% YES
              </span>
            )}
            {hintRevealed && (
              <span className="text-[#AA44FF]">
                ◈ CROWD: {hintRevealed.leans} ({hintRevealed.confidence})
              </span>
            )}
          </div>
        )}
      </div>

      {/* YES / NO buttons */}
      <div className="px-4 pb-3 flex gap-2">
        <button
          onClick={() => handleSelectPrediction('YES')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border transition-colors cursor-pointer ${
            selectedPrediction === 'YES'
              ? 'bg-[#00FF88] text-white border-[#00FF88]'
              : 'border-[#00FF88]/40 text-[#00FF88] hover:bg-[#00FF88]/10'
          }`}
        >
          YES
          {selectedPrediction === 'YES' && hasConfirmationBias && !firstYesBetPlaced && (
            <span className="ml-1 text-white/70">½</span>
          )}
        </button>
        <button
          onClick={() => handleSelectPrediction('NO')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border transition-colors cursor-pointer ${
            selectedPrediction === 'NO'
              ? 'bg-[#FF4444] text-white border-[#FF4444]'
              : 'border-[#FF4444]/40 text-[#FF4444] hover:bg-[#FF4444]/10'
          }`}
        >
          NO
        </button>
      </div>

      {/* Wager + relic actions */}
      {selectedPrediction && (
        <div className="px-4 pb-4 border-t border-[#1A2E52] pt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#4A6A94] text-xs uppercase tracking-wider shrink-0">WAGER</span>
            <div className="flex items-center gap-1 flex-1">
              <button
                onClick={() => handleWagerChange(wager - 5)}
                disabled={wager <= minWager}
                className="w-7 h-7 border border-[#1A2E52] text-[#6A8AB4] hover:text-[#C8DCF8] hover:border-[#4A6A94] text-xs cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >−</button>
              <input
                type="number"
                min={minWager}
                max={tokens}
                value={wager}
                onChange={e => handleWagerChange(Number(e.target.value))}
                className="flex-1 bg-transparent border border-[#1A2E52] text-[#C8DCF8] text-xs text-center py-1 focus:outline-none focus:border-[#4A6A94] [appearance:textfield]"
              />
              <button
                onClick={() => handleWagerChange(wager + 5)}
                className="w-7 h-7 border border-[#1A2E52] text-[#6A8AB4] hover:text-[#C8DCF8] hover:border-[#4A6A94] text-xs cursor-pointer"
              >+</button>
              <button
                onClick={() => handleWagerChange(tokens)}
                className="px-2 h-7 border border-[#1A2E52] text-[#4A6A94] hover:text-[#FFCC00] hover:border-[#FFCC00]/40 text-xs cursor-pointer uppercase"
              >ALL</button>
            </div>
          </div>

          {/* Effective wager info */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#4A6A94]">
            {minWager > 1 && (
              <span className="text-[#FFCC00]/80">MIN: {minWager} PT</span>
            )}
            <span>
              COST: <span className="text-[#C8DCF8]">{displayWager} PT</span>
            </span>
            <span>
              WIN: <span className="text-[#00FF88]">
                +{Math.floor(displayWager * (calculateOdds(market.baseProbability, selectedPrediction) - 1))} PT
              </span>
            </span>
            {hasHedgeFund && (
              <span className="text-[#AA44FF]">⇌ HEDGED</span>
            )}
            {hasConfirmationBias && selectedPrediction === 'YES' && !firstYesBetPlaced && (
              <span className="text-[#4488FF]">↓ 50% BIAS DISCOUNT</span>
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
              className="text-xs border border-[#FFCC00]/30 text-[#FFCC00] px-3 py-1.5 hover:bg-[#FFCC00]/10 cursor-pointer uppercase tracking-wider"
            >
              ◎ PEEK
            </button>
          )}
          {canHint && !hintRevealed && (
            <button
              onClick={onCrowdHint}
              className="text-xs border border-[#AA44FF]/30 text-[#AA44FF] px-3 py-1.5 hover:bg-[#AA44FF]/10 cursor-pointer uppercase tracking-wider"
            >
              ◈ CROWD
            </button>
          )}
        </div>
      )}
    </div>
  )
}
