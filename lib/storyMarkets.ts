import type { Market } from './markets'

// ── Chapter 1 — "The Apartment" ────────────────────────────────
const chapter1Markets: Market[] = [
  {
    id: 'ch1_upstairs_vacuum',
    title: 'Will the upstairs neighbor vacuum before noon?',
    baseProbability: 0.42,
    category: 'Daily Life',
    yesFlavorText: 'The rumble begins at 11:47. You had thirteen minutes. You knew this.',
    noFlavorText: 'Blissful quiet. They\'re either out or dead. You decide not to investigate.',
  },
  {
    id: 'ch1_vending_machine',
    title: 'Does the lobby vending machine eat your dollar without dispensing?',
    baseProbability: 0.55,
    category: 'Daily Life',
    yesFlavorText: 'It takes the dollar. It considers your selection. It declines to proceed. You stand there.',
    noFlavorText: 'The bag falls clean. The machine is satisfied. A small victory for the built environment.',
  },
  {
    id: 'ch1_uber_long',
    title: 'Will your Uber driver take the longer route?',
    baseProbability: 0.47,
    category: 'Daily Life',
    yesFlavorText: '"Traffic on the main road," he says, turning away from the main road.',
    noFlavorText: 'Direct. Efficient. No commentary. You arrive exactly when expected.',
  },
  {
    id: 'ch1_super_radiator',
    title: 'Will the building super fix the broken radiator this week?',
    baseProbability: 0.26,
    category: 'Daily Life',
    yesFlavorText: 'He appears. He has tools. The radiator makes a new noise, but heat comes out. Progress.',
    noFlavorText: 'He texts "on it." He is not on it. The apartment remains a freezer of broken promises.',
  },
  {
    id: 'ch1_pizza_30',
    title: 'Does the pizza delivery arrive in under 30 minutes?',
    baseProbability: 0.38,
    category: 'Daily Life',
    yesFlavorText: 'The box appears at minute 27. The driver looks victorious. You tip 20%.',
    noFlavorText: '38 minutes. You eat it anyway. You give three stars. You will order again next week.',
  },
  {
    id: 'ch1_roommate_dishes',
    title: 'Will your roommate do the dishes before you have to ask?',
    baseProbability: 0.21,
    category: 'Daily Life',
    yesFlavorText: 'You walk into a clean kitchen. The dishes are done. You check the date. It\'s real.',
    noFlavorText: 'The dishes accumulate. The message "hey, could you maybe..." is drafted for the sixth time.',
  },
  {
    id: 'ch1_smoke_alarm',
    title: 'Does the smoke alarm go off while you\'re making toast?',
    baseProbability: 0.62,
    category: 'Daily Life',
    yesFlavorText: 'Toast. You were making TOAST. The alarm does not care. The neighbors hear.',
    noFlavorText: 'Perfect toast. No alarm. The detector has finally accepted your cooking style.',
  },
  {
    id: 'ch1_laundry_sock',
    title: 'Does the laundry machine eat exactly one sock?',
    baseProbability: 0.66,
    category: 'Daily Life',
    yesFlavorText: 'One. It takes exactly one. The remaining sock watches from the basket in silent witness.',
    noFlavorText: 'Full sock count confirmed. You count twice. The machine shows inexplicable mercy.',
  },
  {
    id: 'ch1_parking_spot',
    title: 'Is the good parking spot outside your building available tonight?',
    baseProbability: 0.31,
    category: 'Daily Life',
    yesFlavorText: 'There it is. Open. Waiting. You park with the reverence the moment deserves.',
    noFlavorText: 'Someone took it. They always take it. You circle fourteen minutes. You develop a theory.',
  },
  {
    id: 'ch1_passive_note',
    title: 'Does your downstairs neighbor slide a passive-aggressive note under your door?',
    baseProbability: 0.33,
    category: 'Daily Life',
    yesFlavorText: '"Could you please keep it down? :)" The smiley face is load-bearing.',
    noFlavorText: 'No note. Perhaps they\'ve moved. Perhaps they\'ve accepted the noise as ambient.',
  },
]

