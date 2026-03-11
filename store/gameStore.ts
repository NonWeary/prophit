import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Market } from '@/lib/markets'
import { selectMarkets } from '@/lib/markets'
import type { Relic } from '@/lib/relics'
import { getRelicById, getShopRelics } from '@/lib/relics'
import type { Bet, MarketResult } from '@/lib/gameEngine'
import { resolveRound, applyRoundStartEffects, effectiveWager } from '@/lib/gameEngine'

export type GamePhase =
  | 'landing'
  | 'betting'
  | 'resolving'
  | 'results'
  | 'shop'
  | 'gameover'

export interface GameState {
  phase: GamePhase
  round: number
  tokens: number
  relicIds: string[]
  consecutiveCorrect: number
  lastRoundLoss: number
  peeksUsed: number           // Crystal Ball uses (max 1 per run)
  crowdHintsUsedThisRound: number  // Wisdom of Crowds (1/round)
  marketHistory: MarketResult[]
  currentMarkets: Market[]
  currentBets: Record<string, Bet>   // marketId → Bet
  currentResults: MarketResult[]
  shopRelics: string[]         // relic IDs offered in shop
  usedMarketIds: string[]      // to avoid repeating markets in same run
  roundStartBonus: number      // tokens gained at round start (for display)
  runWon: boolean
  peekReveal: Record<string, boolean>  // marketId → revealed
  crowdHintReveal: Record<string, { leans: 'YES' | 'NO'; confidence: string }>
  firstYesBetPlaced: boolean   // for Confirmation Bias tracking
}

export interface GameActions {
  startRun: () => void
  placeBet: (marketId: string, prediction: 'YES' | 'NO', wager: number) => void
  removeBet: (marketId: string) => void
  resolveMarkets: () => void
  advanceRound: () => void
  buyRelic: (relicId: string) => void
  continueFromShop: () => void
  resetToLanding: () => void
  usePeek: (marketId: string) => void
  useCrowdHint: (marketId: string) => void
}

export type GameStore = GameState & GameActions

const STARTING_TOKENS = 100
const MARKETS_PER_ROUND = 3
const TOTAL_ROUNDS = 15
const SHOP_EVERY = 3

