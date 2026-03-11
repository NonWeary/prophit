'use client'

import type { Relic } from '@/lib/relics'

interface RelicCardProps {
  relic: Relic
  owned?: boolean
  canAfford?: boolean
  onBuy?: () => void
  compact?: boolean
}

const EFFECT_ICONS: Record<string, string> = {
  CRYSTAL_BALL: '◎',
  YES_BET_DISCOUNT: '↓',
  HEDGE_BET: '⇌',
  ROUND_START_BONUS: '★',
  HOT_STREAK_MULTIPLIER: '▲',
  CONTRARIAN_BONUS: '↻',
  SUNK_COST_REFUND: '↩',
  CROWD_HINT: '◈',
}

export default function RelicCard({ relic, owned, canAfford, onBuy, compact }: RelicCardProps) {
  const icon = EFFECT_ICONS[relic.effect.type] ?? '■'

  if (compact) {
    return (
      <div
        className="border border-[#1e1e3a] bg-[#0e0e1a] px-3 py-2 flex items-center gap-3"
        title={relic.description}
      >
        <span className="text-[#00ff88] text-lg w-6 text-center shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-[#c8c8e8] text-xs font-bold truncate">{relic.name}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`border flex flex-col gap-3 p-4 transition-colors ${
        owned
          ? 'border-[#00ff88]/30 bg-[#00ff88]/5'
          : canAfford
          ? 'border-[#1e1e3a] bg-[#0e0e1a] hover:border-[#3a3a5c] cursor-pointer'
          : 'border-[#1e1e3a] bg-[#0e0e1a] opacity-60'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[#00ff88] text-2xl w-8 text-center shrink-0">{icon}</span>
          <div>
            <div className="text-[#c8c8e8] font-bold text-sm">{relic.name}</div>
            {owned && (
              <div className="text-[#00ff88] text-xs mt-0.5 uppercase tracking-wider">EQUIPPED</div>
            )}
          </div>
        </div>
        {!owned && (
          <div className="text-right shrink-0">
            <div className={`text-sm font-bold ${canAfford ? 'text-[#ffcc00]' : 'text-[#3a3a5c]'}`}>
              {relic.cost}
            </div>
            <div className="text-[#3a3a5c] text-xs uppercase">tokens</div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-[#6a6a9a] text-xs leading-relaxed">{relic.description}</p>

      {/* Flavor text */}
      <p className="text-[#3a3a5c] text-xs italic border-l border-[#1e1e3a] pl-3 leading-relaxed">
        {relic.flavorText}
      </p>

      {/* Buy button */}
      {!owned && onBuy && (
        <button
          onClick={onBuy}
          disabled={!canAfford}
          className={`mt-1 w-full py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
            canAfford
              ? 'border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#080810] cursor-pointer'
              : 'border-[#1e1e3a] text-[#3a3a5c] cursor-not-allowed'
          }`}
        >
          {canAfford ? 'ACQUIRE' : 'INSUFFICIENT TOKENS'}
        </button>
      )}
    </div>
  )
}