// ── Chapter 2 — "The Neighborhood" ────────────────────────────
const chapter2Markets: Market[] = [
  {
    id: 'ch2_bar_trivia',
    title: 'Does your team win bar trivia at The Local tonight?',
    baseProbability: 0.31,
    category: 'Daily Life',
    yesFlavorText: 'The host reads the scores. You have won a $20 gift card and one week of bragging.',
    noFlavorText: 'Second. You knew the tiebreaker. Your teammate buzzed the wrong category. You won\'t forget.',
  },
  {
    id: 'ch2_oat_milk',
    title: 'Does the coffee shop run out of oat milk before 10am?',
    baseProbability: 0.64,
    category: 'Daily Life',
    yesFlavorText: '"We\'re out of oat milk." The barista has said this fourteen times. The board is wrong.',
    noFlavorText: 'Abundant oat milk. The tanks are full. Today the alternative milk supply holds its ground.',
  },
  {
    id: 'ch2_street_performer',
    title: 'Does the street performer on the corner make $20 by noon?',
    baseProbability: 0.52,
    category: 'Daily Life',
    yesFlavorText: 'The bucket fills. Quarters accumulate. The lunch crowd stops for the chorus.',
    noFlavorText: 'Sparse applause. Sparse currency. The performer adjusts the set for afternoon foot traffic.',
  },
  {
    id: 'ch2_farmers_sourdough',
    title: 'Does the farmer\'s market sell out of sourdough before noon?',
    baseProbability: 0.73,
    category: 'Daily Life',
    yesFlavorText: 'Gone by 10:48. The bread people know exactly what they have. The line started at 9.',
    noFlavorText: 'Leftover loaves at noon. The baker packs them sadly. Next week, fewer loaves.',
  },
  {
    id: 'ch2_neighborhood_fb',
    title: 'Does the neighborhood Facebook group erupt in argument this week?',
    baseProbability: 0.85,
    category: 'Daily Life',
    yesFlavorText: 'A post about a parking cone escalates. 54 comments. Three people leave the group.',
    noFlavorText: 'A quiet week. Only lost pet posts and garage sales. The peace is noted. It will not last.',
  },
  {
    id: 'ch2_bodega_price',
    title: 'Does the corner bodega raise the price on energy drinks today?',
    baseProbability: 0.32,
    category: 'Daily Life',
    yesFlavorText: 'The price sticker has been revised. By hand. In marker. It now says $3.50.',
    noFlavorText: 'The price holds. The bodega owner nods at you. The understanding is unspoken and binding.',
  },
  {
    id: 'ch2_dog_park',
    title: 'Is there an altercation between dogs at the park this afternoon?',
    baseProbability: 0.57,
    category: 'Daily Life',
    yesFlavorText: 'Two dogs disagree on territory. The owners apologize to each other on their behalf.',
    noFlavorText: 'All dogs get along. A peaceful afternoon. The dogs demonstrate what we cannot.',
  },
  {
    id: 'ch2_open_mic',
    title: 'Does someone at open mic debut an original song about their ex?',
    baseProbability: 0.76,
    category: 'Pop Culture',
    yesFlavorText: '"This next one is called... their name." The room shifts. Eighteen verses.',
    noFlavorText: 'All covers tonight. Safe, competent, forgettable. The open mic gods are merciful.',
  },
  {
    id: 'ch2_craft_beer',
    title: 'Does the bar run out of the limited craft beer special before 9pm?',
    baseProbability: 0.58,
    category: 'Daily Life',
    yesFlavorText: '"We just tapped the last one." You were 90 seconds too late. The bartender is apologetic.',
    noFlavorText: 'Still available. Cold. Moderately priced. You order two. This is why you come here.',
  },
  {
    id: 'ch2_diner_review',
    title: 'Does the local diner get a 5-star review on the food app today?',
    baseProbability: 0.39,
    category: 'Daily Life',
    yesFlavorText: 'Gloria from table 4 gives five stars. "The meatloaf changed my life." It was meatloaf.',
    noFlavorText: 'Three stars. Complaint about the wait time. The diner has been there since 1971. It will survive.',
  },
]

