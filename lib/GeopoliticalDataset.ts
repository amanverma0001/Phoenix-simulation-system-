/**
 * Comprehensive Geopolitical Dataset
 * Contains detailed relationships for major world powers and key nations
 */

export interface CountryProfile {
    id: string;
    name: string;
    flag: string;
    region: string;
    tier: 'superpower' | 'major' | 'regional' | 'emerging' | 'vulnerable';

    // Geographic & Political Relationships
    neighbors: string[];
    allies: string[];
    rivals: string[];

    // Economic Relationships
    tradePartners: string[];
    energySuppliers: string[];
    energyCustomers: string[];

    // Vulnerabilities & Strengths
    vulnerabilities: string[];
    strengths: string[];

    // Cascade Impact Weights (how much they affect others)
    economicInfluence: number; // 0-100
    militaryPower: number; // 0-100
    diplomaticWeight: number; // 0-100
}

export const COUNTRY_PROFILES: Record<string, CountryProfile> = {
    // ========== SUPERPOWERS ==========
    usa: {
        id: 'usa',
        name: 'United States',
        flag: '🇺🇸',
        region: 'North America',
        tier: 'superpower',
        neighbors: ['canada', 'mexico'],
        allies: ['uk', 'japan', 'germany', 'france', 'south_korea', 'australia', 'canada', 'israel'],
        rivals: ['china', 'russia', 'iran', 'north_korea'],
        tradePartners: ['china', 'canada', 'mexico', 'japan', 'germany', 'uk', 'south_korea'],
        energySuppliers: ['canada', 'saudi_arabia', 'mexico'],
        energyCustomers: ['mexico', 'canada', 'japan', 'south_korea'],
        vulnerabilities: ['national_debt', 'political_polarization', 'supply_chain_china'],
        strengths: ['reserve_currency', 'military_tech', 'innovation', 'alliances'],
        economicInfluence: 95,
        militaryPower: 100,
        diplomaticWeight: 90
    },
    china: {
        id: 'china',
        name: 'China',
        flag: '🇨🇳',
        region: 'East Asia',
        tier: 'superpower',
        neighbors: ['russia', 'india', 'japan', 'south_korea', 'vietnam', 'pakistan', 'mongolia'],
        allies: ['russia', 'pakistan', 'north_korea', 'iran'],
        rivals: ['usa', 'india', 'japan', 'taiwan', 'australia'],
        tradePartners: ['usa', 'japan', 'south_korea', 'germany', 'australia', 'brazil'],
        energySuppliers: ['russia', 'saudi_arabia', 'iran', 'australia', 'indonesia'],
        energyCustomers: [],
        vulnerabilities: ['energy_imports', 'semiconductor_access', 'demographic_decline', 'taiwan_tension'],
        strengths: ['manufacturing', 'rare_earths', 'market_size', 'infrastructure'],
        economicInfluence: 90,
        militaryPower: 85,
        diplomaticWeight: 80
    },
    russia: {
        id: 'russia',
        name: 'Russia',
        flag: '🇷🇺',
        region: 'Eurasia',
        tier: 'major',
        neighbors: ['ukraine', 'belarus', 'kazakhstan', 'china', 'finland', 'poland', 'georgia'],
        allies: ['china', 'iran', 'belarus', 'syria', 'north_korea'],
        rivals: ['usa', 'uk', 'ukraine', 'poland', 'nato'],
        tradePartners: ['china', 'india', 'turkey', 'germany', 'netherlands'],
        energySuppliers: [],
        energyCustomers: ['germany', 'china', 'india', 'turkey', 'italy', 'hungary'],
        vulnerabilities: ['sanctions', 'tech_imports', 'demographic_decline', 'economic_isolation'],
        strengths: ['nuclear_arsenal', 'energy_exports', 'military_size', 'un_veto'],
        economicInfluence: 45,
        militaryPower: 90,
        diplomaticWeight: 70
    },

    // ========== MAJOR POWERS ==========
    india: {
        id: 'india',
        name: 'India',
        flag: '🇮🇳',
        region: 'South Asia',
        tier: 'major',
        neighbors: ['pakistan', 'china', 'bangladesh', 'nepal', 'sri_lanka'],
        allies: ['usa', 'japan', 'france', 'australia', 'israel'],
        rivals: ['pakistan', 'china'],
        tradePartners: ['usa', 'china', 'uae', 'saudi_arabia', 'germany'],
        energySuppliers: ['saudi_arabia', 'iraq', 'russia', 'uae'],
        energyCustomers: [],
        vulnerabilities: ['energy_imports', 'border_disputes', 'water_scarcity'],
        strengths: ['demographics', 'it_services', 'pharma', 'growing_market'],
        economicInfluence: 60,
        militaryPower: 70,
        diplomaticWeight: 65
    },
    japan: {
        id: 'japan',
        name: 'Japan',
        flag: '🇯🇵',
        region: 'East Asia',
        tier: 'major',
        neighbors: ['south_korea', 'china', 'russia'],
        allies: ['usa', 'australia', 'india', 'uk', 'south_korea'],
        rivals: ['china', 'north_korea', 'russia'],
        tradePartners: ['china', 'usa', 'south_korea', 'australia', 'taiwan'],
        energySuppliers: ['saudi_arabia', 'australia', 'uae', 'qatar'],
        energyCustomers: [],
        vulnerabilities: ['energy_imports', 'aging_population', 'natural_disasters'],
        strengths: ['technology', 'manufacturing', 'financial_reserves', 'us_alliance'],
        economicInfluence: 70,
        militaryPower: 55,
        diplomaticWeight: 60
    },
    germany: {
        id: 'germany',
        name: 'Germany',
        flag: '🇩🇪',
        region: 'Europe',
        tier: 'major',
        neighbors: ['france', 'poland', 'netherlands', 'austria', 'switzerland'],
        allies: ['usa', 'france', 'uk', 'poland', 'italy', 'nato'],
        rivals: [],
        tradePartners: ['usa', 'china', 'france', 'netherlands', 'uk', 'italy'],
        energySuppliers: ['russia', 'norway', 'netherlands', 'usa'],
        energyCustomers: [],
        vulnerabilities: ['energy_dependence', 'aging_industry', 'russia_gas'],
        strengths: ['manufacturing', 'engineering', 'eu_leadership', 'exports'],
        economicInfluence: 75,
        militaryPower: 40,
        diplomaticWeight: 70
    },
    uk: {
        id: 'uk',
        name: 'United Kingdom',
        flag: '🇬🇧',
        region: 'Europe',
        tier: 'major',
        neighbors: ['france', 'ireland'],
        allies: ['usa', 'france', 'germany', 'australia', 'canada', 'japan'],
        rivals: ['russia'],
        tradePartners: ['usa', 'germany', 'france', 'netherlands', 'china'],
        energySuppliers: ['norway', 'usa', 'qatar'],
        energyCustomers: ['ireland'],
        vulnerabilities: ['post_brexit_trade', 'scottish_independence', 'inflation'],
        strengths: ['financial_services', 'soft_power', 'nuclear', 'intelligence'],
        economicInfluence: 55,
        militaryPower: 60,
        diplomaticWeight: 65
    },
    france: {
        id: 'france',
        name: 'France',
        flag: '🇫🇷',
        region: 'Europe',
        tier: 'major',
        neighbors: ['germany', 'spain', 'italy', 'uk', 'belgium', 'switzerland'],
        allies: ['usa', 'germany', 'uk', 'italy', 'nato'],
        rivals: [],
        tradePartners: ['germany', 'usa', 'italy', 'spain', 'belgium', 'china'],
        energySuppliers: ['russia', 'norway', 'algeria'],
        energyCustomers: [],
        vulnerabilities: ['social_unrest', 'economic_stagnation'],
        strengths: ['nuclear_energy', 'military', 'un_veto', 'luxury_brands'],
        economicInfluence: 55,
        militaryPower: 60,
        diplomaticWeight: 65
    },

    // ========== REGIONAL POWERS ==========
    turkey: {
        id: 'turkey',
        name: 'Turkey',
        flag: '🇹🇷',
        region: 'Middle East',
        tier: 'regional',
        neighbors: ['greece', 'bulgaria', 'syria', 'iraq', 'iran', 'georgia'],
        allies: ['usa', 'nato', 'azerbaijan'],
        rivals: ['greece', 'syria', 'armenia'],
        tradePartners: ['germany', 'russia', 'china', 'uk', 'italy'],
        energySuppliers: ['russia', 'iran', 'azerbaijan', 'iraq'],
        energyCustomers: [],
        vulnerabilities: ['currency_crisis', 'inflation', 'regional_conflicts'],
        strengths: ['bosphorus_control', 'manufacturing', 'strategic_location', 'military_size'],
        economicInfluence: 40,
        militaryPower: 55,
        diplomaticWeight: 50
    },
    saudi_arabia: {
        id: 'saudi_arabia',
        name: 'Saudi Arabia',
        flag: '🇸🇦',
        region: 'Middle East',
        tier: 'regional',
        neighbors: ['uae', 'qatar', 'yemen', 'iraq', 'jordan'],
        allies: ['usa', 'uae', 'egypt', 'pakistan'],
        rivals: ['iran', 'qatar'],
        tradePartners: ['china', 'japan', 'india', 'usa', 'south_korea'],
        energySuppliers: [],
        energyCustomers: ['china', 'japan', 'india', 'usa', 'south_korea', 'germany'],
        vulnerabilities: ['oil_dependence', 'water_scarcity', 'succession'],
        strengths: ['oil_reserves', 'sovereign_wealth', 'opec_leadership'],
        economicInfluence: 50,
        militaryPower: 45,
        diplomaticWeight: 55
    },
    iran: {
        id: 'iran',
        name: 'Iran',
        flag: '🇮🇷',
        region: 'Middle East',
        tier: 'regional',
        neighbors: ['iraq', 'turkey', 'pakistan', 'afghanistan', 'azerbaijan'],
        allies: ['russia', 'china', 'syria', 'hezbollah'],
        rivals: ['usa', 'israel', 'saudi_arabia', 'uae'],
        tradePartners: ['china', 'turkey', 'india', 'russia'],
        energySuppliers: [],
        energyCustomers: ['china', 'india', 'turkey'],
        vulnerabilities: ['sanctions', 'isolation', 'inflation', 'unrest'],
        strengths: ['oil_reserves', 'gas_reserves', 'regional_proxies', 'strait_hormuz'],
        economicInfluence: 25,
        militaryPower: 50,
        diplomaticWeight: 35
    },
    south_korea: {
        id: 'south_korea',
        name: 'South Korea',
        flag: '🇰🇷',
        region: 'East Asia',
        tier: 'regional',
        neighbors: ['japan', 'china', 'north_korea'],
        allies: ['usa', 'japan', 'australia'],
        rivals: ['north_korea', 'china'],
        tradePartners: ['china', 'usa', 'japan', 'vietnam', 'taiwan'],
        energySuppliers: ['saudi_arabia', 'qatar', 'usa', 'australia'],
        energyCustomers: [],
        vulnerabilities: ['north_korea_threat', 'energy_imports', 'aging_population'],
        strengths: ['semiconductors', 'shipbuilding', 'electronics', 'us_alliance'],
        economicInfluence: 50,
        militaryPower: 45,
        diplomaticWeight: 40
    },
    brazil: {
        id: 'brazil',
        name: 'Brazil',
        flag: '🇧🇷',
        region: 'South America',
        tier: 'regional',
        neighbors: ['argentina', 'venezuela', 'colombia', 'peru'],
        allies: ['usa', 'argentina'],
        rivals: [],
        tradePartners: ['china', 'usa', 'argentina', 'germany', 'netherlands'],
        energySuppliers: [],
        energyCustomers: ['argentina', 'chile'],
        vulnerabilities: ['deforestation_pressure', 'political_instability', 'inequality'],
        strengths: ['agriculture', 'mining', 'oil_reserves', 'biodiversity'],
        economicInfluence: 40,
        militaryPower: 35,
        diplomaticWeight: 40
    },
    australia: {
        id: 'australia',
        name: 'Australia',
        flag: '🇦🇺',
        region: 'Oceania',
        tier: 'regional',
        neighbors: ['indonesia', 'new_zealand'],
        allies: ['usa', 'uk', 'japan', 'india', 'south_korea'],
        rivals: ['china'],
        tradePartners: ['china', 'japan', 'south_korea', 'usa', 'india'],
        energySuppliers: [],
        energyCustomers: ['china', 'japan', 'south_korea', 'india'],
        vulnerabilities: ['china_trade_dependence', 'climate_disasters'],
        strengths: ['minerals', 'lng', 'agriculture', 'stable_democracy'],
        economicInfluence: 40,
        militaryPower: 35,
        diplomaticWeight: 45
    },
    israel: {
        id: 'israel',
        name: 'Israel',
        flag: '🇮🇱',
        region: 'Middle East',
        tier: 'regional',
        neighbors: ['egypt', 'jordan', 'syria', 'lebanon'],
        allies: ['usa', 'uk', 'germany', 'uae'],
        rivals: ['iran', 'syria', 'hezbollah', 'hamas'],
        tradePartners: ['usa', 'china', 'uk', 'germany', 'india'],
        energySuppliers: ['egypt'],
        energyCustomers: ['jordan', 'egypt'],
        vulnerabilities: ['regional_conflicts', 'international_isolation'],
        strengths: ['technology', 'intelligence', 'military_tech', 'us_support'],
        economicInfluence: 30,
        militaryPower: 55,
        diplomaticWeight: 40
    },

    // ========== VULNERABLE NATIONS ==========
    ukraine: {
        id: 'ukraine',
        name: 'Ukraine',
        flag: '🇺🇦',
        region: 'Europe',
        tier: 'vulnerable',
        neighbors: ['russia', 'poland', 'romania', 'hungary', 'belarus', 'moldova'],
        allies: ['usa', 'uk', 'poland', 'germany', 'france', 'nato'],
        rivals: ['russia', 'belarus'],
        tradePartners: ['china', 'poland', 'russia', 'germany', 'turkey'],
        energySuppliers: ['russia', 'usa', 'poland'],
        energyCustomers: [],
        vulnerabilities: ['war_damage', 'russian_invasion', 'infrastructure_loss'],
        strengths: ['agriculture', 'western_support', 'strategic_position'],
        economicInfluence: 15,
        militaryPower: 40,
        diplomaticWeight: 45
    },
    pakistan: {
        id: 'pakistan',
        name: 'Pakistan',
        flag: '🇵🇰',
        region: 'South Asia',
        tier: 'vulnerable',
        neighbors: ['india', 'china', 'afghanistan', 'iran'],
        allies: ['china', 'saudi_arabia', 'turkey'],
        rivals: ['india', 'afghanistan'],
        tradePartners: ['china', 'uae', 'usa', 'saudi_arabia'],
        energySuppliers: ['saudi_arabia', 'uae', 'qatar'],
        energyCustomers: [],
        vulnerabilities: ['economic_crisis', 'political_instability', 'terrorism', 'debt'],
        strengths: ['nuclear_arsenal', 'china_alliance', 'young_population'],
        economicInfluence: 20,
        militaryPower: 50,
        diplomaticWeight: 30
    },
    venezuela: {
        id: 'venezuela',
        name: 'Venezuela',
        flag: '🇻🇪',
        region: 'South America',
        tier: 'vulnerable',
        neighbors: ['colombia', 'brazil', 'guyana'],
        allies: ['russia', 'china', 'iran', 'cuba'],
        rivals: ['usa', 'colombia'],
        tradePartners: ['china', 'india', 'usa', 'spain'],
        energySuppliers: [],
        energyCustomers: ['china', 'india', 'cuba'],
        vulnerabilities: ['hyperinflation', 'sanctions', 'brain_drain', 'infrastructure_collapse'],
        strengths: ['oil_reserves'],
        economicInfluence: 10,
        militaryPower: 20,
        diplomaticWeight: 15
    },
    egypt: {
        id: 'egypt',
        name: 'Egypt',
        flag: '🇪🇬',
        region: 'Middle East',
        tier: 'regional',
        neighbors: ['israel', 'libya', 'sudan'],
        allies: ['usa', 'saudi_arabia', 'uae', 'france'],
        rivals: ['turkey', 'qatar'],
        tradePartners: ['china', 'usa', 'germany', 'italy', 'saudi_arabia'],
        energySuppliers: ['saudi_arabia'],
        energyCustomers: ['jordan'],
        vulnerabilities: ['suez_dependency', 'water_scarcity', 'debt', 'food_imports'],
        strengths: ['suez_canal', 'tourism', 'strategic_location', 'population'],
        economicInfluence: 30,
        militaryPower: 40,
        diplomaticWeight: 40
    },
    poland: {
        id: 'poland',
        name: 'Poland',
        flag: '🇵🇱',
        region: 'Europe',
        tier: 'regional',
        neighbors: ['germany', 'ukraine', 'belarus', 'russia', 'czech'],
        allies: ['usa', 'uk', 'nato', 'ukraine'],
        rivals: ['russia', 'belarus'],
        tradePartners: ['germany', 'china', 'france', 'italy', 'uk'],
        energySuppliers: ['usa', 'norway', 'qatar'],
        energyCustomers: [],
        vulnerabilities: ['russia_proximity', 'eu_tensions'],
        strengths: ['manufacturing', 'nato_member', 'strategic_location'],
        economicInfluence: 30,
        militaryPower: 35,
        diplomaticWeight: 35
    },
    indonesia: {
        id: 'indonesia',
        name: 'Indonesia',
        flag: '🇮🇩',
        region: 'Southeast Asia',
        tier: 'emerging',
        neighbors: ['malaysia', 'australia', 'philippines'],
        allies: ['usa', 'japan', 'australia'],
        rivals: ['china'],
        tradePartners: ['china', 'japan', 'usa', 'singapore', 'india'],
        energySuppliers: [],
        energyCustomers: ['china', 'japan', 'india'],
        vulnerabilities: ['natural_disasters', 'deforestation', 'separatism'],
        strengths: ['palm_oil', 'nickel', 'coal', 'young_population', 'market_size'],
        economicInfluence: 35,
        militaryPower: 30,
        diplomaticWeight: 35
    },
    mexico: {
        id: 'mexico',
        name: 'Mexico',
        flag: '🇲🇽',
        region: 'North America',
        tier: 'emerging',
        neighbors: ['usa'],
        allies: ['usa', 'canada'],
        rivals: [],
        tradePartners: ['usa', 'china', 'germany', 'japan', 'canada'],
        energySuppliers: ['usa'],
        energyCustomers: ['usa'],
        vulnerabilities: ['cartel_violence', 'us_dependence', 'corruption'],
        strengths: ['manufacturing', 'nearshoring', 'young_population', 'usmca'],
        economicInfluence: 35,
        militaryPower: 25,
        diplomaticWeight: 30
    },
    taiwan: {
        id: 'taiwan',
        name: 'Taiwan',
        flag: '🇹🇼',
        region: 'East Asia',
        tier: 'vulnerable',
        neighbors: ['china', 'japan', 'philippines'],
        allies: ['usa', 'japan'],
        rivals: ['china'],
        tradePartners: ['china', 'usa', 'japan', 'south_korea', 'singapore'],
        energySuppliers: ['qatar', 'australia', 'usa'],
        energyCustomers: [],
        vulnerabilities: ['china_threat', 'diplomatic_isolation', 'energy_imports'],
        strengths: ['semiconductors', 'technology', 'democracy', 'us_support'],
        economicInfluence: 45,
        militaryPower: 35,
        diplomaticWeight: 25
    },
    nigeria: {
        id: 'nigeria',
        name: 'Nigeria',
        flag: '🇳🇬',
        region: 'Africa',
        tier: 'emerging',
        neighbors: ['cameroon', 'niger', 'benin', 'chad'],
        allies: ['usa', 'uk'],
        rivals: [],
        tradePartners: ['india', 'spain', 'usa', 'france', 'netherlands'],
        energySuppliers: [],
        energyCustomers: ['india', 'spain', 'netherlands'],
        vulnerabilities: ['corruption', 'insurgency', 'oil_theft', 'ethnic_tensions'],
        strengths: ['oil', 'population', 'fintech', 'diaspora'],
        economicInfluence: 25,
        militaryPower: 25,
        diplomaticWeight: 30
    },
    south_africa: {
        id: 'south_africa',
        name: 'South Africa',
        flag: '🇿🇦',
        region: 'Africa',
        tier: 'regional',
        neighbors: ['namibia', 'botswana', 'zimbabwe', 'mozambique'],
        allies: ['china', 'russia', 'india', 'brazil'],
        rivals: [],
        tradePartners: ['china', 'germany', 'usa', 'uk', 'india'],
        energySuppliers: [],
        energyCustomers: ['mozambique'],
        vulnerabilities: ['power_crisis', 'unemployment', 'corruption', 'inequality'],
        strengths: ['minerals', 'financial_sector', 'ports', 'democracy'],
        economicInfluence: 25,
        militaryPower: 25,
        diplomaticWeight: 35
    }
};

