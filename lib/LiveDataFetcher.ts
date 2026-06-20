/**
 * LiveDataFetcher - AI-powered real-time geopolitical data
 * 
 * Uses Gemini AI to generate realistic, contextual geopolitical data
 * based on current world events.
 */

import { aiEngine } from './AIEngine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LiveCountryData {
    id: string;
    name: string;
    flag: string;
    energySecurity: number;      // 0-1
    economicHealth: number;      // 0-1
    politicalStability: number;  // 0-1
    influence: number;           // 0-1
    currentIssues: string[];
    energyDependencies: Record<string, number>;  // countryId -> percentage
}

export interface LiveRelationship {
    from: string;
    to: string;
    type: 'energy' | 'trade' | 'security' | 'diplomatic';
    strength: number;            // 0-1
    critical: boolean;
    context: string;
}

export interface GeopoliticalEvent {
    date: string;
    title: string;
    description: string;
    severity: number;            // 0-1
    affectedCountries: string[];
    category: 'sanctions' | 'energy' | 'conflict' | 'economic' | 'political';
}

export interface GlobalTension {
    parties: string[];
    severity: number;
    description: string;
}

export interface LiveGeopoliticalData {
    timestamp: string;
    countries: LiveCountryData[];
    relationships: LiveRelationship[];
    recentEvents: GeopoliticalEvent[];
    globalTensions: GlobalTension[];
    dataSource: 'ai' | 'fallback';
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const COUNTRIES_TO_FETCH = [
    'russia', 'germany', 'poland', 'turkey', 'ukraine', 'france',
    'italy', 'spain', 'usa', 'china', 'india', 'qatar', 'saudi_arabia',
    'iran', 'uk', 'japan', 'australia', 'brazil', 'south_africa', 'nigeria'
];

// ============================================================================
// LIVE DATA FETCHER CLASS
// ============================================================================

class LiveDataFetcherService {
    private cache: Map<string, { data: LiveGeopoliticalData; timestamp: number }> = new Map();

    /**
     * Fetch current geopolitical state using AI
     */
    async fetchCurrentState(): Promise<LiveGeopoliticalData> {
        // Check cache first
        const cached = this.cache.get('current_state');
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        const today = new Date().toISOString().split('T')[0];

        const prompt = `You are a geopolitical data API. Generate realistic current-state data for a global collapse simulation.

Today: ${today}

Generate data for these 20 major countries:
${COUNTRIES_TO_FETCH.join(', ')}

For each country, analyze CURRENT REAL-WORLD conditions and provide:
1. energySecurity (0-1): Based on energy import dependency
2. economicHealth (0-1): Based on GDP, inflation, debt levels
3. politicalStability (0-1): Based on recent elections, protests, government stability
4. influence (0-1): Global power projection
5. currentIssues: 2-3 current challenges (like "sanctions", "inflation", "energy crisis")
6. energyDependencies: Which countries they depend on for energy and percentages

Also provide:
- 5 most critical current relationships (energy pipelines, trade dependencies)
- 5 major recent geopolitical events (past 30 days)
- 3 active global tensions

Base this on REAL current world events as of ${today}.

Respond with ONLY valid JSON (no explanation, no markdown):
{
  "timestamp": "${new Date().toISOString()}",
  "countries": [
    {
      "id": "russia",
      "name": "Russia",
      "flag": "🇷🇺",
      "energySecurity": 0.95,
      "economicHealth": 0.55,
      "politicalStability": 0.65,
      "influence": 0.75,
      "currentIssues": ["sanctions", "war costs"],
      "energyDependencies": {}
    }
  ],
  "relationships": [
    {
      "from": "russia",
      "to": "germany",
      "type": "energy",
      "strength": 0.35,
      "critical": true,
      "context": "Reduced gas flows post-Nord Stream"
    }
  ],
  "recentEvents": [
    {
      "date": "${today}",
      "title": "Event Title",
      "description": "Brief description",
      "severity": 0.8,
      "affectedCountries": ["country1", "country2"],
      "category": "sanctions"
    }
  ],
  "globalTensions": [
    {
      "parties": ["russia", "ukraine"],
      "severity": 0.95,
      "description": "Ongoing military conflict"
    }
  ]
}`;

        // AI DISABLED - Use fallback data directly to conserve API quota
        // Only What-If feature uses AI now
        const fallbackData = this.getFallbackData();
        this.cache.set('current_state', { data: fallbackData, timestamp: Date.now() });
        return fallbackData;
    }

    /**
     * Fetch recent geopolitical events
     */
    async fetchRecentEvents(): Promise<GeopoliticalEvent[]> {
        const cached = this.cache.get('recent_events');
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return (cached.data as any).events;
        }

        const prompt = `List the 8 most significant geopolitical events from the past 30 days.

Focus on:
- Sanctions and trade disputes
- Energy crises and pipeline issues
- Military conflicts
- Political instability
- Economic shocks

Respond with ONLY JSON array:
[
  {
    "date": "2026-01-20",
    "title": "Brief title",
    "description": "One sentence description",
    "severity": 0.8,
    "affectedCountries": ["country1", "country2"],
    "category": "sanctions"
  }
]`;

        // AI DISABLED - Use fallback events directly
        const events = this.getFallbackEvents();
        this.cache.set('recent_events', { data: { events }, timestamp: Date.now() });
        return events;
    }

    /**
     * Clear cache and force refresh
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Get cache status
     */
    getCacheStatus(): { hasData: boolean; age: number | null } {
        const cached = this.cache.get('current_state');
        if (!cached) return { hasData: false, age: null };
        return { hasData: true, age: Date.now() - cached.timestamp };
    }

