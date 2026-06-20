/**
 * Live Data Service - Hybrid Intelligence Layer
 * 
 * Combines truly free APIs with realistic simulated data
 * to create a "live" data experience at zero cost.
 * 
 * TIER 1: Real APIs (Free)
 * - World Bank: GDP, trade, economic indicators
 * - REST Countries: Country metadata, flags, coordinates
 * 
 * TIER 2: Simulated Live Data
 * - Energy flows: Static baseline + realistic variance
 * - Event feed: Curated events with timestamp simulation
 * - Crisis level: Weighted calculation from all inputs
 */

// ============================================================================
// TYPES
// ============================================================================

export interface CountryData {
    id: string;
    name: string;
    flag: string;
    coordinates: [number, number];
    population: number;
    gdp?: number;
    tradePercentGDP?: number;
    region: string;
}

export interface EnergyData {
    nordStream: {
        status: 'offline' | 'reduced' | 'active';
        utilization: number;
        capacity: number; // bcm/year
    };
    turkStream: {
        status: 'offline' | 'reduced' | 'active';
        utilization: number;
        capacity: number;
    };
    euStorage: {
        fillLevel: number; // 0-100%
        trend: 'increasing' | 'decreasing' | 'stable';
        criticalThreshold: number;
    };
    timestamp: Date;
}

export interface LiveEvent {
    id: string;
    type: 'energy' | 'geopolitical' | 'economic' | 'corporate' | 'military';
    title: string;
    description: string;
    impact: number; // -10 to +10
    affectedCountries: string[];
    timestamp: Date;
    source: string;
}

export interface CrisisIndicator {
    level: number; // 0-100
    category: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
    factors: {
        energyStress: number;
        economicStress: number;
        geopoliticalTension: number;
        supplyChainRisk: number;
    };
    primaryConcern: string;
    lastUpdated: Date;
}

export interface LiveDataState {
    countries: Record<string, CountryData>;
    energy: EnergyData;
    events: LiveEvent[];
    crisis: CrisisIndicator;
    isLoading: boolean;
    lastFetch: Date | null;
    error: string | null;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    // API endpoints
    WORLD_BANK_BASE: 'https://api.worldbank.org/v2',
    REST_COUNTRIES_BASE: 'https://restcountries.com/v3.1',

    // Cache durations (ms)
    CACHE_DURATION_COUNTRIES: 24 * 60 * 60 * 1000, // 24 hours
    CACHE_DURATION_ECONOMIC: 6 * 60 * 60 * 1000,   // 6 hours
    CACHE_DURATION_ENERGY: 5 * 60 * 1000,          // 5 minutes (simulated)
    CACHE_DURATION_EVENTS: 60 * 1000,              // 1 minute

    // Simulation parameters
    ENERGY_VARIANCE: 0.05, // ±5% random variance
    DEMAND_PEAK_HOURS: { start: 6, end: 22 }, // European demand peak
};

// ============================================================================
// CACHE UTILITIES
// ============================================================================

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiry: number;
}

function getFromCache<T>(key: string): T | null {
    try {
        const cached = localStorage.getItem(`fw_cache_${key}`);
        if (!cached) return null;

        const entry: CacheEntry<T> = JSON.parse(cached);
        if (Date.now() > entry.expiry) {
            localStorage.removeItem(`fw_cache_${key}`);
            return null;
        }

        return entry.data;
    } catch {
        return null;
    }
}

function setCache<T>(key: string, data: T, duration: number): void {
    try {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + duration,
        };
        localStorage.setItem(`fw_cache_${key}`, JSON.stringify(entry));
    } catch {
        // localStorage might be full or unavailable
        console.warn('[LiveData] Cache write failed');
    }
}

// ============================================================================
// TIER 1: REAL API FETCHERS
// ============================================================================

/**
 * Fetch country metadata from REST Countries API (100% Free)
 */
export async function fetchCountryMetadata(): Promise<Record<string, CountryData>> {
    const cached = getFromCache<Record<string, CountryData>>('countries');
    if (cached) return cached;

    try {
        const response = await fetch(`${CONFIG.REST_COUNTRIES_BASE}/all?fields=name,cca2,cca3,flags,latlng,population,region`);
        if (!response.ok) throw new Error('REST Countries API failed');

        const data = await response.json();
        const countries: Record<string, CountryData> = {};

        // Map country codes to our simulation IDs
        const codeMapping: Record<string, string> = {
            'RUS': 'russia', 'DEU': 'germany', 'FRA': 'france', 'GBR': 'uk',
            'POL': 'poland', 'ITA': 'italy', 'ESP': 'spain', 'NLD': 'netherlands',
            'TUR': 'turkey', 'UKR': 'ukraine', 'BLR': 'belarus', 'KAZ': 'kazakhstan',
            'AZE': 'azerbaijan', 'QAT': 'qatar', 'SAU': 'saudi_arabia', 'IRN': 'iran',
            'CHN': 'china', 'USA': 'usa', 'IND': 'india', 'JPN': 'japan',
        };

        for (const country of data) {
            const simId = codeMapping[country.cca3];
            if (simId) {
                countries[simId] = {
                    id: simId,
                    name: country.name.common,
                    flag: country.flags?.emoji || '🏳️',
                    coordinates: country.latlng || [0, 0],
                    population: country.population || 0,
                    region: country.region || 'Unknown',
                };
            }
        }

        setCache('countries', countries, CONFIG.CACHE_DURATION_COUNTRIES);
        return countries;
    } catch (error) {
        console.error('[LiveData] Failed to fetch country metadata:', error);
        return getStaticCountryFallback();
    }
}

