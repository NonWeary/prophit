export type MarketCategory =
  | 'Daily Life'
  | 'Tech & Internet'
  | 'Pop Culture'
  | 'Sports'
  | 'Meta/Self-Referential'

export interface Market {
  id: string
  title: string
  baseProbability: number // probability of YES resolving
  category: MarketCategory
  yesFlavorText: string
  noFlavorText: string
}

export const MARKET_POOL: Market[] = [
  // ── Daily Life ────────────────────────────────────────────────
  {
    id: 'barista_name',
    title: 'Will the barista spell your name wrong on the cup?',
    baseProbability: 0.58,
    category: 'Daily Life',
    yesFlavorText: '"Craigory." They wrote Craigory. You have never met a Craigory.',
    noFlavorText: 'A perfect rendering of your name. You feel seen. Almost unsettlingly seen.',
  },
  {
    id: 'elevator_every_floor',
    title: 'Does this elevator stop on every single floor?',
    baseProbability: 0.42,
    category: 'Daily Life',
    yesFlavorText: 'Floor 2. Floor 3. Floor 4. You have made peace with this being your life now.',
    noFlavorText: 'A direct express to your floor. You feel chosen. The elevator respects you.',
  },
  {
    id: 'wifi_video_call',
    title: 'Will the WiFi drop at the most critical moment of your video call?',
    baseProbability: 0.63,
    category: 'Daily Life',
    yesFlavorText: '"Sorry, you froze right as you were saying—" You did not freeze. The universe did.',
    noFlavorText: 'Full bars. Crystal audio. You deliver your point. It lands. The WiFi gods are pleased.',
  },
  {
    id: 'robocall',
    title: 'Will you receive a robocall about your car\'s extended warranty today?',
    baseProbability: 0.71,
    category: 'Daily Life',
    yesFlavorText: '"Hello! This is a message about your vehicle\'s—" You do not own a vehicle.',
    noFlavorText: 'Silence. Pure, blessed silence from the warranty void. Suspicious, but welcome.',
  },
  {
    id: 'grocery_item',
    title: 'Does the grocery store have the specific item you came for?',
    baseProbability: 0.38,
    category: 'Daily Life',
    yesFlavorText: 'There it is. One last can, slightly dented, in the back. The hunt is complete.',
    noFlavorText: 'An empty shelf where hope used to live. You buy three things you didn\'t need instead.',
  },
  {
    id: 'reply_all',
    title: 'Will someone reply-all to a company-wide email unnecessarily?',
    baseProbability: 0.67,
    category: 'Daily Life',
    yesFlavorText: '"Thanks!" — sent to 847 people. Three others reply-all to agree it\'s great.',
    noFlavorText: 'Discipline. Restraint. A quiet inbox. Someone, somewhere, wanted to reply-all but didn\'t.',
  },
  {
    id: 'microwave_one_second',
    title: 'Is the office microwave sitting at exactly 0:01 when you arrive?',
    baseProbability: 0.34,
    category: 'Daily Life',
    yesFlavorText: 'There it is. That one cursed second. You open it. You do not clear the timer. The cycle continues.',
    noFlavorText: 'Someone cleared the timer. A saint. An actual saint walks among us.',
  },
  {
    id: 'pigeon_contact',
    title: 'Will a pigeon make sustained, uncomfortable eye contact with you today?',
    baseProbability: 0.49,
    category: 'Daily Life',
    yesFlavorText: 'It stares. You stare back. It knows. You both know. The pigeon leaves first.',
    noFlavorText: 'Pigeons acknowledge your presence only as an obstacle. This is how it should be.',
  },
  {
    id: 'self_checkout',
    title: 'Does the self-checkout machine require "unexpected item in bagging area" assistance?',
    baseProbability: 0.74,
    category: 'Daily Life',
    yesFlavorText: '"Unexpected item in bagging area." It\'s the bag. The bag is the item. The bag you were told to bring.',
    noFlavorText: 'A flawless transaction. You and the machine reach an understanding. Rare and precious.',
  },
  {
    id: 'parking_spot',
    title: 'Will someone take the parking spot you were clearly waiting for?',
    baseProbability: 0.44,
    category: 'Daily Life',
    yesFlavorText: 'They glided right past your blinker. Eye contact maintained. Zero remorse detected.',
    noFlavorText: 'The spot is yours. The universe, for once, is just. You park with ceremony.',
  },

  // ── Tech & Internet ────────────────────────────────────────────
  {
    id: 'cloud_outage',
    title: 'Will a major cloud provider have an outage affecting millions today?',
    baseProbability: 0.22,
    category: 'Tech & Internet',
    yesFlavorText: '"We are aware of an issue affecting our [EVERYTHING] service region." The status page turns red.',
    noFlavorText: 'All systems operational. Green across the board. You screenshot it. You will need this memory.',
  },
  {
    id: 'works_on_my_machine',
    title: 'Will a developer say "it works on my machine" within your earshot today?',
    baseProbability: 0.83,
    category: 'Tech & Internet',
    yesFlavorText: '"Have you tried—" "It works on my machine." The standup grinds to its familiar halt.',
    noFlavorText: 'A developer admits it is their fault. A thing that happened. In this universe. Today.',
  },
  {
    id: 'npm_warnings',
    title: 'Does `npm install` complete without any warnings or peer dependency issues?',
    baseProbability: 0.11,
    category: 'Tech & Internet',
    yesFlavorText: 'Clean. Silent. No warnings. You stare at the terminal. Something must be wrong.',
    noFlavorText: '47 high severity vulnerabilities. 12 deprecated packages. 3 peer conflicts. The usual.',
  },
  {
    id: 'push_to_main',
    title: 'Will someone push directly to main branch without a pull request?',
    baseProbability: 0.37,
    category: 'Tech & Internet',
    yesFlavorText: '"Just a quick hotfix." It breaks staging. The PR process weeps quietly.',
    noFlavorText: 'Process followed. Branch created. Review requested. The pipeline is respected.',
  },
  {
    id: 'ai_confident_wrong',
    title: 'Will an AI assistant confidently state an incorrect fact today?',
    baseProbability: 0.78,
    category: 'Tech & Internet',
    yesFlavorText: '"Mount Everest is located in Switzerland." Stated with full conviction. No hedging whatsoever.',
    noFlavorText: 'The AI demurs. "I\'m not certain, but—" It was correct. Epistemic humility wins.',
  },
  {
    id: 'ceo_tweet',
    title: 'Will a tech CEO tweet something that immediately triggers a PR crisis?',
    baseProbability: 0.31,
    category: 'Tech & Internet',
    yesFlavorText: 'The stock drops 4% in 11 minutes. The comms team is fully in motion. A thread is being drafted.',
    noFlavorText: 'A normal, boring day in tech leadership communications. Cherish it.',
  },
  {
    id: 'quick_fix_rewrite',
    title: 'Does this "quick fix" turn into a full system refactor?',
    baseProbability: 0.61,
    category: 'Tech & Internet',
    yesFlavorText: '"While I\'m in here..." The ticket is now 14 sub-tasks. The sprint is in flames.',
    noFlavorText: 'Two lines changed. Tests pass. Shipped. The engineer resists the urge to touch anything else.',
  },
  {
    id: 'tab_hoarder',
    title: 'Will someone share their screen to reveal 80+ open browser tabs?',
    baseProbability: 0.55,
    category: 'Tech & Internet',
    yesFlavorText: 'The tabs are pixels now. Tiny, indistinguishable pixels. "I know where everything is."',
    noFlavorText: 'A disciplined 7 tabs, clearly labeled. A being of focus and intention.',
  },

  // ── Pop Culture ────────────────────────────────────────────────
  {
    id: 'social_media_break',
    title: 'Will a celebrity announce a "social media break" this week?',
    baseProbability: 0.62,
    category: 'Pop Culture',
    yesFlavorText: '"Taking time to focus on my mental health." 3 posts later: "Okay I\'m back."',
    noFlavorText: 'All celebrities post normally. The parasocial machine hums without interruption.',
  },
  {
    id: 'sequel_makes_more',
    title: 'Does the sequel outgross the original at the box office?',
    baseProbability: 0.48,
    category: 'Pop Culture',
    yesFlavorText: 'Part 2 dominates. The IP is now eternal. A trilogy is already greenlit.',
    noFlavorText: 'The original stands alone, forever dominant. Some lightning cannot be bottled twice.',
  },
  {
    id: 'farewell_tour',
    title: 'Does a "farewell tour" band announce additional dates after the final show?',
    baseProbability: 0.77,
    category: 'Pop Culture',
    yesFlavorText: '"Due to overwhelming demand, we\'re extending our FINAL farewell. Again."',
    noFlavorText: 'They meant it. The tour ended. The silence is deafening and somehow respectful.',
  },
  {
    id: 'adaptation_disappoints',
    title: 'Does the movie adaptation disappoint fans of the book?',
    baseProbability: 0.73,
    category: 'Pop Culture',
    yesFlavorText: '"They cut the entire subplot!" The book readers form their own viewing party. It is grim.',
    noFlavorText: 'A faithful adaptation. The fans weep tears of joy. The director read the book.',
  },
  {
    id: 'podcast_disruption',
    title: 'Does the podcast say "disruption" within the first five minutes?',
    baseProbability: 0.81,
    category: 'Pop Culture',
    yesFlavorText: '"We\'re really disrupting the—" Minute 2. Minute 2 of the podcast.',
    noFlavorText: 'No disruption mentioned. The host simply has a conversation. Radical.',
  },
  {
    id: 'viral_trend_regret',
    title: 'Will a viral trend become universally embarrassing within six months?',
    baseProbability: 0.88,
    category: 'Pop Culture',
    yesFlavorText: 'The compilation video arrives. Everyone in it looks directly into the camera of their future selves.',
    noFlavorText: 'The trend ages gracefully. A rare miracle of internet culture.',
  },
  {
    id: 'reboot_announced',
    title: 'Will a beloved 90s property be announced for a reboot or live-action adaptation?',
    baseProbability: 0.69,
    category: 'Pop Culture',
    yesFlavorText: 'The announcement drops. The internet splits 50/50 between nostalgia and dread.',
    noFlavorText: 'The IP rests. Some things are left to memory. A small victory for the past.',
  },

  // ── Sports ─────────────────────────────────────────────────────
  {
    id: 'underdog_wins',
    title: 'Does the underdog pull off the upset?',
    baseProbability: 0.28,
    category: 'Sports',
    yesFlavorText: 'The scoreboard is wrong. Everyone checks the scoreboard again. Still wrong. Still real.',
    noFlavorText: 'The favorite wins. Narrative satisfies expectations. The underdog fought with dignity.',
  },
  {
    id: 'first_quarter_injury',
    title: 'Does a key player leave with an injury in the first quarter?',
    baseProbability: 0.38,
    category: 'Sports',
    yesFlavorText: 'They go down at minute 7. The team adjusts. The medical staff emerges with purpose.',
    noFlavorText: 'Everyone stays healthy through Q1. A small blessing in a brutal sport.',
  },
  {
    id: 'blame_shoes',
    title: 'Will an athlete publicly blame their performance on their equipment?',
    baseProbability: 0.24,
    category: 'Sports',
    yesFlavorText: '"These shoes were giving me blisters since warmup." A 12-minute post-game interview follows.',
    noFlavorText: '"I just didn\'t perform today." Direct accountability. The press conference ends early.',
  },
  {
    id: 'home_team_wins',
    title: 'Does the home team win?',
    baseProbability: 0.55,
    category: 'Sports',
    yesFlavorText: 'Home crowd erupts. The advantage was real. Twelve thousand people were right.',
    noFlavorText: 'The visitors silence the crowd methodically. The home fans file out in quiet devastation.',
  },
  {
    id: 'bad_ref_call',
    title: 'Does a referee make a call that becomes the defining controversy of the game?',
    baseProbability: 0.66,
    category: 'Sports',
    yesFlavorText: 'The flag drops. The stadium inhales. Three hours of post-game debate are scheduled.',
    noFlavorText: 'Impeccable officiating. The game is decided by the players. This is noted.',
  },

  // ── Meta/Self-Referential ──────────────────────────────────────
  {
    id: 'this_resolves_yes',
    title: 'Will this prediction resolve YES?',
    baseProbability: 0.50,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'It did. You called it. You called the 50/50 coin flip. Remarkable.',
    noFlavorText: 'It didn\'t. You called it wrong. The coin disagreed. Statistically, this was always possible.',
  },
  {
    id: 'house_always_wins',
    title: 'Does the house always win in the end?',
    baseProbability: 0.65,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The Prophet Tokens were the house\'s all along. You\'re renting them.',
    noFlavorText: 'The house blinks. You take the tokens. This is an anomaly they will study.',
  },
  {
    id: 'second_guess',
    title: 'Will you regret your prediction the moment after you place it?',
    baseProbability: 0.82,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The ink isn\'t dry and you\'re already typing out your counterargument in your head.',
    noFlavorText: 'Clarity. Conviction. You placed the bet and moved on. This is rare behavior.',
  },
  {
    id: 'market_least_expected',
    title: 'Will this market resolve in the least expected way?',
    baseProbability: 0.35,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'Against all odds, the unexpected thing happened. The market grins.',
    noFlavorText: 'Expected. Predictable. This market played it straight for once.',
  },
  {
    id: 'prophet_knows',
    title: 'Does the Prophet know something you don\'t?',
    baseProbability: 0.70,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The data was always there. The Prophet saw it. You were looking at the wrong chart.',
    noFlavorText: 'The Prophet was guessing too. You had the same information. You just chose differently.',
  },
  {
    id: 'lose_tokens_meta',
    title: 'Will you lose tokens on this very market?',
    baseProbability: 0.52,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'You bet NO and it resolved YES. The market predicted your loss. Perfect.',
    noFlavorText: 'You survived. The self-referential paradox resolved in your favor. Barely.',
  },
  {
    id: 'simulation',
    title: 'Is this entire game a simulation of a simulation?',
    baseProbability: 0.93,
    category: 'Meta/Self-Referential',
    yesFlavorText: 'The tokens were always just integers in a JSON object. You knew this and bet anyway.',
    noFlavorText: 'Reality is real. The tokens are physical. This is not a browser-based JavaScript game.',
  },
]

export function selectMarkets(n: number, excludeIds: string[] = []): Market[] {
  const available = MARKET_POOL.filter(m => !excludeIds.includes(m.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function getMarketById(id: string): Market | undefined {
  return MARKET_POOL.find(m => m.id === id)
}

export function calculateOdds(baseProbability: number, prediction: 'YES' | 'NO'): number {
  const prob = prediction === 'YES' ? baseProbability : 1 - baseProbability
  return 1 / prob
}

export function calculateNetGain(wager: number, baseProbability: number, prediction: 'YES' | 'NO'): number {
  const odds = calculateOdds(baseProbability, prediction)
  return Math.floor(wager * (odds - 1))
}