// Helper function to get country by ID
export function getCountryProfile(id: string): CountryProfile | undefined {
    return COUNTRY_PROFILES[id.toLowerCase()];
}

// Get all countries affected by a scenario
export function getScenarioImpactedCountries(scenarioId: string): {
    primary: CountryProfile[];
    affected: CountryProfile[];
    beneficiaries: CountryProfile[];
} {
    const SCENARIO_MAPPINGS: Record<string, { primary: string[], affected: string[], beneficiaries: string[] }> = {
        'SANCTION_RUSSIA': {
            primary: ['russia'],
            affected: ['ukraine', 'germany', 'poland', 'turkey', 'hungary', 'belarus'],
            beneficiaries: ['usa', 'china', 'india', 'saudi_arabia', 'qatar']
        },
        'BLOCK_BOSPHORUS': {
            primary: ['turkey'],
            affected: ['russia', 'ukraine', 'romania', 'bulgaria', 'georgia'],
            beneficiaries: ['usa', 'egypt', 'saudi_arabia']
        },
        'ECONOMIC_CRISIS': {
            primary: ['usa', 'china'],
            affected: ['mexico', 'canada', 'japan', 'south_korea', 'germany', 'uk'],
            beneficiaries: ['india', 'brazil', 'indonesia', 'vietnam']
        },
        'UK_EXIT': {
            primary: ['uk'],
            affected: ['france', 'germany', 'ireland', 'netherlands', 'poland'],
            beneficiaries: ['usa', 'switzerland']
        },
        'MILITARY_TENSION': {
            primary: ['russia', 'china'],
            affected: ['ukraine', 'taiwan', 'japan', 'south_korea', 'india', 'poland'],
            beneficiaries: ['usa', 'uk', 'australia']
        },
        'CHINA_TAIWAN_CRISIS': {
            primary: ['china', 'taiwan'],
            affected: ['japan', 'south_korea', 'usa', 'australia', 'philippines'],
            beneficiaries: ['india', 'vietnam', 'indonesia']
        },
        'IRAN_CRISIS': {
            primary: ['iran'],
            affected: ['iraq', 'saudi_arabia', 'israel', 'uae', 'turkey'],
            beneficiaries: ['usa', 'russia']
        },
        'ENERGY_SHOCK': {
            primary: ['saudi_arabia', 'russia'],
            affected: ['germany', 'japan', 'china', 'india', 'france'],
            beneficiaries: ['usa', 'canada', 'australia', 'qatar']
        }
    };

    const mapping = SCENARIO_MAPPINGS[scenarioId] || SCENARIO_MAPPINGS['SANCTION_RUSSIA'];

    return {
        primary: mapping.primary.map(id => COUNTRY_PROFILES[id]).filter(Boolean),
        affected: mapping.affected.map(id => COUNTRY_PROFILES[id]).filter(Boolean),
        beneficiaries: mapping.beneficiaries.map(id => COUNTRY_PROFILES[id]).filter(Boolean)
    };
}

// Get countries that would be cascade-affected by a country's collapse
export function getCascadeTargets(countryId: string): CountryProfile[] {
    const profile = COUNTRY_PROFILES[countryId.toLowerCase()];
    if (!profile) return [];

    const targets = new Set<string>();

    // Add neighbors
    profile.neighbors.forEach(id => targets.add(id));

    // Add trade partners
    profile.tradePartners.forEach(id => targets.add(id));

    // Add energy customers (they depend on this country)
    profile.energyCustomers.forEach(id => targets.add(id));

    return Array.from(targets)
        .map(id => COUNTRY_PROFILES[id])
        .filter(Boolean)
        .sort((a, b) => b.economicInfluence - a.economicInfluence);
}

// Get major powers sorted by influence
export function getMajorPowers(): CountryProfile[] {
    return Object.values(COUNTRY_PROFILES)
        .filter(c => c.tier === 'superpower' || c.tier === 'major')
        .sort((a, b) => (b.economicInfluence + b.militaryPower) - (a.economicInfluence + a.militaryPower));
}

export default COUNTRY_PROFILES;
