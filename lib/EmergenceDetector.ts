/**
 * EmergenceDetector - Detects Surprising Winners and Losers
 * 
 * Uses surprise score formula: surpriseScore = influenceChange × (1 / initialImportance)
 * Entities with high surprise scores are the "emergent" actors - those who
 * benefited or suffered unexpectedly from the cascade.
 */

import {
    Country,
    HiddenEntity,
    getAllCountries,
    hiddenEntities,
    additionalEntities,
} from './geopoliticalData';
import { CascadeEngine, SystemSnapshot } from './CascadeEngine';
import { COUNTRY_PROFILES } from './GeopoliticalDataset';
import { getGeopoliticalContext } from './GeopoliticalRelationships';
import { GLOBAL_INTELLIGENCE } from './globalIntelligence';
import { SCENARIO_BLUEPRINTS } from './scenarioBlueprints';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface EmergenceResult {
    entityId: string;
    name: string;
    flag?: string;
    type: 'country' | 'entity' | 'additional';
    initialInfluence: number;
    finalInfluence: number;
    influenceChange: number;
    percentageChange: number;
    surpriseScore: number;
    reason: string;
}

export interface InsightCard {
    id: string;
    type: 'hidden_dependency' | 'alliance' | 'corporate' | 'ethnic' | 'shadow';
    icon: string;
    title: string;
    description: string;
    severity: 'critical' | 'major' | 'minor';
    affectedEntities: string[];
}

export interface EmergenceReport {
    winners: EmergenceResult[];
    losers: EmergenceResult[];
    insights: InsightCard[];
    mostSurprising: EmergenceResult | null;
    anchorImpact: EmergenceResult | null;
    timestamp: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    SURPRISE_THRESHOLD: 2.0,    // Minimum surprise score to be considered "emergent"
    TOP_RESULTS: 5,              // Show top 5 winners and losers
    MIN_CHANGE: 5,               // Minimum influence change to be included
};

// ============================================================================
// EMERGENCE DETECTOR CLASS
// ============================================================================

export class EmergenceDetector {
    private initialState: Map<string, number>;

    constructor() {
        this.initialState = new Map();
        this.captureInitialState();
    }

    /**
     * Capture initial influence values for all entities.
     * Use weighted formula to match calculateEffectiveInfluence.
     */
    private captureInitialState(): void {
        // Countries
        getAllCountries().forEach(country => {
            const initialWeight = this.calculateEffectiveInfluence(country);
            this.initialState.set(country.id, initialWeight);
        });

        // Additional entities (Qatar, Norway, etc.)
        additionalEntities.forEach(entity => {
            this.initialState.set(entity.id, entity.influence);
        });

        // Hidden entities
        hiddenEntities.forEach(entity => {
            this.initialState.set(entity.id, entity.influence);
        });
    }

