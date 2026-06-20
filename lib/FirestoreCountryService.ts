/**
 * Firebase Realtime Database Country Service
 * Fetches and seeds country profiles and relationships
 */

import { ref, get, set, child, onValue, off, DataSnapshot } from 'firebase/database';
import database from './firebase';
import { CountryProfile, COUNTRY_PROFILES } from './GeopoliticalDataset';

// Database paths
const PATHS = {
    COUNTRIES: 'countries',
    SCENARIOS: 'scenarios',
    RELATIONSHIPS: 'relationships'
};

// Cache for country data
let countryCache: Record<string, CountryProfile> = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all countries from Realtime Database
 */
export async function fetchAllCountries(): Promise<Record<string, CountryProfile>> {
    // Return cached data if still valid
    if (Object.keys(countryCache).length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return countryCache;
    }

    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, PATHS.COUNTRIES));

        if (snapshot.exists()) {
            const countries = snapshot.val() as Record<string, CountryProfile>;
            countryCache = countries;
            cacheTimestamp = Date.now();
            return countries;
        }

        // If no data in Firebase, fall back to static dataset
        console.warn('No countries in Firebase, using static dataset');
        return COUNTRY_PROFILES;
    } catch (error) {
        console.error('Error fetching countries from Firebase:', error);
        return COUNTRY_PROFILES;
    }
}

/**
 * Fetch a single country by ID
 */
export async function fetchCountryById(countryId: string): Promise<CountryProfile | null> {
    if (countryCache[countryId] && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return countryCache[countryId];
    }

    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `${PATHS.COUNTRIES}/${countryId.toLowerCase()}`));

        if (snapshot.exists()) {
            return snapshot.val() as CountryProfile;
        }

        return COUNTRY_PROFILES[countryId.toLowerCase()] || null;
    } catch (error) {
        console.error(`Error fetching country ${countryId}:`, error);
        return COUNTRY_PROFILES[countryId.toLowerCase()] || null;
    }
}

/**
 * Subscribe to real-time country updates
 */
export function subscribeToCountries(callback: (countries: Record<string, CountryProfile>) => void): () => void {
    const countriesRef = ref(database, PATHS.COUNTRIES);

    const listener = onValue(countriesRef, (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
            const countries = snapshot.val() as Record<string, CountryProfile>;
            countryCache = countries;
            cacheTimestamp = Date.now();
            callback(countries);
        }
    });

    // Return unsubscribe function
    return () => off(countriesRef, 'value', listener);
}

/**
 * Scenario impact interface
 */
export interface ScenarioImpact {
    id: string;
    name: string;
    primary: string[];
    affected: string[];
    beneficiaries: string[];
    description: string;
}

/**
 * Fetch scenario impacts
 */
export async function fetchScenarioImpacts(): Promise<Record<string, ScenarioImpact>> {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, PATHS.SCENARIOS));

        if (snapshot.exists()) {
            return snapshot.val() as Record<string, ScenarioImpact>;
        }
        return {};
    } catch (error) {
        console.error('Error fetching scenarios:', error);
        return {};
    }
}

/**
 * SEED DATABASE with all country data
 * Run this once to populate your Firebase Realtime Database
 */
export async function seedDatabaseWithCountries(): Promise<void> {
    try {
        const countriesRef = ref(database, PATHS.COUNTRIES);
        await set(countriesRef, COUNTRY_PROFILES);
        console.log('✅ Successfully seeded Firebase with country data');
    } catch (error) {
        console.error('Error seeding countries:', error);
        throw error;
    }
}

/**
 * SEED DATABASE with scenario impact data
 */
