'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import RelicCard from '@/components/RelicCard'
import TokenDisplay from '@/components/TokenDisplay'
import { getRelicById } from '@/lib/relics'

export default function ShopPage() {
  const router = useRouter()
  const {
    phase,
    round,
    tokens,
    relicIds,
    shopRelics,
    buyRelic,
    continueFromShop,
  } = useGameStore()

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

  function handleContinue() {
    continueFromShop()
    router.replace('/game')
  }

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
          <div className="text-xs uppercase tracking-widest" style={{ color: '#ffcc00' }}>
            ▪ PROPHET&apos;S EMPORIUM
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: '#3a3a5c' }} className="uppercase tracking-wider">ROUND</span>
            <span style={{ color: '#c8c8e8' }} className="font-bold">{round}</span>
            <span style={{ color: '#3a3a5c' }}>/</span>
            <span style={{ color: '#3a3a5c' }}>15</span>
          </div>
        </div>
        <TokenDisplay tokens={tokens} showDelta />
      </header>

      {/* Round progress */}
      <div className="h-0.5 w-full" style={{ background: '#1e1e3a' }}>
        <div
          className="h-full"
          style={{ width: `${(round / 15) * 100}%`, background: '#ffcc00' }}
        />
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
        {/* Shop intro */}
        <div className="border-b pb-6" style={{ borderColor: '#1e1e3a' }}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#3a3a5c' }}>
            BETWEEN ROUNDS {round} AND {round + 1}
          </div>
          <h1 className="font-bold text-2xl mb-3" style={{ color: '#c8c8e8' }}>
            THE PROPHET&apos;S EMPORIUM
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: '#6a6a9a' }}>
            Spend your Prophet Tokens on cognitive relics. Each one bends the rules of prediction
            in your favor — or introduces new flavors of uncertainty. Choose wisely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available relics */}
          <div className="lg:col-span-2">
            <div
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#3a3a5c' }}
            >
              AVAILABLE RELICS ({offeredRelics.length})
            </div>

            {offeredRelics.length === 0 ? (
              <div
                className="border p-8 text-center text-xs"
                style={{ borderColor: '#1e1e3a', color: '#3a3a5c' }}
              >
                YOU ALREADY OWN EVERYTHING. THE EMPORIUM IS EMPTY.
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
            {/* Balance */}
            <div className="border p-4" style={{ borderColor: '#1e1e3a', background: '#0e0e1a' }}>
              <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#3a3a5c' }}>
                ACCOUNT BALANCE
              </div>
              <div className="font-bold text-2xl mb-1" style={{ color: '#00ff88' }}>
                {tokens} PT
              </div>
              <div className="text-xs" style={{ color: '#3a3a5c' }}>
                PROPHET TOKENS REMAINING
              </div>
            </div>

            {/* Owned relics */}
            {ownedRelicObjects.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#3a3a5c' }}>
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
              <div className="border p-4 text-xs" style={{ borderColor: '#1e1e3a', color: '#3a3a5c' }}>
                NO RELICS ACQUIRED YET.
                <br />THE UNMODIFIED MIND IS ITS OWN PRISON.
              </div>
            )}
          </div>
        </div>

        {/* Continue */}
        <div className="flex justify-end border-t pt-6" style={{ borderColor: '#1e1e3a' }}>
          <div className="flex flex-col items-end gap-2">
            <div className="text-xs" style={{ color: '#3a3a5c' }}>
              NEXT: ROUND {round + 1} OF 15
            </div>
            <button
              onClick={handleContinue}
              className="px-10 py-4 text-sm font-bold uppercase tracking-widest border-2 cursor-pointer transition-colors"
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
              CONTINUE →
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t px-4 py-2 flex justify-between text-xs shrink-0"
        style={{ borderColor: '#1e1e3a', color: '#3a3a5c' }}
      >
        <span>PROPHET&apos;S EMPORIUM</span>
        <span>RELICS ARE NON-REFUNDABLE · TOKENS SPENT ARE TOKENS GONE</span>
      </footer>
    </div>
  )
}