// ── Chapter 3 — "The City" ─────────────────────────────────────
const chapter3Markets: Market[] = [
  {
    id: 'ch3_home_team',
    title: 'Does the city\'s team win tonight\'s home game?',
    baseProbability: 0.53,
    category: 'Sports',
    yesFlavorText: 'The crowd erupts. The final buzzer sounds. The city exhales into the night.',
    noFlavorText: 'Quiet walk home. Scarves around necks. The season is discussed in past tense.',
  },
  {
    id: 'ch3_mayor_presser',
    title: 'Does the mayor\'s outdoor press conference get rained out?',
    baseProbability: 0.33,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The tarp goes up too late. The mayor continues, visibly wet, with stoic professionalism.',
    noFlavorText: 'Clear skies over City Hall. The press corps takes dry notes. The podium remains intact.',
  },
  {
    id: 'ch3_restaurant_violation',
    title: 'Does the restaurant on 3rd get cited for a health violation?',
    baseProbability: 0.28,
    category: 'Daily Life',
    yesFlavorText: 'The inspector arrives at 11. They leave at 1:30. The letter is issued. The sign goes up.',
    noFlavorText: 'A clean inspection. The kitchen passes. The chef emerges to shake one hand.',
  },
  {
    id: 'ch3_city_council',
    title: 'Does the city council vote to approve the controversial development?',
    baseProbability: 0.57,
    category: 'Meta/Self-Referential',
    yesFlavorText: '4-3. The rendering goes up on the website. The protesters fold their signs into briefcases.',
    noFlavorText: 'It fails. "Tabled pending further community input." The third time it\'s been tabled.',
  },
  {
    id: 'ch3_transit_disruption',
    title: 'Does the transit authority announce unexpected service disruptions today?',
    baseProbability: 0.67,
    category: 'Daily Life',
    yesFlavorText: '"Due to a signal malfunction at—" The announcement loops. The platform fills.',
    noFlavorText: 'On time. All lines. The system operates as designed. You screenshot the status board.',
  },
  {
    id: 'ch3_paper_endorsement',
    title: 'Does the local paper endorse an unexpected candidate this week?',
    baseProbability: 0.36,
    category: 'Pop Culture',
    yesFlavorText: 'The editorial board makes a call no one saw coming. The opinion section catches fire.',
    noFlavorText: 'The expected endorsement, for expected reasons, in the expected language. Nobody clips it.',
  },
  {
    id: 'ch3_employer_layoffs',
    title: 'Does the city\'s largest employer announce layoffs this quarter?',
    baseProbability: 0.43,
    category: 'Tech & Internet',
    yesFlavorText: 'The press release goes out at 4:55 PM on a Friday. The number is described as "significant."',
    noFlavorText: 'Stable headcount. "Cautious optimism from HR." The jobs, for now, are fine.',
  },
  {
    id: 'ch3_wifi_delay',
    title: 'Does the city\'s downtown Wi-Fi project hit another announced delay?',
    baseProbability: 0.78,
    category: 'Tech & Internet',
    yesFlavorText: 'The vendor missed a deliverable. A revised timeline will be announced. Again.',
    noFlavorText: 'On track. Under budget. One infrastructure promise is kept. Note the date. Frame it.',
  },
  {
    id: 'ch3_street_fair',
    title: 'Does the city street fair draw larger crowds than projected?',
    baseProbability: 0.49,
    category: 'Daily Life',
    yesFlavorText: 'Two extra blocks are closed off. The churro vendor runs out at 1:47pm.',
    noFlavorText: 'Below projections. The organizers cite "weather uncertainty." The churro vendor goes home early.',
  },
  {
    id: 'ch3_bodycam',
    title: 'Does the city release contested bodycam footage this week?',
    baseProbability: 0.29,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The footage drops at midnight. Every local desk files within the hour. The night is long.',
    noFlavorText: '"Still under review." Timeline "cannot be specified." The ACLU files a response on Tuesday.',
  },
]

