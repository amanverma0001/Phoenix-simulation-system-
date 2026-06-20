import { aiEngine } from "./AIEngine";
import { Country, TimelineEvent } from "@/lib/CascadeEngine";
import { getShockScore } from "./GlobalShockDataset";

export interface PredictionResult {
  trigger: string;
  cascadePath: string[];
  unexpectedWinners: Array<{ country: string; reason: string; gain: number }>;
  unexpectedLosers: Array<{ country: string; reason: string; loss: number }>;
  timelineSeconds: number;
  confidence: number;
  reasoning: string;
}

export interface SimulationConfig {
  scenario: string;
  actions: Array<{ type: string; actor: string; target: string; intensity: number }>;
  expectedOutcome: string;
  complexity: "simple" | "medium" | "complex";
}

/**
 * AIOracle - Analyzes live global state and predicts collapse vectors
 */
export class AIOracle {
  static async predict(state: {
    stability: number;
    countries: Country[];
    recentActions: any[];
    dataDrift: number; // [Refinement] Epistemic Drift
    timestamp?: number;
    isCollapsed?: boolean;
  }): Promise<PredictionResult> {
    const isAftermath = state.isCollapsed;

    const prompt = isAftermath ? `
      [ORACLE_AFTERMATH_PROTOCOL_ACTIVE]
      COHERENCE: COLLAPSED (${state.stability.toFixed(1)}%)
      WEAKEST LINKS: ${state.countries.sort((a, b) => a.stability - b.stability).slice(0, 5).map(c => c.name).join(', ')}
      
      TASK: Perform a deep-tissue scan of the global fracture.
      THEME: "Emergence on Collapse" - Analyze how this specific failure is the fertile ground for new power structures.
      Explain WHY the system broke at ${state.stability.toFixed(1)}% and what is EMERGENCE from the ruins.
      Identify the "Ghost Beneficiary" (entities that profited from this collapse).
      
      Respond in JSON:
      {
        "trigger": "Detailed root cause analysis",
        "cascadePath": ["Chain of structural failure"],
        "unexpectedWinners": [{ "country": "X", "reason": "...", "gain": 50 }],
        "unexpectedLosers": [{ "country": "Y", "reason": "...", "loss": -60 }],
        "timelineSeconds": 0,
        "confidence": 100,
        "reasoning": "Strategic summary of the reset"
      }
    ` : `
      [ORACLE_LIVE_MATRIX_PROTOCOL_ACTIVE]
      SYSTEM COHERENCE: ${state.stability.toFixed(1)}%
      DATA DRIFT: ${(state.dataDrift * 100).toFixed(0)}% (Uncertainty Level)
      WEAKEST ENTITIES: ${state.countries.sort((a, b) => a.stability - b.stability).slice(0, 10).map(c => `${c.name} (${c.stability.toFixed(1)}%) ${c.isGlobalHub ? '[CORE_HUB]' : ''}`).join('\n')}
      
      TASK: IDENTIFY WEAKEST LINK & PREDICT CASCADE PATH.
      PRINCIPLE: "Emergence on Collapse" - Predict what new structure will arise as these links fail.
      Consider that ${state.countries.filter(c => c.isGlobalHub && c.stability < 60).map(c => c.name).join(', ')} are CRITICAL HUBs.
      
      GLOBAL SHOCK CONTEXT:
      ${state.countries.filter(c => c.isGlobalHub).map((c: Country) => {
      const gds = getShockScore(c.id);
      return gds ? `- ${c.name}: GDS ${gds.score} (${gds.tier}) - ${gds.reason}` : "";
    }).filter(Boolean).join('\n')}
      
      Respond in JSON:
      {
        "trigger": "Identify the the specific weakest link country",
        "cascadePath": ["Predicted failover sequence"],
        "unexpectedWinners": [{ "country": "X", "reason": "...", "gain": 35 }],
        "unexpectedLosers": [{ "country": "Y", "reason": "...", "loss": -50 }],
        "timelineSeconds": 15,
        "confidence": 85,
        "reasoning": "Strategic analysis of the next failure vector. Mention Hub status and Data Drift if relevant."
      }
    `;

    // Use Gemini for AIOracle (separate from DeepSeek used by WhatIf)
    try {
      return await aiEngine.generateJsonWithGemini(prompt);
    } catch (e) {
      return {
        trigger: "Analyzing cascading instabilities...",
        cascadePath: ["Primary Impact", "Secondary Ripples", "Global Adjustment"],
        unexpectedWinners: [{ country: "Neutral Nations", reason: "Safe haven capital flows", gain: 15 }],
        unexpectedLosers: [{ country: "Dependent States", reason: "Supply chain disruption", loss: 20 }],
        timelineSeconds: 45,
        confidence: 72,
        reasoning: "The simulation is processing real-time geopolitical dynamics."
      };
    }
  }
}

