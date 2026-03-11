import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Market } from '@/lib/markets'
import { selectMarkets } from '@/lib/markets'
import { getRelicById, getShopRelics } from '@/lib/relics'
import type { Bet, MarketResult, FixInfo } from '@/lib/gameEngine'
import { resolveRound, applyRoundStartEffects, effectiveWager } from '@/lib/gameEngine'
import { selectStoryRoundMarkets, getChapterForRound, CHAPTER_MARKETS } from '@/lib/storyMarkets'
import { getFixById, getFixesForShop } from '@/lib/fixes'

export type GamePhase =
  | 'landing'
  | 'betting'
  | 'resolving'
  | 'results'
  | 'shop'
  | 'gameover'

export type GameMode = 'story' | 'endless'

export interface HighScoreEntry {
  id: string
  date: string
  round: number
  totalCorrect: number
  totalAttempted: number
  bestStreak: number
  finalTokens: number
  totalEarned: number
  totalLost: number
}

export interface GameState {
  // Core
  phase: GamePhase
  mode: GameMode
  round: number
  tokens: number
  relicIds: string[]
  consecutiveCorrect: number
  lastRoundLoss: number
  // Relic helpers
  peeksUsed: number
  crowdHintsUsedThisRound: number
  // Markets
  marketHistory: MarketResult[]
  currentMarkets: Market[]
  currentBets: Record<string, Bet>
  currentResults: MarketResult[]
  usedMarketIds: string[]
  roundStartBonus: number
  // Shop
  shopRelics: string[]
  // Run outcome
  runWon: boolean
  // UI helpers
  peekReveal: Record<string, boolean>
  crowdHintReveal: Record<string, { leans: 'YES' | 'NO'; confidence: string }>
  firstYesBetPlaced: boolean
  // Story Mode
  chapter: number // 1–5
  showChapterIntro: boolean
  // Fix System (Story Mode)
  activeFixId: string | null
  activeFixMarketId: string | null
  activeFixGuaranteedOutcome: 'YES' | 'NO' | null
  // Stats (tracked in both modes, displayed prominently in Endless)
  currentStreak: number
  bestStreak: number
  totalCorrect: number
  totalAttempted: number
  totalEarned: number
  totalLost: number
  // Game over reason
  gameOverReason: 'bankrupt' | null
}

export interface GameActions {
  // Mode entry
  startStoryRun: () => void
  startEndlessRun: () => void
  // Kept for backwards compat (maps to endless)
  startRun: () => void
  // Betting
  placeBet: (marketId: string, prediction: 'YES' | 'NO', wager: number) => void
  removeBet: (marketId: string) => void
  // Resolution
  resolveMarkets: () => void
  advanceRound: () => void
  // Shop
  buyRelic: (relicId: string) => void
  continueFromShop: () => void
  // Fix system
  purchaseFix: (fixId: string) => void
  // Navigation
  resetToLanding: () => void
  dismissChapterIntro: () => void
  // Relic abilities
  usePeek: (marketId: string) => void
  useCrowdHint: (marketId: string) => void
}

export type GameStore = GameState & GameActions

const STARTING_TOKENS = 100
const MARKETS_PER_ROUND = 3
const TOTAL_ROUNDS = 15
const SHOP_EVERY = 3

// Tokens required to enter each chapter (checked at shop between chapters)
export const CHAPTER_TOKEN_REQUIREMENTS: Record<2 | 3 | 4 | 5, number> = {
  2: 130,
  3: 200,
  4: 320,
  5: 500,
}

const initialState: GameState = {
  phase: 'landing',
  mode: 'endless',
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
  chapter: 1,
  showChapterIntro: false,
  activeFixId: null,
  activeFixMarketId: null,
  activeFixGuaranteedOutcome: null,
  currentStreak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalAttempted: 0,
  totalEarned: 0,
  totalLost: 0,
  gameOverReason: null,
}

// ── High Score helpers (separate localStorage key) ──────────────
const HS_KEY = 'prophit-scores'

