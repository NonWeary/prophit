import type { Market } from './markets'
import { calculateNetGain } from './markets'
import type { Relic } from './relics'
import { getRelicById } from './relics'

// Minimum wager per chapter in Story Mode
export const CHAPTER_BLINDS: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 10,
  2: 25,
  3: 50,
  4: 100,
  5: 200,
}

export interface Bet {
  prediction: 'YES' | 'NO'
  wager: number
}

export interface MarketResult {
  market: Market
  outcome: 'YES' | 'NO'
  flavorText: string
  bet: Bet | null
  // netChange: positive = profit, negative = loss, 0 = no bet
  netChange: number
  // raw payout breakdown for display
  baseGain: number
  bonusGain: number
  appliedRelics: string[]
  // Fix metadata
  wasFixed?: boolean
  fixFlavorText?: string | null
}

export interface FixInfo {
  marketId: string
  guaranteedOutcome: 'YES' | 'NO'
  flavorText: string
}

export interface RoundSummary {
  results: MarketResult[]
  totalNetChange: number
  roundStartBonus: number
  newConsecutiveCorrect: number
  newLastRoundLoss: number
}

function resolveOutcome(baseProbability: number): 'YES' | 'NO' {
  return Math.random() < baseProbability ? 'YES' : 'NO'
}

function hasRelic(relicIds: string[], id: string): boolean {
  return relicIds.includes(id)
}