    /**
     * Fallback data when AI is unavailable
     */
    private getFallbackData(): LiveGeopoliticalData {
        return {
            timestamp: new Date().toISOString(),
            dataSource: 'fallback',
            countries: [
                {
                    id: 'russia', name: 'Russia', flag: '🇷🇺',
                    energySecurity: 0.95, economicHealth: 0.50, politicalStability: 0.65, influence: 0.75,
                    currentIssues: ['Western sanctions', 'Military operations'],
                    energyDependencies: {}
                },
                {
                    id: 'germany', name: 'Germany', flag: '🇩🇪',
                    energySecurity: 0.45, economicHealth: 0.75, politicalStability: 0.80, influence: 0.85,
                    currentIssues: ['Energy transition', 'Industrial decline'],
                    energyDependencies: { russia: 0.35, norway: 0.30, usa: 0.15 }
                },
                {
                    id: 'usa', name: 'United States', flag: '🇺🇸',
                    energySecurity: 0.92, economicHealth: 0.78, politicalStability: 0.65, influence: 0.98,
                    currentIssues: ['Political polarization', 'Trade tensions'],
                    energyDependencies: {}
                },
                {
                    id: 'china', name: 'China', flag: '🇨🇳',
                    energySecurity: 0.70, economicHealth: 0.72, politicalStability: 0.85, influence: 0.92,
                    currentIssues: ['Taiwan tensions', 'Property crisis'],
                    energyDependencies: { russia: 0.20, saudi_arabia: 0.25 }
                },
                {
                    id: 'india', name: 'India', flag: '🇮🇳',
                    energySecurity: 0.60, economicHealth: 0.75, politicalStability: 0.70, influence: 0.72,
                    currentIssues: ['Energy imports', 'Border tensions'],
                    energyDependencies: { russia: 0.25, saudi_arabia: 0.30 }
                },
                {
                    id: 'turkey', name: 'Turkey', flag: '🇹🇷',
                    energySecurity: 0.55, economicHealth: 0.50, politicalStability: 0.60, influence: 0.58,
                    currentIssues: ['Inflation', 'Currency crisis'],
                    energyDependencies: { russia: 0.40, azerbaijan: 0.25 }
                },
                {
                    id: 'ukraine', name: 'Ukraine', flag: '🇺🇦',
                    energySecurity: 0.30, economicHealth: 0.25, politicalStability: 0.45, influence: 0.40,
                    currentIssues: ['Ongoing conflict', 'Infrastructure damage'],
                    energyDependencies: { eu: 0.50 }
                },
                {
                    id: 'saudi_arabia', name: 'Saudi Arabia', flag: '🇸🇦',
                    energySecurity: 0.98, economicHealth: 0.80, politicalStability: 0.75, influence: 0.68,
                    currentIssues: ['Oil market volatility', 'Regional tensions'],
                    energyDependencies: {}
                },
                {
                    id: 'qatar', name: 'Qatar', flag: '🇶🇦',
                    energySecurity: 0.98, economicHealth: 0.92, politicalStability: 0.88, influence: 0.45,
                    currentIssues: ['LNG expansion', 'Regional diplomacy'],
                    energyDependencies: {}
                },
                {
                    id: 'iran', name: 'Iran', flag: '🇮🇷',
                    energySecurity: 0.90, economicHealth: 0.40, politicalStability: 0.55, influence: 0.55,
                    currentIssues: ['Sanctions', 'Regional proxy conflicts'],
                    energyDependencies: {}
                },
            ],
            relationships: [
                { from: 'russia', to: 'germany', type: 'energy', strength: 0.35, critical: true, context: 'Reduced gas supply post-sanctions' },
                { from: 'russia', to: 'china', type: 'energy', strength: 0.75, critical: true, context: 'Power of Siberia pipeline' },
                { from: 'qatar', to: 'germany', type: 'energy', strength: 0.45, critical: false, context: 'LNG replacement supply' },
                { from: 'usa', to: 'germany', type: 'energy', strength: 0.35, critical: false, context: 'LNG exports increasing' },
                { from: 'russia', to: 'india', type: 'energy', strength: 0.60, critical: true, context: 'Discounted oil sales' },
            ],
            recentEvents: this.getFallbackEvents(),
            globalTensions: [
                { parties: ['russia', 'ukraine'], severity: 0.95, description: 'Active military conflict' },
                { parties: ['usa', 'china'], severity: 0.65, description: 'Trade and technology competition' },
                { parties: ['israel', 'iran'], severity: 0.75, description: 'Regional proxy tensions' },
            ]
        };
    }

    private getFallbackEvents(): GeopoliticalEvent[] {
        return [
            { date: '2026-01-25', title: 'EU Extends Russia Sanctions', description: 'Extended sanctions package for another 6 months', severity: 0.7, affectedCountries: ['russia', 'germany', 'poland'], category: 'sanctions' },
            { date: '2026-01-22', title: 'LNG Terminal Expansion', description: 'Germany opens new floating LNG terminal', severity: 0.5, affectedCountries: ['germany', 'qatar'], category: 'energy' },
            { date: '2026-01-18', title: 'Trade Tensions Rise', description: 'New tariffs announced on technology exports', severity: 0.6, affectedCountries: ['usa', 'china'], category: 'economic' },
            { date: '2026-01-15', title: 'Regional Summit Held', description: 'Middle East nations discuss energy cooperation', severity: 0.4, affectedCountries: ['saudi_arabia', 'qatar', 'uae'], category: 'diplomatic' as any },
            { date: '2026-01-10', title: 'Currency Volatility', description: 'Emerging market currencies under pressure', severity: 0.55, affectedCountries: ['turkey', 'argentina', 'brazil'], category: 'economic' },
        ];
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const liveDataFetcher = new LiveDataFetcherService();
