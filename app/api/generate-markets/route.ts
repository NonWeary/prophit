import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { Market, MarketCategory } from '@/lib/markets'

const SYSTEM_PROMPT = `You are a market designer for PROPHIT, an absurdist prediction market roguelike game.
Your job is to generate new prediction market cards that are funny, specific, and slightly absurd.
Each market should feel like something that could plausibly happen in daily life but is ridiculous to bet on.`

const USER_PROMPT = (categories: MarketCategory[], count: number) => `Generate ${count} new prediction markets for the game.

Each market must follow this exact JSON schema:
{
  "id": "unique_snake_case_id",
  "title": "A yes/no question about an absurd event (under 80 chars)",
  "baseProbability": 0.XX,  // float 0.15–0.85, probability that YES resolves
  "category": "one of: Daily Life | Tech & Internet | Pop Culture | Sports | Meta/Self-Referential",
  "yesFlavorText": "Funny 1-2 sentence outcome text if YES resolves (under 120 chars)",
  "noFlavorText": "Funny 1-2 sentence outcome text if NO resolves (under 120 chars)"
}

Focus on these categories: ${categories.join(', ')}

Rules:
- Questions must be yes/no
- Avoid repeating concepts from common markets (barista names, WiFi, etc.)
- Flavor text should be dry, deadpan, and slightly existential
- baseProbability should feel realistic, not always 50/50
- IDs must be unique snake_case strings

Return ONLY a valid JSON array of ${count} market objects, no other text.`

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 503 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const count: number = Math.min(body.count ?? 5, 10)
  const categories: MarketCategory[] = body.categories ?? [
    'Daily Life',
    'Tech & Internet',
    'Pop Culture',
  ]

  const client = new Anthropic()

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: USER_PROMPT(categories, count),
        },
      ],
    })

    const rawText = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('')

    // Extract JSON array from the response
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid response from model', raw: rawText }, { status: 500 })
    }

    const markets: Market[] = JSON.parse(jsonMatch[0])

    // Basic validation
    const valid = markets.filter(
      m =>
        m.id &&
        m.title &&
        typeof m.baseProbability === 'number' &&
        m.baseProbability >= 0.1 &&
        m.baseProbability <= 0.9 &&
        m.category &&
        m.yesFlavorText &&
        m.noFlavorText
    )

    return NextResponse.json({ markets: valid })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}