    /**
     * Analyze emergence after a cascade
     */
    public analyze(engine: CascadeEngine, actorId?: string | null): EmergenceReport {
        const results: EmergenceResult[] = [];
        const currentCountries = engine.getCountries();
        let anchorImpact: EmergenceResult | null = null;

        // Use actorId as the anchorId for impact filtering
        const anchorId = actorId;

        // Get neighbors of the anchor for relevance weighting from the comprehensive dataset
        const profile = anchorId ? COUNTRY_PROFILES[anchorId] : null;
        const anchorNeighbors = new Set(profile?.neighbors || []);

        const majorPowerIds = new Set(['usa', 'china', 'india', 'japan', 'russia', 'germany', 'uk', 'france']);

        // Analyze countries
        currentCountries.forEach(country => {
            const initial = this.initialState.get(country.id) || country.influence;

            // Calculate effective influence change based on stability and economic power
            const effectiveInfluence = this.calculateEffectiveInfluence(country);
            const change = effectiveInfluence - initial;

            // Relevance weight: favors neighbors and major powers
            const isNeighbor = anchorNeighbors.has(country.id);
            const isMajor = majorPowerIds.has(country.id);

            // Allow all major powers and neighbors, plus anything with significant change
            if (isMajor || isNeighbor || Math.abs(change) >= CONFIG.MIN_CHANGE || country.id === anchorId) {
                const surpriseScore = this.calculateSurpriseScore(change, initial, engine.getState().globalStability);

                // Boost surprise score for relevant entities so they rank higher in the final lists
                const relevanceMulti = isNeighbor ? 2.5 : (isMajor ? 1.5 : 1.0);
                const finalSurprisingness = Math.abs(surpriseScore) * relevanceMulti;

                const result: EmergenceResult = {
                    entityId: country.id,
                    name: `${country.flag} ${country.name}`,
                    flag: country.flag,
                    type: 'country',
                    initialInfluence: initial,
                    finalInfluence: effectiveInfluence,
                    influenceChange: change,
                    percentageChange: (change / Math.max(initial, 1)) * 100,
                    surpriseScore: finalSurprisingness, // Store the weighted score for sorting
                    reason: this.getReasonForChange(country.id, change, isNeighbor),
                };

                results.push(result);
                if (country.id === anchorId) anchorImpact = result;
            }
        });

        // Analyze additional entities (Qatar, etc.)
        const cascadeEffects = this.simulateSecondaryEffects(engine);
        cascadeEffects.forEach(effect => {
            results.push(effect);
            // [Fix] Also check additional entities for anchor impact
            if (effect.entityId === anchorId) anchorImpact = effect;
        });

        // Filter and Split into winners and losers
        // CRITICAL: We strictly prioritize neighbors and geopolitical links for winners
        const winners = results
            .filter(r => r.influenceChange > 0.1) // Must have some positive growth
            .filter(r => {
                const isRelevant = anchorNeighbors.has(r.entityId) ||
                    majorPowerIds.has(r.entityId) ||
                    r.entityId === anchorId;

                // If it's a neighbor or major power, it's relevant
                if (isRelevant) return true;

                // Also relevant if it's a secondary effect beneficiary (energy, rivals, etc.)
                // These are already in the results from simulateSecondaryEffects
                const isSecondaryEffect = r.reason !== 'Status quo maintenance' &&
                    !r.reason.includes('Rapid power projection');

                return isSecondaryEffect;
            })
            .sort((a, b) => {
                // Primary: Surprise Score
                const surpriseDiff = b.surpriseScore - a.surpriseScore;
                if (Math.abs(surpriseDiff) > 5) return surpriseDiff;

                // Secondary: Favor neighbors and major powers as tie-breaker
                const isANeighbor = anchorNeighbors.has(a.entityId);
                const isBNeighbor = anchorNeighbors.has(b.entityId);
                if (isANeighbor && !isBNeighbor) return -1;
                if (!isANeighbor && isBNeighbor) return 1;

                return b.influenceChange - a.influenceChange;
            })
            .slice(0, CONFIG.TOP_RESULTS);

        const losers = results
            .filter(r => r.influenceChange < 0)
            .filter(r => {
                const isRelevant = anchorNeighbors.has(r.entityId) || majorPowerIds.has(r.entityId) || r.entityId === anchorId;
                if (isRelevant) return true;
                return r.initialInfluence >= 20;
            })
            .sort((a, b) => b.surpriseScore - a.surpriseScore) // Sort by magnitude of surprise
            .slice(0, CONFIG.TOP_RESULTS);

        // Find most surprising result (highest raw change)
        const allSorted = [...winners, ...losers].sort(
            (a, b) => Math.abs(b.influenceChange) - Math.abs(a.influenceChange)
        );

        // Generate insight cards
        const insights = this.generateInsights(engine, winners, losers, anchorId);

        return {
            winners: winners,
            losers: losers,
            insights,
            mostSurprising: allSorted[0] || null,
            anchorImpact,
            timestamp: Date.now(),
        };
    }