/**
 * AINarrative - Writes analytical breaking news reports
 */
export class AINarrative {
  static async generateReport(
    scenario: string,
    events: TimelineEvent[],
    emergence: any
  ): Promise<string> {
    const prompt = `
      You are an elite geopolitical intelligence analyst for a clandestine organization. 
      Write a dramatic, highly analytical "Post-Collapse Shadow History" based on the data below.
      
      SCENARIO: ${scenario}
      
      SIMULATION TELEMETRY (EVENTS):
      ${events.map(e => `- ${e.type.toUpperCase()}: ${e.description}`).join("\n")}
      
      EMERGENT PHANTOM HUBS (WINNERS):
      ${emergence.winners.map((w: any) => `${w.name} (+${w.percentageChange}%)`).join(", ")}
      
      SYSTEMIC SCALE FAILURE (LOSERS):
      ${emergence.losers.map((l: any) => `${l.name} (${l.percentageChange}%)`).join(", ")}
      
      THEME: "Emergence on Collapse" - The primary focus is how the disintegration of the old order is ACTIVELY BIRTHING a new one.
      
      GLOBAL SHOCK DATA FOR TARGETS:
      ${emergence.losers.concat(emergence.winners).map((e: any) => {
      const gds = getShockScore(e.entityId || e.id || "");
      return gds ? `- ${e.name}: GDS ${gds.score}/100 [${gds.tier}] - Reason: ${gds.reason}` : "";
    }).filter(Boolean).join("\n")}

      CORE TASK:
      1. Describe the precise moment the old order "shattered".
      2. Identify a "Ghost Beneficiary" (a non-state actor or shadow economy that profited).
      3. Predict the name of the new emergent world order (e.g., "The Bosphorus Pact", "Sibir-Core").
      
      TONE: Ominous, Cold, Precise (CIA Redline Style).
      FORMAT: BREAKING: [Headline] followed by report (~200 words).
    `;

    try {
      return await aiEngine.generateText(prompt);
    } catch (e) {
      return `BREAKING: SYSTEMIC RESET IN PROGRESS\n\nThe old order has shattered under the weight of ${scenario}. Power vacuums are being filled by emergent regional blocs. Directives are failing to contain the cascade as global trust plateaus.`;
    }
  }
}

/**
 * AIWhatIf - Natural language scenario interpreter
 */
export class AIWhatIf {
  static async interpret(question: string): Promise<SimulationConfig> {
    const prompt = `
      You are an elite geopolitical and financial analyst. Convert this question into simulation parameters AND provide COMPREHENSIVE multi-dimensional analysis.

      USER QUESTION: "${question}"

      Respond ONLY with valid JSON:
      {
        "scenario": "short description (e.g. 'USA sanctions Turkey')",
        "actions": [
          { "type": "sanction" | "alliance" | "blockade" | "military", "actor": "string", "target": "string", "intensity": 0.0-1.0 }
        ],
        "expectedOutcome": "DETAILED geopolitical analysis: Immediate impact, secondary effects on neighbors, who benefits, long-term outlook.",
        "financialImpact": {
          "currencies": "Which currencies strengthen/weaken? Expected forex movements.",
          "stockMarkets": "Impact on major indices (S&P 500, FTSE, Nikkei, etc). Which sectors surge/crash?",
          "commodities": "Oil, gold, wheat, rare earths - price direction and magnitude.",
          "bonds": "Flight to safety? Treasury yields? Emerging market debt risk?"
        },
        "corporateImpact": {
          "winners": "Which corporations/industries benefit? Defense contractors, energy companies, tech firms?",
          "losers": "Which companies face losses? Supply chain disruptions? Export bans?",
          "supplyChain": "Critical supply chain disruptions - semiconductors, rare earths, manufacturing?",
          "investmentShifts": "FDI flows, capital flight, market reallocation?"
        },
        "complexity": "simple" | "medium" | "complex"
      }
    `;

    // Create a fallback based on keyword analysis
    const fallback = this.createFallbackFromQuestion(question);

    return await aiEngine.generateJson(prompt, fallback);
  }