/**
 * Fetch GDP data from World Bank API (100% Free)
 */
export async function fetchGDPData(countryCode: string): Promise<number | null> {
    const cacheKey = `gdp_${countryCode}`;
    const cached = getFromCache<number>(cacheKey);
    if (cached !== null) return cached;

    try {
        const response = await fetch(
            `${CONFIG.WORLD_BANK_BASE}/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json&per_page=1&date=2022`
        );
        if (!response.ok) throw new Error('World Bank API failed');

        const data = await response.json();
        const gdp = data[1]?.[0]?.value || null;

        if (gdp !== null) {
            setCache(cacheKey, gdp, CONFIG.CACHE_DURATION_ECONOMIC);
        }

        return gdp;
    } catch (error) {
        console.error(`[LiveData] Failed to fetch GDP for ${countryCode}:`, error);
        return null;
    }
}

/**
 * Fetch trade as % of GDP from World Bank (100% Free)
 */
export async function fetchTradeData(countryCode: string): Promise<number | null> {
    const cacheKey = `trade_${countryCode}`;
    const cached = getFromCache<number>(cacheKey);
    if (cached !== null) return cached;

    try {
        const response = await fetch(
            `${CONFIG.WORLD_BANK_BASE}/country/${countryCode}/indicator/NE.TRD.GNFS.ZS?format=json&per_page=1&date=2022`
        );
        if (!response.ok) throw new Error('World Bank API failed');

        const data = await response.json();
        const trade = data[1]?.[0]?.value || null;

        if (trade !== null) {
            setCache(cacheKey, trade, CONFIG.CACHE_DURATION_ECONOMIC);
        }

        return trade;
    } catch (error) {
        console.error(`[LiveData] Failed to fetch trade data for ${countryCode}:`, error);
        return null;
    }
}

// ============================================================================
// TIER 2: SIMULATED LIVE DATA
// ============================================================================

/**
 * Static baseline for energy data (researched from real sources)
 */
const ENERGY_BASELINE = {
    nordStream: {
        capacity: 55, // bcm/year
        status: 'offline' as const, // Sabotaged Sept 2022
        baseUtilization: 0, // 0% due to sabotage
    },
    turkStream: {
        capacity: 31.5, // bcm/year
        status: 'active' as const,
        baseUtilization: 0.85, // ~85% capacity
    },
    euStorage: {
        baseFillLevel: 0.68, // ~68% (typical winter level)
        criticalThreshold: 0.30, // 30% = crisis
    },
};

/**
 * Generate simulated "live" energy data with realistic variance
 */
export function generateLiveEnergyData(): EnergyData {
    const now = new Date();
    const hourOfDay = now.getHours();

    // European demand curve (peaks during day)
    const isPeakHours = hourOfDay >= CONFIG.DEMAND_PEAK_HOURS.start &&
        hourOfDay <= CONFIG.DEMAND_PEAK_HOURS.end;
    const demandMultiplier = isPeakHours ? 1.0 : 0.7;

    // Add random variance (±5%) to make it feel live
    const variance = () => 1 - CONFIG.ENERGY_VARIANCE + (Math.random() * CONFIG.ENERGY_VARIANCE * 2);

    // Simulate seasonal effect (winter = higher demand)
    const month = now.getMonth();
    const isWinter = month >= 10 || month <= 2; // Nov-Feb
    const seasonalMultiplier = isWinter ? 1.15 : 0.9;

    // Calculate storage trend
    const storageDelta = (Math.random() - 0.5) * 0.02; // ±1% daily change
    const currentFillLevel = Math.max(0.2, Math.min(0.95,
        ENERGY_BASELINE.euStorage.baseFillLevel + storageDelta
    ));

    return {
        nordStream: {
            status: ENERGY_BASELINE.nordStream.status,
            utilization: 0, // Offline since sabotage
            capacity: ENERGY_BASELINE.nordStream.capacity,
        },
        turkStream: {
            status: ENERGY_BASELINE.turkStream.status,
            utilization: ENERGY_BASELINE.turkStream.baseUtilization * demandMultiplier * variance(),
            capacity: ENERGY_BASELINE.turkStream.capacity,
        },
        euStorage: {
            fillLevel: currentFillLevel * seasonalMultiplier * variance(),
            trend: storageDelta > 0 ? 'increasing' : storageDelta < 0 ? 'decreasing' : 'stable',
            criticalThreshold: ENERGY_BASELINE.euStorage.criticalThreshold,
        },
        timestamp: now,
    };
}