    /**
     * Generate insight cards based on cascade analysis
     */
    private generateInsights(
        engine: CascadeEngine,
        winners: EmergenceResult[],
        losers: EmergenceResult[],
        anchorId: string | null | undefined
    ): InsightCard[] {
        const insights: InsightCard[] = [];
        const state = engine.getState();
        const chaos = 100 - state.globalStability;
        const anchorCountry = anchorId ? engine.getCountry(anchorId) : null;

        // Insight 1: Strategic Shift
        if (anchorCountry && chaos > 2) {
            insights.push({
                id: 'strategic_shift',
                type: 'hidden_dependency',
                icon: '📉',
                title: `${anchorCountry.name} Core Breach`,
                description: `The breakdown of ${anchorCountry.name}'s stability has bypassed standard diplomatic safeguards. High-frequency trading algorithms are now front-running ${anchorCountry.name}'s debt default.`,
                severity: chaos > 40 ? 'critical' : 'major',
                affectedEntities: [anchorId!, 'blackrock', 'goldman_sachs']
            });
        }

        // Insight 2: Energy Arbitrage (Dynamic)
        const energyWinner = winners.find(w => w.reason.toLowerCase().includes('energy') || w.reason.toLowerCase().includes('lng'));
        if (energyWinner) {
            insights.push({
                id: 'energy_arbitrage',
                type: 'alliance',
                icon: '⛽',
                title: 'The Energy Arbiter',
                description: `${energyWinner.name} is now effectively controlling the energy price ceiling for the region. Their influence has grown not by production, but by strategic redirection of existing flows.`,
                severity: 'major',
                affectedEntities: [energyWinner.entityId, 'russia', 'qatar']
            });
        }

        // Insight 3: Corporate Power Sweep
        if (chaos > 20) {
            insights.push({
                id: 'corporate_ascendancy',
                type: 'corporate',
                icon: '🏢',
                title: 'Market Anarchy Profit',
                description: `Non-state actors are currently filling the credit gap left by failing national banks in the most affected zones. A "Shadow IMF" is effectively forming among commodity traders.`,
                severity: 'critical',
                affectedEntities: ['glencore', 'trafigura', 'blackrock']
            });
        }

        // Keg Principle: Emergence Bonus Insight (40-60% chaos/stability crossover)
        const stability = state.globalStability;
        if (stability >= 40 && stability <= 60) {
            insights.push({
                id: 'keg_emergence',
                type: 'shadow',
                icon: '🌀',
                title: 'Emergence on Collapse',
                description: 'The system has crossed the threshold where instability is no longer just destructive—it is generative. New, unforeseen structures are emerging from the ruins of the previous order.',
                severity: 'major',
                affectedEntities: winners.slice(0, 2).map(w => w.entityId)
            });
        }

        return insights.slice(0, 3);
    }

    /**
     * Calculate surprise score
     * Re-calibrated for Keg Principle: Emergence is most audible in the middle zone.
     */
    private calculateSurpriseScore(change: number, initial: number, stability?: number): number {
        const importance = Math.max(initial, 10);
        const normalizedChange = change / 10;

        // Dynamic threshold adjustment: 
        // In stable states, we need HUGE change to be surprised.
        // In the Keg Zone (40-60), we are sensitive to small shifts.
        let sensitivity = 1.0;
        if (stability !== undefined) {
            if (stability >= 40 && stability <= 60) sensitivity = 2.5; // High sensitivity to emergence
            else if (stability > 80) sensitivity = 0.5; // High stability = high inertia/low surprise
        }

        const surpriseScore = (normalizedChange * (100 / importance)) * sensitivity;
        return surpriseScore;
    }

    /**
     * Calculate effective influence
     */
    private calculateEffectiveInfluence(country: Country): number {
        const weightedInfluence =
            country.influence * 0.4 +
            country.stability * 0.3 +
            country.economicPower * 0.3;
        return weightedInfluence;
    }