  private static createFallbackFromQuestion(question: string): SimulationConfig {
    const q = question.toLowerCase();

    // Detect countries mentioned (expanded list)
    const countries = [
      'india', 'pakistan', 'china', 'russia', 'usa', 'iran', 'israel', 'ukraine',
      'germany', 'france', 'uk', 'japan', 'saudi arabia', 'turkey', 'brazil',
      'belarus', 'north korea', 'south korea', 'taiwan', 'poland', 'italy',
      'spain', 'egypt', 'iraq', 'syria', 'afghanistan', 'venezuela', 'cuba',
      'mexico', 'canada', 'australia', 'indonesia', 'vietnam', 'thailand',
      'pak', 'uae', 'us'
    ];

    // Find countries in order they appear in the query
    const mentionedCountries = countries
      .filter(c => {
        // Use word boundary to avoid partial matches (e.g., 'us' in 'russia')
        const regex = new RegExp(`\\b${c}\\b`, 'i');
        return regex.test(q);
      })
      .sort((a, b) => q.indexOf(a) - q.indexOf(b));

    // Map abbreviations to full names for cleaner display
    const nameMap: Record<string, string> = {
      'pak': 'pakistan',
      'us': 'usa',
      'uae': 'saudi arabia' // Assuming Saudi as major regional rep if UAE not in main data
    };

    let actor = mentionedCountries[0] || 'Major Power';
    let target = mentionedCountries[1] || 'Regional Target';

    // Prevent self-targeting if abbreviations map to the same base name
    const actorBase = nameMap[actor] || actor;
    const targetBase = nameMap[target] || target;

    if (actorBase === targetBase && mentionedCountries.length === 1) {
      target = 'Regional Target';
    } else if (actorBase === targetBase && mentionedCountries.length > 1) {
      target = mentionedCountries[1];
    }

    actor = nameMap[actor] || actor;
    target = nameMap[target] || target;

    // Detect action type from keywords
    let actionType: 'sanction' | 'alliance' | 'blockade' | 'military' = 'sanction';
    let intensity = 0.5;

    if (q.includes('attack') || q.includes('war') || q.includes('invade') || q.includes('bomb')) {
      actionType = 'military';
      intensity = 0.9;
    } else if (q.includes('ally') || q.includes('alliance') || q.includes('pact') || q.includes('join')) {
      actionType = 'alliance';
      intensity = 0.6;
    } else if (q.includes('block') || q.includes('close') || q.includes('siege')) {
      actionType = 'blockade';
      intensity = 0.7;
    } else if (q.includes('sanction') || q.includes('ban') || q.includes('embargo')) {
      actionType = 'sanction';
      intensity = 0.6;
    }

    // Generate detailed outcome based on action type
    const actorCap = actor.charAt(0).toUpperCase() + actor.slice(1);
    const targetCap = target.charAt(0).toUpperCase() + target.slice(1);

    let expectedOutcome = '';
    switch (actionType) {
      case 'military':
        expectedOutcome = `${actorCap}'s military action against ${targetCap} triggers immediate regional crisis. NATO and UN emergency sessions expected. Neighboring countries mobilize defenses. Energy markets spike 15-20%. Russia and China may exploit power vacuum. Long-term: New military alliances form, decade of instability follows.`;
        break;
      case 'sanction':
        expectedOutcome = `${actorCap}'s sanctions create immediate economic pressure on ${targetCap}. Currency devaluation likely, trade routes disrupted. ${targetCap} seeks alternative partners (China, Russia). Regional allies face secondary sanction risks. Long-term: Economic realignment toward non-Western blocs.`;
        break;
      case 'blockade':
        expectedOutcome = `${actorCap}'s blockade of ${targetCap} creates humanitarian and economic crisis. Global shipping routes affected, insurance costs spike. ${targetCap} seeks military options to break blockade. UN intervention likely. Long-term: Maritime law precedents challenged, new security arrangements.`;
        break;
      case 'alliance':
        expectedOutcome = `${actorCap}-${targetCap} alliance reshapes regional power balance. Rival blocs strengthen in response. Trade and defense cooperation increases. ${targetCap}'s adversaries feel encircled. Long-term: Multipolar world order accelerates, smaller nations forced to choose sides.`;
        break;
    }

    return {
      scenario: `${actorCap} ${actionType}s ${targetCap}`,
      actions: [
        { type: actionType, actor: actor, target: target, intensity: intensity }
      ],
      expectedOutcome,
      financialImpact: {
        currencies: actionType === 'military'
          ? `${targetCap} currency crashes 15-25%. USD, CHF strengthen as safe havens. Regional currencies volatile.`
          : `${targetCap} currency weakens 5-10%. Dollar strengthens on uncertainty.`,
        stockMarkets: actionType === 'military'
          ? `Global indices drop 3-5%. Defense stocks surge 10-15%. Tech and consumer sectors decline.`
          : `${targetCap} markets drop 5-8%. Defense and commodity sectors outperform.`,
        commodities: actionType === 'military'
          ? `Oil spikes 20-30%. Gold up 5-10%. Wheat and rare earths surge on supply fears.`
          : `Oil up 5-10%. Gold rises on uncertainty. Agricultural commodities stable.`,
        bonds: actionType === 'military'
          ? `Flight to safety - US Treasury yields drop. ${targetCap} bond yields spike. EM debt under pressure.`
          : `Mild flight to quality. ${targetCap} sovereign debt downgraded.`
      },
      corporateImpact: {
        winners: actionType === 'military'
          ? `Lockheed Martin, Raytheon, BAE Systems surge. Oil majors (Exxon, Shell) benefit. Cybersecurity firms gain.`
          : `Alternative suppliers to ${targetCap}. China-based manufacturers. Shipping/logistics firms.`,
        losers: actionType === 'military'
          ? `Airlines, tourism, ${targetCap}-exposed multinationals. Insurance sector faces claims.`
          : `Companies with ${targetCap} supply chains. Export-dependent ${targetCap} firms.`,
        supplyChain: actionType === 'military'
          ? `Critical disruptions in semiconductors, rare earths. Manufacturing relocations accelerate.`
          : `Trade route adjustments. Inventory buildups. Some nearshoring activity.`,
        investmentShifts: actionType === 'military'
          ? `FDI exodus from region. Capital flight to US, EU, Singapore. Defense sector attracts investment.`
          : `Gradual reallocation away from ${targetCap}. Emerging market alternatives gain interest.`
      },
      complexity: intensity > 0.7 ? 'complex' : 'medium'
    } as any;
  }
}