// ── Chapter 4 — "The Nation" ───────────────────────────────────
const chapter4Markets: Market[] = [
  {
    id: 'ch4_stock_surge',
    title: 'Does the benchmark index close more than 1% up today?',
    baseProbability: 0.44,
    category: 'Tech & Internet',
    yesFlavorText: 'Green across the board. The bulls are credited. The bears are not mentioned.',
    noFlavorText: 'Flat to slightly down. "Uncertainty cited." The Dow shrugs. CNBC fills four hours.',
  },
  {
    id: 'ch4_viral_moment',
    title: 'Does a single social media post hit 1 million shares this week?',
    baseProbability: 0.54,
    category: 'Pop Culture',
    yesFlavorText: 'A video of unclear context spreads globally. Opinion is split. It is simply everywhere.',
    noFlavorText: 'Nothing breaks through. The algorithm churns. The feed recycles. No ignition point.',
  },
  {
    id: 'ch4_senator_flip',
    title: 'Does a senator vote against their publicly stated position on the bill?',
    baseProbability: 0.34,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The vote is recorded. The senator\'s office does not immediately respond to requests for comment.',
    noFlavorText: 'They voted as stated. Word and action aligned. Political journalists note the novelty.',
  },
  {
    id: 'ch4_fed_signal',
    title: 'Does the Fed chair hint at a rate change in today\'s statement?',
    baseProbability: 0.49,
    category: 'Tech & Internet',
    yesFlavorText: 'The word "appropriate" is parsed by 400 analysts simultaneously. Markets move 0.8%.',
    noFlavorText: 'No hint. No signal. The statement is "cautious, measured, and boring." Markets flatline.',
  },
  {
    id: 'ch4_special_election',
    title: 'Does the ruling party lose a special election in a safe seat?',
    baseProbability: 0.32,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The results come in. Pundits reach for the word "stunning." They locate it quickly.',
    noFlavorText: 'Safe seat held. The machine delivers. The margin is smaller than expected. No one reports that.',
  },
  {
    id: 'ch4_congressional_hearing',
    title: 'Does a major tech CEO get summoned to testify before Congress this month?',
    baseProbability: 0.40,
    category: 'Tech & Internet',
    yesFlavorText: 'The committee sends a letter. The CEO\'s lawyers begin preparing 140-page briefs immediately.',
    noFlavorText: 'No subpoena. The industry breathes. The hearings are "being scheduled." Still.',
  },
  {
    id: 'ch4_jobs_surprise',
    title: 'Does the monthly jobs report significantly beat expectations?',
    baseProbability: 0.39,
    category: 'Tech & Internet',
    yesFlavorText: 'The number lands well above consensus. Revisions are noted. The headline writes itself.',
    noFlavorText: 'In line with expectations. Nobody writes a headline for "basically what we predicted."',
  },
  {
    id: 'ch4_cabinet_resign',
    title: 'Does a sitting cabinet member resign or get dismissed this week?',
    baseProbability: 0.21,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The letter cites "personal reasons." The subtext is not subtle. The filing is immediate.',
    noFlavorText: 'The cabinet holds. The weekly reshuffle predictions were wrong. Status quo maintained.',
  },
  {
    id: 'ch4_politician_gaffe',
    title: 'Does a politician\'s verbal gaffe become a national meme within 24 hours?',
    baseProbability: 0.62,
    category: 'Pop Culture',
    yesFlavorText: 'The clip is 9 seconds long. By evening it has been remixed eleven times.',
    noFlavorText: 'A full news cycle without a viral gaffe. The bar, though low, was cleared.',
  },
  {
    id: 'ch4_late_night',
    title: 'Does a late-night monologue spark a national news cycle debate?',
    baseProbability: 0.45,
    category: 'Pop Culture',
    yesFlavorText: 'Twelve seconds of monologue are clipped, decontextualized, and debated for 48 hours.',
    noFlavorText: 'The jokes land and are forgotten by morning. As is traditional. As is right.',
  },
]

// ── Chapter 5 — "The World" ────────────────────────────────────
const chapter5Markets: Market[] = [
  {
    id: 'ch5_central_bank',
    title: 'Does a major central bank call an emergency rate decision this week?',
    baseProbability: 0.19,
    category: 'Tech & Internet',
    yesFlavorText: 'The emergency meeting is called. Markets open to chaos. The statement is "reassuring."',
    noFlavorText: 'Scheduled meeting only. The global financial plumbing holds for another week.',
  },
  {
    id: 'ch5_world_leader_tweet',
    title: 'Does a sitting world leader post something immediately flagged by media outlets?',
    baseProbability: 0.73,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The post goes up at 2am local time. It is everything. It is immediately archived.',
    noFlavorText: 'A measured, communications-team-approved statement. Someone is doing their job well.',
  },
  {
    id: 'ch5_geopolitical_event',
    title: 'Does a major geopolitical flashpoint escalate to breaking-news level?',
    baseProbability: 0.36,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'Breaking banners. Correspondent deployed. The situation is described as "fluid."',
    noFlavorText: 'Simmering tensions remain at simmer. The region is called "cautiously stable."',
  },
  {
    id: 'ch5_climate_report',
    title: 'Does an international body release a climate report that surprises analysts?',
    baseProbability: 0.44,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The numbers diverge from the models — worse or better, either way, graphs are everywhere.',
    noFlavorText: 'Consistent with projections. The scientists are unsurprised. The headline does not trend.',
  },
  {
    id: 'ch5_g7_turmoil',
    title: 'Does a G7 nation experience unexpected political upheaval this week?',
    baseProbability: 0.28,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'Coalition talks collapse. Parliament is dissolved. It is a Tuesday. It is a normal Tuesday.',
    noFlavorText: 'All G7 governments constitutionally intact. A slow week for democratic institutions.',
  },
  {
    id: 'ch5_global_outage',
    title: 'Does a major tech platform experience a global outage during business hours?',
    baseProbability: 0.31,
    category: 'Tech & Internet',
    yesFlavorText: 'At 9:42am: the platform goes dark. The status page says "investigating." The world notices.',
    noFlavorText: '100% uptime. The distributed systems hold. The on-call engineers sleep through their shift.',
  },
  {
    id: 'ch5_state_visit_cancel',
    title: 'Does a world leader cancel a state visit at the last minute?',
    baseProbability: 0.26,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The delegation turns around at the airport. The diplomatic phrasing is "postponed."',
    noFlavorText: 'The visit proceeds. A handshake occurs. A communiqué is released. Trees are planted.',
  },
  {
    id: 'ch5_commodity_spike',
    title: 'Does a commodity price spike more than 5% in a single trading session?',
    baseProbability: 0.33,
    category: 'Tech & Internet',
    yesFlavorText: 'The commodity moves. Supply concerns cited. Three analysts use the word "unprecedented."',
    noFlavorText: 'Stable commodity markets. The traders are bored. The headline never materializes.',
  },
  {
    id: 'ch5_summit_fails',
    title: 'Does a major international summit end without a joint communiqué?',
    baseProbability: 0.41,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'No statement. Leaders depart separately. Officials call it "productive but complex."',
    noFlavorText: 'A joint statement is issued. It is non-binding. Everyone shakes hands for the cameras.',
  },
  {
    id: 'ch5_currency_crash',
    title: 'Does a previously stable currency drop more than 3% against the dollar today?',
    baseProbability: 0.17,
    category: 'Tech & Internet',
    yesFlavorText: 'The currency slides. The central bank intervenes. The word "contagion" appears once in print.',
    noFlavorText: 'Currency markets quiet. The pairs hold. The traders look for other things to worry about.',
  },
]