export async function seedDatabaseWithScenarios(): Promise<void> {
    const scenarios: Record<string, ScenarioImpact> = {
        'SANCTION_RUSSIA': {
            id: 'SANCTION_RUSSIA',
            name: 'Russian Sanctions',
            primary: ['russia'],
            affected: ['ukraine', 'germany', 'poland', 'turkey', 'hungary', 'belarus'],
            beneficiaries: ['usa', 'china', 'india', 'saudi_arabia', 'qatar'],
            description: 'Comprehensive economic sanctions targeting Russian financial systems'
        },
        'BLOCK_BOSPHORUS': {
            id: 'BLOCK_BOSPHORUS',
            name: 'Bosphorus Blockade',
            primary: ['turkey'],
            affected: ['russia', 'ukraine', 'romania', 'bulgaria', 'georgia'],
            beneficiaries: ['usa', 'egypt', 'saudi_arabia'],
            description: 'Strategic closure of the Bosphorus Strait'
        },
        'CHINA_TAIWAN_CRISIS': {
            id: 'CHINA_TAIWAN_CRISIS',
            name: 'Taiwan Strait Crisis',
            primary: ['china', 'taiwan'],
            affected: ['japan', 'south_korea', 'usa', 'australia', 'philippines'],
            beneficiaries: ['india', 'vietnam', 'indonesia'],
            description: 'Military confrontation disrupting semiconductor supply chains'
        },
        'IRAN_CRISIS': {
            id: 'IRAN_CRISIS',
            name: 'Iran Nuclear Crisis',
            primary: ['iran'],
            affected: ['iraq', 'saudi_arabia', 'israel', 'uae', 'turkey'],
            beneficiaries: ['usa', 'russia'],
            description: 'Escalating tensions threatening Strait of Hormuz'
        },
        'ENERGY_SHOCK': {
            id: 'ENERGY_SHOCK',
            name: 'Global Energy Shock',
            primary: ['saudi_arabia', 'russia'],
            affected: ['germany', 'japan', 'china', 'india', 'france'],
            beneficiaries: ['usa', 'canada', 'australia', 'qatar'],
            description: 'Coordinated supply disruption causing global energy price surge'
        },
        'ECONOMIC_CRISIS': {
            id: 'ECONOMIC_CRISIS',
            name: 'Global Economic Crisis',
            primary: ['usa', 'china'],
            affected: ['mexico', 'canada', 'japan', 'south_korea', 'germany', 'uk'],
            beneficiaries: ['india', 'brazil', 'indonesia'],
            description: 'Synchronized recession triggering global trade collapse'
        },
        'MILITARY_TENSION': {
            id: 'MILITARY_TENSION',
            name: 'Global Military Tensions',
            primary: ['russia', 'china'],
            affected: ['ukraine', 'taiwan', 'japan', 'south_korea', 'india', 'poland'],
            beneficiaries: ['usa', 'uk', 'australia'],
            description: 'Multi-front military posturing raising global conflict risk'
        },
        'UK_EXIT': {
            id: 'UK_EXIT',
            name: 'UK Political Crisis',
            primary: ['uk'],
            affected: ['france', 'germany', 'ireland', 'netherlands', 'poland'],
            beneficiaries: ['usa', 'china', 'india'],
            description: 'Post-Brexit political and economic instability'
        }
    };

    try {
        const scenariosRef = ref(database, PATHS.SCENARIOS);
        await set(scenariosRef, scenarios);
        console.log('✅ Successfully seeded Firebase with scenario data');
    } catch (error) {
        console.error('Error seeding scenarios:', error);
        throw error;
    }
}

/**
 * SEED COMPLETE DATABASE
 * Call this to populate everything at once
 */
export async function seedCompleteDatabase(): Promise<void> {
    console.log('🚀 Starting database seed...');
    await seedDatabaseWithCountries();
    await seedDatabaseWithScenarios();
    console.log('✅ Database seeding complete!');
}

/**
 * Clear cache
 */
export function clearCountryCache(): void {
    countryCache = {};
    cacheTimestamp = 0;
}

export default {
    fetchAllCountries,
    fetchCountryById,
    subscribeToCountries,
    fetchScenarioImpacts,
    seedDatabaseWithCountries,
    seedDatabaseWithScenarios,
    seedCompleteDatabase,
    clearCountryCache
};