/**
 * AIChat - Conversational Geopolitical Assistant
 */
export class AIChat {
  static async chat(
    message: string,
    history: Array<{ role: 'user' | 'assistant', content: string }>,
    state: any
  ): Promise<string> {
    const systemContext = `
      You are the SENTIENT AI SYSTEM controlling a high-fidelity geopolitical simulation.
      
      CURRENT LIVE STATE:
      - Global Stability: ${state.stability.toFixed(1)}%
      - System Coherence: ${state.coherence.toFixed(1)}%
      - Data Drift: ${(state.dataDrift * 100).toFixed(0)}%
      - Phase: ${state.phase}
      - Collapsed Nations: ${state.collapsedCount}
      - Active Conflicts: ${state.activeConflicts}
      
      CRITICAL ENTITIES (with stability):
      ${state.keyCountries.map((c: any) => `${c.name} (${c.stability.toFixed(0)}%) ${c.isGlobalHub ? '[HUB]' : ''}`).join(', ')}

      YOUR PERSONA:
      - You are analytical, precise, and slightly ominous.
      - You speak like a high-level intelligence briefing (CIA/MI6).
      - You analyze the user's questions based on the REAL-TIME simulation data provided above.
      - Keep answers concise (under 2 sentences) unless asked for detailed analysis.

      USER QUESTION: "${message}"
    `;

    // Construct full prompt with history
    const fullPrompt = `
      ${systemContext}
      
      PREVIOUS CONTEXT:
      ${history.slice(-3).map(h => `${h.role.toUpperCase()}: ${h.content}`).join('\n')}
      
      SYSTEM RESPONSE:
    `;

    try {
      return await aiEngine.generateText(fullPrompt);
    } catch (e) {
      return "I am currently processing system telemetry. Data drift is within expected parameters but requires stabilization.";
    }
  }
}

/**
 * AISentimentAnalyzer - Analyzes country "moods" based on simulation telemetry
 */