    /**
     * Get reason for influence change
     */
    private getReasonForChange(entityId: string, change: number, isNeighbor: boolean = false): string {
        // PRIORITY: Use Global Intelligence if available and matches the trend
        const intel = GLOBAL_INTELLIGENCE[entityId];
        const isPositiveTrend = change > 5;
        const isNegativeTrend = change < -5;

        if (intel) {
            if (isPositiveTrend && intel.impact === 'green') return intel.why;
            if (isNegativeTrend && intel.impact === 'red') return intel.why;
        }

        // [Refinement] Emergent Reason Generation: Analyzes the magnitude and role
        const absChange = Math.abs(change);

        if (isPositiveTrend) {
            if (absChange > 25) return "Exploiting unprecedented geopolitical vacuum";
            if (entityId === 'russia' || entityId === 'usa' || entityId === 'china') return "Hegemonic consolidation during regional chaos";
            if (isNeighbor) return "Capturing diverted trade & refugee capital";
            return "Opportunistic diplomatic pivot & market gain";
        }

        if (isNegativeTrend) {
            if (absChange > 25) return "Systemic failure of critical social contracts";
            if (isNeighbor) return "Collateral damage from border proximity";
            return "Secondary contagion & supply chain isolation";
        }

        return 'Maintaining precarious status quo';
    }

