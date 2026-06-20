/**
 * Global Shock Score (GDS) Dataset
 * Based on Trade Centrality, Resource Control, Financial Integration, Supply Chain Role, and Geopolitical Influence.
 */

export interface GlobalShockScore {
    id: string;
    score: number;
    tier: 'System-Shaking' | 'Major Global Disruption' | 'Regional Shock' | 'Limited Global Effect' | 'Minimal System Impact';
    reason: string;
    color: string;
}

export const GLOBAL_SHOCK_DATA: Record<string, GlobalShockScore> = {
    // 🔴 SYSTEM-SHAKING (90-100)
    usa: {
        id: 'usa',
        score: 100,
        tier: 'System-Shaking',
        reason: 'Trade centrality, USD dominance, military tech, global alliances',
        color: '#ef4444' // Red
    },
    china: {
        id: 'china',
        score: 98,
        tier: 'System-Shaking',
        reason: 'Manufacturing hub, rare earths, market size, infrastructure',
        color: '#ef4444'
    },
    germany: {
        id: 'germany',
        score: 95,
        tier: 'System-Shaking',
        reason: 'EU economic engine, high-end manufacturing, energy dependence',
        color: '#ef4444'
    },
    france: {
        id: 'france',
        score: 93,
        tier: 'System-Shaking',
        reason: 'Nuclear power, UN veto, military capability, EU leadership',
        color: '#ef4444'
    },
    japan: {
        id: 'japan',
        score: 92,
        tier: 'System-Shaking',
        reason: 'Technology hub, financial reserves, US alliance, manufacturing',
        color: '#ef4444'
    },
    uk: {
        id: 'uk',
        score: 91,
        tier: 'System-Shaking',
        reason: 'Financial services, soft power, nuclear deterrent, intelligence',
        color: '#ef4444'
    },
    italy: {
        id: 'italy',
        score: 90,
        tier: 'System-Shaking',
        reason: 'Eurozone economy, manufacturing, shipping, culture influence',
        color: '#ef4444'
    },

    // 🟠 MAJOR GLOBAL DISRUPTION (70-89)
    india: {
        id: 'india',
        score: 88,
        tier: 'Major Global Disruption',
        reason: 'IT services, population scale, energy imports, growing market',
        color: '#fbbf24' // Orange/Yellow
    },
    taiwan: {
        id: 'taiwan',
        score: 88,
        tier: 'Major Global Disruption',
        reason: 'Critical semiconductor manufacturing (TSMC), technology supply chain',
        color: '#fbbf24'
    },
    russia: {
        id: 'russia',
        score: 87,
        tier: 'Major Global Disruption',
        reason: 'Energy exports (oil/gas), nuclear arsenal, UN veto, wheat supply',
        color: '#fbbf24'
    },
    saudi_arabia: {
        id: 'saudi_arabia',
        score: 86,
        tier: 'Major Global Disruption',
        reason: 'OPEC leadership, world\'s largest oil exporter, sovereign wealth',
        color: '#fbbf24'
    },
    south_korea: {
        id: 'south_korea',
        score: 85,
        tier: 'Major Global Disruption',
        reason: 'Semiconductors, electronics, shipbuilding, high-tech manufacturing',
        color: '#fbbf24'
    },
    canada: {
        id: 'canada',
        score: 84,
        tier: 'Major Global Disruption',
        reason: 'Resource exports, energy integration with US, critical minerals',
        color: '#fbbf24'
    },
    brazil: {
        id: 'brazil',
        score: 83,
        tier: 'Major Global Disruption',
        reason: 'Agricultural exports, mining, regional economic leader',
        color: '#fbbf24'
    },
    australia: {
        id: 'australia',
        score: 82,
        tier: 'Major Global Disruption',
        reason: 'Mineral and LNG exports, strategic Indo-Pacific role',
        color: '#fbbf24'
    },
    mexico: {
        id: 'mexico',
        score: 81,
        tier: 'Major Global Disruption',
        reason: 'Next-shoring manufacturing, US trade integration, oil production',
        color: '#fbbf24'
    },
    netherlands: {
        id: 'netherlands',
        score: 80,
        tier: 'Major Global Disruption',
        reason: 'Rotterdam port, high-tech (ASML), agricultural exports',
        color: '#fbbf24'
    },
    uae: {
        id: 'uae',
        score: 79,
        tier: 'Major Global Disruption',
        reason: 'Financial hub, oil exports, logistical center (Dubai)',
        color: '#fbbf24'
    },
    singapore: {
        id: 'singapore',
        score: 78,
        tier: 'Major Global Disruption',
        reason: 'Global shipping hub, financial services, tech integration',
        color: '#fbbf24'
    },
    norway: {
        id: 'norway',
        score: 75,
        tier: 'Major Global Disruption',
        reason: 'Gas exports to Europe, world\'s largest sovereign wealth fund',
        color: '#fbbf24'
    },
    turkey: {
        id: 'turkey',
        score: 74,
        tier: 'Major Global Disruption',
        reason: 'Straddling Europe/Asia, Bosphorus control, military role',
        color: '#fbbf24'
    },
    indonesia: {
        id: 'indonesia',
        score: 73,
        tier: 'Major Global Disruption',
        reason: 'Nickel/Coal exports, population size, SEA leadership',
        color: '#fbbf24'
    },
    switzerland: {
        id: 'switzerland',
        score: 72,
        tier: 'Major Global Disruption',
        reason: 'Global banking, neutrality center, high-tech pharma',
        color: '#fbbf24'
    },
    spain: {
        id: 'spain',
        score: 72,
        tier: 'Major Global Disruption',
        reason: 'EU economy, infrastructure, shipping, regional weight',
        color: '#fbbf24'
    },
    qatar: {
        id: 'qatar',
        score: 71,
        tier: 'Major Global Disruption',
        reason: 'LNG export dominance, diplomatic mediator, media influence',
        color: '#fbbf24'
    },
    malaysia: {
        id: 'malaysia',
        score: 70,
        tier: 'Major Global Disruption',
        reason: 'Electronics manufacturing, chip testing, energy exports',
        color: '#fbbf24'
    },

    // 🟡 REGIONAL SHOCK (40-69)
    south_africa: {
        id: 'south_africa',
        score: 69,
        tier: 'Regional Shock',
        reason: 'Critical minerals (platinum), African financial hub',
        color: '#eab308' // Yellow
    },
    thailand: { id: 'thailand', score: 68, tier: 'Regional Shock', reason: 'Automotive manufacturing hub, ASEAN trade integration', color: '#eab308' },
    vietnam: { id: 'vietnam', score: 67, tier: 'Regional Shock', reason: 'Manufacturing shift from China, electronics exports', color: '#eab308' },
    poland: { id: 'poland', score: 66, tier: 'Regional Shock', reason: 'EU manufacturing, NATO eastern flank, logistics hub', color: '#eab308' },
    sweden: { id: 'sweden', score: 65, tier: 'Regional Shock', reason: 'High-tech military/industrial base, arctic influence', color: '#eab308' },
    belgium: { id: 'belgium', score: 65, tier: 'Regional Shock', reason: 'EU/NATO headquarters, port logistics (Antwerp)', color: '#eab308' },
    argentina: { id: 'argentina', score: 64, tier: 'Regional Shock', reason: 'Agricultural exports, lithium reserves', color: '#eab308' },
    nigeria: { id: 'nigeria', score: 63, tier: 'Regional Shock', reason: 'Africa\'s largest population, oil production', color: '#eab308' },
    egypt: { id: 'egypt', score: 62, tier: 'Regional Shock', reason: 'Suez Canal control, regional population weight', color: '#eab308' },
    pakistan: { id: 'pakistan', score: 61, tier: 'Regional Shock', reason: 'Nuclear power, regional instability, population scale', color: '#eab308' },
    ukraine: { id: 'ukraine', score: 60, tier: 'Regional Shock', reason: 'Agricultural exports (grain), mineral resources', color: '#eab308' },
    philippines: { id: 'philippines', score: 59, tier: 'Regional Shock', reason: 'Business process outsourcing, maritime location', color: '#eab308' },
    chile: { id: 'chile', score: 58, tier: 'Regional Shock', reason: 'World\'s top copper exporter, lithium reserves', color: '#eab308' },
    colombia: { id: 'colombia', score: 57, tier: 'Regional Shock', reason: 'Regional energy/agriExports, migration hub', color: '#eab308' },
    bangladesh: { id: 'bangladesh', score: 56, tier: 'Regional Shock', reason: 'Garment manufacturing hub, massive labor force', color: '#eab308' },
    kazakhstan: { id: 'kazakhstan', score: 55, tier: 'Regional Shock', reason: 'Uranium exports, energy/mineral wealth in Eurasia', color: '#eab308' },
    israel: { id: 'israel', score: 52, tier: 'Regional Shock', reason: 'High-tech defense, intelligence hub, regional stability', color: '#eab308' },
    ireland: { id: 'ireland', score: 52, tier: 'Regional Shock', reason: 'Tech/Pharma tax hub for multinationals', color: '#eab308' },

    // 🟢 LIMITED GLOBAL EFFECT (10-39)
    sri_lanka: { id: 'sri_lanka', score: 39, tier: 'Limited Global Effect', reason: 'Apparel exports, Indian Ocean shipping lane', color: '#22c55e' }, // Green
    ethiopia: { id: 'ethiopia', score: 38, tier: 'Limited Global Effect', reason: 'African air hub, regional population weight', color: '#22c55e' },
    belarus: { id: 'belarus', score: 32, tier: 'Limited Global Effect', reason: 'Potash exports, Russian military bridgehead', color: '#22c55e' },
    luxembourg: { id: 'luxembourg', score: 35, tier: 'Limited Global Effect', reason: 'Financial fund management hub', color: '#22c55e' },
    panama: { id: 'panama', score: 34, tier: 'Limited Global Effect', reason: 'Critical canal transit, financial system', color: '#22c55e' },

    // ⚪ MINIMAL SYSTEM IMPACT (0-9)
    afghanistan: { id: 'afghanistan', score: 9, tier: 'Minimal System Impact', reason: 'Low integrated economy, isolated regime', color: '#94a3b8' }, // Slate/White
    haiti: { id: 'haiti', score: 9, tier: 'Minimal System Impact', reason: 'Severe institutional decay, low production', color: '#94a3b8' },
    bhutan: { id: 'bhutan', score: 7, tier: 'Minimal System Impact', reason: 'Carbon-negative, high isolation', color: '#94a3b8' },
    vatican_city: { id: 'vatican_city', score: 1, tier: 'Minimal System Impact', reason: 'Microstate with specialized religious role', color: '#94a3b8' }
};

export function getShockScore(id: string): GlobalShockScore | undefined {
    return GLOBAL_SHOCK_DATA[id.toLowerCase()];
}

export function getTierColor(score: number): string {
    if (score >= 90) return '#ef4444'; // Red
    if (score >= 70) return '#fbbf24'; // Orange
    if (score >= 40) return '#eab308'; // Yellow
    if (score >= 10) return '#22c55e'; // Green
    return '#94a3b8'; // Slate
}