function loadHighScores(): HighScoreEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(HS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveHighScore(entry: HighScoreEntry): void {
  if (typeof window === 'undefined') return
  const existing = loadHighScores()
  const updated = [...existing, entry]
    .sort((a, b) => b.totalCorrect - a.totalCorrect || b.finalTokens - a.finalTokens)
    .slice(0, 5)
  localStorage.setItem(HS_KEY, JSON.stringify(updated))
}

// ── Market selection helpers ────────────────────────────────────
function pickMarketsForRound(
  mode: GameMode,
  chapter: number,
  usedMarketIds: string[],
  activeFixMarketId: string | null
): Market[] {
  if (mode === 'story') {
    const ch = Math.min(5, Math.max(1, chapter)) as 1 | 2 | 3 | 4 | 5
    return selectStoryRoundMarkets(ch, usedMarketIds, activeFixMarketId)
  }
  // Endless: full pool, no fix
  const markets = selectMarkets(MARKETS_PER_ROUND, usedMarketIds)
  return markets.length === MARKETS_PER_ROUND
    ? markets
    : selectMarkets(MARKETS_PER_ROUND)
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Run start ─────────────────────────────────────────────
      startStoryRun: () => {
        const markets = selectStoryRoundMarkets(1, [], null)
        const { newTokens, roundStartBonus } = applyRoundStartEffects(STARTING_TOKENS, [], 0)
        set({
          ...initialState,
          mode: 'story',
          phase: 'betting',
          round: 1,
          chapter: 1,
          tokens: newTokens,
          roundStartBonus,
          currentMarkets: markets,
          usedMarketIds: markets.map(m => m.id),
          showChapterIntro: true,
        })
      },

      startEndlessRun: () => {
        const markets = selectMarkets(MARKETS_PER_ROUND)
        const { newTokens, roundStartBonus } = applyRoundStartEffects(STARTING_TOKENS, [], 0)
        set({
          ...initialState,
          mode: 'endless',
          phase: 'betting',
          round: 1,
          tokens: newTokens,
          roundStartBonus,
          currentMarkets: markets,
          usedMarketIds: markets.map(m => m.id),
        })
      },

      startRun: () => get().startEndlessRun(),

      // ── Betting ───────────────────────────────────────────────
      placeBet: (marketId, prediction, wager) => {
        const { relicIds, firstYesBetPlaced, tokens, currentBets } = get()
        const isFirstYes = prediction === 'YES' && !firstYesBetPlaced
        const eff = effectiveWager(wager, prediction, relicIds, isFirstYes)
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

      // ── Resolution ────────────────────────────────────────────
      resolveMarkets: () => {
        const {
          currentMarkets, currentBets, relicIds, consecutiveCorrect,
          activeFixId, activeFixMarketId, activeFixGuaranteedOutcome,
          mode, round, bestStreak, totalCorrect, totalAttempted, totalEarned, totalLost,
        } = get()
        set({ phase: 'resolving' })

        setTimeout(() => {
          // Build fixInfo if a fix is active
          const fixInfo: FixInfo | null =
            activeFixId && activeFixMarketId && activeFixGuaranteedOutcome
              ? {
                  marketId: activeFixMarketId,
                  guaranteedOutcome: activeFixGuaranteedOutcome,
                  flavorText: getFixById(activeFixId)?.flavorText ?? '',
                }
              : null

          const { results, totalNetChange, newConsecutiveCorrect, newLastRoundLoss } =
            resolveRound(currentMarkets, currentBets, relicIds, consecutiveCorrect, fixInfo)

          // Update stats
          let newTotalCorrect = totalCorrect
          let newTotalAttempted = totalAttempted
          let newTotalEarned = totalEarned
          let newTotalLost = totalLost

          for (const r of results) {
            if (r.bet) {
              newTotalAttempted++
              if (r.netChange > 0) {
                newTotalCorrect++
                newTotalEarned += r.netChange
              } else if (r.netChange < 0) {
                newTotalLost += Math.abs(r.netChange)
              }
            }
          }

          const newBestStreak = Math.max(bestStreak, newConsecutiveCorrect)

          // Check if the fix was consumed
          const fixConsumed = fixInfo && results.some(r => r.market.id === fixInfo.marketId)

          const { tokens } = get()
          const newTokens = tokens + totalNetChange
          const bankrupt = newTokens <= 0

          // Save score for endless mode on bankruptcy
          if (bankrupt && mode === 'endless') {
            saveHighScore({
              id: Date.now().toString(),
              date: new Date().toLocaleDateString(),
              round,
              totalCorrect: newTotalCorrect,
              totalAttempted: newTotalAttempted,
              bestStreak: newBestStreak,
              finalTokens: 0,
              totalEarned: newTotalEarned,
              totalLost: newTotalLost,
            })
          }

          set(state => ({
            phase: bankrupt ? 'gameover' : 'results',
            currentResults: results,
            marketHistory: [...state.marketHistory, ...results],
            tokens: bankrupt ? 0 : newTokens,
            consecutiveCorrect: newConsecutiveCorrect,
            lastRoundLoss: newLastRoundLoss,
            runWon: false,
            gameOverReason: bankrupt ? 'bankrupt' : state.gameOverReason,
            currentStreak: newConsecutiveCorrect,
            bestStreak: newBestStreak,
            totalCorrect: newTotalCorrect,
            totalAttempted: newTotalAttempted,
            totalEarned: newTotalEarned,
            totalLost: newTotalLost,
            // Clear fix if consumed
            activeFixId: fixConsumed ? null : state.activeFixId,
            activeFixMarketId: fixConsumed ? null : state.activeFixMarketId,
            activeFixGuaranteedOutcome: fixConsumed ? null : state.activeFixGuaranteedOutcome,
          }))
        }, 2400)
      },

      // ── Advance round ─────────────────────────────────────────
      advanceRound: () => {
        const {
          round, tokens, relicIds, lastRoundLoss, usedMarketIds,
          mode, chapter, activeFixMarketId,
          bestStreak, totalCorrect, totalAttempted, totalEarned, totalLost,
        } = get()

        if (round % SHOP_EVERY === 0) {
          // Go to shop (story win is detected in continueFromShop, not here)
          if (mode === 'endless' && round >= TOTAL_ROUNDS) {
            saveHighScore({
              id: Date.now().toString(),
              date: new Date().toLocaleDateString(),
              round,
              totalCorrect,
              totalAttempted,
              bestStreak,
              finalTokens: tokens,
              totalEarned,
              totalLost,
            })
            set({ phase: 'gameover', runWon: true })
            return
          }
          const shopRelicOptions = getShopRelics(relicIds).map(r => r.id)
          set({ phase: 'shop', shopRelics: shopRelicOptions })
          return
        }

        // Next betting round — chapter stays fixed until the shop gate passes
        const nextRound = round + 1
        const { newTokens, roundStartBonus } = applyRoundStartEffects(tokens, relicIds, lastRoundLoss)
        const markets = pickMarketsForRound(mode, chapter, usedMarketIds, activeFixMarketId)

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
          showChapterIntro: false,
          usedMarketIds: [...usedMarketIds, ...markets.map(m => m.id)],
        })
      },

      // ── Relics ────────────────────────────────────────────────
      buyRelic: (relicId) => {
        const { tokens, relicIds } = get()
        const relic = getRelicById(relicId)
        if (!relic || relicIds.includes(relicId) || tokens < relic.cost) return
        set(state => ({
          tokens: state.tokens - relic.cost,
          relicIds: [...state.relicIds, relicId],
          shopRelics: state.shopRelics.filter(id => id !== relicId),
        }))
      },

      // ── Fix purchase ──────────────────────────────────────────
      purchaseFix: (fixId) => {
        const { tokens, activeFixId } = get()
        if (activeFixId) return // Only 1 fix at a time
        const fix = getFixById(fixId)
        if (!fix || tokens < fix.cost) return
        set({
          tokens: tokens - fix.cost,
          activeFixId: fix.id,
          activeFixMarketId: fix.targetMarketId,
          activeFixGuaranteedOutcome: fix.guaranteedOutcome,
        })
      },

      // ── Continue from shop ────────────────────────────────────
      continueFromShop: () => {
        const {
          round, tokens, relicIds, lastRoundLoss, usedMarketIds,
          mode, chapter, activeFixMarketId,
          bestStreak, totalCorrect, totalAttempted, totalEarned, totalLost,
        } = get()
        const nextRound = round + 1

        // Story mode: chapter advancement is token-gated, not round-gated
        if (mode === 'story') {
          // Win condition: completed the shop after Chapter 5
          if (chapter === 5) {
            set({ phase: 'gameover', runWon: true })
            return
          }

          // Try to advance to next chapter
          const tentativeNext = (chapter + 1) as 2 | 3 | 4 | 5
          const required = CHAPTER_TOKEN_REQUIREMENTS[tentativeNext]
          const canAdvance = tokens >= required
          const nextChapter = canAdvance ? tentativeNext : chapter

          const { newTokens, roundStartBonus } = applyRoundStartEffects(tokens, relicIds, lastRoundLoss)
          const markets = pickMarketsForRound('story', nextChapter, usedMarketIds, activeFixMarketId)

          set({
            phase: 'betting',
            round: nextRound,
            chapter: nextChapter,
            tokens: newTokens,
            roundStartBonus,
            currentMarkets: markets,
            currentBets: {},
            currentResults: [],
            peekReveal: {},
            crowdHintReveal: {},
            crowdHintsUsedThisRound: 0,
            firstYesBetPlaced: false,
            showChapterIntro: canAdvance,
            usedMarketIds: [...usedMarketIds, ...markets.map(m => m.id)],
          })
          return
        }

        // Endless mode
        if (nextRound > TOTAL_ROUNDS) {
          saveHighScore({
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            round,
            totalCorrect,
            totalAttempted,
            bestStreak,
            finalTokens: tokens,
            totalEarned,
            totalLost,
          })
          set({ phase: 'gameover', runWon: true })
          return
        }

        const { newTokens, roundStartBonus } = applyRoundStartEffects(tokens, relicIds, lastRoundLoss)
        const markets = pickMarketsForRound('endless', chapter, usedMarketIds, activeFixMarketId)

        set({
          phase: 'betting',
          round: nextRound,
          chapter,
          tokens: newTokens,
          roundStartBonus,
          currentMarkets: markets,
          currentBets: {},
          currentResults: [],
          peekReveal: {},
          crowdHintReveal: {},
          crowdHintsUsedThisRound: 0,
          firstYesBetPlaced: false,
          showChapterIntro: false,
          usedMarketIds: [...usedMarketIds, ...markets.map(m => m.id)],
        })
      },

      // ── Misc ──────────────────────────────────────────────────
      resetToLanding: () => set(initialState),

      dismissChapterIntro: () => set({ showChapterIntro: false }),

      usePeek: (marketId) => {
        const { peeksUsed, relicIds } = get()
        if (!relicIds.includes('crystal_ball') || peeksUsed >= 1) return
        set(state => ({
          peeksUsed: state.peeksUsed + 1,
          peekReveal: { ...state.peekReveal, [marketId]: true },
        }))
      },

      useCrowdHint: (marketId) => {
        const { crowdHintsUsedThisRound, relicIds, currentMarkets } = get()
        if (!relicIds.includes('wisdom_of_crowds') || crowdHintsUsedThisRound >= 1) return
        const market = currentMarkets.find(m => m.id === marketId)
        if (!market) return

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
      partialize: (state) => ({
        phase: state.phase,
        mode: state.mode,
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
        chapter: state.chapter,
        showChapterIntro: state.showChapterIntro,
        activeFixId: state.activeFixId,
        activeFixMarketId: state.activeFixMarketId,
        activeFixGuaranteedOutcome: state.activeFixGuaranteedOutcome,
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
        totalCorrect: state.totalCorrect,
        totalAttempted: state.totalAttempted,
        totalEarned: state.totalEarned,
        totalLost: state.totalLost,
        gameOverReason: state.gameOverReason,
      }),
    }
  )
)

// ── High score reader (for use in scores page) ─────────────────
export function getHighScores(): HighScoreEntry[] {
  return loadHighScores()
}