    /**
     * Simulate secondary effects based on RELATIONSHIPS - works for ANY country.
     * Finds winners dynamically based on:
     * 1. Alternative energy suppliers (countries that export similar resources)
     * 2. Trade beneficiaries (neighbors/competitors)
     * 3. Strategic chokepoint controllers (Bosphorus, etc.)
     * 4. Declared rivals (from country data)
     */
    private simulateSecondaryEffects(engine: CascadeEngine): EmergenceResult[] {
        const results: EmergenceResult[] = [];
        const state = engine.getState();
        const chaos = 100 - state.globalStability;

        // CRITICAL FIX: Find the country that DROPPED the most, not just the most unstable.
        // This avoids picking 'russia' (initial stability 75) as the target of an India sanction.
        const countryDrops = Object.entries(state.countryStabilities).map(([id, stability]) => ({
            id,
            drop: (this.initialState.get(id) || 100) - stability,
            stability
        })).sort((a, b) => b.drop - a.drop);

        if (countryDrops.length === 0 || countryDrops[0].drop < 5) return results;

        const sanctionedId = countryDrops[0].id;
        const sanctionedCountry = engine.getCountry(sanctionedId);

        if (!sanctionedCountry) return results;

        const impactSeverity = countryDrops[0].drop;

        // Get relationships to analyze
        const context = getGeopoliticalContext(sanctionedId);

        // === 1. ALTERNATIVE ENERGY SUPPLIERS ===
        // Only return these for MAJOR energy exporters
        if (sanctionedId === 'russia' || sanctionedId === 'iran' || sanctionedId === 'venezuela') {
            const energySuppliers = this.findAlternativeSuppliers(sanctionedId, chaos);
            results.push(...energySuppliers);
        }

        // === 2. RIVALS BENEFIT ===
        // Neighbors/Rivals gain from the power vacuum
        if (sanctionedCountry.rivals && sanctionedCountry.rivals.length > 0) {
            sanctionedCountry.rivals.forEach(rivalId => {
                const rival = getAllCountries().find(c => c.id === rivalId);
                if (rival) {
                    const gain = impactSeverity * 0.45 + chaos * 0.15; // Increased gain
                    if (gain > CONFIG.MIN_CHANGE) {
                        results.push(this.createEmergenceResult(
                            rivalId,
                            `${rival.flag} ${rival.name}`,
                            'country',
                            rival.influence,
                            gain,
                            `Rival's downfall strengthens position`
                        ));
                    }
                }
            });
        }

        // === 3. BENEFICIARIES (TRADE DIVERSION) ===
        // Countries listed as beneficiaries get cheap resources
        if (sanctionedCountry.beneficiaries && sanctionedCountry.beneficiaries.length > 0) {
            sanctionedCountry.beneficiaries.forEach(beneficiaryId => {
                const beneficiary = getAllCountries().find(c => c.id === beneficiaryId);
                if (beneficiary) {
                    const gain = impactSeverity * 0.4 + chaos * 0.15;
                    if (gain > CONFIG.MIN_CHANGE) {
                        results.push(this.createEmergenceResult(
                            beneficiaryId,
                            `${beneficiary.flag} ${beneficiary.name}`,
                            'country',
                            beneficiary.influence,
                            gain,
                            `Discounted resource access & trade diversion`
                        ));
                    }
                }
            });
        }

        // === 4. STRATEGIC CHOKEPOINT CONTROLLERS ===
        // Turkey/Bosphorus gains when Black Sea nations affected
        const blackSeaNations = ['russia', 'ukraine', 'romania', 'bulgaria', 'georgia'];
        if (blackSeaNations.includes(sanctionedId)) {
            const turkey = getAllCountries().find(c => c.id === 'turkey');
            if (turkey) {
                const gain = impactSeverity * 0.45 + chaos * 0.1;
                results.push(this.createEmergenceResult(
                    'turkey',
                    `${turkey.flag} ${turkey.name}`,
                    'country',
                    turkey.influence,
                    gain,
                    `Bosphorus Strait leverage - controls transit`
                ));
            }
        }

        // === 5. REGIONAL NEIGHBORS (TRADE CAPTURE) ===
        // Neighbors capture trade that was going to sanctioned country
        const neighbors = context?.neighbors || [];
        neighbors.slice(0, 3).forEach(neighborId => {
            const neighbor = getAllCountries().find(c => c.id === neighborId);
            if (neighbor && !results.find(r => r.entityId === neighborId)) {
                const gain = impactSeverity * 0.15 + chaos * 0.08;
                if (gain > CONFIG.MIN_CHANGE * 0.5) {
                    results.push(this.createEmergenceResult(
                        neighborId,
                        `${neighbor.flag} ${neighbor.name}`,
                        'country',
                        neighbor.influence,
                        gain,
                        `Regional trade pivot & supply chain capture`
                    ));
                }
            }
        });

        // === 6. SCENARIO SPECIFIC INTELLIGENCE ===
        this.applyScenarioIntelligence(sanctionedId, impactSeverity, chaos, results);

        // === 7. SEPARATIST MOVEMENTS (HIGH CHAOS ONLY) ===
        if (chaos > 30) {
            const regions = ['catalonia', 'scotland', 'bavaria', 'crimea', 'donbas'];
            regions.forEach(region => {
                const entity = hiddenEntities.find(e => e.id === region);
                if (entity) {
                    const regionGain = chaos * 0.12;
                    results.push(this.createEmergenceResult(
                        region, entity.name, 'entity', entity.influence, regionGain,
                        'Independence movement surge from instability'
                    ));
                }
            });
        }

        // Remove duplicates and sort by gain
        const uniqueResults = results.filter((result, index, self) =>
            index === self.findIndex(r => r.entityId === result.entityId)
        );

        return uniqueResults.sort((a, b) => b.influenceChange - a.influenceChange).slice(0, 8);
    }

