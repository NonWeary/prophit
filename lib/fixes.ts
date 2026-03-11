// Fixes are available in the shop at the END of chapter N and target chapter N+1 markets.
// They guarantee a specific outcome on a specific upcoming market.

export interface Fix {
  id: string
  name: string
  description: string
  flavorText: string // shown when the fixed market resolves
  cost: number
  targetChapter: 2 | 3 | 4 | 5 // which chapter's market pool this targets
  targetMarketId: string
  guaranteedOutcome: 'YES' | 'NO'
}

export const FIXES: Fix[] = [
  // ── Available in Shop 1 (after Chapter 1) → targets Chapter 2 markets ──
  {
    id: 'fix_bribe_trivia',
    name: 'Bribe the Trivia Host',
    description: 'Guarantee your team wins bar trivia. Kevin has a price. You have Prophet Tokens.',
    flavorText:
      'Kevin was very understanding once the envelope appeared. The questions tonight were... specifically tailored. You knew every answer before he asked.',
    cost: 120,
    targetChapter: 2,
    targetMarketId: 'ch2_bar_trivia',
    guaranteedOutcome: 'YES',
  },
  {
    id: 'fix_corner_oat_milk',
    name: 'Corner the Oat Milk Supply',
    description: 'Purchase every carton of oat milk within four blocks before the coffee shop opens.',
    flavorText:
      'You bought every carton in a three-block radius. The coffee shop never saw it coming. The barista looked confused at the empty shelf. You looked elsewhere.',
    cost: 85,
    targetChapter: 2,
    targetMarketId: 'ch2_oat_milk',
    guaranteedOutcome: 'YES',
  },
  {
    id: 'fix_plant_heartbreak',
    name: 'Plant an "Emotional Artist"',
    description: 'Arrange for someone to debut a very personal original song at open mic tonight.',
    flavorText:
      'You merely suggested they "share something vulnerable." The song was called Tyler. It was nineteen verses. The room was not okay. You were $120 richer.',
    cost: 100,
    targetChapter: 2,
    targetMarketId: 'ch2_open_mic',
    guaranteedOutcome: 'YES',
  },

  // ── Available in Shop 2 (after Chapter 2) → targets Chapter 3 markets ──
  {
    id: 'fix_pay_player',
    name: 'Pay a Player to Have an Off Night',
    description: 'One player. One arrangement. One mysteriously timed hamstring injury.',
    flavorText:
      "He said his hamstring was acting up at minute 34. It wasn't. The check cleared at 6am. You watched the game from your couch with the sound off.",
    cost: 350,
    targetChapter: 3,
    targetMarketId: 'ch3_home_team',
    guaranteedOutcome: 'NO',
  },
  {
    id: 'fix_weather_leak',
    name: "Leak the Mayor's Outdoor Schedule",
    description: 'One meteorologist. One tip. One press conference that ends in precipitation.',
    flavorText:
      'The meteorologist got a call from "a concerned citizen." The mayor got wet. The transcript was later corrected. You were not mentioned.',
    cost: 280,
    targetChapter: 3,
    targetMarketId: 'ch3_mayor_presser',
    guaranteedOutcome: 'YES',
  },
  {
    id: 'fix_plant_story',
    name: 'Plant a Story in the Local Paper',
    description: 'A strategically placed article the night before the vote. Page 3. The council reads page 3.',
    flavorText:
      'The story ran on page 3. The council members read page 3. Two votes shifted. You were not a source. You were never a source.',
    cost: 450,
    targetChapter: 3,
    targetMarketId: 'ch3_city_council',
    guaranteedOutcome: 'NO',
  },

  // ── Available in Shop 3 (after Chapter 3) → targets Chapter 4 markets ──
  {
    id: 'fix_short_leak',
    name: 'Short the Stock, Then Leak Bad News',
    description: 'Take a position first. Release damaging information second. Wait for gravity to do its work.',
    flavorText:
      'An anonymous source. A strategically timed rumor. A short position established at 8:45am. The index closed down. You were exceedingly well positioned.',
    cost: 750,
    targetChapter: 4,
    targetMarketId: 'ch4_stock_surge',
    guaranteedOutcome: 'NO',
  },
  {
    id: 'fix_stage_moment',
    name: 'Stage a Viral Moment',
    description: 'Seed content across platforms. Let the algorithm do the rest.',
    flavorText:
      'The account was paid. The content was seeded across seven platforms. The moment was manufactured. The million shares: completely authentic public reaction.',
    cost: 620,
    targetChapter: 4,
    targetMarketId: 'ch4_viral_moment',
    guaranteedOutcome: 'YES',
  },
  {
    id: 'fix_senate_staffer',
    name: "Call In a Favor with a Senate Staffer",
    description: 'One call. One reminder of a long-standing arrangement. One changed vote.',
    flavorText:
      "The call lasted four minutes. The senator's stated position 'evolved.' No follow-up questions were asked. You did not take notes.",
    cost: 900,
    targetChapter: 4,
    targetMarketId: 'ch4_senator_flip',
    guaranteedOutcome: 'YES',
  },

  // ── Available in Shop 4 (after Chapter 4) → targets Chapter 5 markets ──
  {
    id: 'fix_lobby_fed',
    name: 'Lobby the Federal Reserve',
    description: 'Three meetings. Two intermediaries. One policy adjustment.',
    flavorText:
      "You were never in the room. The decision emerged from 'committee consensus.' You were positioned correctly before the announcement.",
    cost: 2200,
    targetChapter: 5,
    targetMarketId: 'ch5_central_bank',
    guaranteedOutcome: 'YES',
  },
  {
    id: 'fix_anonymous_call',
    name: 'Place an Anonymous Call',
    description: 'A world leader. A phone. Your carefully prepared talking points. 2am local time.',
    flavorText:
      "You provided the talking points. They provided the platform. The post went up at 2:14am. The markets opened to chaos. You were already positioned.",
    cost: 1700,
    targetChapter: 5,
    targetMarketId: 'ch5_world_leader_tweet',
    guaranteedOutcome: 'YES',
  },
  {
    id: 'fix_engineer_incident',
    name: 'Engineer an International Incident',
    description: 'A leak. A misunderstanding. A press conference. A market-moving headline. You remain unnamed.',
    flavorText:
      "It started with a document. Then a statement. Then a counter-statement from three governments. You were anonymous throughout. The incident was 'organic.'",
    cost: 3000,
    targetChapter: 5,
    targetMarketId: 'ch5_geopolitical_event',
    guaranteedOutcome: 'YES',
  },
]

export function getFixById(id: string): Fix | undefined {
  return FIXES.find(f => f.id === id)
}

// Returns fixes available in the shop at the end of currentChapter
// (i.e., fixes that target the next chapter's markets)
export function getFixesForShop(currentChapter: number): Fix[] {
  const nextChapter = currentChapter + 1
  return FIXES.filter(f => f.targetChapter === nextChapter)
}