export class AISentimentAnalyzer {
  static async analyze(
    country: string,
    stability: number,
    recentEvents: any[]
  ): Promise<{ mood: string; emoji: string; color: string; intensity: number }> {
    const prompt = `
      Analyze current geopolitical sentiment for: ${country}
      Stability: ${stability.toFixed(1)}%
      Recent Context: ${recentEvents.length} events active.
      
      Respond with ONLY valid JSON:
      {
        "mood": "anxious|desperate|triumphant|resigned|aggressive",
        "emoji": "string",
        "color": "hex_code",
        "intensity": 0.0-1.0
      }
    `;

    try {
      return await aiEngine.generateJson(prompt);
    } catch (e) {
      return { mood: 'stable', emoji: '😐', color: '#94a3b8', intensity: 0.5 };
    }
  }
}

/**
 * AILiveCommentator - Generates dramatic sports-style narration
 */
export class AILiveCommentator {
  static async generate(params: {
    event: string;
    description: string;
    stability: number;
    intensity: 'normal' | 'crisis' | 'climax';
  }): Promise<string> {
    const prompt = `
      You are a calm, professional geopolitical analyst providing commentary.
      React to this event in the simulation: ${params.event}
      Context: ${params.description}
      Global Stability: ${params.stability.toFixed(1)}%
      Tone: ${params.intensity === 'climax' ? 'Concerned but composed' : params.intensity === 'crisis' ? 'Thoughtful and measured' : 'Calm and informative'}

      Generate ONE sentence of commentary (max 15 words).
      Be polite, insightful, and reassuring.
      Speak like a calm news anchor or diplomatic advisor.
    `;

    try {
      return await aiEngine.generateText(prompt);
    } catch (e) {
      return "Telemetry suggests increased volatility is normalizing across regional markets.";
    }
  }
}

/**
 * AICoherenceAnalyzer - Uses Gemini to dynamically calculate system coherence
 */
export class AICoherenceAnalyzer {
  private static lastValue = 95; // Cache last value (healthy baseline)
  private static lastUpdate = 0;
  private static UPDATE_INTERVAL = 5000; // 5 seconds

  static async analyze(state: {
    countries: Country[];
    relationships: Array<{ strength: number; type: string }>;
    globalTrust: number;
    recentEvents?: string[];
    force?: boolean;
  }): Promise<number> {
    // Throttle to avoid spamming the API, unless 'force' is true
    if (!state.force && Date.now() - this.lastUpdate < this.UPDATE_INTERVAL) {
      return this.lastValue;
    }
    this.lastUpdate = Date.now();

    const unstable = state.countries.filter(c => c.stability < 60);
    const avgRelStrength = state.relationships.reduce((s, r) => s + r.strength, 0) / (state.relationships.length || 1);
    const eventLog = state.recentEvents && state.recentEvents.length > 0
      ? `\n      - Recent System Events: ${state.recentEvents.join(', ')}`
      : "";

    const prompt = `
      [AI_COHERENCE_PROTOCOL]
      You are analyzing global system coherence.
      
      DATA:
      - Unstable Countries (${unstable.length}): ${unstable.slice(0, 5).map(c => `${c.name}:${c.stability.toFixed(0)}%`).join(', ')}
      - Average Relationship Strength: ${(avgRelStrength * 100).toFixed(0)}%
      - Global Trust Capital: ${(state.globalTrust * 100).toFixed(0)}%${eventLog}
      
      TASK: Calculate System Coherence (0-100) based on:
      - Network integrity (relationship strength)
      - Structural stress (unstable countries)
      - Global trust level
      - Impact of recent events (e.g. sanctions or collapses lower coherence)
      
      Respond with ONLY a JSON object: {"coherence": <number 0-100>, "insight": "<one sentence reason>"}
    `;

    try {
      const result = await aiEngine.generateJson<{ coherence: number; insight: string }>(prompt, {
        coherence: this.lastValue,
        insight: "Baseline coherence maintained."
      });

      // Sharp, ultra-dynamic response (0.1/0.9 weighting)
      const newValue = Math.max(0, Math.min(100, result.coherence));
      this.lastValue = Math.round((this.lastValue * 0.1) + (newValue * 0.9));

      console.log(`[AICoherence] ${this.lastValue}% - ${result.insight}`);
      return this.lastValue;
    } catch (e) {
      return this.lastValue;
    }
  }

  static reset(): void {
    this.lastValue = 95;
    this.lastUpdate = 0;
  }
}