/**
 * Curated real-world events (researched from news)
 * These are cycled through with simulated timestamps to appear "live"
 */
const CURATED_EVENTS: Omit<LiveEvent, 'id' | 'timestamp'>[] = [
    // Energy events
    {
        type: 'energy',
        title: 'Germany gas storage reaches 68%',
        description: 'European gas reserves stabilizing ahead of winter heating season.',
        impact: -2,
        affectedCountries: ['germany', 'netherlands', 'france'],
        source: 'Reuters',
    },
    {
        type: 'energy',
        title: 'TurkStream flow increases 5%',
        description: 'Turkey-Russia pipeline ramps up deliveries as alternative route gains importance.',
        impact: 3,
        affectedCountries: ['turkey', 'russia', 'hungary'],
        source: 'Energy Intel',
    },
    {
        type: 'energy',
        title: 'LNG tanker diversions to Europe',
        description: 'Asian LNG cargoes redirected to European terminals amid price differentials.',
        impact: 2,
        affectedCountries: ['qatar', 'usa', 'germany', 'poland'],
        source: 'Bloomberg',
    },

    // Geopolitical events
    {
        type: 'geopolitical',
        title: 'Turkey mediates EU-Russia talks',
        description: 'Diplomatic channels opened through Ankara for energy negotiations.',
        impact: -3,
        affectedCountries: ['turkey', 'russia', 'germany'],
        source: 'Al Jazeera',
    },
    {
        type: 'geopolitical',
        title: 'New EU sanctions package proposed',
        description: 'European Commission considering 12th sanctions package targeting energy sector.',
        impact: 5,
        affectedCountries: ['russia', 'belarus', 'germany', 'poland'],
        source: 'Politico EU',
    },
    {
        type: 'geopolitical',
        title: 'Black Sea shipping tensions rise',
        description: 'Naval incidents near Bosphorus strain Turkey-Russia relations.',
        impact: 4,
        affectedCountries: ['turkey', 'russia', 'ukraine'],
        source: 'Naval News',
    },

    // Economic events
    {
        type: 'economic',
        title: 'German PMI signals contraction',
        description: 'Manufacturing index falls to 48.2, indicating industrial output decline.',
        impact: 3,
        affectedCountries: ['germany', 'france', 'italy'],
        source: 'Financial Times',
    },
    {
        type: 'economic',
        title: 'Euro weakness continues',
        description: 'EUR/USD drops to 1.05 as energy crisis weighs on European economy.',
        impact: 2,
        affectedCountries: ['germany', 'france', 'italy', 'spain'],
        source: 'Reuters',
    },

    // Corporate events
    {
        type: 'corporate',
        title: 'Gazprom reports record profits',
        description: 'Despite sanctions, Russian gas giant posts highest quarterly earnings.',
        impact: 3,
        affectedCountries: ['russia'],
        source: 'Moscow Times',
    },
    {
        type: 'corporate',
        title: 'BASF announces plant closures',
        description: 'German chemical giant to shutter energy-intensive facilities.',
        impact: 4,
        affectedCountries: ['germany', 'poland', 'czech_republic'],
        source: 'Handelsblatt',
    },

    // Military/Security events
    {
        type: 'military',
        title: 'NATO exercises in Baltic',
        description: 'Alliance conducts largest naval drills near Russian border.',
        impact: 4,
        affectedCountries: ['russia', 'poland', 'germany', 'uk'],
        source: 'Defense News',
    },
    {
        type: 'military',
        title: 'Wagner Group activity in Africa',
        description: 'Private military company expands operations in Sahel region.',
        impact: 2,
        affectedCountries: ['russia'],
        source: 'BBC',
    },
];

/**
 * Generate simulated live event feed
 */