export const CHAPTER_MARKETS: Record<1 | 2 | 3 | 4 | 5, Market[]> = {
  1: chapter1Markets,
  2: chapter2Markets,
  3: chapter3Markets,
  4: chapter4Markets,
  5: chapter5Markets,
}

export const CHAPTER_INFO: Record<1 | 2 | 3 | 4 | 5, { title: string; blurb: string }> = {
  1: {
    title: 'THE APARTMENT',
    blurb:
      "It starts small. You're broke, underscheduled, and apparently very interested in whether your upstairs neighbor vacuums. Take what you can. The markets are always watching.",
  },
  2: {
    title: 'THE NEIGHBORHOOD',
    blurb:
      "You've outgrown the apartment. The block knows you — not by name yet, but by reputation. The bets are bigger. The fixes are more expensive. The trivia host is negotiable.",
  },
  3: {
    title: 'THE CITY',
    blurb:
      "Scale up. The stakes are real now. City council votes. Local sports outcomes. A restaurant's health code. You've stopped guessing and started arranging. This is different.",
  },
  4: {
    title: 'THE NATION',
    blurb:
      "National stage. Your positions move markets. Senators answer to people like you now, whether they know it or not. The Prophet Tokens are just how we keep score.",
  },
  5: {
    title: 'THE WORLD',
    blurb:
      "You're not predicting anymore. You're deciding. Central banks. World leaders. International incidents. The line between forecasting and control has dissolved. Bet accordingly.",
  },
}

export function getChapterMarkets(chapter: 1 | 2 | 3 | 4 | 5, excludeIds: string[] = []): Market[] {
  const pool = CHAPTER_MARKETS[chapter] ?? []
  return pool.filter(m => !excludeIds.includes(m.id))
}

export function selectStoryRoundMarkets(
  chapter: 1 | 2 | 3 | 4 | 5,
  excludeIds: string[],
  forceIncludeId: string | null = null
): Market[] {
  const available = getChapterMarkets(chapter, excludeIds)
  const fullPool = CHAPTER_MARKETS[chapter] ?? []

  if (forceIncludeId) {
    const forced = available.find(m => m.id === forceIncludeId)
    if (forced) {
      const others = available.filter(m => m.id !== forceIncludeId)
      const picked = [...others].sort(() => Math.random() - 0.5).slice(0, 2)
      return [...picked, forced].sort(() => Math.random() - 0.5)
    }
    // Fixed market was already used — still force it from full pool
    const forcedFromFull = fullPool.find(m => m.id === forceIncludeId)
    if (forcedFromFull) {
      const others = available.filter(m => m.id !== forceIncludeId)
      const picked = [...others].sort(() => Math.random() - 0.5).slice(0, 2)
      return [...picked, forcedFromFull].sort(() => Math.random() - 0.5)
    }
  }

  if (available.length < 3) {
    // Pool exhausted — redraw from full chapter pool
    return [...fullPool].sort(() => Math.random() - 0.5).slice(0, 3)
  }

  return [...available].sort(() => Math.random() - 0.5).slice(0, 3)
}

export function getChapterForRound(round: number): 1 | 2 | 3 | 4 | 5 {
  return Math.min(5, Math.ceil(round / 3)) as 1 | 2 | 3 | 4 | 5
}