const initialState: GameState = {
  phase: 'landing',
  round: 0,
  tokens: STARTING_TOKENS,
  relicIds: [],
  consecutiveCorrect: 0,
  lastRoundLoss: 0,
  peeksUsed: 0,
  crowdHintsUsedThisRound: 0,
  marketHistory: [],
  currentMarkets: [],
  currentBets: {},
  currentResults: [],
  shopRelics: [],
  usedMarketIds: [],
  roundStartBonus: 0,
  runWon: false,
  peekReveal: {},
  crowdHintReveal: {},
  firstYesBetPlaced: false,
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startRun: () => {
        const markets = selectMarkets(MARKETS_PER_ROUND)
        const { newTokens, roundStartBonus } = applyRoundStartEffects(
          STARTING_TOKENS,
          [],
          0
        )
        set({
          ...initialState,
          phase: 'betting',
          round: 1,
          tokens: newTokens,
          roundStartBonus,
          currentMarkets: markets,
          usedMarketIds: markets.map(m => m.id),
        })
      },

      placeBet: (marketId, prediction, wager) => {
        const { relicIds, firstYesBetPlaced, tokens, currentBets } = get()
        const existingBet = currentBets[marketId]

        // Is this the first YES bet of the round (for Confirmation Bias)?
        const isFirstYes = prediction === 'YES' && !firstYesBetPlaced
        const eff = effectiveWager(wager, prediction, relicIds, isFirstYes)

        // Don't allow betting more than current tokens (minus other bets)
        const otherBetsTotal = Object.entries(currentBets)
          .filter(([id]) => id !== marketId)
          .reduce((sum, [, b]) => sum + b.wager, 0)
        const maxWager = Math.max(1, tokens - otherBetsTotal)
        const clampedWager = Math.min(eff, maxWager)

        set(state => ({
          currentBets: { ...state.currentBets, [marketId]: { prediction, wager: clampedWager } },
          firstYesBetPlaced: state.firstYesBetPlaced || prediction === 'YES',
        }))
      },

      removeBet: (marketId) => {
        set(state => {
          const bets = { ...state.currentBets }
          delete bets[marketId]
          return { currentBets: bets }
        })
      },

      resolveMarkets: () => {
        const { currentMarkets, currentBets, relicIds, consecutiveCorrect } = get()
        set({ phase: 'resolving' })

        // Resolution is triggered; actual calculation happens after animation
        setTimeout(() => {
          const { results, totalNetChange, newConsecutiveCorrect, newLastRoundLoss } =
            resolveRound(currentMarkets, currentBets, relicIds, consecutiveCorrect)

          const { tokens } = get()
          const newTokens = tokens + totalNetChange
          const bankrupt = newTokens <= 0

          set({
            phase: bankrupt ? 'gameover' : 'results',
            currentResults: results,
            marketHistory: [...get().marketHistory, ...results],
            tokens: bankrupt ? 0 : newTokens,
            consecutiveCorrect: newConsecutiveCorrect,
            lastRoundLoss: newLastRoundLoss,
            runWon: false,
          })
        }, 2400)
      },

      advanceRound: () => {
        const { round, tokens, relicIds, lastRoundLoss, usedMarketIds } = get()
        const nextRound = round + 1

        if (round >= TOTAL_ROUNDS) {
          set({ phase: 'gameover', runWon: true })
          return
        }

        if (round % SHOP_EVERY === 0) {
          // Go to shop
          const shopRelics = getShopRelics(get().relicIds).map(r => r.id)
          set({ phase: 'shop', shopRelics })
          return
        }

        // Next betting round
        const { newTokens, roundStartBonus } = applyRoundStartEffects(tokens, relicIds, lastRoundLoss)
        const newMarkets = selectMarkets(MARKETS_PER_ROUND, usedMarketIds)
        // If pool is exhausted, re-use markets
        const markets = newMarkets.length === MARKETS_PER_ROUND
          ? newMarkets
          : selectMarkets(MARKETS_PER_ROUND)

        set({
          phase: 'betting',
          round: nextRound,
          tokens: newTokens,
          roundStartBonus,
          currentMarkets: markets,
          currentBets: {},
          currentResults: [],
          peekReveal: {},
          crowdHintReveal: {},
          crowdHintsUsedThisRound: 0,
          firstYesBetPlaced: false,
          usedMarketIds: [...usedMarketIds, ...markets.map(m => m.id)],
        })
      },

      buyRelic: (relicId) => {
        const { tokens, relicIds } = get()
        const relic = getRelicById(relicId)
        if (!relic || relicIds.includes(relicId) || tokens < relic.cost) return
        set({
          tokens: tokens - relic.cost,
          relicIds: [...relicIds, relicId],
          shopRelics: get().shopRelics.filter(id => id !== relicId),
        })
      },

      continueFromShop: () => {
        const { round, tokens, relicIds, lastRoundLoss, usedMarketIds } = get()
        const nextRound = round + 1

        if (nextRound > TOTAL_ROUNDS) {
          set({ phase: 'gameover', runWon: true })
          return
        }

        const { newTokens, roundStartBonus } = applyRoundStartEffects(tokens, relicIds, lastRoundLoss)
        const newMarkets = selectMarkets(MARKETS_PER_ROUND, usedMarketIds)
        const markets = newMarkets.length === MARKETS_PER_ROUND
          ? newMarkets
          : selectMarkets(MARKETS_PER_ROUND)

        set({
          phase: 'betting',
          round: nextRound,
          tokens: newTokens,
          roundStartBonus,
          currentMarkets: markets,
          currentBets: {},
          currentResults: [],
          peekReveal: {},
          crowdHintReveal: {},
          crowdHintsUsedThisRound: 0,
          firstYesBetPlaced: false,
          usedMarketIds: [...usedMarketIds, ...markets.map(m => m.id)],
        })
      },

      resetToLanding: () => {
        set(initialState)
      },

      usePeek: (marketId) => {
        const { peeksUsed, relicIds } = get()
        if (!relicIds.includes('crystal_ball')) return
        if (peeksUsed >= 1) return
        set(state => ({
          peeksUsed: state.peeksUsed + 1,
          peekReveal: { ...state.peekReveal, [marketId]: true },
        }))
      },

      useCrowdHint: (marketId) => {
        const { crowdHintsUsedThisRound, relicIds, currentMarkets } = get()
        if (!relicIds.includes('wisdom_of_crowds')) return
        if (crowdHintsUsedThisRound >= 1) return
        const market = currentMarkets.find(m => m.id === marketId)
        if (!market) return

        // Import getCrowdHint lazily to avoid circular imports
        import('@/lib/gameEngine').then(({ getCrowdHint }) => {
          const hint = getCrowdHint(market)
          set(state => ({
            crowdHintsUsedThisRound: state.crowdHintsUsedThisRound + 1,
            crowdHintReveal: { ...state.crowdHintReveal, [marketId]: hint },
          }))
        })
      },
    }),
    {
      name: 'prophit-run',
      // Only persist the data, not function references
      partialize: (state) => ({
        phase: state.phase,
        round: state.round,
        tokens: state.tokens,
        relicIds: state.relicIds,
        consecutiveCorrect: state.consecutiveCorrect,
        lastRoundLoss: state.lastRoundLoss,
        peeksUsed: state.peeksUsed,
        crowdHintsUsedThisRound: state.crowdHintsUsedThisRound,
        marketHistory: state.marketHistory,
        currentMarkets: state.currentMarkets,
        currentBets: state.currentBets,
        currentResults: state.currentResults,
        shopRelics: state.shopRelics,
        usedMarketIds: state.usedMarketIds,
        roundStartBonus: state.roundStartBonus,
        runWon: state.runWon,
        peekReveal: state.peekReveal,
        crowdHintReveal: state.crowdHintReveal,
        firstYesBetPlaced: state.firstYesBetPlaced,
      }),
    }
  )
)