export function generateLiveEvents(count: number = 5): LiveEvent[] {
    const now = Date.now();

    // Shuffle and pick random events
    const shuffled = [...CURATED_EVENTS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    // Assign simulated timestamps (last 24 hours)
    return selected.map((event, index) => ({
        ...event,
        id: `event_${now}_${index}`,
        timestamp: new Date(now - Math.random() * 24 * 60 * 60 * 1000), // Random within last 24h
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Most recent first
}

/**
 * Calculate crisis indicator from multiple inputs
 */
export function calculateCrisisLevel(energy: EnergyData, events: LiveEvent[]): CrisisIndicator {
    // Energy stress (0-100)
    const storageStress = energy.euStorage.fillLevel < 0.5
        ? (0.5 - energy.euStorage.fillLevel) * 100 * 2
        : 0;
    const pipelineStress = energy.nordStream.status === 'offline' ? 30 : 0;
    const energyStress = Math.min(100, storageStress + pipelineStress);

    // Geopolitical tension from events (0-100)
    const negativEvents = events.filter(e => e.impact > 0).length;
    const geopoliticalTension = Math.min(100, negativEvents * 15);

    // Economic stress (simulated based on season)
    const month = new Date().getMonth();
    const isWinter = month >= 10 || month <= 2;
    const economicStress = isWinter ? 40 : 20;

    // Supply chain risk
    const supplyChainRisk = energy.turkStream.utilization < 0.7 ? 50 : 20;

    // Weighted total
    const totalRisk = (
        energyStress * 0.35 +
        geopoliticalTension * 0.25 +
        economicStress * 0.20 +
        supplyChainRisk * 0.20
    );

    // Determine category
    let category: CrisisIndicator['category'] = 'NORMAL';
    if (totalRisk > 70) category = 'CRITICAL';
    else if (totalRisk > 50) category = 'HIGH';
    else if (totalRisk > 30) category = 'ELEVATED';

    // Primary concern
    const concerns = [
        { factor: 'Energy supply uncertainty', value: energyStress },
        { factor: 'Geopolitical tensions', value: geopoliticalTension },
        { factor: 'Economic stress', value: economicStress },
        { factor: 'Supply chain disruption', value: supplyChainRisk },
    ].sort((a, b) => b.value - a.value);

    return {
        level: Math.round(totalRisk),
        category,
        factors: {
            energyStress,
            economicStress,
            geopoliticalTension,
            supplyChainRisk,
        },
        primaryConcern: concerns[0].factor,
        lastUpdated: new Date(),
    };
}

// ============================================================================
// FALLBACK STATIC DATA
// ============================================================================

function getStaticCountryFallback(): Record<string, CountryData> {
    return {
        russia: { id: 'russia', name: 'Russia', flag: '🇷🇺', coordinates: [61.52, 105.32], population: 144100000, region: 'Europe' },
        germany: { id: 'germany', name: 'Germany', flag: '🇩🇪', coordinates: [51.17, 10.45], population: 83200000, region: 'Europe' },
        france: { id: 'france', name: 'France', flag: '🇫🇷', coordinates: [46.23, 2.21], population: 67390000, region: 'Europe' },
        uk: { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', coordinates: [55.38, -3.44], population: 67220000, region: 'Europe' },
        poland: { id: 'poland', name: 'Poland', flag: '🇵🇱', coordinates: [51.92, 19.15], population: 37950000, region: 'Europe' },
        turkey: { id: 'turkey', name: 'Turkey', flag: '🇹🇷', coordinates: [38.96, 35.24], population: 84340000, region: 'Asia' },
        ukraine: { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', coordinates: [48.38, 31.17], population: 43730000, region: 'Europe' },
        qatar: { id: 'qatar', name: 'Qatar', flag: '🇶🇦', coordinates: [25.35, 51.18], population: 2880000, region: 'Asia' },
        china: { id: 'china', name: 'China', flag: '🇨🇳', coordinates: [35.86, 104.20], population: 1412000000, region: 'Asia' },
        usa: { id: 'usa', name: 'United States', flag: '🇺🇸', coordinates: [37.09, -95.71], population: 331900000, region: 'Americas' },
    };
}

// ============================================================================
// MAIN EXPORT: UNIFIED DATA FETCHER
// ============================================================================

/**
 * Fetch all live data in one call
 */
export async function fetchAllLiveData(): Promise<LiveDataState> {
    try {
        // Fetch country metadata (cached for 24h)
        const countries = await fetchCountryMetadata();

        // Generate simulated live data
        const energy = generateLiveEnergyData();
        const events = generateLiveEvents(5);
        const crisis = calculateCrisisLevel(energy, events);

        return {
            countries,
            energy,
            events,
            crisis,
            isLoading: false,
            lastFetch: new Date(),
            error: null,
        };
    } catch (error) {
        console.error('[LiveData] Failed to fetch all data:', error);
        return {
            countries: getStaticCountryFallback(),
            energy: generateLiveEnergyData(),
            events: generateLiveEvents(5),
            crisis: {
                level: 50,
                category: 'ELEVATED',
                factors: { energyStress: 50, economicStress: 30, geopoliticalTension: 40, supplyChainRisk: 30 },
                primaryConcern: 'Data unavailable',
                lastUpdated: new Date(),
            },
            isLoading: false,
            lastFetch: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Get time since last update in human-readable format
 */
export function getTimeSinceUpdate(date: Date | null): string {
    if (!date) return 'Never';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
