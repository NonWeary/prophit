export type RelicEffectType =
  | 'CRYSTAL_BALL'
  | 'YES_BET_DISCOUNT'
  | 'HEDGE_BET'
  | 'ROUND_START_BONUS'
  | 'HOT_STREAK_MULTIPLIER'
  | 'CONTRARIAN_BONUS'
  | 'SUNK_COST_REFUND'
  | 'CROWD_HINT'

export interface RelicEffect {
  type: RelicEffectType
  params: Record<string, number>
}

export interface Relic {
  id: string
  name: string
  description: string
  flavorText: string
  cost: number
  effect: RelicEffect
}

export const RELICS: Relic[] = [
  {
    id: 'crystal_ball',
    name: 'Crystal Ball',
    description: 'Once per run: reveal the true probability of any market before you bet.',
    flavorText: '"The future is clear. Unfortunately, so is your WiFi password."',
    cost: 60,
    effect: { type: 'CRYSTAL_BALL', params: { totalUses: 1 } },
  },
  {
    id: 'confirmation_bias',
    name: 'Confirmation Bias',
    description: 'Your YES bets cost 50% fewer tokens. You were right all along.',
    flavorText: '"I knew it. I always knew it. Stop asking me how I knew it."',
    cost: 40,
    effect: { type: 'YES_BET_DISCOUNT', params: { discount: 0.5 } },
  },
  {
    id: 'hedge_fund_brain',
    name: 'Hedge Fund Brain',
    description: 'Your wager is auto-split 50/50 across YES and NO. Technically, you\'re always right.',
    flavorText: '"Directional exposure is for people who feel things."',
    cost: 50,
    effect: { type: 'HEDGE_BET', params: {} },
  },
  {
    id: 'the_vibes',
    name: 'The Vibes',
    description: 'Receive a random bonus of 5–40 Prophet Tokens at the start of each round.',
    flavorText: '"Sometimes the universe just likes you more than other people."',
    cost: 45,
    effect: { type: 'ROUND_START_BONUS', params: { min: 5, max: 40 } },
  },
  {
    id: 'hot_streak',
    name: 'Hot Streak',
    description: '+10% payout multiplier per consecutive correct prediction. Resets on a wrong call.',
    flavorText: '"You can\'t stop me. I\'m in the zone. The zone is real and I live there now."',
    cost: 55,
    effect: { type: 'HOT_STREAK_MULTIPLIER', params: { bonusPerStreak: 0.1, maxBonus: 1.0 } },
  },
  {
    id: 'contrarian',
    name: 'Contrarian',
    description: 'Earn +75% bonus tokens when you correctly bet against market consensus (>50% base).',
    flavorText: '"Everyone was wrong. As usual. You\'re welcome, everyone."',
    cost: 50,
    effect: { type: 'CONTRARIAN_BONUS', params: { bonus: 0.75 } },
  },
  {
    id: 'sunk_cost',
    name: 'Sunk Cost Fallacy',
    description: 'Recover 30% of tokens lost in the previous round at round start. Stop when ahead.',
    flavorText: '"I\'ve already invested too much to not recover some of it."',
    cost: 35,
    effect: { type: 'SUNK_COST_REFUND', params: { refundRate: 0.3 } },
  },
  {
    id: 'wisdom_of_crowds',
    name: 'Wisdom of Crowds',
    description: 'Once per round: see which way the "crowd" is leaning on a market.',
    flavorText: '"Fifty million flies can\'t be wrong. Probably."',
    cost: 30,
    effect: { type: 'CROWD_HINT', params: { usesPerRound: 1 } },
  },
]

export function getRelicById(id: string): Relic | undefined {
  return RELICS.find(r => r.id === id)
}

export function getShopRelics(ownedIds: string[], count = 3): Relic[] {
  const available = RELICS.filter(r => !ownedIds.includes(r.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}