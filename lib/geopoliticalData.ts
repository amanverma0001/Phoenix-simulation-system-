/**
 * Geopolitical Data Model for Phoenix Simulation
 * 
 * This file contains comprehensive data structures representing:
 * - 12 Country entities with real geopolitical properties
 * - 35+ Hidden entities (corporations, pipelines, regional divisions)
 * - 50+ Relationships with energy, trade, military, and cultural ties
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type EntityType = 'country' | 'corporation' | 'pipeline' | 'region' | 'shadow_actor' | 'alliance';
export type RelationshipType = 'energy' | 'trade' | 'military' | 'cultural' | 'political';
export type PhaseState = 'STABLE' | 'STRESSED' | 'UNSTABLE' | 'COLLAPSED';
export type LayerType = 'energy' | 'corporate' | 'ethnic' | 'shadow';

export interface Position {
    lat: number;
    lng: number;
}

export interface Country {
    id: string;
    name: string;
    influence: number;        // 0-100, global influence score
    stability: number;        // 0-100, internal stability
    economicPower: number;    // 0-100, economic strength
    militaryPower: number;    // 0-100, military capability
    position: Position;       // Geographic center
    color: string;            // Base color for visualization
    flag: string;             // Emoji flag
    energyDependency: Record<string, number>; // Energy dependencies on other countries (0-1)
    phase: PhaseState;
    shockHistory: number;     // Number of past shocks for hysteresis
    rivals: string[];         // Countries that might benefit from this country's downfall
    beneficiaries: string[];  // Countries that benefit from trade diversion (e.g., cheap oil) if this country is sanctioned
    isGlobalHub?: boolean;    // [Refinement] Structural Fragility: Key logistical/economic nodes
}

export interface HiddenEntity {
    id: string;
    name: string;
    type: EntityType;
    layer: LayerType;
    revealed: boolean;        // Whether visible on map
    influence: number;        // 0-100
    parentCountry?: string;   // Country it's based in
    controlledTerritories: string[]; // Countries/regions it operates in
    position?: Position;
    color: string;
    description: string;
}

export interface Relationship {
    id: string;
    source: string;           // Entity ID
    target: string;           // Entity ID
    type: RelationshipType;
    strength: number;         // 0-1, relationship strength
    direction: 'unidirectional' | 'bidirectional';
    label?: string;           // Description
    critical: boolean;        // Is this relationship critical for stability?
}

export interface Pipeline {
    id: string;
    name: string;
    startPosition: Position;
    endPosition: Position;
    waypoints?: Position[];
    capacity: number;         // bcm/year
    status: 'active' | 'disrupted' | 'inactive';
    owner: string;            // Entity ID
    color: string;
}

// ============================================================================
// COUNTRY DATA - 12 Primary Countries
// ============================================================================

export const countries: Country[] = [
    {
        id: 'russia',
        name: 'Russia',
        influence: 85,
        stability: 75,
        economicPower: 60,
        militaryPower: 90,
        position: { lat: 55.7558, lng: 37.6173 }, // Moscow
        color: '#D32F2F',
        flag: '🇷🇺',
        energyDependency: {},  // Net exporter
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['usa', 'uk', 'poland'],
        beneficiaries: ['india', 'china', 'turkey', 'uae', 'kazakhstan'], // Updated with middlemen
        isGlobalHub: true
    },
    {
        id: 'germany',
        name: 'Germany',
        influence: 75,
        stability: 90,
        economicPower: 85,
        militaryPower: 50,
        position: { lat: 52.5200, lng: 13.4050 }, // Berlin
        color: '#FFC107',
        flag: '🇩🇪',
        energyDependency: { russia: 0.55, norway: 0.15, netherlands: 0.10 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['russia', 'china'],
        beneficiaries: [],
        isGlobalHub: true
    },
    {
        id: 'france',
        name: 'France',
        influence: 70,
        stability: 80,
        economicPower: 75,
        militaryPower: 75,
        position: { lat: 48.8566, lng: 2.3522 }, // Paris
        color: '#1976D2',
        flag: '🇫🇷',
        energyDependency: { russia: 0.17, norway: 0.25, algeria: 0.20 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['russia'],
        beneficiaries: []
    },
    {
        id: 'uk',
        name: 'United Kingdom',
        influence: 68,
        stability: 78,
        economicPower: 72,
        militaryPower: 70,
        position: { lat: 51.5074, lng: -0.1278 }, // London
        color: '#C2185B',
        flag: '🇬🇧',
        energyDependency: { norway: 0.35, qatar: 0.15 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['russia', 'argentina', 'china'],
        beneficiaries: ['germany', 'france', 'singapore', 'hong_kong', 'uae'] // Capital flight destinations
    },
    {
        id: 'poland',
        name: 'Poland',
        influence: 45,
        stability: 82,
        economicPower: 55,
        militaryPower: 45,
        position: { lat: 52.2297, lng: 21.0122 }, // Warsaw
        color: '#E91E63',
        flag: '🇵🇱',
        energyDependency: { russia: 0.50, germany: 0.15, usa: 0.10 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['russia', 'belarus'],
        beneficiaries: []
    },
    {
        id: 'turkey',
        name: 'Turkey',
        influence: 55,
        stability: 65,
        economicPower: 50,
        militaryPower: 65,
        position: { lat: 39.9334, lng: 32.8597 }, // Ankara
        color: '#FF5722',
        flag: '🇹🇷',
        energyDependency: { russia: 0.33, iran: 0.20, azerbaijan: 0.15 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['greece', 'russia'],
        beneficiaries: [],
        isGlobalHub: true
    },
    {
        id: 'ukraine',
        name: 'Ukraine',
        influence: 35,
        stability: 45,
        economicPower: 30,
        militaryPower: 55,
        position: { lat: 50.4501, lng: 30.5234 }, // Kyiv
        color: '#2196F3',
        flag: '🇺🇦',
        energyDependency: { russia: 0.35 },
        phase: 'STRESSED',
        shockHistory: 2,
        rivals: ['russia'],
        beneficiaries: []
    },
    {
        id: 'italy',
        name: 'Italy',
        influence: 55,
        stability: 70,
        economicPower: 65,
        militaryPower: 45,
        position: { lat: 41.9028, lng: 12.4964 }, // Rome
        color: '#4CAF50',
        flag: '🇮🇹',
        energyDependency: { russia: 0.40, algeria: 0.25, libya: 0.10 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['france'],
        beneficiaries: []
    },
    {
        id: 'spain',
        name: 'Spain',
        influence: 50,
        stability: 75,
        economicPower: 58,
        militaryPower: 40,
        position: { lat: 40.4168, lng: -3.7038 }, // Madrid
        color: '#FFEB3B',
        flag: '🇪🇸',
        energyDependency: { algeria: 0.30, nigeria: 0.15, usa: 0.10 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['uk'], // Gibraltar etc
        beneficiaries: []
    },
    {
        id: 'greece',
        name: 'Greece',
        influence: 30,
        stability: 65,
        economicPower: 35,
        militaryPower: 35,
        position: { lat: 37.9838, lng: 23.7275 }, // Athens
        color: '#03A9F4',
        flag: '🇬🇷',
        energyDependency: { russia: 0.35, turkey: 0.10, azerbaijan: 0.20 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['turkey'],
        beneficiaries: []
    },
    {
        id: 'belarus',
        name: 'Belarus',
        influence: 20,
        stability: 55,
        economicPower: 25,
        militaryPower: 30,
        position: { lat: 53.9006, lng: 27.5590 }, // Minsk
        color: '#8BC34A',
        flag: '🇧🇾',
        energyDependency: { russia: 0.90 },
        phase: 'STRESSED',
        shockHistory: 1,
        rivals: ['poland', 'ukraine'],
        beneficiaries: []
    },
    {
        id: 'kazakhstan',
        name: 'Kazakhstan',
        influence: 35,
        stability: 70,
        economicPower: 45,
        militaryPower: 35,
        position: { lat: 51.1694, lng: 71.4491 }, // Nur-Sultan
        color: '#00BCD4',
        flag: '🇰🇿',
        energyDependency: { russia: 0.15 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['russia'],
        beneficiaries: []
    },
    {
        id: 'india',
        name: 'India',
        influence: 75,
        stability: 80,
        economicPower: 70,
        militaryPower: 85,
        position: { lat: 20.5937, lng: 78.9629 }, // New Delhi (approx center)
        color: '#FF9933',
        flag: '🇮🇳',
        energyDependency: { russia: 0.25, usa: 0.10, saudi_arabia: 0.20 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['china', 'pakistan'],
        beneficiaries: []
    },
    {
        id: 'usa',
        name: 'United States',
        influence: 95,
        stability: 85,
        economicPower: 95,
        militaryPower: 98,
        position: { lat: 39.8, lng: -98.6 },
        color: '#2E7D32',
        flag: '🇺🇸',
        energyDependency: { canada: 0.2 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['russia', 'china', 'iran'],
        beneficiaries: ['china', 'russia', 'iran', 'saudi_arabia', 'uae', 'singapore', 'hong_kong'], // Alt finance & rival powers
        isGlobalHub: true
    },
    {
        id: 'china',
        name: 'China',
        influence: 90,
        stability: 78,
        economicPower: 92,
        militaryPower: 88,
        position: { lat: 35.8, lng: 104.2 },
        color: '#D84315',
        flag: '🇨🇳',
        energyDependency: { russia: 0.2, saudi_arabia: 0.15 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['usa', 'india', 'japan'],
        beneficiaries: [],
        isGlobalHub: true
    },
    {
        id: 'brazil',
        name: 'Brazil',
        influence: 60,
        stability: 65,
        economicPower: 65,
        militaryPower: 55,
        position: { lat: -14.2, lng: -51.9 },
        color: '#00695C',
        flag: '🇧🇷',
        energyDependency: {},
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['argentina'],
        beneficiaries: []
    },
    {
        id: 'australia',
        name: 'Australia',
        influence: 55,
        stability: 88,
        economicPower: 70,
        militaryPower: 60,
        position: { lat: -25.3, lng: 133.8 },
        color: '#0277BD',
        flag: '🇦🇺',
        energyDependency: {},
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['china'],
        beneficiaries: []
    },
    {
        id: 'pakistan',
        name: 'Pakistan',
        influence: 42,
        stability: 60,
        economicPower: 35,
        militaryPower: 55,
        position: { lat: 30.3753, lng: 69.3451 },
        color: '#006600',
        flag: '🇵🇰',
        energyDependency: { china: 0.15, saudi_arabia: 0.25 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['india'],
        beneficiaries: ['china']
    },
    {
        id: 'bangladesh',
        name: 'Bangladesh',
        influence: 28,
        stability: 70,
        economicPower: 32,
        militaryPower: 25,
        position: { lat: 23.6850, lng: 90.3563 },
        color: '#006A4E',
        flag: '🇧🇩',
        energyDependency: { india: 0.10, qatar: 0.20 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: [],
        beneficiaries: ['india']
    },
    {
        id: 'nepal',
        name: 'Nepal',
        influence: 12,
        stability: 75,
        economicPower: 15,
        militaryPower: 15,
        position: { lat: 28.3949, lng: 84.1240 },
        color: '#DC143C',
        flag: '🇳🇵',
        energyDependency: { india: 0.85 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: [],
        beneficiaries: ['india']
    },
    {
        id: 'japan',
        name: 'Japan',
        influence: 70,
        stability: 92,
        economicPower: 80,
        militaryPower: 55,
        position: { lat: 36.2048, lng: 138.2529 },
        color: '#BC002D',
        flag: '🇯🇵',
        energyDependency: { usa: 0.15, saudi_arabia: 0.25 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['china', 'russia', 'north_korea'],
        beneficiaries: []
    },
    {
        id: 'south_korea',
        name: 'South Korea',
        influence: 55,
        stability: 85,
        economicPower: 70,
        militaryPower: 55,
        position: { lat: 35.9078, lng: 127.7669 },
        color: '#0047A0',
        flag: '🇰🇷',
        energyDependency: { usa: 0.10, saudi_arabia: 0.20 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['north_korea', 'china'],
        beneficiaries: []
    },
    {
        id: 'canada',
        name: 'Canada',
        influence: 55,
        stability: 92,
        economicPower: 68,
        militaryPower: 45,
        position: { lat: 56.1304, lng: -106.3468 },
        color: '#FF0000',
        flag: '🇨🇦',
        energyDependency: {},
        phase: 'STABLE',
        shockHistory: 0,
        rivals: [],
        beneficiaries: ['usa']
    },
    {
        id: 'mexico',
        name: 'Mexico',
        influence: 45,
        stability: 58,
        economicPower: 52,
        militaryPower: 42,
        position: { lat: 23.6345, lng: -102.5528 },
        color: '#006847',
        flag: '🇲🇽',
        energyDependency: { usa: 0.40 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: [],
        beneficiaries: ['usa']
    },
    {
        id: 'iran',
        name: 'Iran',
        influence: 55,
        stability: 55,
        economicPower: 45,
        militaryPower: 60,
        position: { lat: 32.4279, lng: 53.6880 },
        color: '#239F40',
        flag: '🇮🇷',
        energyDependency: {},
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['usa', 'saudi_arabia', 'israel'],
        beneficiaries: ['china', 'russia']
    },
    {
        id: 'vietnam',
        name: 'Vietnam',
        influence: 35,
        stability: 75,
        economicPower: 42,
        militaryPower: 38,
        position: { lat: 14.0583, lng: 108.2772 },
        color: '#DA251D',
        flag: '🇻🇳',
        energyDependency: { china: 0.15 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['china'],
        beneficiaries: ['usa', 'japan']
    },
    {
        id: 'north_korea',
        name: 'North Korea',
        influence: 25,
        stability: 68,
        economicPower: 15,
        militaryPower: 55,
        position: { lat: 40.3399, lng: 127.5101 },
        color: '#C40233',
        flag: '🇰🇵',
        energyDependency: { china: 0.80 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['usa', 'south_korea', 'japan'],
        beneficiaries: ['china']
    },
    {
        id: 'finland',
        name: 'Finland',
        influence: 32,
        stability: 95,
        economicPower: 52,
        militaryPower: 35,
        position: { lat: 61.9241, lng: 25.7482 },
        color: '#003580',
        flag: '🇫🇮',
        energyDependency: { russia: 0.10, sweden: 0.15 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['russia'],
        beneficiaries: []
    },
    {
        id: 'georgia',
        name: 'Georgia',
        influence: 15,
        stability: 58,
        economicPower: 22,
        militaryPower: 18,
        position: { lat: 42.3154, lng: 43.3569 },
        color: '#FF0000',
        flag: '🇬🇪',
        energyDependency: { russia: 0.25, azerbaijan: 0.30 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['russia'],
        beneficiaries: []
    },
    {
        id: 'azerbaijan',
        name: 'Azerbaijan',
        influence: 25,
        stability: 65,
        economicPower: 35,
        militaryPower: 35,
        position: { lat: 40.1431, lng: 47.5769 },
        color: '#3F9F3F',
        flag: '🇦🇿',
        energyDependency: {},
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['armenia'],
        beneficiaries: ['turkey', 'italy']
    },
    {
        id: 'taiwan',
        name: 'Taiwan',
        influence: 45,
        stability: 85,
        economicPower: 65,
        militaryPower: 45,
        position: { lat: 23.6978, lng: 120.9605 },
        color: '#FE0000',
        flag: '🇹🇼',
        energyDependency: { usa: 0.10, qatar: 0.15 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['china'],
        beneficiaries: []
    },
    {
        id: 'mongolia',
        name: 'Mongolia',
        influence: 15,
        stability: 72,
        economicPower: 20,
        militaryPower: 18,
        position: { lat: 46.8625, lng: 103.8467 },
        color: '#DA2032',
        flag: '🇲🇳',
        energyDependency: { russia: 0.40, china: 0.30 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: [],
        beneficiaries: ['china', 'russia']
    },
    {
        id: 'afghanistan',
        name: 'Afghanistan',
        influence: 15,
        stability: 25,
        economicPower: 10,
        militaryPower: 25,
        position: { lat: 33.9391, lng: 67.7100 },
        color: '#000000',
        flag: '🇦🇫',
        energyDependency: { pakistan: 0.30, iran: 0.20 },
        phase: 'STRESSED',
        shockHistory: 1,
        rivals: [],
        beneficiaries: []
    },
    {
        id: 'saudi_arabia',
        name: 'Saudi Arabia',
        influence: 68,
        stability: 85,
        economicPower: 75,
        militaryPower: 60,
        position: { lat: 23.8859, lng: 45.0792 },
        color: '#006C35',
        flag: '🇸🇦',
        energyDependency: {},
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['iran'],
        beneficiaries: ['usa', 'china']
    },
    {
        id: 'uae',
        name: 'United Arab Emirates',
        influence: 55,
        stability: 90,
        economicPower: 70,
        militaryPower: 45,
        position: { lat: 23.4241, lng: 53.8478 },
        color: '#00732F',
        flag: '🇦🇪',
        energyDependency: {},
        phase: 'STABLE',
        shockHistory: 0,
        rivals: ['iran'],
        beneficiaries: ['usa', 'uk']
    },
    {
        id: 'singapore',
        name: 'Singapore',
        influence: 45,
        stability: 95,
        economicPower: 72,
        militaryPower: 35,
        position: { lat: 1.3521, lng: 103.8198 },
        color: '#ED2939',
        flag: '🇸🇬',
        energyDependency: { malaysia: 0.30 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: [],
        beneficiaries: ['usa', 'uk']
    },
    {
        id: 'hong_kong',
        name: 'Hong Kong',
        influence: 40,
        stability: 75,
        economicPower: 70,
        militaryPower: 10,
        position: { lat: 22.3193, lng: 114.1694 },
        color: '#BC002D',
        flag: '🇭🇰',
        energyDependency: { china: 0.80 },
        phase: 'STABLE',
        shockHistory: 0,
        rivals: [],
        beneficiaries: ['china', 'uk']
    }
];

// Import world countries database
import { worldCountries, type WorldCountry } from './worldCountries';

// Convert world country to simulation Country format
function worldToSimulationCountry(wc: WorldCountry): Country {
    return {
        id: wc.id,
        name: wc.name,
        influence: wc.influence,
        stability: wc.stability,
        economicPower: wc.economicPower,
        militaryPower: wc.militaryPower,
        position: wc.position,
        color: wc.color,
        flag: wc.flag,
        energyDependency: {},  // Basic default
        phase: 'STABLE' as PhaseState,
        shockHistory: 0,
        rivals: [],
        beneficiaries: []
    };
}

// Get all countries including world database (for selection UI)
export function getAllCountries(): Country[] {
    // Start with core simulation countries (have detailed data)
    const coreIds = new Set(countries.map(c => c.id));

    // Add world countries that aren't already in core
    const additionalWorldCountries = worldCountries
        .filter(wc => !coreIds.has(wc.id))
        .map(worldToSimulationCountry);

    return [...countries, ...additionalWorldCountries];
}

// Additional influential countries for emergence calculations
export const additionalEntities: Array<{ id: string; name: string; influence: number; flag: string }> = [
    { id: 'qatar', name: 'Qatar', influence: 25, flag: '🇶🇦' },
    { id: 'norway', name: 'Norway', influence: 40, flag: '🇳🇴' },
    { id: 'iran', name: 'Iran', influence: 45, flag: '🇮🇷' },
    { id: 'azerbaijan', name: 'Azerbaijan', influence: 30, flag: '🇦🇿' },
    { id: 'algeria', name: 'Algeria', influence: 35, flag: '🇩🇿' },
    { id: 'saudi_arabia', name: 'Saudi Arabia', influence: 68, flag: '🇸🇦' },
    { id: 'japan', name: 'Japan', influence: 70, flag: '🇯🇵' },
    { id: 'south_korea', name: 'South Korea', influence: 55, flag: '🇰🇷' },
    { id: 'mexico', name: 'Mexico', influence: 45, flag: '🇲🇽' },
    { id: 'canada', name: 'Canada', influence: 55, flag: '🇨🇦' },
    { id: 'indonesia', name: 'Indonesia', influence: 45, flag: '🇮🇩' },
    { id: 'south_africa', name: 'South Africa', influence: 48, flag: '🇿🇦' },
    { id: 'nigeria', name: 'Nigeria', influence: 42, flag: '🇳🇬' },
    { id: 'egypt', name: 'Egypt', influence: 45, flag: '🇪🇬' },
    { id: 'pakistan', name: 'Pakistan', influence: 42, flag: '🇵🇰' },
    { id: 'vietnam', name: 'Vietnam', influence: 35, flag: '🇻🇳' },
    { id: 'thailand', name: 'Thailand', influence: 38, flag: '🇹🇭' },
    { id: 'argentina', name: 'Argentina', influence: 35, flag: '🇦🇷' },
    { id: 'israel', name: 'Israel', influence: 55, flag: '🇮🇱' },
    { id: 'uae', name: 'UAE', influence: 52, flag: '🇦🇪' },
];

// ============================================================================
// HIDDEN ENTITIES - Corporations, Pipelines, Regions, Shadow Actors
// ============================================================================

export const hiddenEntities: HiddenEntity[] = [
    // === ENERGY CORPORATIONS ===
    {
        id: 'gazprom',
        name: 'Gazprom',
        type: 'corporation',
        layer: 'corporate',
        revealed: false,
        influence: 70,
        parentCountry: 'russia',
        controlledTerritories: ['russia', 'germany', 'italy', 'turkey', 'belarus'],
        position: { lat: 55.7558, lng: 37.6173 },
        color: '#0D47A1',
        description: 'Russian state gas monopoly, controls 40% of Europe\'s gas supply'
    },
    {
        id: 'rosneft',
        name: 'Rosneft',
        type: 'corporation',
        layer: 'corporate',
        revealed: false,
        influence: 55,
        parentCountry: 'russia',
        controlledTerritories: ['russia', 'germany'],
        position: { lat: 55.7, lng: 37.5 },
        color: '#1565C0',
        description: 'Russia\'s largest oil producer'
    },
    {
        id: 'shell',
        name: 'Shell',
        type: 'corporation',
        layer: 'corporate',
        revealed: false,
        influence: 50,
        parentCountry: 'uk',
        controlledTerritories: ['uk', 'germany', 'italy', 'poland'],
        position: { lat: 51.5, lng: -0.1 },
        color: '#FDD835',
        description: 'Anglo-Dutch oil and gas supermajor'
    },
    {
        id: 'totalenergies',
        name: 'TotalEnergies',
        type: 'corporation',
        layer: 'corporate',
        revealed: false,
        influence: 48,
        parentCountry: 'france',
        controlledTerritories: ['france', 'italy', 'spain'],
        position: { lat: 48.8, lng: 2.3 },
        color: '#B71C1C',
        description: 'French multinational energy company'
    },
    {
        id: 'eni',
        name: 'ENI',
        type: 'corporation',
        layer: 'corporate',
        revealed: false,
        influence: 42,
        parentCountry: 'italy',
        controlledTerritories: ['italy', 'greece'],
        position: { lat: 41.9, lng: 12.5 },
        color: '#F9A825',
        description: 'Italian multinational energy company'
    },

    // === PIPELINES ===
    {
        id: 'nordstream1',
        name: 'Nord Stream 1',
        type: 'pipeline',
        layer: 'energy',
        revealed: false,
        influence: 60,
        parentCountry: 'russia',
        controlledTerritories: ['russia', 'germany'],
        color: '#FF6F00',
        description: 'Baltic Sea pipeline: Russia → Germany, 55 bcm/year'
    },
    {
        id: 'nordstream2',
        name: 'Nord Stream 2',
        type: 'pipeline',
        layer: 'energy',
        revealed: false,
        influence: 55,
        parentCountry: 'russia',
        controlledTerritories: ['russia', 'germany'],
        color: '#FF8F00',
        description: 'Controversial parallel pipeline, completed but not certified'
    },
    {
        id: 'turkstream',
        name: 'TurkStream',
        type: 'pipeline',
        layer: 'energy',
        revealed: false,
        influence: 50,
        parentCountry: 'russia',
        controlledTerritories: ['russia', 'turkey', 'greece', 'italy'],
        color: '#FFB300',
        description: 'Black Sea pipeline: Russia → Turkey → Southern Europe'
    },
    {
        id: 'transadriatic',
        name: 'Trans-Adriatic Pipeline',
        type: 'pipeline',
        layer: 'energy',
        revealed: false,
        influence: 35,
        parentCountry: 'azerbaijan',
        controlledTerritories: ['turkey', 'greece', 'italy'],
        color: '#00C853',
        description: 'Azerbaijan → Turkey → Greece → Italy, 10 bcm/year'
    },
    {
        id: 'yamal',
        name: 'Yamal-Europe Pipeline',
        type: 'pipeline',
        layer: 'energy',
        revealed: false,
        influence: 45,
        parentCountry: 'russia',
        controlledTerritories: ['russia', 'belarus', 'poland', 'germany'],
        color: '#FF5722',
        description: 'Land route: Russia → Belarus → Poland → Germany'
    },

    // === REGIONAL DIVISIONS (Ethnic Layer) ===
    {
        id: 'bavaria',
        name: 'Bavaria',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 20,
        parentCountry: 'germany',
        controlledTerritories: [],
        position: { lat: 48.1351, lng: 11.5820 },
        color: '#5D4037',
        description: 'Distinct German state with separatist undercurrents'
    },
    {
        id: 'catalonia',
        name: 'Catalonia',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 25,
        parentCountry: 'spain',
        controlledTerritories: [],
        position: { lat: 41.3851, lng: 2.1734 },
        color: '#8D6E63',
        description: 'Spanish autonomous community with independence movement'
    },
    {
        id: 'scotland',
        name: 'Scotland',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 22,
        parentCountry: 'uk',
        controlledTerritories: [],
        position: { lat: 56.4907, lng: -4.2026 },
        color: '#3E2723',
        description: 'UK nation with strong independence movement'
    },
    {
        id: 'basque',
        name: 'Basque Country',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 15,
        parentCountry: 'spain',
        controlledTerritories: [],
        position: { lat: 42.9896, lng: -2.6189 },
        color: '#6D4C41',
        description: 'Autonomous region spanning Spain and France'
    },
    {
        id: 'chechnya',
        name: 'Chechnya',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 18,
        parentCountry: 'russia',
        controlledTerritories: [],
        position: { lat: 43.3180, lng: 45.6980 },
        color: '#4E342E',
        description: 'Russian republic with history of conflict'
    },
    {
        id: 'tatarstan',
        name: 'Tatarstan',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 15,
        parentCountry: 'russia',
        controlledTerritories: [],
        position: { lat: 55.7963, lng: 49.1088 },
        color: '#795548',
        description: 'Tatar majority Russian republic with autonomy movements'
    },
    {
        id: 'crimea',
        name: 'Crimea',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 20,
        parentCountry: 'ukraine',
        controlledTerritories: [],
        position: { lat: 44.9521, lng: 34.1024 },
        color: '#A1887F',
        description: 'Disputed peninsula, flashpoint of conflict'
    },
    {
        id: 'donbas',
        name: 'Donbas',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 18,
        parentCountry: 'ukraine',
        controlledTerritories: [],
        position: { lat: 48.0159, lng: 37.8028 },
        color: '#8D6E63',
        description: 'Eastern Ukrainian industrial region in conflict'
    },
    {
        id: 'northern_cyprus',
        name: 'Northern Cyprus',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 10,
        parentCountry: 'turkey',
        controlledTerritories: [],
        position: { lat: 35.1856, lng: 33.3823 },
        color: '#BCAAA4',
        description: 'Turkish-occupied northern Cyprus'
    },
    {
        id: 'corsica',
        name: 'Corsica',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 12,
        parentCountry: 'france',
        controlledTerritories: [],
        position: { lat: 42.0396, lng: 9.0129 },
        color: '#7B5B3A',
        description: 'French island with autonomist movements'
    },
    {
        id: 'south_tyrol',
        name: 'South Tyrol',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 10,
        parentCountry: 'italy',
        controlledTerritories: [],
        position: { lat: 46.7319, lng: 11.2887 },
        color: '#9E8B7D',
        description: 'German-speaking Italian autonomous region'
    },
    {
        id: 'northern_ireland',
        name: 'Northern Ireland',
        type: 'region',
        layer: 'ethnic',
        revealed: false,
        influence: 18,
        parentCountry: 'uk',
        controlledTerritories: [],
        position: { lat: 54.7877, lng: -6.4923 },
        color: '#A1887F',
        description: 'UK region with complex political status and potential for friction'
    },
    {
        id: 'bosphorus',
        name: 'Bosphorus Strait',
        type: 'pipeline', // Using pipeline type for flow simulation
        layer: 'energy',
        revealed: false,
        influence: 35,
        parentCountry: 'turkey',
        controlledTerritories: ['turkey', 'russia', 'ukraine', 'kazakhstan', 'romania'],
        position: { lat: 41.0850, lng: 29.0660 },
        color: '#FFEA00',
        description: 'Critical maritime chokepoint connecting Black Sea to Mediterranean'
    },

    // === SHADOW ACTORS ===
    {
        id: 'wagner',
        name: 'Wagner Group',
        type: 'shadow_actor',
        layer: 'shadow',
        revealed: false,
        influence: 40,
        parentCountry: 'russia',
        controlledTerritories: ['russia', 'belarus', 'ukraine'],
        position: { lat: 47.2357, lng: 39.7015 },
        color: '#B71C1C',
        description: 'Russian private military company'
    },
    {
        id: 'azov',
        name: 'Azov Battalion',
        type: 'shadow_actor',
        layer: 'shadow',
        revealed: false,
        influence: 15,
        parentCountry: 'ukraine',
        controlledTerritories: ['ukraine'],
        position: { lat: 47.0951, lng: 37.5413 },
        color: '#D50000',
        description: 'Ukrainian nationalist militia'
    },
    {
        id: 'grey_wolves',
        name: 'Grey Wolves',
        type: 'shadow_actor',
        layer: 'shadow',
        revealed: false,
        influence: 20,
        parentCountry: 'turkey',
        controlledTerritories: ['turkey', 'germany'],
        position: { lat: 39.9, lng: 32.8 },
        color: '#C62828',
        description: 'Turkish ultranationalist organization'
    },
    {
        id: 'russian_oligarchs',
        name: 'Russian Oligarchs Network',
        type: 'shadow_actor',
        layer: 'shadow',
        revealed: false,
        influence: 55,
        parentCountry: 'russia',
        controlledTerritories: ['russia', 'uk', 'germany', 'france', 'italy', 'spain'],
        color: '#880E4F',
        description: 'Network of wealthy Russian businessmen with political influence'
    },
    {
        id: 'separatist_donetsk',
        name: 'Donetsk People\'s Republic',
        type: 'shadow_actor',
        layer: 'shadow',
        revealed: false,
        influence: 12,
        parentCountry: 'ukraine',
        controlledTerritories: ['ukraine'],
        position: { lat: 48.0159, lng: 37.8028 },
        color: '#E53935',
        description: 'Pro-Russian separatist entity'
    },
    {
        id: 'polish_nationalists',
        name: 'Polish Nationalist Movement',
        type: 'shadow_actor',
        layer: 'shadow',
        revealed: false,
        influence: 15,
        parentCountry: 'poland',
        controlledTerritories: ['poland'],
        position: { lat: 52.2, lng: 21.0 },
        color: '#C41C00',
        description: 'Far-right political movements in Poland'
    },

    // === MILITARY ALLIANCES ===
    {
        id: 'nato',
        name: 'NATO',
        type: 'alliance',
        layer: 'corporate',
        revealed: false,
        influence: 90,
        controlledTerritories: ['usa', 'uk', 'france', 'germany', 'italy', 'spain', 'poland', 'turkey', 'greece'],
        position: { lat: 50.8503, lng: 4.3517 },
        color: '#1565C0',
        description: 'North Atlantic Treaty Organization'
    },
    {
        id: 'csto',
        name: 'CSTO',
        type: 'alliance',
        layer: 'corporate',
        revealed: false,
        influence: 45,
        controlledTerritories: ['russia', 'belarus', 'kazakhstan'],
        position: { lat: 55.75, lng: 37.62 },
        color: '#C62828',
        description: 'Collective Security Treaty Organization'
    }
];

// ============================================================================
// PIPELINES DATA - For Energy Network Layer
// ============================================================================

export const pipelines: Pipeline[] = [
    {
        id: 'nordstream1',
        name: 'Nord Stream 1',
        startPosition: { lat: 59.7, lng: 29.5 }, // Russia (Vyborg)
        endPosition: { lat: 54.1, lng: 12.1 },   // Germany (Greifswald)
        capacity: 55,
        status: 'active',
        owner: 'gazprom',
        color: '#FF6F00'
    },
    {
        id: 'nordstream2',
        name: 'Nord Stream 2',
        startPosition: { lat: 59.9, lng: 29.8 },
        endPosition: { lat: 54.2, lng: 12.3 },
        capacity: 55,
        status: 'inactive',
        owner: 'gazprom',
        color: '#FF8F00'
    },
    {
        id: 'turkstream',
        name: 'TurkStream',
        startPosition: { lat: 44.6, lng: 37.8 }, // Russia (Anapa)
        endPosition: { lat: 41.2, lng: 28.0 },   // Turkey
        waypoints: [
            { lat: 42.5, lng: 32.5 }  // Black Sea crossing
        ],
        capacity: 31.5,
        status: 'active',
        owner: 'gazprom',
        color: '#FFB300'
    },
    {
        id: 'transadriatic',
        name: 'Trans-Adriatic Pipeline (TAP)',
        startPosition: { lat: 40.65, lng: 22.9 }, // Greece
        endPosition: { lat: 40.8, lng: 17.4 },    // Italy (Puglia)
        waypoints: [
            { lat: 40.6, lng: 19.8 }  // Albania
        ],
        capacity: 10,
        status: 'active',
        owner: 'azerbaijan',
        color: '#00C853'
    },
    {
        id: 'yamal',
        name: 'Yamal-Europe',
        startPosition: { lat: 61.0, lng: 73.0 }, // Russia (Yamal)
        endPosition: { lat: 52.5, lng: 13.4 },   // Germany
        waypoints: [
            { lat: 55.5, lng: 48.0 },  // Russia
            { lat: 53.9, lng: 27.6 },  // Belarus
            { lat: 52.2, lng: 21.0 }   // Poland
        ],
        capacity: 33,
        status: 'active',
        owner: 'gazprom',
        color: '#FF5722'
    },
    {
        id: 'druzhba',
        name: 'Druzhba Pipeline',
        startPosition: { lat: 51.7, lng: 36.2 }, // Russia
        endPosition: { lat: 52.5, lng: 13.4 },   // Germany
        waypoints: [
            { lat: 53.9, lng: 27.6 },  // Belarus
            { lat: 52.2, lng: 21.0 }   // Poland
        ],
        capacity: 67,
        status: 'active',
        owner: 'rosneft',
        color: '#795548'
    },
    {
        id: 'medgaz',
        name: 'Medgaz',
        startPosition: { lat: 35.8, lng: -0.4 }, // Algeria
        endPosition: { lat: 36.7, lng: -2.1 },   // Spain
        capacity: 8,
        status: 'active',
        owner: 'algeria',
        color: '#4CAF50'
    }
];

// ============================================================================
// RELATIONSHIPS - 50+ connections between entities
// ============================================================================

export const relationships: Relationship[] = [
    // === ENERGY DEPENDENCIES ===
    {
        id: 'rel_germany_russia_gas',
        source: 'germany',
        target: 'russia',
        type: 'energy',
        strength: 0.55,
        direction: 'unidirectional',
        label: 'German gas dependency on Russia (55%)',
        critical: true
    },
    {
        id: 'rel_italy_russia_gas',
        source: 'italy',
        target: 'russia',
        type: 'energy',
        strength: 0.40,
        direction: 'unidirectional',
        label: 'Italian gas dependency on Russia (40%)',
        critical: true
    },
    {
        id: 'rel_poland_russia_gas',
        source: 'poland',
        target: 'russia',
        type: 'energy',
        strength: 0.50,
        direction: 'unidirectional',
        label: 'Polish gas dependency on Russia (50%)',
        critical: true
    },
    {
        id: 'rel_turkey_russia_gas',
        source: 'turkey',
        target: 'russia',
        type: 'energy',
        strength: 0.33,
        direction: 'unidirectional',
        label: 'Turkish gas dependency on Russia (33%)',
        critical: true
    },
    {
        id: 'rel_greece_russia_gas',
        source: 'greece',
        target: 'russia',
        type: 'energy',
        strength: 0.35,
        direction: 'unidirectional',
        label: 'Greek gas dependency on Russia (35%)',
        critical: false
    },
    {
        id: 'rel_belarus_russia_gas',
        source: 'belarus',
        target: 'russia',
        type: 'energy',
        strength: 0.90,
        direction: 'unidirectional',
        label: 'Belarus near-total energy dependency (90%)',
        critical: true
    },
    {
        id: 'rel_france_russia_gas',
        source: 'france',
        target: 'russia',
        type: 'energy',
        strength: 0.17,
        direction: 'unidirectional',
        label: 'French gas from Russia (17%)',
        critical: false
    },
    {
        id: 'rel_ukraine_russia_gas',
        source: 'ukraine',
        target: 'russia',
        type: 'energy',
        strength: 0.35,
        direction: 'unidirectional',
        label: 'Ukraine gas dependency',
        critical: true
    },

    // === TRADE RELATIONSHIPS ===
    {
        id: 'rel_germany_russia_trade',
        source: 'germany',
        target: 'russia',
        type: 'trade',
        strength: 0.45,
        direction: 'bidirectional',
        label: 'Major trade partner',
        critical: true
    },
    {
        id: 'rel_germany_france_trade',
        source: 'germany',
        target: 'france',
        type: 'trade',
        strength: 0.80,
        direction: 'bidirectional',
        label: 'EU core partnership',
        critical: false
    },
    {
        id: 'rel_germany_italy_trade',
        source: 'germany',
        target: 'italy',
        type: 'trade',
        strength: 0.65,
        direction: 'bidirectional',
        label: 'Major EU trade',
        critical: false
    },
    {
        id: 'rel_germany_poland_trade',
        source: 'germany',
        target: 'poland',
        type: 'trade',
        strength: 0.60,
        direction: 'bidirectional',
        label: 'Eastern EU integration',
        critical: false
    },
    {
        id: 'rel_uk_germany_trade',
        source: 'uk',
        target: 'germany',
        type: 'trade',
        strength: 0.55,
        direction: 'bidirectional',
        label: 'Post-Brexit trade (reduced)',
        critical: false
    },
    {
        id: 'rel_turkey_russia_trade',
        source: 'turkey',
        target: 'russia',
        type: 'trade',
        strength: 0.40,
        direction: 'bidirectional',
        label: 'Strategic trade partnership',
        critical: true
    },
    {
        id: 'rel_russia_kazakhstan_trade',
        source: 'russia',
        target: 'kazakhstan',
        type: 'trade',
        strength: 0.70,
        direction: 'bidirectional',
        label: 'Eurasian integration',
        critical: true
    },
    {
        id: 'rel_france_spain_trade',
        source: 'france',
        target: 'spain',
        type: 'trade',
        strength: 0.55,
        direction: 'bidirectional',
        label: 'Mediterranean trade',
        critical: false
    },
    {
        id: 'rel_italy_greece_trade',
        source: 'italy',
        target: 'greece',
        type: 'trade',
        strength: 0.45,
        direction: 'bidirectional',
        label: 'Adriatic trade',
        critical: false
    },

    // === MILITARY ALLIANCES ===
    {
        id: 'rel_nato_germany',
        source: 'nato',
        target: 'germany',
        type: 'military',
        strength: 0.85,
        direction: 'bidirectional',
        label: 'NATO member',
        critical: true
    },
    {
        id: 'rel_nato_france',
        source: 'nato',
        target: 'france',
        type: 'military',
        strength: 0.75,
        direction: 'bidirectional',
        label: 'NATO nuclear power',
        critical: true
    },
    {
        id: 'rel_nato_uk',
        source: 'nato',
        target: 'uk',
        type: 'military',
        strength: 0.90,
        direction: 'bidirectional',
        label: 'NATO nuclear power',
        critical: true
    },
    {
        id: 'rel_nato_poland',
        source: 'nato',
        target: 'poland',
        type: 'military',
        strength: 0.80,
        direction: 'bidirectional',
        label: 'NATO eastern flank',
        critical: true
    },
    {
        id: 'rel_nato_turkey',
        source: 'nato',
        target: 'turkey',
        type: 'military',
        strength: 0.60,
        direction: 'bidirectional',
        label: 'Strategic NATO member',
        critical: true
    },
    {
        id: 'rel_nato_italy',
        source: 'nato',
        target: 'italy',
        type: 'military',
        strength: 0.70,
        direction: 'bidirectional',
        label: 'NATO Mediterranean',
        critical: false
    },
    {
        id: 'rel_nato_greece',
        source: 'nato',
        target: 'greece',
        type: 'military',
        strength: 0.65,
        direction: 'bidirectional',
        label: 'NATO member',
        critical: false
    },
    {
        id: 'rel_csto_russia',
        source: 'csto',
        target: 'russia',
        type: 'military',
        strength: 0.95,
        direction: 'bidirectional',
        label: 'CSTO leader',
        critical: true
    },
    {
        id: 'rel_csto_belarus',
        source: 'csto',
        target: 'belarus',
        type: 'military',
        strength: 0.85,
        direction: 'bidirectional',
        label: 'CSTO member',
        critical: true
    },
    {
        id: 'rel_csto_kazakhstan',
        source: 'csto',
        target: 'kazakhstan',
        type: 'military',
        strength: 0.75,
        direction: 'bidirectional',
        label: 'CSTO member',
        critical: false
    },
    {
        id: 'rel_russia_belarus_military',
        source: 'russia',
        target: 'belarus',
        type: 'military',
        strength: 0.90,
        direction: 'bidirectional',
        label: 'Union State',
        critical: true
    },
    {
        id: 'rel_turkey_greece_military',
        source: 'turkey',
        target: 'greece',
        type: 'military',
        strength: 0.20,
        direction: 'bidirectional',
        label: 'NATO tension (Aegean)',
        critical: false
    },

    // === CULTURAL TIES ===
    {
        id: 'rel_germany_france_cultural',
        source: 'germany',
        target: 'france',
        type: 'cultural',
        strength: 0.85,
        direction: 'bidirectional',
        label: 'Franco-German axis',
        critical: false
    },
    {
        id: 'rel_russia_ukraine_cultural',
        source: 'russia',
        target: 'ukraine',
        type: 'cultural',
        strength: 0.60,
        direction: 'bidirectional',
        label: 'Slavic/Orthodox ties (strained)',
        critical: true
    },
    {
        id: 'rel_russia_belarus_cultural',
        source: 'russia',
        target: 'belarus',
        type: 'cultural',
        strength: 0.90,
        direction: 'bidirectional',
        label: 'East Slavic brotherhood',
        critical: false
    },
    {
        id: 'rel_uk_france_cultural',
        source: 'uk',
        target: 'france',
        type: 'cultural',
        strength: 0.55,
        direction: 'bidirectional',
        label: 'Cross-Channel relations',
        critical: false
    },
    {
        id: 'rel_spain_italy_cultural',
        source: 'spain',
        target: 'italy',
        type: 'cultural',
        strength: 0.70,
        direction: 'bidirectional',
        label: 'Mediterranean culture',
        critical: false
    },
    {
        id: 'rel_greece_italy_cultural',
        source: 'greece',
        target: 'italy',
        type: 'cultural',
        strength: 0.65,
        direction: 'bidirectional',
        label: 'Classical heritage',
        critical: false
    },
    {
        id: 'rel_russia_kazakhstan_cultural',
        source: 'russia',
        target: 'kazakhstan',
        type: 'cultural',
        strength: 0.70,
        direction: 'bidirectional',
        label: 'Russian minority ties',
        critical: false
    },
    {
        id: 'rel_turkey_greece_cultural',
        source: 'turkey',
        target: 'greece',
        type: 'cultural',
        strength: 0.35,
        direction: 'bidirectional',
        label: 'Historical tensions',
        critical: false
    },
    {
        id: 'rel_poland_ukraine_cultural',
        source: 'poland',
        target: 'ukraine',
        type: 'cultural',
        strength: 0.55,
        direction: 'bidirectional',
        label: 'Solidarity & support',
        critical: false
    },

    // === POLITICAL RELATIONSHIPS ===
    {
        id: 'rel_eu_germany',
        source: 'germany',
        target: 'france',
        type: 'political',
        strength: 0.90,
        direction: 'bidirectional',
        label: 'EU leadership',
        critical: true
    },
    {
        id: 'rel_turkey_eu_political',
        source: 'turkey',
        target: 'germany',
        type: 'political',
        strength: 0.40,
        direction: 'bidirectional',
        label: 'EU accession stalled',
        critical: false
    },
    {
        id: 'rel_uk_eu_political',
        source: 'uk',
        target: 'germany',
        type: 'political',
        strength: 0.35,
        direction: 'bidirectional',
        label: 'Post-Brexit relations',
        critical: false
    },
    {
        id: 'rel_russia_turkey_political',
        source: 'russia',
        target: 'turkey',
        type: 'political',
        strength: 0.55,
        direction: 'bidirectional',
        label: 'Complex partnership',
        critical: true
    },
    {
        id: 'rel_germany_poland_political',
        source: 'germany',
        target: 'poland',
        type: 'political',
        strength: 0.60,
        direction: 'bidirectional',
        label: 'EU integration tensions',
        critical: false
    },

    // === SHADOW ACTOR RELATIONSHIPS ===
    {
        id: 'rel_wagner_russia',
        source: 'wagner',
        target: 'russia',
        type: 'military',
        strength: 0.85,
        direction: 'bidirectional',
        label: 'State-adjacent PMC',
        critical: true
    },
    {
        id: 'rel_wagner_belarus',
        source: 'wagner',
        target: 'belarus',
        type: 'military',
        strength: 0.60,
        direction: 'unidirectional',
        label: 'Wagner presence',
        critical: false
    },
    {
        id: 'rel_oligarchs_russia',
        source: 'russian_oligarchs',
        target: 'russia',
        type: 'political',
        strength: 0.80,
        direction: 'bidirectional',
        label: 'Oligarch political power',
        critical: true
    },
    {
        id: 'rel_oligarchs_uk',
        source: 'russian_oligarchs',
        target: 'uk',
        type: 'trade',
        strength: 0.45,
        direction: 'unidirectional',
        label: 'London property investments',
        critical: false
    },
    {
        id: 'rel_gazprom_germany',
        source: 'gazprom',
        target: 'germany',
        type: 'energy',
        strength: 0.60,
        direction: 'unidirectional',
        label: 'Gas supply monopoly',
        critical: true
    },
    {
        id: 'rel_gazprom_italy',
        source: 'gazprom',
        target: 'italy',
        type: 'energy',
        strength: 0.45,
        direction: 'unidirectional',
        label: 'ENI partnership',
        critical: true
    },
    {
        id: 'rel_gazprom_turkey',
        source: 'gazprom',
        target: 'turkey',
        type: 'energy',
        strength: 0.40,
        direction: 'unidirectional',
        label: 'TurkStream operator',
        critical: true
    },
    // === SOUTH ASIA RELATIONSHIPS ===
    {
        id: 'rel_india_pakistan_rivalry',
        source: 'india',
        target: 'pakistan',
        type: 'military',
        strength: 0.85,
        direction: 'bidirectional',
        label: 'Nuclear tension & rivalry',
        critical: true
    },
    {
        id: 'rel_india_nepal_energy',
        source: 'india',
        target: 'nepal',
        type: 'energy',
        strength: 0.85,
        direction: 'unidirectional',
        label: 'Sole energy supplier',
        critical: true
    },
    {
        id: 'rel_india_bangladesh_trade',
        source: 'india',
        target: 'bangladesh',
        type: 'trade',
        strength: 0.70,
        direction: 'bidirectional',
        label: 'Key economic partner',
        critical: true
    },
    {
        id: 'rel_china_pakistan_trade',
        source: 'china',
        target: 'pakistan',
        type: 'trade',
        strength: 0.75,
        direction: 'bidirectional',
        label: 'Economic Corridor (CPEC)',
        critical: true
    },
    // === EAST ASIA RELATIONSHIPS ===
    {
        id: 'rel_china_japan_rivalry',
        source: 'china',
        target: 'japan',
        type: 'political',
        strength: 0.70,
        direction: 'bidirectional',
        label: 'Regional leadership rivalry',
        critical: false
    },
    {
        id: 'rel_china_north_korea_ally',
        source: 'china',
        target: 'north_korea',
        type: 'political',
        strength: 0.90,
        direction: 'bidirectional',
        label: 'Strategic buffer alliance',
        critical: true
    },
    {
        id: 'rel_usa_japan_military',
        source: 'usa',
        target: 'japan',
        type: 'military',
        strength: 0.95,
        direction: 'bidirectional',
        label: 'Pacific security treaty',
        critical: true
    },
    {
        id: 'rel_usa_south_korea_military',
        source: 'usa',
        target: 'south_korea',
        type: 'military',
        strength: 0.90,
        direction: 'bidirectional',
        label: 'Mutual defense treaty',
        critical: true
    },
    // === NORTH AMERICA RELATIONSHIPS ===
    {
        id: 'rel_usa_canada_energy',
        source: 'canada',
        target: 'usa',
        type: 'energy',
        strength: 0.40,
        direction: 'unidirectional',
        label: 'Integrated energy grid',
        critical: true
    },
    {
        id: 'rel_usa_mexico_trade',
        source: 'usa',
        target: 'mexico',
        type: 'trade',
        strength: 0.85,
        direction: 'bidirectional',
        label: 'USMCA trade agreement',
        critical: true
    },
    // === CAUCASUS & EURASIA RELATIONSHIPS ===
    {
        id: 'rel_russia_georgia_political',
        source: 'russia',
        target: 'georgia',
        type: 'political',
        strength: 0.60,
        direction: 'bidirectional',
        label: 'Territorial disputes & tension',
        critical: true
    },
    {
        id: 'rel_russia_finland_rivalry',
        source: 'russia',
        target: 'finland',
        type: 'political',
        strength: 0.50,
        direction: 'bidirectional',
        label: 'Border security tension',
        critical: false
    },
    {
        id: 'rel_azerbaijan_turkey_energy',
        source: 'azerbaijan',
        target: 'turkey',
        type: 'energy',
        strength: 0.70,
        direction: 'unidirectional',
        label: 'Natural gas transit',
        critical: true
    },
    {
        id: 'rel_china_taiwan_tension',
        source: 'china',
        target: 'taiwan',
        type: 'political',
        strength: 1.0,
        direction: 'bidirectional',
        label: 'Existential sovereignty conflict',
        critical: true
    },
    {
        id: 'rel_pakistan_afghanistan_trade',
        source: 'pakistan',
        target: 'afghanistan',
        type: 'trade',
        strength: 0.50,
        direction: 'bidirectional',
        label: 'Cross-border commerce',
        critical: false
    }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getCountryById(id: string): Country | undefined {
    // First check core countries
    const core = countries.find(c => c.id === id);
    if (core) return core;

    // Then check world countries
    const world = worldCountries.find(wc => wc.id === id);
    if (world) return worldToSimulationCountry(world);

    return undefined;
}

export function getEntityById(id: string): HiddenEntity | undefined {
    return hiddenEntities.find(e => e.id === id);
}

export function getRelationshipsByEntity(entityId: string): Relationship[] {
    return relationships.filter(r => r.source === entityId || r.target === entityId);
}

export function getEntitiesByLayer(layer: LayerType): HiddenEntity[] {
    return hiddenEntities.filter(e => e.layer === layer);
}

export function getPhaseFromStability(stability: number): PhaseState {
    if (stability >= 80) return 'STABLE';
    if (stability >= 60) return 'STRESSED';
    if (stability >= 40) return 'UNSTABLE';
    return 'COLLAPSED';
}

export function getStabilityColor(stability: number): string {
    if (stability >= 90) return '#4CAF50';  // Green
    if (stability >= 70) return '#FFC107';  // Yellow
    if (stability >= 50) return '#FF9800';  // Orange
    return '#F44336';                        // Red
}

// Clone function for deep copying state
export function cloneCountries(): Country[] {
    return getAllCountries().map(c => ({
        ...c,
        energyDependency: { ...c.energyDependency }
    }));
}

export function cloneRelationships(): Relationship[] {
    return relationships.map(r => ({ ...r }));
}

export function cloneHiddenEntities(): HiddenEntity[] {
    return hiddenEntities.map(e => ({
        ...e,
        controlledTerritories: [...e.controlledTerritories]
    }));
}
