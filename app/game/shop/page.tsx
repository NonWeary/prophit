'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore, CHAPTER_TOKEN_REQUIREMENTS } from '@/store/gameStore'
import RelicCard from '@/components/RelicCard'
import TokenDisplay from '@/components/TokenDisplay'
import { getRelicById } from '@/lib/relics'
import { getFixById, getFixesForShop, getFtcTriggerChance, getHeatLabel } from '@/lib/fixes'
import type { Fix } from '@/lib/fixes'
import { CHAPTER_MARKETS } from '@/lib/storyMarkets'

export default function ShopPage() {
  const router = useRouter()
  const {
    phase,
    mode,
    round,
    tokens,
    relicIds,
    shopRelics,
    chapter,
    activeFixId,
    activeFixMarketId,
    activeFixGuaranteedOutcome,
    heat,
    ftcLocked,
    ftcCostMultiplier,
    buyRelic,
    continueFromShop,
    purchaseFix,
  } = useGameStore()

  const [activeTab, setActiveTab] = useState<'relics' | 'fix'>('relics')

  useEffect(() => {
    if (phase === 'landing') router.replace('/')
    if (phase === 'betting' || phase === 'resolving' || phase === 'results') router.replace('/game')
    if (phase === 'gameover') router.replace('/game')
  }, [phase, router])

  if (phase !== 'shop') return null

  const offeredRelics = shopRelics
    .map(id => getRelicById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getRelicById>>[]

  const ownedRelicObjects = relicIds
    .map(id => getRelicById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getRelicById>>[]

  const isStory = mode === 'story'
  const shopTitle = isStory ? "THE PROPHET'S EMPORIUM" : "RELIC SHOP"

  // Story mode: chapter advancement gate
  const nextChapter = chapter + 1
  const chapterRequirement = isStory && nextChapter <= 5
    ? CHAPTER_TOKEN_REQUIREMENTS[nextChapter as 2 | 3 | 4 | 5]
    : null
  const canAdvanceChapter = chapterRequirement === null || tokens >= chapterRequirement

  const availableFixes: Fix[] = isStory && nextChapter <= 5
    ? getFixesForShop(nextChapter)
    : []

  const activeFix = activeFixId ? getFixById(activeFixId) : null
  const activeFixMarket = activeFixMarketId
    ? Object.values(CHAPTER_MARKETS).flat().find(m => m.id === activeFixMarketId)
    : null

  function handleContinue() {
    continueFromShop()
    router.replace('/game')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080F1E', fontFamily: 'var(--font-mono)' }}>

      {/* Header */}
      <header
        className="border-b px-4 py-3 flex items-center justify-between gap-4 shrink-0"
        style={{ borderColor: '#1A2E52', background: '#0E1A30' }}
      >
        <div className="flex items-center gap-6">
          <div className="text-xs uppercase tracking-widest" style={{ color: '#FFCC00' }}>
            ▪ {shopTitle}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: '#4A6A94' }}>AFTER ROUND</span>
            <span style={{ color: '#C8DCF8' }} className="font-bold">{round}</span>
          </div>
          {isStory && (
            <div className="text-xs" style={{ color: '#4A6A94' }}>
              CH <span style={{ color: '#FFCC00' }}>{chapter}</span>
              {nextChapter <= 5 && <span> → CH <span style={{ color: '#FFCC00' }}>{nextChapter}</span></span>}
            </div>
          )}
        </div>
        <TokenDisplay tokens={tokens} showDelta />
      </header>

      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: '#1A2E52' }}>
        <div
          className="h-full"
          style={{ width: `${(round / 15) * 100}%`, background: '#FFCC00' }}
        />
      </div>

      {/* Tabs (Story Mode only) */}
      {isStory && (
        <div className="border-b flex" style={{ borderColor: '#1A2E52' }}>
          <button
            onClick={() => setActiveTab('relics')}
            className="px-6 py-3 text-xs uppercase tracking-widest border-b-2 transition-colors cursor-pointer"
            style={{
              borderColor: activeTab === 'relics' ? '#00FF88' : 'transparent',
              color: activeTab === 'relics' ? '#00FF88' : '#4A6A94',
              background: 'transparent',
            }}
          >
            RELICS
          </button>
          <button
            onClick={() => setActiveTab('fix')}
            className="px-6 py-3 text-xs uppercase tracking-widest border-b-2 transition-colors cursor-pointer flex items-center gap-2"
            style={{
              borderColor: activeTab === 'fix' ? '#FF4444' : 'transparent',
              color: activeTab === 'fix' ? '#FF4444' : '#4A6A94',
              background: 'transparent',
            }}
          >
            THE FIX
            {activeFix && (
              <span
                className="px-1 py-0.5 text-[10px] leading-none"
                style={{ background: '#FF4444', color: '#080F1E' }}
              >
                ACTIVE
              </span>
            )}
          </button>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col gap-8">

        {/* ── RELICS TAB ── */}
        {(!isStory || activeTab === 'relics') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {!isStory && (
                <div className="border-b pb-4 mb-6" style={{ borderColor: '#1A2E52' }}>
                  <h1 className="font-bold text-xl mb-2" style={{ color: '#C8DCF8' }}>
                    RELIC SHOP
                  </h1>
                  <p className="text-xs" style={{ color: '#6A8AB4' }}>
                    Spend Prophet Tokens on cognitive relics that bend the rules of prediction.
                  </p>
                </div>
              )}

              <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#4A6A94' }}>
                AVAILABLE RELICS ({offeredRelics.length})
              </div>

              {offeredRelics.length === 0 ? (
                <div
                  className="border p-8 text-center text-xs"
                  style={{ borderColor: '#1A2E52', color: '#4A6A94' }}
                >
                  YOU ALREADY OWN EVERYTHING.
                  <br />THE EMPORIUM HAS NOTHING LEFT TO OFFER.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offeredRelics.map(relic => (
                    <RelicCard
                      key={relic.id}
                      relic={relic}
                      owned={false}
                      canAfford={tokens >= relic.cost}
                      onBuy={() => buyRelic(relic.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="border p-4" style={{ borderColor: '#1A2E52', background: '#0E1A30' }}>
                <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#4A6A94' }}>
                  ACCOUNT BALANCE
                </div>
                <div className="font-bold text-2xl mb-1" style={{ color: '#00FF88' }}>{tokens} PT</div>
                <div className="text-xs" style={{ color: '#4A6A94' }}>PROPHET TOKENS REMAINING</div>
              </div>

              {ownedRelicObjects.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#4A6A94' }}>
                    YOUR RELICS
                  </div>
                  <div className="flex flex-col gap-2">
                    {ownedRelicObjects.map(relic => (
                      <RelicCard key={relic.id} relic={relic} owned compact />
                    ))}
                  </div>
                </div>
              )}

              {ownedRelicObjects.length === 0 && (
                <div className="border p-4 text-xs" style={{ borderColor: '#1A2E52', color: '#4A6A94' }}>
                  NO RELICS ACQUIRED YET.
                  <br />THE UNAUGMENTED MIND IS ITS OWN PRISON.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── THE FIX TAB (Story Mode only) ── */}
        {isStory && activeTab === 'fix' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Header */}
              <div
                className="border-b pb-4 mb-6"
                style={{ borderColor: '#2A0808' }}
              >
                <h1 className="font-bold text-xl mb-2" style={{ color: '#FF4444' }}>
                  THE FIX
                </h1>
                <p className="text-xs leading-relaxed" style={{ color: '#6A8AB4' }}>
                  Spend Prophet Tokens to guarantee a specific market outcome in the next chapter.
                  One fix active at a time. Results are unambiguous. Your involvement is not.
                </p>
              </div>

              {/* FTC Cease & Desist lock banner */}
              {ftcLocked && (
                <div
                  className="border p-4 mb-6 animate-slide-up"
                  style={{ borderColor: '#FF4444', background: 'rgba(255,68,68,0.06)' }}
                >
                  <div className="text-xs uppercase tracking-widest mb-1 animate-blink" style={{ color: '#FF4444' }}>
                    ⚠ CEASE & DESIST IN EFFECT
                  </div>
                  <p className="text-xs" style={{ color: '#6A8AB4' }}>
                    The Fix System is suspended for this shop phase by order of the FTC. You may not
                    purchase or arrange any market interventions at this time. The order expires after
                    you continue to the next round.
                  </p>
                </div>
              )}

              {/* Forced Transparency banner */}
              {!ftcLocked && ftcCostMultiplier > 1 && (
                <div
                  className="border p-3 mb-6"
                  style={{ borderColor: '#FFCC00', background: 'rgba(255,204,0,0.06)' }}
                >
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#FFCC00' }}>
                    ⚠ ENHANCED COMPLIANCE ACTIVE
                  </div>
                  <p className="text-xs" style={{ color: '#6A8AB4' }}>
                    Your next Fix purchase costs <span style={{ color: '#FFCC00' }}>2× the listed price</span> due
                    to a Forced Transparency order. This surcharge applies to one transaction only.
                  </p>
                </div>
              )}

              {/* Active fix notice */}
              {activeFix && (
                <div
                  className="border p-4 mb-6"
                  style={{ borderColor: '#2A0808', background: 'rgba(255,68,68,0.04)' }}
                >
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#FF4444' }}>
                    FIX ACTIVE — AWAITING EXECUTION
                  </div>
                  <div className="font-bold mb-1" style={{ color: '#C8DCF8' }}>{activeFix.name}</div>
                  {activeFixMarket && (
                    <div className="text-xs mb-2" style={{ color: '#6A8AB4' }}>
                      Target: <span style={{ color: '#C8DCF8' }}>&ldquo;{activeFixMarket.title}&rdquo;</span>
                    </div>
                  )}
                  <div className="text-xs" style={{ color: '#4A6A94' }}>
                    Guaranteed outcome:{' '}
                    <span
                      className="font-bold"
                      style={{ color: activeFixGuaranteedOutcome === 'YES' ? '#00FF88' : '#FF4444' }}
                    >
                      {activeFixGuaranteedOutcome}
                    </span>
                    <span style={{ color: '#4A6A94' }}> · Will appear in next round · Bet accordingly.</span>
                  </div>
                </div>
              )}

              {/* Available fixes */}
              {!activeFix && !ftcLocked && nextChapter <= 5 && availableFixes.length > 0 && (
                <>
                  <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#4A6A94' }}>
                    AVAILABLE FOR CHAPTER {nextChapter} ({availableFixes.length})
                  </div>
                  <div className="flex flex-col gap-4">
                    {availableFixes.map(fix => {
                      const targetMarket = Object.values(CHAPTER_MARKETS)
                        .flat()
                        .find(m => m.id === fix.targetMarketId)
                      const effectiveCost = fix.cost * ftcCostMultiplier
                      const canAfford = tokens >= effectiveCost

                      return (
                        <div
                          key={fix.id}
                          className="border flex flex-col gap-3 p-4"
                          style={{
                            borderColor: canAfford ? '#2A0808' : '#1A2E52',
                            background: canAfford ? 'rgba(255,68,68,0.03)' : '#0E1A30',
                            opacity: canAfford ? 1 : 0.6,
                          }}
                        >
                          {/* Fix header */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div
                                className="text-xs uppercase tracking-widest mb-1"
                                style={{ color: '#FF4444' }}
                              >
                                ⚑ FIX
                              </div>
                              <div className="font-bold" style={{ color: '#C8DCF8' }}>
                                {fix.name}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              {ftcCostMultiplier > 1 && (
                                <div
                                  className="text-[10px] line-through"
                                  style={{ color: '#4A6A94' }}
                                >
                                  {fix.cost.toLocaleString()}
                                </div>
                              )}
                              <div
                                className="font-bold text-sm"
                                style={{ color: canAfford ? '#FFCC00' : '#4A6A94' }}
                              >
                                {effectiveCost.toLocaleString()}
                              </div>
                              <div className="text-[10px] uppercase" style={{ color: '#4A6A94' }}>
                                {ftcCostMultiplier > 1 ? '2× RATE' : 'tokens'}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs leading-relaxed" style={{ color: '#6A8AB4' }}>
                            {fix.description}
                          </p>

                          {/* Target market */}
                          {targetMarket && (
                            <div
                              className="border p-2 text-xs"
                              style={{ borderColor: '#1A2E52' }}
                            >
                              <div className="uppercase tracking-wider mb-1" style={{ color: '#4A6A94' }}>
                                GUARANTEES
                              </div>
                              <div style={{ color: '#6A8AB4' }}>
                                &ldquo;{targetMarket.title}&rdquo; →{' '}
                                <span
                                  className="font-bold"
                                  style={{ color: fix.guaranteedOutcome === 'YES' ? '#00FF88' : '#FF4444' }}
                                >
                                  {fix.guaranteedOutcome}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Flavor */}
                          <p
                            className="text-xs italic leading-relaxed border-l-2 pl-3"
                            style={{ color: '#4A6A94', borderColor: '#2A0808' }}
                          >
                            {fix.flavorText}
                          </p>

                          {/* Buy button */}
                          <button
                            onClick={() => purchaseFix(fix.id)}
                            disabled={!canAfford}
                            className="w-full py-2 text-xs font-bold uppercase tracking-widest border transition-colors"
                            style={{
                              borderColor: canAfford ? '#FF4444' : '#1A2E52',
                              color: canAfford ? '#FF4444' : '#4A6A94',
                              background: 'transparent',
                              cursor: canAfford ? 'pointer' : 'not-allowed',
                            }}
                            onMouseEnter={e => {
                              if (canAfford) {
                                e.currentTarget.style.background = '#FF4444'
                                e.currentTarget.style.color = '#080F1E'
                              }
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = canAfford ? '#FF4444' : '#4A6A94'
                            }}
                          >
                            {canAfford ? 'ARRANGE THIS →' : 'INSUFFICIENT TOKENS'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {!activeFix && !ftcLocked && (nextChapter > 5 || availableFixes.length === 0) && (
                <div
                  className="border p-8 text-center text-xs"
                  style={{ borderColor: '#1A2E52', color: '#4A6A94' }}
                >
                  {nextChapter > 5
                    ? 'NO FURTHER CHAPTERS TO FIX. YOU HAVE REACHED THE END.'
                    : 'NO FIXES AVAILABLE FOR THIS TRANSITION.'}
                </div>
              )}
            </div>

            {/* Fix sidebar */}
            <div className="flex flex-col gap-6">
              {/* FTC Heat indicator */}
              {(() => {
                const heatInfo = getHeatLabel(heat)
                const nextChance = getFtcTriggerChance(heat + 1)
                return (
                  <div
                    className="border p-4"
                    style={{ borderColor: heat >= 4 ? '#2A0808' : '#1A2E52', background: heat >= 4 ? 'rgba(255,68,68,0.04)' : '#0E1A30' }}
                  >
                    <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#4A6A94' }}>
                      FTC INTEREST LEVEL
                    </div>
                    <div
                      className={`font-bold text-xl mb-1${heatInfo.animate ? ' animate-blink' : ''}`}
                      style={{ color: heatInfo.color }}
                    >
                      {heatInfo.label}
                    </div>
                    <div className="text-xs mb-3" style={{ color: '#4A6A94' }}>
                      {heat} fix{heat !== 1 ? 'es' : ''} used this run
                    </div>
                    {heat > 0 && (
                      <div className="text-xs border-t pt-3" style={{ borderColor: '#1A2E52', color: '#6A8AB4' }}>
                        Next fix carries a{' '}
                        <span style={{ color: heatInfo.color }}>{Math.round(nextChance * 100)}%</span>
                        {' '}chance of FTC intervention on resolution.
                      </div>
                    )}
                    {heat === 0 && (
                      <div className="text-xs" style={{ color: '#4A6A94' }}>
                        No fixes used yet. The Commission is not watching. Yet.
                      </div>
                    )}
                  </div>
                )
              })()}

              <div className="border p-4" style={{ borderColor: '#2A0808', background: 'rgba(255,68,68,0.03)' }}>
                <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#FF4444' }}>
                  ACCOUNT BALANCE
                </div>
                <div className="font-bold text-2xl mb-1" style={{ color: '#00FF88' }}>{tokens} PT</div>
                <div className="text-xs" style={{ color: '#4A6A94' }}>PROPHET TOKENS AVAILABLE</div>
              </div>

              <div
                className="border p-4 text-xs leading-relaxed"
                style={{ borderColor: '#1A2E52', color: '#4A6A94' }}
              >
                <div className="uppercase tracking-widest mb-2" style={{ color: '#FF4444' }}>
                  HOW FIXES WORK
                </div>
                <div className="flex flex-col gap-2">
                  <p>Buy a Fix to guarantee a specific market resolves a specific way.</p>
                  <p>The fixed market will appear in the next round. Bet on it. Win.</p>
                  <p>Only 1 Fix can be active at a time.</p>
                  <p style={{ color: '#2A0808' }}>You were never here.</p>
                </div>
              </div>

              {activeFix && (
                <div
                  className="border p-3 text-xs"
                  style={{ borderColor: '#2A0808', background: 'rgba(255,68,68,0.04)', color: '#FF4444' }}
                >
                  <div className="uppercase tracking-widest mb-1">FIX STATUS</div>
                  <div style={{ color: '#C8DCF8' }}>{activeFix.name}</div>
                  <div className="mt-1" style={{ color: '#4A6A94' }}>Pending execution in next round.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chapter gate status (story mode only, when not on ch5) */}
        {isStory && chapterRequirement !== null && (
          <div
            className="border p-4 flex items-center justify-between gap-6"
            style={{
              borderColor: canAdvanceChapter ? '#1A2E52' : '#FFCC00',
              background: canAdvanceChapter ? '#0E1A30' : 'rgba(255,204,0,0.05)',
            }}
          >
            <div>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4A6A94' }}>
                CHAPTER {nextChapter} ENTRY REQUIREMENT
              </div>
              <div className="text-sm" style={{ color: canAdvanceChapter ? '#C8DCF8' : '#FFCC00' }}>
                {chapterRequirement} PT required to advance
              </div>
              {!canAdvanceChapter && (
                <div className="text-xs mt-1" style={{ color: '#6A8AB4' }}>
                  You need{' '}
                  <span style={{ color: '#FFCC00' }}>{chapterRequirement - tokens} more PT</span>
                  {' '}— you&apos;ll replay Chapter {chapter} until you have enough.
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div
                className="font-bold text-lg"
                style={{ color: canAdvanceChapter ? '#00FF88' : '#FF4444' }}
              >
                {tokens} PT
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ color: canAdvanceChapter ? '#00FF88' : '#FF4444' }}>
                {canAdvanceChapter ? 'READY' : 'SHORT'}
              </div>
            </div>
          </div>
        )}

        {/* Continue button */}
        <div className="flex justify-end border-t pt-6" style={{ borderColor: '#1A2E52' }}>
          <div className="flex flex-col items-end gap-2">
            <div className="text-xs" style={{ color: '#4A6A94' }}>
              NEXT: ROUND {round + 1}
              {isStory && canAdvanceChapter && nextChapter <= 5 && (
                <span style={{ color: '#FFCC00' }}> · CHAPTER {nextChapter}</span>
              )}
              {isStory && !canAdvanceChapter && (
                <span style={{ color: '#FFCC00' }}> · REPLAY CHAPTER {chapter}</span>
              )}
            </div>
            <button
              onClick={handleContinue}
              className="px-10 py-4 text-sm font-bold uppercase tracking-widest border-2 cursor-pointer transition-colors"
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
              CONTINUE →
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t px-4 py-2 flex justify-between text-xs shrink-0"
        style={{ borderColor: '#1A2E52', color: '#4A6A94' }}
      >
        <span>{shopTitle}</span>
        <span>RELICS NON-REFUNDABLE · FIXES IRREVERSIBLE · YOU WERE NEVER HERE</span>
      </footer>
    </div>
  )
}