export function applyRoundStartEffects(
  tokens: number,
  relicIds: string[],
  lastRoundLoss: number
): { newTokens: number; roundStartBonus: number } {
  let bonus = 0

  // The Vibes: random 5–40 tokens
  if (hasRelic(relicIds, 'the_vibes')) {
    const relic = getRelicById('the_vibes')!
    const { min, max } = relic.effect.params
    bonus += Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Sunk Cost Fallacy: recover 30% of last round's losses
  if (hasRelic(relicIds, 'sunk_cost') && lastRoundLoss > 0) {
    const relic = getRelicById('sunk_cost')!
    bonus += Math.floor(lastRoundLoss * relic.effect.params.refundRate)
  }

  return { newTokens: tokens + bonus, roundStartBonus: bonus }
}

export function resolveRound(
  markets: Market[],
  bets: Record<string, Bet>,
  relicIds: string[],
  consecutiveCorrect: number,
  fixInfo?: FixInfo | null
): Omit<RoundSummary, 'roundStartBonus'> {
  let newConsecutiveCorrect = consecutiveCorrect
  let totalNetChange = 0
  let roundLoss = 0
  const results: MarketResult[] = []

  for (const market of markets) {
    // Determine outcome — fixed markets always resolve to guaranteedOutcome
    const isFixed = fixInfo?.marketId === market.id
    const outcome: 'YES' | 'NO' = isFixed
      ? fixInfo!.guaranteedOutcome
      : resolveOutcome(market.baseProbability)

    const flavorText = outcome === 'YES' ? market.yesFlavorText : market.noFlavorText
    const bet = bets[market.id] ?? null
    const appliedRelics: string[] = []

    if (!bet) {
      results.push({
        market, outcome, flavorText, bet: null,
        netChange: 0, baseGain: 0, bonusGain: 0, appliedRelics,
        wasFixed: isFixed, fixFlavorText: isFixed ? fixInfo!.flavorText : null,
      })
      continue
    }

    const won = bet.prediction === outcome

    if (won) {
      newConsecutiveCorrect++
    } else {
      newConsecutiveCorrect = 0
    }

    // ── Hedge Fund Brain ──────────────────────────────────────────
    if (hasRelic(relicIds, 'hedge_fund_brain')) {
      appliedRelics.push('hedge_fund_brain')
      const halfWager = Math.floor(bet.wager / 2)
      const otherHalfWager = bet.wager - halfWager
      const chosenProb = bet.prediction === 'YES' ? market.baseProbability : 1 - market.baseProbability
      const otherProb = 1 - chosenProb
      const chosenWins = bet.prediction === outcome

      let netChange = 0
      if (chosenWins) {
        netChange = Math.floor(halfWager * (1 / chosenProb - 1)) - otherHalfWager
      } else {
        netChange = Math.floor(otherHalfWager * (1 / otherProb - 1)) - halfWager
      }

      let bonusGain = 0
      if (hasRelic(relicIds, 'hot_streak') && newConsecutiveCorrect > 1) {
        const relicData = getRelicById('hot_streak')!
        const bonus = Math.min(
          (newConsecutiveCorrect - 1) * relicData.effect.params.bonusPerStreak,
          relicData.effect.params.maxBonus
        )
        if (netChange > 0) {
          bonusGain = Math.floor(netChange * bonus)
          netChange += bonusGain
          appliedRelics.push('hot_streak')
        }
      }

      if (netChange < 0) roundLoss += Math.abs(netChange)
      totalNetChange += netChange
      results.push({
        market, outcome, flavorText, bet, netChange,
        baseGain: netChange - bonusGain, bonusGain, appliedRelics,
        wasFixed: isFixed, fixFlavorText: isFixed ? fixInfo!.flavorText : null,
      })
      continue
    }

    // ── Standard resolution ──────────────────────────────────────
    if (!won) {
      const loss = bet.wager
      roundLoss += loss
      totalNetChange -= loss
      results.push({
        market, outcome, flavorText, bet, netChange: -loss,
        baseGain: -loss, bonusGain: 0, appliedRelics,
        wasFixed: isFixed, fixFlavorText: isFixed ? fixInfo!.flavorText : null,
      })
      continue
    }

    // Player won — calculate payout
    let baseGain = calculateNetGain(bet.wager, market.baseProbability, bet.prediction)
    let bonusGain = 0

    // Contrarian: +75% if betting NO on a market with baseProbability > 0.5
    if (
      hasRelic(relicIds, 'contrarian') &&
      bet.prediction === 'NO' &&
      market.baseProbability > 0.5
    ) {
      const relicData = getRelicById('contrarian')!
      bonusGain += Math.floor(baseGain * relicData.effect.params.bonus)
      appliedRelics.push('contrarian')
    }

    // Hot Streak: +10% per consecutive correct (stacks, max +100%)
    if (hasRelic(relicIds, 'hot_streak') && newConsecutiveCorrect > 1) {
      const relicData = getRelicById('hot_streak')!
      const streakBonus = Math.min(
        (newConsecutiveCorrect - 1) * relicData.effect.params.bonusPerStreak,
        relicData.effect.params.maxBonus
      )
      const streakBonusAmount = Math.floor((baseGain + bonusGain) * streakBonus)
      bonusGain += streakBonusAmount
      appliedRelics.push('hot_streak')
    }

    const netChange = baseGain + bonusGain
    totalNetChange += netChange
    results.push({
      market, outcome, flavorText, bet, netChange, baseGain, bonusGain, appliedRelics,
      wasFixed: isFixed, fixFlavorText: isFixed ? fixInfo!.flavorText : null,
    })
  }

  return {
    results,
    totalNetChange,
    newConsecutiveCorrect,
    newLastRoundLoss: roundLoss,
  }
}

// Effective wager after relic discounts (applied at bet time display)
export function effectiveWager(
  wager: number,
  prediction: 'YES' | 'NO',
  relicIds: string[],
  firstYesBetThisRound: boolean
): number {
  if (
    prediction === 'YES' &&
    firstYesBetThisRound &&
    relicIds.includes('confirmation_bias')
  ) {
    return Math.max(1, Math.floor(wager * 0.5))
  }
  return wager
}

export function getCrowdHint(market: Market): { leans: 'YES' | 'NO'; confidence: 'high' | 'medium' | 'low' } {
  const p = market.baseProbability
  const noise = (Math.random() - 0.5) * 0.08
  const adjusted = Math.max(0.1, Math.min(0.9, p + noise))
  const leans: 'YES' | 'NO' = adjusted > 0.5 ? 'YES' : 'NO'
  const distance = Math.abs(adjusted - 0.5)
  const confidence = distance > 0.25 ? 'high' : distance > 0.12 ? 'medium' : 'low'
  return { leans, confidence }
}
