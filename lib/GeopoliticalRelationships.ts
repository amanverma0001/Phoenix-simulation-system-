import { countries, Country } from './geopoliticalData';

export interface RelationshipState {
    rivals: string[];
    allies: string[];
    neighbors: string[];
}

/**
 * GeopoliticalRelationships - Core logic for international dynamics
 */
export const getGeopoliticalContext = (countryId: string): RelationshipState => {
    const country = countries.find(c => c.id === countryId);
    if (!country) return { rivals: [], allies: [], neighbors: [] };

    // Rivals are explicitly defined or countries with opposing interests
    const rivals = country.rivals || [];

    // Allies are those who share energy or trade dependencies
    const allies = countries.filter(c =>
        c.id !== countryId &&
        (c.energyDependency[countryId] > 0.1 || country.energyDependency[c.id] > 0.1)
    ).map(c => c.id);

    // Neighbors based on rough geographic proximity (hand-mapped for simulation)
    const neighborMap: Record<string, string[]> = {
        'russia': ['ukraine', 'poland', 'germany', 'china'],
        'germany': ['france', 'poland', 'uk'],
        'france': ['germany', 'uk', 'italy'],
        'uk': ['france', 'germany', 'usa'],
        'usa': ['uk', 'russia', 'china', 'japan'],
        'china': ['russia', 'india', 'japan', 'usa'],
        'india': ['china', 'russia', 'uk', 'pakistan', 'nepal'],
        'ukraine': ['russia', 'poland', 'germany'],
        'poland': ['russia', 'germany', 'ukraine'],
        'japan': ['china', 'usa', 'russia'],
        'italy': ['france', 'germany'],
        'turkey': ['russia', 'germany', 'uk'],
        'pakistan': ['india', 'china', 'iran'],
        'nepal': ['india', 'china'],
    };

    const neighbors = neighborMap[countryId] || [];

    return { rivals, allies, neighbors };
};

/**
 * Calculate the mood of a country based on what happened to a target
 */
export const calculateMood = (observerId: string, targetId: string, eventType: 'sanction' | 'collapse'): 'HAPPY' | 'CONCERNED' | 'ANGRY' | 'NEUTRAL' => {
    const context = getGeopoliticalContext(targetId);

    if (eventType === 'sanction' || eventType === 'collapse') {
        if (context.rivals.includes(observerId)) return 'HAPPY';
        if (context.allies.includes(observerId)) return 'ANGRY';
        if (context.neighbors.includes(observerId)) return 'CONCERNED';
    }

    return 'NEUTRAL';
};

export const getMoodEmoji = (mood: string): string => {
    switch (mood) {
        case 'HAPPY': return '😊';
        case 'ANGRY': return '😡';
        case 'CONCERNED': return '😟';
        default: return '😐';
    }
};