    private applyScenarioIntelligence(targetId: string, severity: number, chaos: number, results: EmergenceResult[]) {
        const blueprint = SCENARIO_BLUEPRINTS[targetId];
        if (!blueprint) return;

        // Process Winners
        blueprint.winners.forEach(ripple => {
            const country = getAllCountries().find(c => c.id === ripple.id);
            if (country) {
                // Winners gain based on severity and chaos
                const gain = (severity * 0.4 + 10) * (1 + chaos / 100);
                results.push(this.createEmergenceResult(
                    ripple.id,
                    `${country.flag} ${country.name}`,
                    'country',
                    country.influence,
                    gain,
                    ripple.reason
                ));
            }
        });

        // Process Losers
        blueprint.losers.forEach(ripple => {
            const country = getAllCountries().find(c => c.id === ripple.id);
            if (country) {
                // Losers lose based on severity
                const loss = -(severity * 0.5 + 15);
                results.push(this.createEmergenceResult(
                    ripple.id,
                    `${country.flag} ${country.name}`,
                    'country',
                    country.influence,
                    loss,
                    ripple.reason
                ));
            }
        });
    }

    /**
     * Find countries that can supply alternatives to the sanctioned country's exports.
     */
    private findAlternativeSuppliers(sanctionedId: string, chaos: number): EmergenceResult[] {
        const results: EmergenceResult[] = [];

        // Energy exporters that benefit when major exporters are sanctioned
        const energyExporters: Record<string, { suppliers: string[], reason: string }> = {
            'russia': {
                suppliers: ['saudi_arabia', 'qatar', 'norway', 'usa', 'uae', 'azerbaijan'],
                reason: 'Alternative energy supply capture'
            },
            'iran': {
                suppliers: ['saudi_arabia', 'uae', 'qatar', 'iraq'],
                reason: 'Middle East energy market share capture'
            },
            'venezuela': {
                suppliers: ['usa', 'canada', 'brazil', 'mexico'],
                reason: 'Americas oil market capture'
            },
            'china': {
                suppliers: ['india', 'vietnam', 'indonesia', 'japan'],
                reason: 'Manufacturing supply chain diversion'
            },
            'india': {
                suppliers: ['pakistan', 'china', 'bangladesh', 'vietnam'],
                reason: 'Regional trade capture & market vacuum'
            }
        };

        const alternatives = energyExporters[sanctionedId];
        if (alternatives) {
            alternatives.suppliers.forEach((supplierId, index) => {
                const supplier = getAllCountries().find(c => c.id === supplierId) ||
                    additionalEntities.find(e => e.id === supplierId);
                if (supplier) {
                    // First alternatives get bigger gains
                    const priorityBonus = (alternatives.suppliers.length - index) / alternatives.suppliers.length;
                    const gain = chaos * 0.35 * priorityBonus + 10;

                    results.push(this.createEmergenceResult(
                        supplierId,
                        `${supplier.flag} ${supplier.name}`,
                        'country',
                        supplier.influence,
                        gain,
                        alternatives.reason
                    ));
                }
            });
        }

        return results;
    }

    /**
     * Create emergence result object
     */
    private createEmergenceResult(
        id: string,
        name: string,
        type: 'country' | 'entity' | 'additional',
        initial: number,
        change: number,
        reason: string
    ): EmergenceResult {
        // Extract flag emoji if present at the start of the name
        const flagMatch = name.match(/^([\u{1F1E0}-\u{1F1FF}]{2}|[\u2694\u{1F3E2}\u{1F5FA}][\uFE0F]?)\s*/u);
        const flag = flagMatch ? flagMatch[1] : undefined;

        return {
            entityId: id,
            name,
            flag,
            type,
            initialInfluence: initial,
            finalInfluence: initial + change,
            influenceChange: change,
            percentageChange: (change / Math.max(initial, 1)) * 100,
            surpriseScore: 0, // Will be recalculated in analyzer
            reason,
        };
    }

    /**
     * Reset detector to initial state
     */
    reset(): void {
        this.captureInitialState();
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

let detectorInstance: EmergenceDetector | null = null;

export function getEmergenceDetector(): EmergenceDetector {
    if (!detectorInstance) {
        detectorInstance = new EmergenceDetector();
    }
    return detectorInstance;
}

export function resetEmergenceDetector(): EmergenceDetector {
    detectorInstance = new EmergenceDetector();
    return detectorInstance;
}
